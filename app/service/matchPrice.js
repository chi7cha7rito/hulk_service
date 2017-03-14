'use strict';

module.exports = app => {
    class MatcPrice extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Match = this.app.model.match
            this.MatcPrice = this.app.model.matchPrice
            this.Sequelize = this.app.sequelize
            this.Helper = this.ctx.helper
        }

        /**
         * @description 获取比赛价格
         * @param  {} {matchId}
         */
        async findMatchPrice({ matchId }) {
            const result = await this.MatcPrice.findAll({
                where: { matchId: matchId, status: { $ne: 3 } },
            })
            return result
        }

        /**
         * @description 删除价格
         * @param  {} {id
         * @param  {} updator}
         */
        async delete({ id, updator }) {
            const exist = await this.MatcPrice.count({
                where: { id: id }
            })
            if (exist == 0) throw new Error("记录不存在")

            const result = await this.MatcPrice.update({
                status: 3,
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
        async update({ id, type, price, status, updator }) {
            const exist = await this.MatcPrice.count({
                where: { id: id }
            })
            if (exist == 0) throw new Error("记录不存在")

            const typeCount = await this.MatcPrice.count({
                where: { matchId: matchId, type: type, status: { $ne: 3 } }
            })
            if (typeCount == 0) throw new Error("该类型价格已经存在")

            const result = await this.MatcPrice.update({
                type: type,
                price: price,
                status: status,
                updator: updator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 新建比赛价格
         * @param  {} {matchId
         * @param  {} type
         * @param  {} price
         * @param  {} status=1
         * @param  {} creator}
         */
        async create({ matchId, type, price, status, creator }) {
            const matchCount = await this.Match.count({ where: { id: matchId } })
            if (matchCount == 0) throw new Error("赛事不存在")
            const priceCount = await this.MatcPrice.count({
                where: { matchId: matchId, type: type, status: { $ne: 3 } }
            })
            if (priceCount == 0) throw new Error("该类型价格已经存在")
            const result = await this.MatcPrice.create({
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