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
         * @description 创建赛事奖励
         * @param  {} {matchId
         * @param  {} ranking
         * @param  {} rewardPoints
         * @param  {} creator}
         */
        async create({ matchId, ranking, rewardPoints, creator }) {
            const matchCount = await this.Match.count({ where: { matchId: matchId } })
            if (matchCount = 0) throw new Error("赛事不存在")
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