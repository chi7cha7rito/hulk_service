'use strict';

module.exports = app => {
    class Sprit extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Member = this.app.Member
            this.MemberType = this.app.MemberType
            this.Sprit = this.app.model.Sprit
        }

        /**
         * @description 获取豪气
         * @param  {} {memberId
         * @param  {} type
         * @param  {} amount:消费金额}
         */
        async create({ memberId, type, amount = 0 }) {
            let point = 0
            let result
            const member = await this.Member.findById(memberId, { include: [this.MemberType] })
            if (!member) throw new Error("会员不存在")
            if (type == 1) {
                //参赛
                point = member.memberLevel.apply || 0
            } else if (type == 2) {
                //重入
                point = member.memberLevel.buyChip || 0
            } else if (type == 3) {
                //消费
                point = (amount * member.memberLevel.consume || 0) / 100
            }
            if (point) {
                result = await this.Sprit.create({
                    memberId: memberId,
                    type: type,
                    point: point
                })
            }
            return result
        }
    }
    return Sprit;
};