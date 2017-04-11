'use strict';

module.exports = app => {
    class Sprit extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.User = this.app.model.User
            this.Member = this.app.model.Member
            this.MemberType = this.app.model.MemberType
            this.Sprit = this.app.model.Sprit
            this.Helper = this.ctx.helper
            this.Sequelize = this.app.model
            this.moment = this.app.moment
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
                order: 'total DESC',
                attributes: ['id', 'user.name', 'user.phoneNo', [this.Sequelize.fn('SUM', this.Sequelize.col('sprits.point')), 'total']],
                include: [{
                    model: this.Sprit,
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
         * @description 获取豪气总数
         * @param  {} {startDatetime
         * @param  {} endDatetime
         * @param  {} memberId}
         */
        async totalByMemberId({ startDatetime, endDatetime, memberId }) {
            if (!startDatetime) throw new Error('请输入开始时间')
            if (!endDatetime) throw new Error('请输入结束时间')
            const result = await this.Sprit.sum('point', {
                where: {
                    memberId: memberId,
                    createdAt: {
                        $gte: startDatetime,
                        $lte: (endDatetime && this.moment(endDatetime).endOf('day'))
                    }
                }
            })
            return result || 0
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