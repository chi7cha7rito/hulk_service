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
        async findEntries() {
            const result = await this.LoyaltyPointSvr.findEntries(this.ctx.query)
            this.success(result)
        }

        /**
        * @description 根据memberId查询积分余额
        */
        async totalByMemberId() {
            const result = await this.LoyaltyPointSvr.totalByMemberId(this.ctx.query)
            this.success(result)
        }
    }
    return LoyaltyPointController;
};
