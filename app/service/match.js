'use strict';

module.exports = app => {
    class Match extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Match = this.app.model.match
            this.Sequelize = this.app.sequelize
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
            //todo:时间处理
            cond.opening = {
                $gte: this.moment.utc(startOpening || '1971-01-01').format(),
                $lte: this.moment.utc(endOpening || '9999-12-31').format()
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
            return this.Helper.ok(result)
        }

       
        /**
         * @description 创建赛事
         * @param  {} {name
         * @param  {} type
         * @param  {} opening
         * @param  {} description
         * @param  {} holder
         * @param  {} status=1
         * @param  {} creator}
         * @return {object}
         */
        async create({ name, type, opening, description, holder, status = 1, creator }) {
            const result = await this.Match.create({
                name: name,
                type: type,
                opening: opening,
                description: description,
                holder: holder,
                status: status,
                creator: creator
            })
            return this.Helper.ok(result)
        }
    }

    return Match;
};