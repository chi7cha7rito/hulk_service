'use strict';

module.exports = app => {
    class MatchReward extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Match = this.app.model.match
            this.Member = this.app.model.member
            this.Attendance = this.app.model.attendance
            this.Sequelize = this.app.sequelize
            this.Helper = this.ctx.helper
        }

        /**
         * @description 获取参赛者
         * @param  {} {matchId
         * @param  {} pageIndex=1
         * @param  {} pageSize=10}
         */
        async findAttendances({ matchId, pageIndex = 1, pageSize = 10 }) {
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            const result = await this.Attendance.findAndCount({
                where: { matchId: matchId },
                offset: (index - 1) * size,
                limit: size
            })
            return this.Helper.ok(result)
        }
        
        /**
         * @param  {} {memberId
         * @param  {} pageIndex=1
         * @param  {} pageSize=10}
         */
        async findRankingByMemberId({ memberId, pageIndex = 1, pageSize = 10 }) {
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            const result = await this.Attendance.findAndCount({
                where: { memberId: memberId },
                offset: (index - 1) * size,
                limit: size
            })
            return this.Helper.ok(result)
        }

        /**
         * @description 报名参加
         * @param  {} {matchId
         * @param  {} ranking
         * @param  {} rewardPoints
         * @param  {} creator}
         */
        async create({ matchId, memberId, creator }) {
            const match = await this.Match.findById(matchId)
            const member = await this.Member.findById(memberId)
            if (match && member) {
                const result = await this.Attendance.create({
                    matchId: matchId,
                    memberId: memberId,
                    creator: creator
                })
                return this.Helper.ok(result)
            }
            return this.Helper.err("赛事或者会员不存在")
        }
    }
    return MatchReward;
};