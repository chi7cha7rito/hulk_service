'use strict';

module.exports = app => {
    class Match extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Match = this.app.model.match
            this.MatchType = this.app.model.matchType
            this.Helper = this.ctx.helper
            this.moment = this.app.moment
        }

        /**
         * @description 获取赛事
         * @param  {} {name
         * @param  {} type
         * @param  {} startOpening
         * @param  {} endOpening
         * @param  {} holder
         * @param  {} status
         * @param  {} pageIndex=1
         * @param  {} pageSize=10}
         * @return {object}
         */
        async findMatches({ name, type, startOpening, endOpening, holder, status, pageIndex = 1, pageSize = 10 }) {
            let cond = {}
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            if (name) {
                cond.name = { $like: '%' + name + '%' }
            }
            if (type) {
                cond.type = type
            }
            cond.opening = {
                $gte: startOpening || moment('1971-01-01').utc().format(),
                $lte: endOpening || moment('9999-12-31').utc().format(),
            }
            if (holder) {
                cond.holder = { $like: '%' + holder + '%' }
            }
            if (status) {
                cond.status = status
            }
            const result = await this.Match.findAndCount({
                where: cond,
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @description 更新赛事
         * @param  {} {name
         * @param  {} type
         * @param  {} subType
         * @param  {} opening
         * @param  {} description
         * @param  {} holder
         * @param  {} updator}
         * @return {object}
         */
        async update({ id, name, type, subType, opening, description, holder, updator }) {
            const matchCount = await this.Match.count({ where: { id: id, status: 1 } })
            if (matchCount == 0) throw new Error("赛事不存在或已结束")
            const nameCount = await this.Match.count({ where: { name: name } })
            if (nameCount > 0) throw new Error("赛事名称已存在")
            const typeCount = await this.MatchType.count({ where: { id: type } })
            if (typeCount == 0) throw new Error("赛事类型不存在")
            const subTypeCount = await this.MatchType.count({ where: { id: subType } })
            if (subTypeCount == 0) throw new Error("赛事子类型不存在")
            const result = await this.Match.update({
                name: name,
                type: type,
                subType: subType,
                opening: opening,
                description: description,
                holder: holder,
                updator: updator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 关闭赛事
         * @param  {} {id
         * @param  {} updator}
         */
        async disable({ id, updator }) {
            const matchCount = await this.Match.count({ where: { id: id, status: 1 } })
            if (matchCount == 0) throw new Error("赛事不存在或已结束")
            const result = await this.Match.update({
                status: 2,
                updator: updator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 创建赛事
         * @param  {} {name
         * @param  {} type
         * @param  {} subType
         * @param  {} opening
         * @param  {} description
         * @param  {} holder
         * @param  {} status=1
         * @param  {} creator}
         * @return {object}
         */
        async create({ name, type, subType, opening, description, holder, status = 1, creator }) {
            const nameCount = await this.Match.count({ where: { name: name } })
            if (nameCount > 0) throw new Error("赛事名称已存在")
            const typeCount = await this.MatchType.count({ where: { id: type } })
            if (typeCount == 0) throw new Error("赛事类型不存在")
            const subTypeCount = await this.MatchType.count({ where: { id: subType } })
            if (subTypeCount == 0) throw new Error("赛事子类型不存在")
            const result = await this.Match.create({
                name: name,
                type: type,
                subType: subType,
                opening: opening,
                description: description,
                holder: holder,
                status: status,
                creator: creator
            })
            return result
        }
    }

    return Match;
};