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
                where: { matchId: matchId },
            })
            return this.Helper.ok(result)
        }

        /**
         * @description 新建比赛价格
         * @param  {} {matchId
         * @param  {} type
         * @param  {} price
         * @param  {} status=1
         * @param  {} creator}
         */
        async create({ matchId, type, price, status = 1, creator }) {
            const match = await this.Match.findById(matchId)
            if (match) {
                const result = await this.MatcPrice.create({
                    matchId: matchId,
                    type: type,
                    price: price,
                    status: status,
                    creator: creator
                })
                return this.Helper.ok(result)
            }
            return this.Helper.err("赛事不存在")
        }
    }
    return MatcPrice;
};