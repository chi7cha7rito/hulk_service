'use strict';

module.exports = app => {
    class Match extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Attendance = this.app.model.Attendance
            this.MatchConfig = this.app.model.MatchConfig
            this.Match = this.app.model.Match
            this.MatchPrice = this.app.model.MatchPrice
            this.MatchReward = this.app.model.MatchReward
            this.MatchType = this.app.model.MatchType
            this.MemberLevel = this.app.model.MemberLevel
            this.Helper = this.ctx.helper
            this.moment = this.app.moment
            this._ = this.app._
        }

        /**
         * @description 获取赛事
         * @param  {} {name
         * @param  {} type
         * @param  {} startClosing
         * @param  {} endClosing
         * @param  {} subType
         * @param  {} applyOnline
         * @param  {} status
         * @param  {} pageIndex=1
         * @param  {} pageSize=10}
         * @return {object}
         */
        async findMatches({ name, type, startClosing, endClosing, subType, applyOnline, status, pageIndex = 1, pageSize = 10 }) {
            let cond = {}
            let configCond = {}
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)

            cond.closingDatetime = {
                $gte: startClosing || this.moment('1971-01-01').format(),
                $lte: (endClosing && this.moment(endClosing).endOf('day')) || this.moment('9999-12-31').format(),
            }
            if (status) {
                cond.status = status
            } else {
                cond.status = { $ne: 3 }
            }
            if (name) {
                configCond.name = { $like: '%' + name + '%' }
            }
            if (type) {
                configCond.type = type
            }
            if (subType) {
                configCond.subType = subType
            }
            if (applyOnline) {
                applyOnline = applyOnline == "true"
                cond.applyOnline = applyOnline
            }

            const result = await this.Match.findAndCount({
                where: cond,
                order: 'openingDatetime DESC',
                include: [{
                    model: this.MatchConfig,
                    where: configCond,
                    include: [
                        { model: this.MatchType, as: 'Type' },
                        {
                            model: this.MatchPrice,
                            where: { status: { $ne: 3 } },
                            include: [{ model: this.MemberLevel, as: 'Type', attributes: ['id', 'name'] }]
                        },
                        { model: this.MatchReward },
                    ]
                }, {
                    model: this.Attendance,
                    attributes: ['id'],
                }],
                distinct: true,
                offset: (index - 1) * size,
                limit: size,
            })
            return result
        }

        /**
         * @description 获取当天可参赛赛事
         * @return {object}
         */
        async findAvailable() {
            let cond = {}
            cond.closingDatetime = {
                $gte: this.moment().format()
                // $lte: this.moment().endOf('day').format(),
            }
            cond.status = 1
            const result = await this.Match.findAll({
                where: cond,
                order: 'openingDatetime DESC',
                include: [{
                    model: this.MatchConfig,
                    include: [
                        { model: this.MatchType, as: 'Type' },
                        {
                            model: this.MatchPrice,
                            where: { status: 1 },
                            include: [{ model: this.MemberLevel, as: 'Type', attributes: ['id', 'name'] }]
                        },
                    ]
                }],
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
                        {
                            model: this.MatchPrice,
                            include: [{ model: this.MemberLevel, as: 'Type', attributes: ['id', 'name'] }]
                        },
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
         * @param  {} applyOnline
         * @param  {} limitation
         * @param  {} operator}
         * @return {object}
         */
        async update({ id, closingDatetime, openingDatetime, matchConfigId, perHand, applyOnline, limitation, status, operator }) {
            const matchCount = await this.Match.count({ where: { id } })
            if (matchCount == 0) throw new Error("赛事不存在")
            const configCount = await this.MatchConfig.count({ where: { id: matchConfigId, status: 1 } })
            if (configCount == 0) throw new Error("赛事配置不存在或禁用")
            const result = await this.Match.update({
                closingDatetime,
                openingDatetime,
                matchConfigId,
                perHand,
                applyOnline,
                limitation,
                status,
                updator: operator
            }, { where: { id } })
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
            if (status.toString() === '3') {
                const attendance = await this.Attendance.count({ where: { matchId: id } })
                if (attendance > 0) throw new Error('已有人参赛，无法删除')
            }
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
         * @param  {} applyOnline
         * @param  {} limitation
         * @param  {} status
         * @param  {} operator}
         * @return {object}
         */
        async create({ closingDatetime, openingDatetime, matchConfigId, applyOnline, limitation, perHand, status = 1, operator }) {
            const configCount = await this.MatchConfig.count({ where: { id: matchConfigId, status: 1 } })
            if (configCount == 0) throw new Error("赛事配置不存在或禁用")
            const result = await this.Match.create({
                closingDatetime,
                openingDatetime,
                perHand,
                matchConfigId,
                applyOnline,
                limitation,
                status,
                creator: operator
            })
            return result
        }
    }

    return Match;
};