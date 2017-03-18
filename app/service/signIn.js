'use strict';

module.exports = app => {
    class SignIn extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.SignIn = this.app.model.SignIn
            this.Member = this.app.model.Member
            this.Wechat = this.app.model.Wechat
            this.Sequelize = this.app.model
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
                        this.Sequelize.where(
                            this.Sequelize.fn('DATE', this.Sequelize.col('createdAt')),
                            this.Sequelize.literal('CURRENT_DATE')
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