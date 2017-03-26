'use strict';

module.exports = app => {
    class CouponController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.CouponSvr = this.service.coupon
        }

        /**
         * @description 创建优惠券
         */
        async create() {
            const result = await this.CouponSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 创建优惠券
        */
        async update() {
            const result = await this.CouponSvr.update(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查询优惠券
         */
        async findAll() {
            const result = await this.CouponSvr.findAll(this.ctx.query)
            this.success(result)

        }
    }
    return CouponController;
};
