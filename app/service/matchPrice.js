'use strict';

module.exports = app => {
    class MatcPrice extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.MatchConfig = this.app.model.MatchConfig
            this.MatchPrice = this.app.model.MatchPrice
            this.MemberLevel = this.app.model.MemberLevel
            this.Helper = this.ctx.helper
        }

        /**
         * @description 获取比赛配置价格
         * @param  {} {matchConfigId}
         */
        async findAll({ matchConfigId }) {
            const result = await this.MatchPrice.findAll({
                where: { matchConfigId: matchConfigId, status: { $ne: 3 } },
                include: [{ model: this.MemberLevel, as: 'Type', attributes: ['id', 'name'] }]
            })
            return result
        }

        /**
         * @description 根据赛事id和类型查找价格
         * @param  {} {matchConfigId
         * @param  {} type}
         */
        async findActivePrice({ matchConfigId, type }) {
            const result = await this.MatchPrice.findOne({
                where: { matchConfigId, type, status: 1 },
                include: [{ model: this.MemberLevel, as: 'Type', attributes: ['id', 'name'] }]
            })
            return result
        }

        /**
         * @description 根据赛事id和类型查找价格
         * @param  {} {matchConfigId
         * @param  {} type}
         */
        async findActivePriceById({ id }) {
            const result = await this.MatchPrice.findOne({
                where: { id, status: 1 },
                include: [{ model: this.MemberLevel, as: 'Type', attributes: ['id', 'name'] }]
            })
            return result
        }

        /**
         * @description 修改状态
         * @param  {} {id
         * @param  {} status
         * @param  {} operator}
         */
        async changeStatus({ id, status, operator }) {
            const price = await this.MatchPrice.findById(id)
            if (!price) throw new Error("记录不存在")
            if (price.status == 3) throw new Error("该价格已被删除")

            const result = await this.MatchPrice.update({
                status: status,
                updator: operator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 更新比赛价格
         * @param  {} {id
         * @param  {} type
         * @param  {} price
         * @param  {} limitation
         * @param  {} operator}
         */
        async update({ id, type, price, limitation, operator }) {
            const record = await this.MatchPrice.findById(id)
            if (!record) throw new Error("记录不存在")

            if (record.type != type) {
                const typeCount = await this.MatchPrice.count({
                    where: { matchConfigId: record.matchConfigId, type: type, status: { $ne: 3 } }
                })
                if (typeCount > 0) throw new Error("该类型价格已经存在")
            }

            const result = await this.MatchPrice.update({
                type,
                price,
                limitation,
                updator: operator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 新建比赛价格
         * @param  {} {matchConfigId
         * @param  {} type
         * @param  {} price
         * @param  {} limitation
         * @param  {} status
         * @param  {} operator}
         */
        async create({ matchConfigId, type, price, limitation, status, operator }) {
            const configCount = await this.MatchConfig.count({ where: { id: matchConfigId } })
            if (configCount == 0) throw new Error("赛事配置不存在")
            const priceCount = await this.MatchPrice.count({
                where: { matchConfigId: matchConfigId, type: type, status: { $ne: 3 } }
            })
            if (priceCount > 0) throw new Error("该类型价格已经存在")
            const result = await this.MatchPrice.create({
                matchConfigId,
                type,
                price,
                limitation,
                status,
                creator: operator
            })
            return result
        }
    }
    return MatcPrice;
};