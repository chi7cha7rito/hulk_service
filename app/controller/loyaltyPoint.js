'use strict';

module.exports = app => {
    class LoyaltyPointController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.LoyaltyPointSvr = this.service.loyaltyPoint
        }
        
        /**
         * @description 创建积分记录
         */
        async create() {
            const result = await this.LoyaltyPointSvr.create(this.ctx.request.body);
            this.success(result)
        }
 
        /**
         * @description 查询积分记录
         */
        async findEntriesByMemberId() {
            const result = await this.LoyaltyPointSvr.findEntriesByMemberId(this.ctx.query)
            this.success(result)
        }
    }
    return LoyaltyPointController;
};
