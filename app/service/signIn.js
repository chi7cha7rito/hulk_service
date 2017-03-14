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
        async create({ memberId, comment }) {
            const member = await this.Member.findById(memberId)
            if (!member) throw new Error("会员不存在")
            const today = await this.SignIn.count({
                where: {
                    $and: [
                        { memberId: memberId },
                        this.app.sequelize.where(
                            this.app.sequelize.fn('DATE', this.app.sequelize.col('createdAt')),
                            this.app.sequelize.literal('CURRENT_DATE')
                        )
                    ]
                }
            })
            if (today > 0) throw new Error("今天已经签到过")
            const result = await this.SignIn.create({
                comment: comment,
                creator: member.userId,
                memberId: member.id
            })
            return result
        }
    }
    return SignIn;
};