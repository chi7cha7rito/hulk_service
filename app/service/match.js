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
         * @param  {} {name
         * @param  {} type
         * @param  {} startClosing
         * @param  {} endClosing
         * @param  {} frequency
         * @param  {} status
         * @param  {} pageIndex=1
         * @param  {} pageSize=10}
         * @return {object}
         */
        async findMatches({ name, type, startClosing, endClosing, frequency, status, pageIndex = 1, pageSize = 10 }) {
            let cond = {}
            let configCond = {}
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)

            cond.closingDatetime = {
                $gte: startClosing || this.moment('1971-01-01').format(),
                $lte: endClosing || this.moment('9999-12-31').format(),
            }
            if (status) {
                cond.status = status
            }
            if (name) {
                configCond.name = { $like: '%' + name + '%' }
            }
            if (type) {
                configCond.type = type
            }
            if (frequency) {
                configCond.frequency = frequency
            }
            const result = await this.Match.findAndCount({
                where: cond,
                order: 'openingDatetime DESC',
                include: [{
                    model: this.MatchConfig,
                    where: configCond,
                    include: [
                        { model: this.MatchType, as: 'Type' },
                        { model: this.MatchType, as: 'SubType' },
                        { model: this.MatchPrice },
                        { model: this.MatchReward },
                    ]
                }],
                distinct: true,
                offset: (index - 1) * size,
                limit: size,
            })
            return result
        }

        /**
         * @description 获取赛事
         * @param  {} {id }
         * @return {object}
         */
        async findMatchById({ id }) {
            const result = await this.Match.findOne({
                where: { id },
                include: [{
                    model: this.MatchConfig,
                    include: [
                        { model: this.MatchType, as: 'Type' },
                        { model: this.MatchType, as: 'SubType' },
                        { model: this.MatchPrice },
                        { model: this.MatchReward }
                    ]
                }],
            })
            return result
        }

        /**
         * @description 更新赛事
         * @param  {} {id
         * @param  {} closingDatetime
         * @param  {} openingDatetime
         * @param  {} matchConfigId
         * @param  {} perHand
         * @param  {} operator}
         * @return {object}
         */
        async update({ id, closingDatetime, openingDatetime, matchConfigId, perHand, status, operator }) {
            const matchCount = await this.Match.count({ where: { id: id } })
            if (matchCount == 0) throw new Error("赛事不存在")
            const configCount = await this.MatchConfig.count({ where: { id: matchConfigId, status: 1 } })
            if (configCount == 0) throw new Error("赛事配置不存在或禁用")
            const result = await this.Match.update({
                closingDatetime: closingDatetime,
                openingDatetime: openingDatetime,
                matchConfigId: matchConfigId,
                perHand: perHand,
                status: status,
                updator: operator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 变更赛事状态
         * @param  {} {id
         * @param  {} status
         * @param  {} updator}
         */
        async changeStatus({ id, status, operator }) {
            const matchCount = await this.Match.count({ where: { id: id } })
            if (matchCount == 0) throw new Error("赛事不存在")
            const result = await this.Match.update({
                status: status,
                updator: operator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 创建赛事
         * @param  {} {closingDatetime
         * @param  {} openingDatetime
         * @param  {} matchConfigId
         * @param  {} perHand
         * @param  {} status
         * @param  {} operator}
         * @return {object}
         */
        async create({ closingDatetime, openingDatetime, matchConfigId, perHand, status = 1, operator }) {
            const configCount = await this.MatchConfig.count({ where: { id: matchConfigId, status: 1 } })
            if (configCount == 0) throw new Error("赛事配置不存在或禁用")
            const result = await this.Match.create({
                closingDatetime: closingDatetime,
                openingDatetime: openingDatetime,
                perHand: perHand,
                matchConfigId: matchConfigId,
                status: status,
                creator: operator
            })
            return result
        }
    }

    return Match;
};