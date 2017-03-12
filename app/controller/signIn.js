'use strict';

module.exports = app => {
    class SignController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.SignInSvr = this.service.signIn
        }
        async create() {
            this.ctx.body = await this.SignInSvr.create(this.ctx.request.body.wechatOpenId);
        }
    }
    return SignController;
};
