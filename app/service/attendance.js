'use strict';

module.exports = app => {
    class MatchReward extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Match = this.app.model.Match
            this.Member = this.app.model.Member
            this.Attendance = this.app.model.Attendance
            this.Balance = this.app.model.Balance
            this.BalanceSvr = this.service.balance
            this.MatchPriceSvr = this.service.matchPrice
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
                where: { matchId: matchId, status: 1 },
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
                where: { memberId: memberId, status: 1 },
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @description 取消报名
         * @param  {} {id}
         */
        async del({ id }) {
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
         * @param  {} memberId
         * @param  {} creator}
         */
        async createOnline({ matchId, memberId, creator }) {
            let classSelf = this
            //检查赛事
            const match = await this.Match.findOne({
                where: { id: matchId, status: 1 }
            })
            if (!match) throw new Error("赛事不存在或已结束")

            //查找线上价格
            const price = await this.MatchPriceSvr.findActivePrice({ matchId, type: 1 })

            //检查会员
            const member = await this.Member.findOne({
                where: { id: memberId },
                include: [{ all: true }]
            })
            if (!member) throw new Error("会员不存在")

            //查询余额
            const balance = await this.BalanceSvr.totalByMemberId({ memberId })
            if (balance < price.price) throw new Error("帐户余额不足")

            //检查是否报名
            const attended = await this.Attendance.count({
                where: { matchId: matchId, memberId: memberId }
            })
            if (attended > 0) throw new Error("您已报名参赛")

            //报名事务
            return classSelf.app.model.transaction(function (t) {
                return classSelf.Attendance.create({
                    matchId: matchId,
                    memberId: memberId,
                    status: 1,
                    creator: member.user.id
                }, { transaction: t }).then(function (attendance) {
                    return classSelf.Balance.create({
                        memberId: memberId,
                        type: 2,  //消费
                        amount: price.price,
                        source: 7,  //赛事门票
                        sourceNo: attendance.id,
                        remark: "线上赛事报名门票费用",
                        status: 1,
                        creator: member.user.id
                    }, { transaction: t }).then(function (result) {
                        return result
                    })
                });
            });
        }
    }
    return MatchReward;
};