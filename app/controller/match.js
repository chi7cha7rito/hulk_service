'use strict';

module.exports = app => {
    class MatchController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.MatchSvr = this.service.match
            this.MatchPriceSvr = this.service.matchPrice
            this.MatchRewardSvr = this.service.matchReward
            this.AttendanceSvr = this.service.attendance
        }
        /**
         * 赛事
         */
        async create() {
            const result = await this.MatchSvr.create(this.ctx.request.body)
            this.success(result)
        }
        async findMatches() {
            const result = await this.MatchSvr.findMatches(this.ctx.query)
            this.success(result)
        }
        /**
         * 赛事价格
         */
        async createPrice() {
            const result = await this.MatchPriceSvr.create(this.ctx.request.body)
            this.success(result)
        }
        async findMatchPrice() {
            const result = await this.MatchPriceSvr.findMatchPrice(this.ctx.query)
            this.success(result)
        }
        /**
         * 赛事奖励
         */
        async createReward() {
            const result = await this.MatchRewardSvr.create(this.ctx.request.body)
            this.success(result)
        }
        async findMatchRewards() {
            const result = await this.MatchRewardSvr.findMatchRewards(this.ctx.query)
            this.success(result)
        }
        /**
        * 赛事奖励
        */
        async attend() {
            const result = await this.AttendanceSvr.create(this.ctx.request.body)
            this.success(result)
        }
        async findAttendances() {
            const result = await this.AttendanceSvr.findAttendances(this.ctx.query)
            this.success(result)
        }
        /**
         * 战绩
         */
        async findRankingByMemberId() {
            const result = await this.AttendanceSvr.findRankingByMemberId(this.ctx.query)
            this.success(result)
        }
    }
    return MatchController;
};
