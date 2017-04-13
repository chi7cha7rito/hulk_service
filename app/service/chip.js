'use strict';

module.exports = app => {
    class Chip extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Chip = this.app.model.Chip
            this.MemberLevel = this.app.model.MemberLevel
            this.Member = this.app.model.Member
            this.Attendance = this.app.model.Attendance
            this.User = this.app.model.User
            this.Match = this.app.model.Match
            this.MatchConfig = this.app.model.MatchConfig
            this.Sprit = this.app.model.Sprit
            this.Balance = this.app.model.Balance
            this.LoyaltyPoint = this.app.model.LoyaltyPoint
            this.BalanceSvr = this.service.balance
            this.LoyaltyPointSvr = this.service.loyaltyPoint
            this.SmsSenderSvr = this.service.smsSender
            this.Helper = this.ctx.helper
            this.Sequelize = this.app.model
            this.moment = this.app.moment
        }

        /**
         * @description 赛事重入统计
         * @param  {} {matchName
         * @param  {} startOpening
         * @param  {} endOpening
         * @param  {} pageIndex
         * @param  {} pageSize}
         */
        async matchChipStats({ matchName, startOpening, endOpening, pageIndex = 1, pageSize = 10 }) {
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            const result = await this.Chip.findAndCount({
                order: 'match.openingDatetime DESC',
                attributes: ['id', 'match.openingDatetime', 'match.perHand', 'match.matchConfig.name', [this.Sequelize.fn('SUM', this.Sequelize.col('quantity')), 'totalQty'], [this.Sequelize.fn('SUM', this.Sequelize.col('payAmount')), 'totalAmount']],
                include: [{
                    model: this.Match,
                    duplicating: false,
                    attributes: [],
                    where: {
                        openingDatetime: {
                            $gte: startOpening || this.moment('1971-01-01').format(),
                            $lte: (endOpening && this.moment(endOpening).endOf('day')) || this.moment('9999-12-31').format()
                        }
                    },
                    include: [{
                        model: this.MatchConfig,
                        duplicating: false,
                        attributes: [],
                        where: {
                            name: { $like: `%${matchName || ''}%` }
                        }
                    }]
                }],
                raw: true,
                group: ['matchId'],
                offset: (index - 1) * size,
                limit: size,
            })
            result.count = result.count.length
            return result
        }

        /**
         * @description 获取重入信息
         * @param  {} {matchName
         * @param  {} startOpening
         * @param  {} endOpening}
         */
        async findAll({ matchName, startOpening, endOpening }) {
            const result = await this.Chip.findAll({
                order: 'match.openingDatetime DESC',
                attributes: ['id', 'quantity', 'payAmount', 'payType'],
                include: [{
                    model: this.Match,
                    duplicating: false,
                    attributes: ['openingDatetime', 'perHand'],
                    where: {
                        openingDatetime: {
                            $gte: startOpening || this.moment('1971-01-01').format(),
                            $lte: (endOpening && this.moment(endOpening).endOf('day')) || this.moment('9999-12-31').format()
                        }
                    },
                    include: [{
                        model: this.MatchConfig,
                        duplicating: false,
                        attributes: ['name'],
                        where: {
                            name: { $like: `%${matchName || ''}%` }
                        }
                    }]
                }, {
                    model: this.Member,
                    duplicating: false,
                    attributes: [],
                    include: [{
                        model: this.User,
                        duplicating: false,
                        attributes: ['name'],
                    }],
                }],
                raw: true
            })
            return result
        }

        /**
         * @description 购买筹码
         * @param  {} {memberId
         * @param  {} matchId
         * @param  {} quantity
         * @param  {} payType
         * @param  {} payAmount
         * @param  {} remark
         * @param  {} operator}
         */
        async create({ memberId, matchId, quantity, payType, payAmount, remark, operator }) {
            const classSelf = this;
            let member, match, balance, attendance;
            member = await classSelf.Member.findOne({ where: { id: memberId, status: 1 }, include: [this.MemberLevel, this.User] })
            if (!member) throw new Error('会员不存在或已冻结')
            match = await classSelf.Match.findOne({ where: { id: matchId, status: 1 }, include: [this.MatchConfig] })
            if (!match) throw new Error('赛事不存在或已结束')
            attendance = await classSelf.Attendance.findOne({ where: { matchId, memberId } })
            if (!attendance) throw new Error('该会员未参赛，无法重入')
            //查询余额
            if (payType == 1) {
                //余额支付
                balance = await this.BalanceSvr.totalByMemberId({ memberId })
                if (balance < payAmount) throw new Error("帐户余额不足")
            } else if (payType == 2) {
                //积分支付
                const point = await this.LoyaltyPointSvr.totalByMemberId({ memberId })
                if (point < payAmount) throw new Error("帐户积分不足")
            } else {
                throw new Error('支付方式不存在')
            }

            const buyChip = member.memberLevel.buyChip || 0
            const consume = member.memberLevel.consume || 0
            //买筹码事务
            return classSelf.app.model.transaction(function (t) {
                //买筹码
                return classSelf.Chip.create({
                    memberId: memberId,
                    matchId: matchId,
                    unitPrice: match.perHand || 0,
                    quantity: quantity,
                    payType: payType,
                    payAmount: payAmount,
                    remark: remark,
                    creator: operator
                }, { transaction: t }).then(function (result) {
                    //重入返豪气
                    let chipId = result.id
                    return classSelf.Sprit.create({
                        memberId: memberId,
                        type: 2,
                        point: buyChip * quantity,
                        creator: operator
                    }, { transaction: t }).then(function (result) {
                        // 余额支付返豪气
                        if (payType == 1) {
                            return classSelf.Sprit.create({
                                memberId: memberId,
                                type: 3,
                                point: payAmount * consume / 100,
                                creator: operator
                            }, { transaction: t }).then(function (result) {
                                //扣减余额
                                return classSelf.Balance.create({
                                    memberId: memberId,
                                    type: 2,
                                    amount: payAmount,
                                    source: 11,
                                    sourceNo: chipId,
                                    remark: '购买筹码',
                                    status: 1,
                                    creator: operator
                                }, { transaction: t }).then(function (result) {
                                    classSelf.SmsSenderSvr.balanceMinus({
                                        phoneNo: member.user.phoneNo,
                                        name: member.user.name,
                                        amount: payAmount,
                                        avlAmt: balance - payAmount
                                    })
                                    return result
                                })
                            })
                        } else if (payType == 2) {
                            //扣减积分
                            return classSelf.LoyaltyPoint.create({
                                memberId: memberId,
                                type: 2,
                                points: payAmount,
                                source: 6,
                                sourceNo: chipId,
                                remark: '购买筹码',
                                status: 1,
                                creator: operator
                            }, { transaction: t }).then(function (result) {
                                classSelf.SmsSenderSvr.loyaltyPointMinus({
                                    phoneNo: member.user.phoneNo,
                                    name: member.user.name,
                                    points: payAmount,
                                    avlPts: point - payAmount
                                })
                                return result
                            })
                        } else {
                            throw new Error('支付方式不存在')
                        }
                    })
                })
            })
        }
    }
    return Chip;
};