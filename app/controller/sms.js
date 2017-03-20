'use strict';

module.exports = app => {
    class SmsController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.SmsSvr = this.service.sms
        }

        /**
         * @description 创建短信验证码
         */
        async create() {
            const result = await this.SmsSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 创建短信验证码
        */
        async successful() {
            const result = await this.SmsSvr.success(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 创建短信验证码
        */
        async failure() {
            const result = await this.SmsSvr.failure(this.ctx.request.body)
            this.success(result)
        }
    }
    return SmsController;
};
