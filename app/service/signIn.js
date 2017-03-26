'use strict';

module.exports = app => {
    class SignIn extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.SignIn = this.app.model.SignIn
            this.Member = this.app.model.Member
            this.User = this.app.model.User
            this.Wechat = this.app.model.Wechat
            this.Helper = this.ctx.helper
            this.Sequelize = this.app.model
        }

        /**
         * @description 查询签到
         * @param  {} {startDatetime
         * @param  {} endDatetime
         * @param  {} pageIndex
         * @param  {} pageSize}
         */
        async signInStats({ startDatetime, endDatetime, pageIndex = 1, pageSize = 10 }) {
            if (!startDatetime) throw new Error('请输入开始时间')
            if (!endDatetime) throw new Error('请输入结束时间')
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            const result = await this.Member.findAndCount({
                order: 'total DESC',
                attributes: ['id', 'user.name', 'user.phoneNo', [this.Sequelize.fn('COUNT', this.Sequelize.col('signIns.id')), 'total']],
                include: [{
                    model: this.SignIn,
                    attributes: [],
                    duplicating: false,
                    where: {
                        createdAt: {
                            $gte: startDatetime,
                            $lte: endDatetime
                        }
                    }
                }, {
                    model: this.User,
                    duplicating: false,
                    attributes: [],
                }],
                raw: true,
                group: ['member.id'],
                offset: (index - 1) * size,
                limit: size,
            })
            result.count = result.count.length
            return result
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