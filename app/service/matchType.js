'use strict';

module.exports = app => {
    class MatchType extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.MatchType = this.app.model.matchType
        }

        /**
         * @description 查找赛事类型
         * @param  {} {pid
         * @param  {} status}
         */
        async findByPid({ pid, status }) {
            let cond = {}
            if (pid) cond.pid = pid
            if (status) cond.status = status
            const result = await this.MatchType.findAll({ where: cond })
            return result
        }

        /**
        * @description 更新赛事类型
        * @param  {} {id
        * @param  {} name
        * @param  {} pid}
        */
        async update({ id, name, pid }) {
            const exist = await this.MatchType.count({ where: { id: id } })
            if (exist == 0) throw new Error("记录不存在")
            const typeCount = await this.MatchType.count({ where: { name: name } })
            if (typeCount > 0) throw new Error("赛事类型已存在")
            const result = await this.MatchType.update({
                name: name,
                pid: pid
            }, { where: { id: id } })
            return result
        }

        /**
        * @description 更新状态
        * @param  {} {id
        * @param  {} status}
        */
        async changeStatus({ id, status }) {
            const exist = await this.MatchType.count({ where: { id: id } })
            if (exist == 0) throw new Error("记录不存在")
            const result = await this.MatchType.update({
                status: status
            }, { where: { id: id } })
            return result
        }

        /**
         * @
         * @param  {} {name
         * @param  {} pid}
         */
        async create({ name, pid }) {
            const typeCount = await this.MatchType.count({ where: { name: name } })
            if (typeCount > 0) throw new Error("赛事类型已存在")
            const result = await this.MatchType.create({
                name: name,
                pid: pid
            })
            return result
        }
    }
    return MatchType;
};