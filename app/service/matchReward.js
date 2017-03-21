'use strict';

module.exports = app => {
    class MatchReward extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Match = this.app.model.Match
            this.MatchReward = this.app.model.MatchReward
            this.Helper = this.ctx.helper
        }

        /**
         * @description 获取比赛奖励
         * @param  {} {matchId}
         */
        async findAll({ matchId }) {
            const result = await this.MatchReward.findAll({
                where: { matchId: matchId },
            })
            return result
        }

        /**
         * @description 查询有效奖励
         * @param  {} {matchId}
         */
        async findAllActive({ matchId }) {
            const result = await this.MatchReward.findAll({
                where: { matchId: matchId, status: 1 },
            })
            return result
        }

        /**
        * @description 修改赛事奖励状态
        * @param  {} {id
        * @param  {} status
        * @param  {} updator}
        */
        async changeStatus({ id, status, updator }) {
            const reward = await this.MatchReward.findById(id)
            if (!reward) throw new Error("记录不存在")
            if (reward.status == 3) throw new Error("该奖励已被删除")

            const result = await this.MatchReward.update({
                status: status,
                updator: updator
            }, { where: { id: id } })
            return result
        }

        /**
        * @description 更新赛事奖励
        * @param  {} {id
        * @param  {} ranking
        * @param  {} rewardPoints
        * @param  {} updator}
        */
        async update({ id, ranking, rewardPoints, updator }) {
            const record = await this.MatchReward.findById(id)
            if (!record) throw new Error("记录不存在")

            if (record.ranking != ranking) {
                const typeCount = await this.MatchReward.count({
                    where: { matchId: record.matchId, ranking: ranking, status: { $ne: 3 } }
                })
                if (typeCount > 0) throw new Error("该赛事已存在此等级的奖励")
            }

            const result = await this.MatchReward.update({
                ranking: ranking,
                rewardPoints: rewardPoints,
                updator: updator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 创建赛事奖励
         * @param  {} {matchId
         * @param  {} ranking
         * @param  {} rewardPoints
         * @param  {} creator}
         */
        async create({ matchId, ranking, rewardPoints, status, creator }) {
            const matchCount = await this.Match.count({
                where: { id: matchId, status: 1 }
            })
            if (matchCount == 0) throw new Error("赛事不存在或已经结束")

            const exist = await this.MatchReward.count({
                where: { matchId: matchId, ranking: ranking, status: { $ne: 3 } }
            })
            if (exist > 0) throw new Error("该赛事已存在此等级的奖励")
            const result = await this.MatchReward.create({
                matchId: matchId,
                ranking: ranking,
                rewardPoints: rewardPoints,
                status: status,
                creator: creator
            })
            return result
        }
    }
    return MatchReward;
};