'use strict';

module.exports = app => {
    class MatchReward extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Match = this.app.model.Match
            this.MatchConfig = this.app.model.MatchConfig
            this.MatchReward = this.app.model.MatchReward
            this.MatchType = this.app.model.MatchType
            this.User = this.app.model.User
            this.Member = this.app.model.Member
            this.MemberLevel = this.app.model.MemberLevel
            this.Sprit = this.app.model.Sprit
            this.Attendance = this.app.model.Attendance
            this.Balance = this.app.model.Balance
            this.LoyaltyPoint = this.app.model.LoyaltyPoint
            this.Coupon = this.app.model.Coupon
            this.BalanceSvr = this.service.balance
            this.LoyaltyPointSvr = this.service.loyaltyPoint
            this.MatchPriceSvr = this.service.matchPrice
            this.SmsSenderSvr = this.service.smsSender
            this.Helper = this.ctx.helper
            this.moment = this.app.moment
        }

        /**
         * @description 获取参赛者
         * @param  {} {matchId
         * @param  {} pageIndex=1
         * @param  {} pageSize=10}
         */
        async findAttendances({ matchId, pageIndex = 1, pageSize = 10 }) {
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            const result = await this.Attendance.findAndCount({
                where: { matchId: matchId, status: 1 },
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @description 查询参赛名单
         * @param  {} {phoneNo
         * @param  {} matchName
         * @param  {} openingStart
         * @param  {} openingEnd
         * @param  {} pageIndex=1
         * @param  {} pageSize=10}
         */
        async findAll({ phoneNo, matchName, openingStart, openingEnd, pageIndex = 1, pageSize = 10 }) {
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            let cond = {}
            let matchCond = {
                openingDatetime: {
                    $gte: openingStart || this.moment('1971-01-01').format(),
                    $lte: (openingEnd && this.moment(openingEnd).endOf('day')) || this.moment('9999-12-31').format(),
                }
            }
            let matchConfigCond = {}
            let userCond = {}

            if (phoneNo) {
                userCond.phoneNo = { $like: '%' + phoneNo + '%' }
            }
            if (matchName) {
                matchConfigCond.name = { $like: '%' + matchName + '%' }
            }
            const result = await this.Attendance.findAndCount({
                include: [{
                    model: this.Match,
                    where: matchCond,
                    include: [{
                        model: this.MatchConfig,
                        where: matchConfigCond,
                        include: [{ model: this.MatchType, as: 'Type' }]
                    }]
                }, {
                    model: this.Member,
                    include: [{ model: this.User, where: userCond }]
                }],
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @description 查询参赛名单
         * @param  {} {phoneNo
         * @param  {} matchName
         * @param  {} openingStart
         * @param  {} openingEnd}
         */
        async findResult({ phoneNo, matchName, openingStart, openingEnd }) {
            let cond = {}
            let matchCond = {
                openingDatetime: {
                    $gte: openingStart || this.moment('1971-01-01').format(),
                    $lte: (openingEnd && this.moment(openingEnd).endOf('day')) || this.moment('9999-12-31').format(),
                }
            }
            let matchConfigCond = {}
            let userCond = {}

            if (phoneNo) {
                userCond.phoneNo = { $like: '%' + phoneNo + '%' }
            }
            if (matchName) {
                matchConfigCond.name = { $like: '%' + matchName + '%' }
            }
            const result = await this.Attendance.findAll({
                include: [{
                    model: this.Match,
                    where: matchCond,
                    include: [{
                        model: this.MatchConfig,
                        where: matchConfigCond,
                        include: [{ model: this.MatchType, as: 'Type' }]
                    }]
                }, {
                    model: this.Member,
                    include: [{ model: this.User, where: userCond }]
                }],
            })
            return result
        }

        /**
         * @description 查询成绩
         * @param  {} {memberId
         * @param  {} pageIndex=1
         * @param  {} pageSize=10}
         */
        async findRankingByMemberId({ memberId, pageIndex = 1, pageSize = 10 }) {
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            const result = await this.Attendance.findAndCount({
                where: { memberId: memberId, issue: true, status: 1 },
                offset: (index - 1) * size,
                limit: size,
                distinct: true,
                include: [{ model: this.Match, include: [this.MatchConfig] }]
            })
            return result
        }

        /**
         * @description 取消报名
         * @param  {} {id
         * @param  {} operator}
         */
        async del({ id, operator }) {
            const attendedExist = await this.Attendance.count({
                where: { id: id }
            })
            if (attendedExist == 0) throw new Error("参赛记录不存在")
            const result = await this.Attendance.update({ status: 2, updator: operator }, { where: { id: id } })
            return result
        }

        /**
         * @description 颁奖
         * @param  {} {id
         * @param  {} memberId
         * @param  {} matchId
         * @param  {} matchRewardId
         * @param  {} operator}
         */
        async award({ id, memberId, matchId, matchRewardId, operator }) {
            const classSelf = this
            const attendance = await this.Attendance.findOne({ where: { id } })
            if (!attendance) throw new Error("您没有报名参加该赛事")
            const member = await this.Member.findOne({ where: { id: memberId, status: 1 }, include: [this.User] })
            if (!member) throw new Error("会员不存在或已冻结")
            const match = await this.Match.findOne({ where: { id: matchId } })
            if (!match) throw new Error("赛事不存在")
            const reward = await this.MatchReward.findOne({ where: { id: matchRewardId } })
            if (!reward) throw new Error("赛事奖励不存在")
            const result = classSelf.Attendance.update({
                result: reward.ranking,
                rewards: reward.rewardPoints,
                rewardsRemark: reward.remark,
                updator: operator
            }, { where: { id } })
            return result
        }

        /**
        * @description 确认参赛
        * @param  {} {id
        * @param  {} operator}
        */
        async confirmJoin({ id, operator }) {
            const classSelf = this
            const attendance = await this.Attendance.findOne({ where: { id } })
            if (!attendance) throw new Error("您没有报名参加该赛事")
            const member = await this.Member.findOne({ where: { id: attendance.memberId, status: 1 } })
            if (!member) throw new Error("会员不存在或已冻结")
            const match = await this.Match.findOne({ where: { id: attendance.matchId } })
            if (!match) throw new Error("赛事不存在或已结束")
            const result = classSelf.Attendance.update({
                join: true,
                updator: operator
            }, { where: { id } })
            return result
        }


        /**
         * @description 发放奖励
         * @param  {} {id
         * @param  {} operator}
         */
        async issueReward({ id, memberId, operator }) {
            const attendance = await this.Attendance.findOne({ where: { id } })
            if (!attendance) throw new Error("您没有报名参加该赛事")
            if (!attendance.result) throw new Error('比赛名次不存在')
            if (attendance.issue) throw new Error('已发放过奖励')
            let member = await this.Member.findOne({ where: { id: memberId }, include: [this.User] })
            let point = await this.LoyaltyPointSvr.totalByMemberId({ memberId })
            const classSelf = this
            return classSelf.app.model.transaction(function (t) {
                return classSelf.Attendance.update({
                    issue: true,
                    updator: operator
                }, { where: { id }, transaction: t }).then(function (result) {
                    if (attendance.rewards) {
                        return classSelf.LoyaltyPoint.create({
                            memberId: member.id,
                            type: 1,
                            points: attendance.rewards,
                            source: 2,
                            sourceNo: id,
                            remark: '比赛奖励',
                            status: 1,
                            creator: operator
                        }, { transaction: t }).then(function (result) {
                            classSelf.SmsSenderSvr.loyaltyPointPlus({
                                phoneNo: member.user.phoneNo,
                                name: member.user.name,
                                points: attendance.rewards,
                                avlPts: point + attendance.rewards
                            })
                            return result
                        })
                    } else {
                        return result
                    }
                })
            })
        }

        /**
         * @description 线上报名参加
         * @param  {} {matchId
         * @param  {} priceId
         * @param  {} memberId}
         */
        async createOnline({ matchId, memberId, matchPriceId }) {
            let classSelf = this
            //检查赛事
            const match = await this.Match.findOne({
                where: { id: matchId, status: 1 },
                include: [this.MatchConfig]
            })
            if (!match) throw new Error("赛事不存在或已结束")
            if (!match.applyOnline) throw new Error("该赛事无法线上报名")

            //检查报名人数
            if (match.limitation) {
                const attendances = await this.Attendance.count({ where: { matchId } })
                if (attendances >= match.limitation) throw new Error('参赛人数已满')
            }

            //查找价格
            const price = await this.MatchPriceSvr.findActivePriceById({ id: matchPriceId })
            if (!price) throw new Error('赛事价格不存在')

            if (price.limitation) {
                const priceCount = await this.Attendance.count({ where: { matchId, priceType: price.type } })
                if (priceCount >= price.limitation) throw new Error('该价格优惠人数已满')
            }

            //检查会员
            const member = await this.Member.findOne({
                where: { id: memberId, status: 1 },
                include: [{ all: true }]
            })
            if (!member) throw new Error("会员不存在或已冻结")
            if (!member.memberLevel.applyOnline) throw new Error("该会员等级无法线上报名此项赛事")
            const apply = member.memberLevel.apply || 0
            const consume = member.memberLevel.consume || 0

            //查询余额
            const balance = await this.BalanceSvr.totalByMemberId({ memberId })
            if (balance < price.price) throw new Error("帐户余额不足")

            //检查是否报名
            const attended = await this.Attendance.count({
                where: { matchId: matchId, memberId: memberId }
            })
            if (attended > 0) throw new Error("您已报名参赛")

            //报名事务
            return classSelf.app.model.transaction(function (t) {
                //参赛
                return classSelf.Attendance.create({
                    matchId: matchId,
                    memberId: memberId,
                    payType: 1,
                    priceType: price.type,
                    matchPrice: price.price,
                    status: 1,
                    creator: member.user.id
                }, { transaction: t }).then(function (attendance) {
                    //扣余额
                    return classSelf.Balance.create({
                        memberId: memberId,
                        type: 2,  //消费
                        amount: price.price,
                        source: 7,  //赛事门票
                        sourceNo: attendance.id,
                        remark: "线上赛事报名门票费用",
                        status: 1,
                        creator: member.user.id
                    }, { transaction: t }).then(function (result) {
                        //消费返豪气
                        return classSelf.Sprit.create({
                            memberId: memberId,
                            type: 3,
                            point: price.price * consume / 100,
                            creator: member.user.id
                        }, { transaction: t }).then(function (result) {
                            //参赛返豪气
                            return classSelf.Sprit.create({
                                memberId: memberId,
                                type: 1,
                                point: apply,
                                creator: member.user.id
                            }, { transaction: t }).then(function (result) {
                                classSelf.SmsSenderSvr.balanceMinus({
                                    phoneNo: member.user.phoneNo,
                                    name: member.user.name,
                                    amount: price.price,
                                    avlAmt: balance - price.price
                                })
                                return result
                            })
                        })
                    })
                });
            });
        }

        /**
         * @description 线下报名参加
         * @param  {} {phoneNo
         * @param  {} matchId
         * @param  {} matchPriceId
         * @param  {} payType
         * @param  {} couponId}
         */
        async createOffline({ phoneNo, matchId, matchPriceId, payType, couponId, operator }) {
            let classSelf = this
            //检查赛事
            const match = await this.Match.findOne({
                where: { id: matchId, status: 1 },
                include: [this.MatchConfig]
            })
            if (!match) throw new Error("赛事不存在或已结束")

            //检查报名人数
            if (match.limitation) {
                const attendances = await this.Attendance.count({ where: { matchId } })
                if (attendances >= match.limitation) throw new Error('参赛人数已满')
            }

            //查找价格
            const price = await this.MatchPriceSvr.findActivePriceById({ id: matchPriceId })
            if (!price) throw new Error('赛事价格不存在')

            if (price.limitation) {
                const priceCount = await this.Attendance.count({ where: { matchId, priceType: price.type } })
                if (priceCount >= price.limitation) throw new Error('该价格优惠人数已满')
            }

            //检查会员
            const member = await this.Member.findOne({
                include: [{
                    model: this.User,
                    where: { phoneNo, status: 1 }
                }, {
                    model: this.MemberLevel
                }]
            })
            if (!member) throw new Error("会员不存在或已冻结")
            const apply = member.memberLevel.apply || 0
            const consume = member.memberLevel.consume || 0
            const memberId = member.id
            let balance = 0
            let point = 0
            let coupon = {}
            if (payType == 1) {
                balance = await this.BalanceSvr.totalByMemberId({ memberId })
                if (balance < price.price) throw new Error("帐户余额不足")
            } else if (payType == 2) {
                point = await this.LoyaltyPointSvr.totalByMemberId({ memberId })
                if (point < price.price) throw new Error("帐户积分不足")
            } else if (payType == 3) {
                coupon = await this.Coupon.findOne({ where: { id: couponId, type: 1, subType: match.matchConfig.subType.val, status: 1 } })
                if (!coupon) throw new Error("免费赛事门票不存在")
            } else {
                throw new Error('支付方式不存在')
            }

            //检查是否报名
            const attended = await this.Attendance.count({
                where: { matchId, memberId }
            })
            if (attended > 0) throw new Error("您已报名参赛")

            //报名事务
            return classSelf.app.model.transaction(function (t) {
                //参赛
                return classSelf.Attendance.create({
                    matchId,
                    memberId,
                    payType,
                    priceType: price.type,
                    matchPrice: price.price,
                    status: 1,
                    creator: operator
                }, { transaction: t }).then(function (attendance) {
                    if (payType == 1) {
                        //扣余额
                        return classSelf.Balance.create({
                            memberId,
                            type: 2,  //消费
                            amount: price.price,
                            source: 7,  //赛事门票
                            sourceNo: attendance.id,
                            remark: "线下赛事报名门票费用",
                            status: 1,
                            creator: operator
                        }, { transaction: t }).then(function (result) {
                            //消费返豪气
                            return classSelf.Sprit.create({
                                memberId,
                                type: 3,
                                point: price.price * consume / 100,
                                creator: operator
                            }, { transaction: t }).then(function (result) {
                                //参赛返豪气
                                return classSelf.Sprit.create({
                                    memberId,
                                    type: 1,
                                    point: apply,
                                    creator: operator
                                }, { transaction: t }).then(function (result) {
                                    classSelf.SmsSenderSvr.balanceMinus({
                                        phoneNo: member.user.phoneNo,
                                        name: member.user.name,
                                        amount: price.price,
                                        avlAmt: balance - price.price
                                    })
                                    return result
                                })
                            })
                        })
                    } else if (payType == 2) {
                        //扣积分
                        return classSelf.LoyaltyPoint.create({
                            memberId,
                            type: 2,
                            points: price.price,
                            source: 7,
                            sourceNo: attendance.id,
                            remark: '线上赛事报名门票费用',
                            status: 1,
                            creator: operator
                        }, { transaction: t }).then(function (result) {
                            //参赛返豪气
                            return classSelf.Sprit.create({
                                memberId,
                                type: 1,
                                point: apply,
                                creator: operator
                            }, { transaction: t }).then(function (result) {
                                classSelf.SmsSenderSvr.loyaltyPointMinus({
                                    phoneNo: member.user.phoneNo,
                                    name: member.user.name,
                                    points: price.price,
                                    avlPts: point - price.price
                                })
                                return result
                            })
                        })
                    } else if (payType == 3) {
                        //使用优惠券
                        return classSelf.Coupon.update({
                            status: 2,
                            updator: operator
                        }, { where: { id: couponId }, transaction: t }).then(function (resunt) {
                            //参赛返豪气
                            return classSelf.Sprit.create({
                                memberId,
                                type: 1,
                                point: apply,
                                creator: operator
                            })
                        })
                    } else {
                        throw new Error('支付方式不存在')
                    }
                });
            });
        }
    }
    return MatchReward
}