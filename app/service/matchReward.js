'use strict';

module.exports = app => {
    class MatchReward extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.MatchConfig = this.app.model.MatchConfig
            this.MatchReward = this.app.model.MatchReward
            this.Helper = this.ctx.helper
        }

        /**
         * @description 获取比赛奖励
         * @param  {} {matchConfigId}
         */
        async findAll({ matchConfigId }) {
            const result = await this.MatchReward.findAll({
                where: { matchConfigId: matchConfigId },
            })
            return result
        }

        /**
         * @description 查询有效奖励
         * @param  {} {matchConfigId}
         */
        async findAllActive({ matchConfigId }) {
            const result = await this.MatchReward.findAll({
                where: { matchConfigId: matchConfigId, status: 1 },
            })
            return result
        }

        /**
        * @description 修改赛事奖励状态
        * @param  {} {id
        * @param  {} status
        * @param  {} updator}
        */
        async changeStatus({ id, status, operator }) {
            const reward = await this.MatchReward.findById(id)
            if (!reward) throw new Error("记录不存在")
            if (reward.status == 3) throw new Error("该奖励已被删除")

            const result = await this.MatchReward.update({
                status: status,
                updator: operator
            }, { where: { id: id } })
            return result
        }

        /**
        * @description 更新赛事奖励
        * @param  {} {id
        * @param  {} ranking
        * @param  {} rewardPoints
        * @param  {} remark
        * @param  {} operator}
        */
        async update({ id, ranking, rewardPoints, remark, operator }) {
            const record = await this.MatchReward.findById(id)
            if (!record) throw new Error("记录不存在")

            if (record.ranking != ranking) {
                const typeCount = await this.MatchReward.count({
                    where: { matchConfigId: record.matchConfigId, ranking: ranking, status: { $ne: 3 } }
                })
                if (typeCount > 0) throw new Error("该赛事配置已存在此等级的奖励")
            }

            const result = await this.MatchReward.update({
                ranking,
                rewardPoints,
                remark,
                updator: operator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 创建赛事奖励
         * @param  {} {matchConfigId
         * @param  {} ranking
         * @param  {} rewardPoints
         * @param  {} remark
         * @param  {} operator}
         */
        async create({ matchConfigId, ranking, rewardPoints, remark, status = 1, operator }) {
            const configCount = await this.MatchConfig.count({
                where: { id: matchConfigId, status: 1 }
            })
            if (configCount == 0) throw new Error("赛事配置不存在或已禁用")

            const exist = await this.MatchReward.count({
                where: { matchConfigId, ranking, status: { $ne: 3 } }
            })
            if (exist > 0) throw new Error("该赛事已存在此等级的奖励")
            const result = await this.MatchReward.create({
                matchConfigId,
                ranking,
                rewardPoints,
                remark,
                status,
                creator: operator
            })
            return result
        }
    }
    return MatchReward;
};