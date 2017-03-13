'use strict';

module.exports = app => {
    class Balance extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Balance = this.app.model.balance
            this.Member = this.app.model.member
            this.Sequelize = this.app.sequelize
            this.Helper = this.ctx.helper
        }
        /**
         * @description 根据memberId获取余额
         * @param  {int} memberId
         * @return {decimal} 余额
         */
        async totalByMemberId(memberId) {
            const positive = await this.Balance.sum('amount', { where: { memberId: memberId, isPositive: true } })
            const negative = await this.Balance.sum('amount', { where: { memberId: memberId, isPositive: false } })
            return (positive || 0) - (negative || 0)
        }
        /**
         * @description 获取余额明细
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
            const result = await this.Balance.findAndCount({
                where: cond,
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @param  {int} {memberId
         * @param  {int} type
         * @param  {decimal} amount
         * @param  {int} source
         * @param  {string} sourceNo
         * @param  {string} remark
         * @param  {int} status=1
         * @param  {int} creator=1}
         */
        async create({ memberId, type, amount, isPositive, source, sourceNo, remark, status = 1, creator = 1 }) {
            const memberCount = await this.Member.count({ where: { memberId: memberId } })
            if (matchCount = 0) throw new Error("会员不存在")
            const result = await this.Balance.create({
                memberId: memberId,
                type: type,
                amount: amount,
                isPositive: isPositive,
                source: source,
                sourceNo: sourceNo,
                remark: remark,
                status: status,
                creator: creator
            })
            return result
        }
    }
    return Balance;
};