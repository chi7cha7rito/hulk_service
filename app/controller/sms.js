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
        async SecurityCode() {
            const result = await this.SmsSvr.SecurityCode(this.ctx.request.body);
            this.success(result)
        }
    }
    return SmsController;
};
