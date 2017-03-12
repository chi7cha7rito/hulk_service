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
            this.ctx.body = await this.MatchSvr.create(this.ctx.request.body);
        }
        async findMatches() {
            this.ctx.body = await this.MatchSvr.findMatches(this.ctx.query)
        }
        /**
         * 赛事价格
         */
        async createPrice() {
            this.ctx.body = await this.MatchPriceSvr.create(this.ctx.request.body);
        }
        async findMatchPrice() {
            this.ctx.body = await this.MatchPriceSvr.findMatchPrice(this.ctx.query)
        }
        /**
         * 赛事奖励
         */
        async createReward() {
            this.ctx.body = await this.MatchRewardSvr.create(this.ctx.request.body);
        }
        async findMatchRewards() {
            this.ctx.body = await this.MatchRewardSvr.findMatchRewards(this.ctx.query)
        }
        /**
        * 赛事奖励
        */
        async attend() {
            this.ctx.body = await this.AttendanceSvr.create(this.ctx.request.body);
        }
        async findAttendances() {
            this.ctx.body = await this.AttendanceSvr.findAttendances(this.ctx.query)
        }
        /**
         * 战绩
         */
        async findRankingByMemberId() {
            this.ctx.body = await this.AttendanceSvr.findRankingByMemberId(this.ctx.query)
        }
    }
    return MatchController;
};
