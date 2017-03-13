'use strict';

module.exports = app => {
    class WechatTokenController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.WechatTokenSvr = this.service.wechatToken
        }
        async create() {
            const result = await this.WechatTokenSvr.create(this.ctx.request.body);
            this.success(result)
        }
        async findByOpenId() {
            const result = await this.WechatTokenSvr.findByOpenId(this.ctx.query);
            this.success(result)
        }
    }
    return WechatTokenController;
};
