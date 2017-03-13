'use strict';

module.exports = app => {
    class BalanceController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.BalanceSvr = this.service.balance
        }
        async create() {
            const result = await this.BalanceSvr.create(this.ctx.request.body)
            this.success(result)
        }
        async findEntriesByMemberId() {
            const result = await this.BalanceSvr.findEntriesByMemberId(this.ctx.query)
            this.success(result)

        }
    }
    return BalanceController;
};
