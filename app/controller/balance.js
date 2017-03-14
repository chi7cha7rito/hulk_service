'use strict';

module.exports = app => {
    class BalanceController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.BalanceSvr = this.service.balance
        }
        
        /**
         * @description 创建充值记录
         */
        async create() {
            const result = await this.BalanceSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查询余额记录
         */
        async findEntriesByMemberId() {
            const result = await this.BalanceSvr.findEntriesByMemberId(this.ctx.query)
            this.success(result)

        }
    }
    return BalanceController;
};
