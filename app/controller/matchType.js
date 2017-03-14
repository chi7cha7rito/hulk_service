'use strict';

module.exports = app => {
    class MatchTypeController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.MatchTypeSvr = this.service.matchType
        }

        /**
         * @description 创建赛事类型
         */
        async create() {
            const result = await this.MatchTypeSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查找赛事类型
         */
        async findByPid() {
            const result = await this.MatchTypeSvr.findByPid(this.ctx.query)
            this.success(result)
        }

        /**
         * @description 更改赛事类型状态
         */
        async changeStatus() {
            const result = await this.MatchTypeSvr.changeStatus(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 更新赛事类型
         */
        async update() {
            const result = await this.MatchTypeSvr.update(this.ctx.request.body)
            this.success(result)
        }
    }
    return MatchTypeController;
};
