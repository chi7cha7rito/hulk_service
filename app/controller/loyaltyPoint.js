'use strict';

module.exports = app => {
    class LoyaltyPointController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.LoyaltyPointSvr = this.service.loyaltyPoint
        }
        async create() {
            const result = await this.LoyaltyPointSvr.create(this.ctx.request.body);
            this.success(result)
        }
        async findEntriesByMemberId() {
            const result = await this.LoyaltyPointSvr.findEntriesByMemberId(this.ctx.query)
            this.success(result)
        }
    }
    return LoyaltyPointController;
};
