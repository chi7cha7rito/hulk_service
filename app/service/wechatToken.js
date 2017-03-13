'use strict';

module.exports = app => {
    class WechatToken extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.WechatToken = this.app.model.wechatToken
            this.moment = this.app.moment
        }

        async findByOpenId({ openid }) {
            const result = await this.WechatToken.findOne({ where: { openid: openid } })
            if (result) {
                let diff = this.moment().utc().unix() - this.moment(result.createdAt).unix()
                if (diff > this.app.config.wxExpires) throw new Error("Token过期")
            } else {
                throw new Error("没有找到Token")
            }
            return result
        }

        /**
         * @description 创建微信access_token
         * @param  {} {access_token
         * @param  {} expires_in
         * @param  {} openid
         * @param  {} scope}
         */
        async create({ access_token, expires_in, openid, scope }) {
            const result = await this.WechatToken.create({
                access_token: access_token,
                expires_in: expires_in,
                openid: openid,
                scope: scope
            })
            return result
        }
    }
    return WechatToken;
};