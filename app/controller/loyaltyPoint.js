'use strict';

module.exports = app => {
    class LoyaltyPointController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.LoyaltyPointSvr = this.service.loyaltyPoint
        }
        async create() {
            this.ctx.body = await this.LoyaltyPointSvr.create(this.ctx.request.body);
        }
        async findEntriesByMemberId() {
            this.ctx.body = await this.LoyaltyPointSvr.findEntriesByMemberId(this.ctx.query)
        }
    }
    return LoyaltyPointController;
};
