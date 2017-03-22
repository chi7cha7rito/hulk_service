'use strict';

module.exports = app => {
    class Match extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.MatchConfig = this.app.model.MatchConfig
            this.Match = this.app.model.Match
            this.MatchPrice = this.app.model.MatchPrice
            this.MatchReward = this.app.model.MatchReward
            this.MatchType = this.app.model.MatchType
            this.Helper = this.ctx.helper
            this.moment = this.app.moment
        }

        /**
         * @description 获取赛事
         * @param  {} {startOpening
         * @param  {} endOpening
         * @param  {} status
         * @param  {} pageIndex=1
         * @param  {} pageSize=10}
         * @return {object}
         */
        async findMatches({ startOpening, endOpening, status, pageIndex = 1, pageSize = 10 }) {
            let cond = {}
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)

            cond.openingDatetime = {
                $gte: startOpening || this.moment('1971-01-01').format(),
                $lte: endOpening || this.moment('9999-12-31').format(),
            }
            if (status) {
                cond.status = status
            }
            const result = await this.Match.findAndCount({
                where: cond,
                order: 'openingDatetime DESC',
                include: [{
                    model: this.MatchConfig,
                    include: [
                        { model: this.MatchType, as: 'Type' },
                        { model: this.MatchType, as: 'SubType' },
                        { model: this.MatchPrice },
                        { model: this.MatchReward }
                    ]
                }],
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @description 更新赛事
         * @param  {} {id
         * @param  {} closingDatetime
         * @param  {} openingDatetime
         * @param  {} matchConfigId
         * @param  {} updator}
         * @return {object}
         */
        async update({ id, closingDatetime, openingDatetime, matchConfigId, status, updator }) {
            const matchCount = await this.Match.count({ where: { id: id } })
            if (matchCount == 0) throw new Error("赛事不存在")
            const configCount = await this.MatchConfig.count({ where: { id: matchConfigId, status: 1 } })
            if (configCount == 0) throw new Error("赛事配置不存在或禁用")
            const result = await this.Match.update({
                closingDatetime: closingDatetime,
                openingDatetime: openingDatetime,
                matchConfigId: matchConfigId,
                status: status,
                updator: updator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 变更赛事状态
         * @param  {} {id
         * @param  {} status
         * @param  {} updator}
         */
        async changeStatus({ id, status, updator }) {
            const matchCount = await this.Match.count({ where: { id: id } })
            if (matchCount == 0) throw new Error("赛事不存在")
            const result = await this.Match.update({
                status: status,
                updator: updator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 创建赛事
         * @param  {} {closingDatetime
         * @param  {} openingDatetime
         * @param  {} matchConfigId
         * @param  {} status
         * @param  {} creator}
         * @return {object}
         */
        async create({ closingDatetime, openingDatetime, matchConfigId, status = 1, creator }) {
            const configCount = await this.MatchConfig.count({ where: { id: matchConfigId, status: 1 } })
            if (configCount == 0) throw new Error("赛事配置不存在或禁用")
            const result = await this.Match.create({
                closingDatetime: closingDatetime,
                openingDatetime: openingDatetime,
                matchConfigId: matchConfigId,
                status: status,
                creator: creator
            })
            return result
        }
    }

    return Match;
};