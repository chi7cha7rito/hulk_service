'use strict';

module.exports = app => {
    class WechatPaymentController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.WechatPaymentSvr = this.service.wechatPayment
        }

        /**
         * @description 新建充值记录
         */
        async create() {
            const result = await this.WechatPaymentSvr.create(this.ctx.request.body);
            this.success(result)
        }

        /**
         * @description 查找充值记录
         */
        async findEntry() {
            const result = await this.WechatPaymentSvr.findEntry(this.ctx.query);
            this.success(result)
        }

        /**
         * @description 微信回掉通知
         */
        async notify() {
            const result = await this.WechatPaymentSvr.notify(this.ctx.request.body);
            this.success(result)
        }
    }
    return WechatPaymentController;
};
