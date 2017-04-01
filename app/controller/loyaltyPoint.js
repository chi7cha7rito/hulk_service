'use strict';

module.exports = app => {
    class LoyaltyPointController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.LoyaltyPointSvr = this.service.loyaltyPoint
        }

        /**
        * @description 积分扣减
        */
        async decrease() {
            const result = await this.LoyaltyPointSvr.decrease(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 积分扣减
         */
        async increase() {
            const result = await this.LoyaltyPointSvr.increase(this.ctx.request.body)
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

        /**
        * @description 根据phoneNo查询积分余额
        */
        async totalByPhoneNo() {
            const result = await this.LoyaltyPointSvr.totalByPhoneNo(this.ctx.query)
            this.success(result)
        }
    }
    return LoyaltyPointController;
};
