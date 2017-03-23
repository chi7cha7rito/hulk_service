'use strict';

module.exports = app => {
    class Sprit extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Member = this.app.model.Member
            this.MemberType = this.app.model.MemberType
            this.Sprit = this.app.model.Sprit
            this.Helper = this.ctx.helper
            this.Sequelize = this.app.model
        }

        /**
         * @description 查询豪气排名
         * @param  {} {startDatetime
         * @param  {} endDatetime
         * @param  {} pageIndex
         * @param  {} pageSize}
         */
        async spritRanking({ startDatetime, endDatetime, pageIndex = 1, pageSize = 10 }) {
            if (!startDatetime) throw new Error('请输入开始时间')
            if (!endDatetime) throw new Error('请输入结束时间')
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            const result = await this.Member.findAndCount({
               attributes: [[this.Sequelize.fn('sum', this.Sequelize.col('sprint.point')), 'total']],
                include: [{
                    model: this.Sprit,
                }],
                offset: (index - 1) * size,
                limit: size,
            })
            return result
        }

        /**
         * @description 获取豪气总数
         * @param  {} {memberId}
         */
        async totalByMemberId({ memberId }) {
            const result = await this.Sprit.sum('point', {
                where: { memberId: memberId }
            })
            return result
        }

        /**
         * @description 获取豪气
         * @param  {} {memberId
         * @param  {} type
         * @param  {} amount:消费金额}
         */
        async create({ memberId, type, amount = 0 }) {
            let point = 0
            let result
            const member = await this.Member.findById(memberId, { include: [this.MemberType] })
            if (!member) throw new Error("会员不存在")
            if (type == 1) {
                //参赛
                point = member.memberLevel.apply || 0
            } else if (type == 2) {
                //重入
                point = member.memberLevel.buyChip || 0
            } else if (type == 3) {
                //消费
                point = (amount * member.memberLevel.consume || 0) / 100
            }
            if (point) {
                result = await this.Sprit.create({
                    memberId: memberId,
                    type: type,
                    point: point
                })
            }
            return result
        }
    }
    return Sprit;
};