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

        /**
        * @description 获取所有赛事配置
        */
        async findAll() {
            const result = await this.MatchConfigSvr.findAll()
            this.success(result)
        }

        /**
        * @description 获取指定ID的赛事配置
        */
        async findMatchConfigById() {
            const result = await this.MatchConfigSvr.findMatchConfigById(this.ctx.query)
            this.success(result)
        }

        /**
        * @description 添加赛事配置
        */
        async edit() {
            const result = await this.MatchConfigSvr.edit(this.ctx.request.body)
            this.success(result)
        }

    }
    return MatchConfigController;
};
