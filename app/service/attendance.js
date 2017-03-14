'use strict';

module.exports = app => {
    class MatchReward extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Match = this.app.model.match
            this.Member = this.app.model.member
            this.Attendance = this.app.model.attendance
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
            return result
        }

        /**
         * @description 查询成绩
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
            return result
        }

        /**
         * @description 取消报名
         * @param  {} {id}
         */
        async delete({ id }) {
            const attendedExist = await this.Attendance.count({
                where: { id: id }
            })
            if (attendedExist == 0) throw new Error("参赛记录不存在")
            const result = await this.Attendance.update({ status: 2 }, { where: { id: id } })
            return result
        }

        /**
         * @description 报名参加
         * @param  {} {matchId
         * @param  {} ranking
         * @param  {} rewardPoints
         * @param  {} creator}
         */
        async create({ matchId, memberId, creator }) {
            const matchCount = await this.Match.count({
                where: { id: matchId, status: 1 }
            })
            if (matchCount == 0) throw new Error("赛事不存在或已结束")
            const memberCount = await this.Member.count({
                where: { id: memberId }
            })
            if (memberCount == 0) throw new Error("会员不存在")
            const attended = await this.Attendance.count({
                where: { matchId: matchId, memberId: memberId }
            })
            if (attended > 0) throw new Error("您已报名参赛")
            const result = await this.Attendance.create({
                matchId: matchId,
                memberId: memberId,
                creator: creator
            })
            return result
        }
    }
    return MatchReward;
};