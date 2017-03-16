'use strict';

module.exports = app => {
    class Sms extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Sms = this.app.model.sms
        }

        /**
         * @description 验证码
         * @param  {} {type
         * @param  {} phoneNo
         * @param  {} code}
         */
        async SecurityCode({ type, phoneNo, code }) {
            const result = await this.Sms.create({
                type: type,
                phoneNo: phoneNo,
                content: `您的验证码为${code}，请在30分钟内完成输入。`
            })
            return result
        }
    }
    return Sms;
};