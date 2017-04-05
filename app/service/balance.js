'use strict';

module.exports = app => {
    class Balance extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Balance = this.app.model.Balance
            this.LoyaltyPoint = this.app.model.LoyaltyPoint
            this.RechargeSetup = this.app.model.RechargeSetup
            this.MemberLevel = this.app.model.MemberLevel
            this.Sprit = this.app.model.Sprit
            this.SmsSenderSvr = this.service.smsSender
            this.LoyaltyPointSvr = this.service.loyaltyPoint
            this.Member = this.app.model.Member
            this.User = this.app.model.User
            this.Helper = this.ctx.helper
            this.moment = this.app.moment
        }

        /**
         * @description 根据memberId获取余额
         * @param  {int} memberId
         * @return {decimal} 余额
         */
        async totalByMemberId({ memberId }) {
            const total = await this.Balance.sum('amount', {
                where: { memberId: memberId, status: 1 }
            })
            return total || 0
        }

        /**
        * @description 根据手机号获取余额
        * @param  {int} phoneNo
        * @return {decimal} 余额
        */
        async totalByPhoneNo({ phoneNo }) {
            const member = await this.Member.findOne({
                where: { status: 1 },
                include: [{ model: this.User, where: { phoneNo } }]
            })
            if (!member) throw new Error("会员不存在或被冻结")

            const total = await this.Balance.sum('amount', {
                where: { memberId: member.id, status: 1 }
            })
            return total || 0
        }

        /**
         * @description 获取余额明细
         * @param  {int} {phoneNo
         * @param  {int} type
         * @param  {int} startCreatedAt
         * @param  {int} endCreatedAt
         * @param  {int} pageIndex=1
         * @param  {int} pageSize=10}
         * @return {object}
         */
        async findEntries({ phoneNo, type, startCreatedAt, endCreatedAt, pageIndex = 1, pageSize = 10 }) {
            let cond = {}
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            let user = await this.User.findOne({ where: { phoneNo: phoneNo }, include: [this.Member] })

            if (user && user.member.id) {
                cond.memberId = user.member.id
            }
            cond.createdAt = {
                $gte: startCreatedAt || this.moment('1971-01-01').format(),
                $lte: endCreatedAt || this.moment('9999-12-31').format(),
            }
            if (type) {
                cond.type = type
            }
            cond.status = 1
            const result = await this.Balance.findAndCount({
                where: cond,
                order: 'createdAt DESC',
                include: [
                    {
                        model: this.Member,
                        include: [{ model: this.User }],
                    }
                ],
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @description 余额买积分
         * @param  {} {memberId
         * @param  {} amount
         * @param  {} remark
         * @param  {} operator}
         */
        async buyPoints({ phoneNo, amount, operator, remark }) {
            const classSelf = this
            const member = await this.Member.findOne({
                where: { status: 1 },
                include: [{ model: this.User, where: { phoneNo } }]
            })
            if (!member) throw new Error("会员不存在或被冻结")
            amount = parseFloat(amount)
            const total = await this.totalByMemberId({ memberId: member.id })
            if (total < amount) throw new Error("帐户余额不足")

            return classSelf.app.model.transaction(function (t) {
                return classSelf.Balance.create({
                    memberId: member.id,
                    type: 2,
                    amount,
                    source: 8,
                    remark,
                    status: 1,
                    creator: operator
                }, { transaction: t }).then(function (result) {
                    return classSelf.LoyaltyPoint.create({
                        memberId: member.id,
                        type: 1,
                        points: amount,
                        source: 8,
                        sourceNo: result.id,
                        remark,
                        status: 1,
                        creator: operator
                    }, { transaction: t }).then(async (result) => {
                        let totalBalance = await classSelf.totalByMemberId({ memberId: member.id })
                        classSelf.SmsSenderSvr.balanceMinus({
                            phoneNo: member.user.phoneNo,
                            name: member.user.name,
                            amount: amount,
                            avlAmt: totalBalance - amount
                        })
                        let totalPoints = await classSelf.LoyaltyPointSvr.totalByMemberId({ memberId: member.id })
                        classSelf.SmsSenderSvr.loyaltyPointPlus({
                            phoneNo: member.user.phoneNo,
                            name: member.user.name,
                            points: amount,
                            avlPts: totalPoints + amount
                        })
                        return result
                    })
                })
            })
        }

        /**
         * @description 余额扣减
         * @param  {} {phoneNo
         * @param  {} type
         * @param  {} amount
         * @param  {} source
         * @param  {} sourceNo
         * @param  {} remark
         * @param  {} operator}
         */
        async decrease({ phoneNo, type, amount, source, sourceNo, remark, operator }) {
            const member = await this.Member.findOne({
                where: { status: 1 },
                include: [{ model: this.User, where: { phoneNo } }]
            })
            if (!member) throw new Error("会员不存在或被冻结")
            const total = await this.totalByMemberId({ memberId: member.id })
            if (total < amount) throw new Error('帐户余额不足')
            const result = await this.create({ memberId: member.id, type, amount: parseFloat(amount), source, sourceNo, remark, status: 1, operator })
            return result
        }

        /**
        * @description 余额增加
        * @param  {} {phoneNo
        * @param  {} type
        * @param  {} amount
        * @param  {} source
        * @param  {} sourceNo
        * @param  {} remark
        * @param  {} operator}
        */
        async increase({ phoneNo, type, amount, source, sourceNo, remark, operator }) {
            const member = await this.Member.findOne({
                where: { status: 1 },
                include: [{ model: this.User, where: { phoneNo } }]
            })
            if (!member) throw new Error("会员不存在或被冻结")

            const result = await this.create({ memberId: member.id, type, amount: parseFloat(amount), source, sourceNo, remark, status: 1, operator })
            return result
        }

        /**
         * @description 创建余额记录
         * @param  {int} {memberId
         * @param  {int} type
         * @param  {decimal} amount
         * @param  {int} source
         * @param  {string} sourceNo
         * @param  {string} remark
         * @param  {int} status=1
         * @param  {int} creator=1}
         */
        async create({ memberId, type, amount, source, sourceNo, remark, status, operator }) {
            const classSelf = this
            const max = await this.RechargeSetup.max('reward', { where: { threshold: { $lte: amount }, status: 1 } })
            const member = await this.Member.findOne({ where: { id: memberId }, include: [this.User, this.MemberLevel] })
            return classSelf.app.model.transaction(function (t) {
                return classSelf.Balance.create({
                    memberId: memberId,
                    type: type,
                    amount: amount,
                    source: source,
                    sourceNo: sourceNo,
                    remark: remark,
                    status: status,
                    creator: operator
                }, { transaction: t }).then(async (result) => {
                    if (type == 1) {
                        let totalBalance = await classSelf.totalByMemberId({ memberId })
                        let memberLevel = await classSelf.MemberLevel.findOne({ order: 'threshold DESC', where: { threshold: { $lte: amount }, status: 1 } })
                        if (member.memberLevel.threshold < memberLevel.threshold) {
                            return classSelf.Member.update({
                                memberLevelId: memberLevel.id,
                                updator: operator
                            }, { where: { id: memberId }, transaction: t }).then(async (result) => {
                                if (max) {
                                    return classSelf.LoyaltyPoint.create({
                                        memberId: memberId,
                                        type: 1,    //获取
                                        points: max,
                                        source: 1,  //充值返现
                                        sourceNo: result.id,
                                        status: 1,  //状态正常
                                        remark: "充值积分返现",
                                        creator: operator
                                    }, { transaction: t }).then(async (result) => {
                                        let totalPoints = await classSelf.LoyaltyPointSvr.totalByMemberId({ memberId })
                                        classSelf.SmsSenderSvr.loyaltyPointPlus({
                                            phoneNo: member.user.phoneNo,
                                            name: member.user.name,
                                            points: max,
                                            avlPts: totalPoints + max
                                        })
                                        classSelf.SmsSenderSvr.balancePlus({
                                            phoneNo: member.user.phoneNo,
                                            name: member.user.name,
                                            amount: amount,
                                            avlAmt: totalBalance + amount
                                        })
                                        return result
                                    })
                                } else {
                                    classSelf.SmsSenderSvr.balancePlus({
                                        phoneNo: member.user.phoneNo,
                                        name: member.user.name,
                                        amount: amount,
                                        avlAmt: totalBalance + amount
                                    })
                                    return result
                                }
                            })
                        } else {
                            if (max) {
                                return classSelf.LoyaltyPoint.create({
                                    memberId: memberId,
                                    type: 1,    //获取
                                    points: max,
                                    source: 1,  //充值返现
                                    sourceNo: result.id,
                                    status: 1,  //状态正常
                                    remark: "充值积分返现",
                                    creator: operator
                                }, { transaction: t }).then(async (result) => {
                                    let totalPoints = await classSelf.LoyaltyPointSvr.totalByMemberId({ memberId })
                                    classSelf.SmsSenderSvr.loyaltyPointPlus({
                                        phoneNo: member.user.phoneNo,
                                        name: member.user.name,
                                        points: max,
                                        avlPts: totalPoints + max
                                    })
                                    classSelf.SmsSenderSvr.balancePlus({
                                        phoneNo: member.user.phoneNo,
                                        name: member.user.name,
                                        amount: amount,
                                        avlAmt: totalBalance + amount
                                    })
                                    return result
                                })
                            } else {
                                classSelf.SmsSenderSvr.balancePlus({
                                    phoneNo: member.user.phoneNo,
                                    name: member.user.name,
                                    amount: amount,
                                    avlAmt: totalBalance + amount
                                })
                                return result
                            }
                        }
                    } else if (type == 2) {
                        let totalBalance = await classSelf.totalByMemberId({ memberId })
                        if (member.memberLevel.consume) {
                            return classSelf.Sprit.create({
                                memberId,
                                type: 3, //余额消费
                                point: amount * member.memberLevel.consume / 100,
                                creator: operator
                            }, { transaction: t }).then(async (result) => {
                                classSelf.SmsSenderSvr.balanceMinus({
                                    phoneNo: member.user.phoneNo,
                                    name: member.user.name,
                                    amount: amount,
                                    avlAmt: totalBalance - amount
                                })
                                return result
                            })
                        } else {
                            classSelf.SmsSenderSvr.balanceMinus({
                                phoneNo: member.user.phoneNo,
                                name: member.user.name,
                                amount: amount,
                                avlAmt: totalBalance - amount
                            })
                            return result
                        }
                    }
                })
            })
        }
    }
    return Balance;
};