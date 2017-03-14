'use strict';

module.exports = app => {
    class MatchReward extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Match = this.app.model.match
            this.MatchReward = this.app.model.matchReward
            this.Sequelize = this.app.sequelize
            this.Helper = this.ctx.helper
        }

        /**
         * @description 获取比赛奖励
         * @param  {} {matchId}
         */
        async findMatchRewards({ matchId }) {
            const result = await this.MatchReward.findAll({
                where: { matchId: matchId },
            })
            return result
        }

        /**
        * @description 删除奖励
        * @param  {} {id
        * @param  {} updator}
        */
        async delete({ id, updator }) {
            const exist = await this.MatchReward.count({
                where: { id: id }
            })
            if (exist == 0) throw new Error("记录不存在")

            const result = await this.MatchReward.update({
                status: 3,
                updator: updator
            }, { where: { id: id } })
            return result
        }

        /**
        * @description 更新赛事奖励
        * @param  {} {id
        * @param  {} rewardPoints
        * @param  {} rewardPoints
        * @param  {} updator}
        */
        async update({ id, ranking, rewardPoints, updator }) {
            const exist = await this.MatchReward.count({
                where: { matchId: matchId, ranking: ranking, status: { $ne: 3 } }
            })
            if (exist > 0) throw new Error("该赛事已存在此等级的奖励")

            const result = await this.MatchReward.update({
                ranking: ranking,
                rewardPoints: rewardPoints,
                updator: updator
            })
            return result
        }

        /**
         * @description 创建赛事奖励
         * @param  {} {matchId
         * @param  {} ranking
         * @param  {} rewardPoints
         * @param  {} creator}
         */
        async create({ matchId, ranking, rewardPoints, creator }) {
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
                creator: creator
            })
            return result
        }
    }
    return MatchReward;
};