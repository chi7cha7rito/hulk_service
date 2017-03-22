'use strict';

module.exports = app => {
    class MatchController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.MatchSvr = this.service.match
        }

        /**
         * @description 创建赛事
         */
        async create() {
            const result = await this.MatchSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 更新赛事
         */
        async update() {
            const result = await this.MatchSvr.update(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 变更赛事状态
        */
        async changeStatus() {
            const result = await this.MatchSvr.changeStatus(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查找赛事
         */
        async findMatches() {
            const result = await this.MatchSvr.findMatches(this.ctx.query)
            this.success(result)
        }


    }
    return MatchController;
};
