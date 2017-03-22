'use strict';

module.exports = app => {
    class MatchConfigController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.MatchConfigSvr = this.service.matchConfig
        }

        /**
         * @description 创建赛事配置
         */
        async create() {
            const result = await this.MatchConfigSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 更新赛事配置
         */
        async update() {
            const result = await this.MatchConfigSvr.update(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 禁用赛事配置
        */
        async changeStatus() {
            const result = await this.MatchConfigSvr.changeStatus(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查找赛事配置
         */
        async findMatchConfigs() {
            const result = await this.MatchConfigSvr.findMatchConfigs(this.ctx.query)
            this.success(result)
        }


    }
    return MatchConfigController;
};
