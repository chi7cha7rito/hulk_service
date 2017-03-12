'use strict';

module.exports = app => {
    class LoyaltyPoint extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.LoyaltyPoint = this.app.model.loyaltyPoint
            this.Sequelize = this.app.sequelize
            this.Helper = this.ctx.helper
        }

        async totalByMemberId(memberId) {
            const positive = await this.LoyaltyPoint.sum('points', { where: { memberId: memberId, isPositive: true } })
            const negative = await this.LoyaltyPoint.sum('points', { where: { memberId: memberId, isPositive: false } })
            return positive - negative
        }

        /**
         * @description 获取积分明细
         * @param  {int} {memberId
         * @param  {int} type
         * @param  {int} status=1
         * @param  {int} pageIndex=1
         * @param  {int} pageSize=10}
         * @return {object}
         */
        async findEntriesByMemberId({ memberId, type, status, pageIndex = 1, pageSize = 10 }) {
            let cond = {}
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            if (memberId) {
                cond.memberId = memberId
            }
            if (type) {
                cond.type = type
            }
            if (status) {
                cond.status = status
            }
            const result = await this.LoyaltyPoint.findAndCount({
                where: cond,
                offset: (index - 1) * size,
                limit: size
            })
            return this.Helper.ok(result)
        }

        /**
         * @param  {int} {memberId
         * @param  {int} type
         * @param  {decimal} points
         * @param  {int} source
         * @param  {string} sourceNo
         * @param  {string} remark
         * @param  {int} status=1
         * @param  {int} creator=1}
         */
        async create({ memberId, type, points, isPositive, source, sourceNo, remark, status = 1, creator = 1 }) {
            const result = await this.LoyaltyPoint.create({
                memberId: memberId,
                type: type,
                points: points,
                isPositive: isPositive,
                source: source,
                sourceNo: sourceNo,
                remark: remark,
                status: status,
                creator: creator
            })
            return this.Helper.ok(result)
        }
    }

    return LoyaltyPoint;
};