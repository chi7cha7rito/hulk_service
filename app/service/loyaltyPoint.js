'use strict';

module.exports = app => {
    class LoyaltyPoint extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.LoyaltyPoint = this.app.model.LoyaltyPoint
            this.Member = this.app.model.Member
            this.User = this.app.model.User
            this.Helper = this.ctx.helper
            this.moment = this.app.moment
        }

        async totalByMemberId({ memberId }) {
            const total = await this.LoyaltyPoint.sum('points', {
                where: { memberId: memberId, status: 1 }
            })
            return total || 0
        }

        /**
         * @description 获取积分明细
         * @param  {int} {memberId
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
            let member = await this.User.findOne({ where: { phoneNo: phoneNo } })

            if (member && member.memberId) {
                cond.memberId = member.memberId
            }
            cond.createdAt = {
                $gte: startCreatedAt || this.moment('1971-01-01').format(),
                $lte: endCreatedAt || this.moment('9999-12-31').format(),
            }
            if (type) {
                cond.type = type
            }
            cond.status = 1
            const result = await this.LoyaltyPoint.findAndCount({
                where: cond,
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
         * @description 创建积分记录
         * @param  {int} {memberId
         * @param  {int} type
         * @param  {decimal} points
         * @param  {int} source
         * @param  {string} sourceNo
         * @param  {string} remark
         * @param  {int} status=1
         * @param  {int} operator}
         */
        async create({ memberId, type, points, source, sourceNo, remark, status = 1, operator }) {
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
                creator: operator
            })
            return result
        }
    }

    return LoyaltyPoint;
};