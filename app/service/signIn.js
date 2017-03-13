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
            const memberCount = await this.Member.count({ where: { memberId: memberId } })
            if (memberCount = 0) throw new Error("会员不存在")
            const result = await this.SignIn.create({
                creator: member.userId,
                memberId: member.id
            })
            return result
        }
    }
    return SignIn;
};