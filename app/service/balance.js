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
            const positive = await this.Balance.sum('amount', {
                where: { memberId: memberId, isPositive: true, status: 1 }
            })
            const negative = await this.Balance.sum('amount', {
                where: { memberId: memberId, isPositive: false, status: 1 }
            })
            return (positive || 0) - (negative || 0)
        }

        /**
         * @description 获取余额明细
         * @param  {int} {memberId
         * @param  {int} type
         * @param  {int} status
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
        async create({ memberId, type, amount, isPositive, source, sourceNo, remark, status, creator = 1 }) {
            const memberCount = await this.Member.count({
                where: { id: memberId, status: 1 }
            })
            if (memberCount == 0) throw new Error("会员不存在或被冻结")
            const result = await this.Balance.create({
                memberId: memberId,
                type: type,
                amount: amount,
                isPositive: isPositive,
                source: source,
                sourceNo: sourceNo,
                remark: remark,
                status: type == 1 ? 2 : 1,  //线上充值状态为2（冻结）,等待支付反馈成功转为1（正常）,失败转为状态3（失败）
                creator: creator
            })
            return result
        }
    }
    return Balance;
};