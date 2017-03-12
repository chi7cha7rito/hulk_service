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
            return this.Helper.ok(result)
        }

        /**
         * @description 创建赛事奖励
         * @param  {} {matchId
         * @param  {} ranking
         * @param  {} rewardPoints
         * @param  {} creator}
         */
        async create({ matchId, ranking, rewardPoints, creator }) {
            const match = await this.Match.findById(matchId)
            if (match) {
                const result = await this.MatchReward.create({
                    matchId: matchId,
                    ranking: ranking,
                    rewardPoints: rewardPoints,
                    creator: creator
                })
                return this.Helper.ok(result)
            }
            return this.Helper.err("赛事不存在")
        }
    }
    return MatchReward;
};