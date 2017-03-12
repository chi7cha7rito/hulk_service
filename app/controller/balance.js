'use strict';

module.exports = app => {
    class BalanceController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.BalanceSvr = this.service.balance
        }
        async create() {
            this.ctx.body = await this.BalanceSvr.create(this.ctx.request.body);
        }
        async findEntriesByMemberId() {
            this.ctx.body = await this.BalanceSvr.findEntriesByMemberId(this.ctx.query)
        }
    }
    return BalanceController;
};
