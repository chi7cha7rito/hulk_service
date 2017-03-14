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
         * @description 创建赛事
         */
        async create() {
            const result = await this.MatchSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查找赛事
         */
        async findMatches() {
            const result = await this.MatchSvr.findMatches(this.ctx.query)
            this.success(result)
        }

        /**
         * @description 创建赛事价格
         */
        async createPrice() {
            const result = await this.MatchPriceSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查找赛事价格
         */
        async findMatchPrice() {
            const result = await this.MatchPriceSvr.findMatchPrice(this.ctx.query)
            this.success(result)
        }

        /**
         * @description 创建赛事奖励
         */
        async createReward() {
            const result = await this.MatchRewardSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查找赛事奖励
         */
        async findMatchRewards() {
            const result = await this.MatchRewardSvr.findMatchRewards(this.ctx.query)
            this.success(result)
        }

        /**
         * @description 报名参赛
         */
        async attend() {
            const result = await this.AttendanceSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 取消参赛
         */
        async cancelAttend() {
            const result = await this.AttendanceSvr.delete(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查找参赛者
         */
        async findAttendances() {
            const result = await this.AttendanceSvr.findAttendances(this.ctx.query)
            this.success(result)
        }

        /**
         * @description 查询成绩
         */
        async findRankingByMemberId() {
            const result = await this.AttendanceSvr.findRankingByMemberId(this.ctx.query)
            this.success(result)
        }
    }
    return MatchController;
};
