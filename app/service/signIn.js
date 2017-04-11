'use strict';

module.exports = app => {
    class SignIn extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.SignIn = this.app.model.SignIn
            this.Member = this.app.model.Member
            this.User = this.app.model.User
            this.Balance = this.app.model.Balance
            this.MemberLevel = this.app.model.MemberLevel
            this.Coupon = this.app.model.Coupon
            this.User = this.app.model.User
            this.Wechat = this.app.model.Wechat
            this.Helper = this.ctx.helper
            this.Sequelize = this.app.model
            this.moment = this.app.moment
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
                            $lte: (endDatetime && this.moment(endDatetime).endOf('day'))
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
         * @param  {} {memberId
         * @param  {} comment}
         */
        async create({ memberId, comment }) {
            const classSelf = this
            const member = await classSelf.Member.findById(memberId, { include: [classSelf.MemberLevel, classSelf.User] })
            if (!member) throw new Error("会员不存在")
            const today = await classSelf.SignIn.count({
                where: {
                    $and: [
                        { memberId: memberId },
                        classSelf.Sequelize.where(
                            classSelf.Sequelize.fn('DATE', classSelf.Sequelize.col('createdAt')),
                            classSelf.Sequelize.literal('CURRENT_DATE')
                        )
                    ]
                }
            })
            if (today > 0) throw new Error("今天已经签到过")
            const consumeCount = await classSelf.Balance.count({
                where: {
                    memberId,
                    type: 2,    //消费
                    createdAt: {
                        $gte: this.moment().startOf('day'),
                        $lte: classSelf.moment().endOf('day')
                    }
                }
            })
            if (consumeCount == 0) throw new Error("今天还未到店消费,无法签到")

            const count = await classSelf.SignIn.count({
                where: {
                    memberId,
                    createdAt: {
                        $gte: classSelf.moment().startOf('month'),
                        $lte: classSelf.moment().endOf('month')
                    }
                }
            })
            const coupon = await classSelf.Coupon.count({
                where: {
                    memberId,
                    type: 1,
                    subType: 2,
                    source: 1,
                    status: 1,
                    createdAt: {
                        $gte: classSelf.moment().startOf('month'),
                        $lte: classSelf.moment().endOf('month')
                    },
                    creator: member.user.id
                }
            })

            return classSelf.app.model.transaction(function (t) {
                return classSelf.SignIn.create({
                    comment: comment,
                    creator: member.userId,
                    memberId: member.id
                }, { transaction: t }).then(function (result) {
                    let curr = count + 1
                    if (member.memberLevel.weeklyTicket && curr == member.memberLevel.weeklyTicket && coupon == 0) {
                        return classSelf.Coupon.create({
                            memberId,
                            type: 1,
                            subType: 2,
                            source: 1,
                            remark: '签到周票',
                            status: 1,
                            creator: member.user.id
                        }, { transaction: t }).then(function (result) {
                            return result
                        })
                    } else {
                        return result
                    }
                })
            })
        }
    }
    return SignIn;
};