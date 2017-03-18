'use strict';

module.exports = app => {
    class LoyaltyPoint extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.LoyaltyPoint = this.app.model.LoyaltyPoint
            this.Member = this.app.model.Member
            this.Helper = this.ctx.helper
        }

        async totalByMemberId({ memberId }) {
            const positive = await this.LoyaltyPoint.sum('points', {
                where: { memberId: memberId, isPositive: true, status: 1 }
            })
            const negative = await this.LoyaltyPoint.sum('points', {
                where: { memberId: memberId, isPositive: false, status: 1 }
            })
            return (positive || 0) - (negative || 0)
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
        async findEntries({ memberId, type, status, pageIndex = 1, pageSize = 10 }) {
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
            } else {
                cond.status = { $in: [1, 2] }
            }
            const result = await this.LoyaltyPoint.findAndCount({
                where: cond,
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @description 创建积分记录
         * @param  {int} {memberId
         * @param  {int} type
         * @param  {decimal} points
         * @param  {int} source
         * @param  {string} sourceNo
         * @param  {string} remark
         * @param  {int} status=1
         * @param  {int} creator}
         */
        async create({ memberId, type, points, source, sourceNo, remark, status = 1, creator }) {
            const memberCount = await this.Member.count({ where: { id: memberId } })
            if (memberCount == 0) throw new Error("会员不存在")
            const result = await this.LoyaltyPoint.create({
                memberId: memberId,
                type: type,
                points: points,
                source: source,
                sourceNo: sourceNo,
                remark: remark,
                status: status,
                creator: creator
            })
            return result
        }
    }

    return LoyaltyPoint;
};