'use strict';

module.exports = app => {
    class MatchRewardController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.MatchRewardSvr = this.service.matchReward
        }

        /**
         * @description 创建赛事奖励
         */
        async create() {
            const result = await this.MatchRewardSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查找赛事奖励
         */
        async findAll() {
            const result = await this.MatchRewardSvr.findAll(this.ctx.query)
            this.success(result)
        }

        async findAllActive() {
            const result = await this.MatchRewardSvr.findAllActive(this.ctx.query)
            this.success(result)
        }

        /**
         * @description 修改赛事奖励状态
         */
        async changeStatus() {
            const result = await this.MatchRewardSvr.changeStatus(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 更新赛事奖励
         */
        async update() {
            const result = await this.MatchRewardSvr.update(this.ctx.request.body)
            this.success(result)
        }
    }
    return MatchRewardController;
};
