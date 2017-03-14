'use strict';

module.exports = app => {
    class WechatTokenController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.WechatTokenSvr = this.service.wechatToken
        }

        /**
         * @description 新建access_token
         */
        async create() {
            const result = await this.WechatTokenSvr.create(this.ctx.request.body);
            this.success(result)
        }

        /**
         * @description 查找access_token
         */
        async findByOpenId() {
            const result = await this.WechatTokenSvr.findByOpenId(this.ctx.query);
            this.success(result)
        }

        /**
         * @description 更新access_token
         */
        async update() {
            const result = await this.WechatTokenSvr.update(this.ctx.request.body);
            this.success(result)
        }
    }
    return WechatTokenController;
};
