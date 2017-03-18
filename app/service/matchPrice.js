'use strict';

module.exports = app => {
    class MatcPrice extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Match = this.app.model.Match
            this.MatchPrice = this.app.model.MatchPrice
            this.Helper = this.ctx.helper
        }

        /**
         * @description 获取比赛价格
         * @param  {} {matchId}
         */
        async findAll({ matchId }) {
            const result = await this.MatchPrice.findAll({
                where: { matchId: matchId, status: { $ne: 3 } },
            })
            return result
        }

        /**
         * @description 修改状态
         * @param  {} {id
         * @param  {} status
         * @param  {} updator}
         */
        async changeStatus({ id, status, updator }) {
            const price = await this.MatchPrice.findById(id)
            if (!price) throw new Error("记录不存在")
            if (price.status == 3) throw new Error("该价格已被删除")

            const result = await this.MatchPrice.update({
                status: status,
                updator: updator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 更新比赛价格
         * @param  {} {id
         * @param  {} type
         * @param  {} price
         * @param  {} updator}
         */
        async update({ id, type, price, updator }) {
            const record = await this.MatchPrice.findById(id)
            if (!record) throw new Error("记录不存在")

            if (record.type != type) {
                const typeCount = await this.MatchPrice.count({
                    where: { matchId: record.matchId, type: type, status: { $ne: 3 } }
                })
                if (typeCount > 0) throw new Error("该类型价格已经存在")
            }

            const result = await this.MatchPrice.update({
                type: type,
                price: price,
                updator: updator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 新建比赛价格
         * @param  {} {matchId
         * @param  {} type
         * @param  {} price
         * @param  {} status
         * @param  {} creator}
         */
        async create({ matchId, type, price, status, creator }) {
            const matchCount = await this.Match.count({ where: { id: matchId } })
            if (matchCount == 0) throw new Error("赛事不存在")
            const priceCount = await this.MatchPrice.count({
                where: { matchId: matchId, type: type, status: { $ne: 3 } }
            })
            if (priceCount > 0) throw new Error("该类型价格已经存在")
            const result = await this.MatchPrice.create({
                matchId: matchId,
                type: type,
                price: price,
                status: status,
                creator: creator
            })
            return result
        }
    }
    return MatcPrice;
};