'use strict';

module.exports = app => {
    class SignIn extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.SignIn = this.app.model.signIn
            this.Member = this.app.model.member
            this.Wechat = this.app.model.wechat
            this.Sequelize = this.app.sequelize
            this.Helper = this.ctx.helper
        }

        /**
         * @description 签到
         * @param  {} memberId
         */
        async create({ memberId }) {
            try {
                const member = await this.Member.findById(memberId)
                if (member) {
                    const result = await this.SignIn.create({
                        creator: member.userId,
                        memberId: member.id
                    })
                    return this.Helper.ok(result)
                }
                return this.Helper.err("会员不存在")
            } catch (error) {
                return this.Helper.err(JSON.stringify(error.errors))
            }
        }
    }
    return SignIn;
};