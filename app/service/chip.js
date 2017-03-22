'use strict';

module.exports = app => {
    class Chip extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Chip = this.app.model.Chip
            this.MemberLevel = this.app.model.MemberLevel
            this.Member = this.app.model.Member
            this.Match = this.app.model.Match
            this.MatchConfig = this.app.model.MatchConfig
            this.Sprit = this.app.model.Sprit
            this.Balance = this.app.model.Balance
            this.LoyaltyPoint = this.app.model.LoyaltyPoint
            this.BalanceSvr = this.service.balance
            this.LoyaltyPointSvr = this.service.loyaltyPoint
        }

        /**
         * @description 购买筹码
         * @param  {} {memberId
         * @param  {} matchId
         * @param  {} quantity
         * @param  {} payType
         * @param  {} payAmount
         * @param  {} remark
         * @param  {} creator}
         */
        async create({ memberId, matchId, quantity, payType, payAmount, remark, creator }) {
            const classSelf = this
            const member = await classSelf.Member.findOne({ where: { id: memberId }, include: [this.MemberLevel] })
            if (!member) throw new Error('会员不存在')
            const match = await classSelf.Match.findOne({ where: { id: matchId }, include: [this.MatchConfig] })
            if (!match) throw new Error('赛事不存在')
            //查询余额
            if (payType == 1) {
                const balance = await this.BalanceSvr.totalByMemberId({ memberId })
                if (balance < payAmount) throw new Error("帐户余额不足")
            } else if (payType == 2) {
                const point = await this.LoyaltyPointSvr.totalByMemberId({ memberId })
                if (point < payAmount) throw new Error("帐户积分不足")
            } else {
                throw new Error('支付方式不对')
            }

            const buyChip = member.memberLevel.buyChip || 0
            const consume = member.memberLevel.consume || 0
            //报名事务
            return classSelf.app.model.transaction(function (t) {
                return classSelf.Chip.create({
                    memberId: memberId,
                    matchId: matchId,
                    unitPrice: match.matchConfig.perHand || 0,
                    quantity: quantity,
                    payType: payType,
                    payAmount: payAmount,
                    remark: remark,
                    creator: creator
                }, { transaction: t }).then(function (result) {
                    //重入返豪气
                    let chipId = result.id
                    return classSelf.Sprit.create({
                        memberId: memberId,
                        type: 2,
                        point: buyChip
                    }, { transaction: t }).then(function (result) {
                        // 余额支付返豪气
                        if (payType == 1) {
                            return classSelf.Sprit.create({
                                memberId: memberId,
                                type: 3,
                                point: payAmount * consume / 100
                            }, { transaction: t }).then(function (result) {
                                return classSelf.Balance.create({
                                    memberId: memberId,
                                    type: 2,
                                    amount: payAmount,
                                    source: 11,
                                    sourceNo: chipId,
                                    remark: '购买筹码',
                                    status: 1,
                                    creator: creator
                                }, { transaction: t }).then(function (result) {
                                    return result
                                })
                            })
                        } else if (payType == 2) {
                            return classSelf.LoyaltyPoint.create({
                                memberId: memberId,
                                type: 2,
                                points: payAmount,
                                source: 6,
                                sourceNo: chipId,
                                remark: '购买筹码',
                                status: 1,
                                creator: creator
                            }, { transaction: t }).then(function (result) {
                                return result
                            })
                        } else {
                            throw new Error('支付方式不对')
                        }
                    })
                })
            })
        }
    }
    return Chip;
};