'use strict';

module.exports = app => {
    class MatchPriceController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.MatchPriceSvr = this.service.matchPrice
        }

        /**
         * @description 创建赛事价格
         */
        async create() {
            const result = await this.MatchPriceSvr.create(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查找赛事价格
         */
        async findAll() {
            const result = await this.MatchPriceSvr.findAll(this.ctx.query)
            this.success(result)
        }

        /**
        * @description 删除赛事价格
        */
        async changeStatus() {
            const result = await this.MatchPriceSvr.changeStatus(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 更新赛事价格
        */
        async update() {
            const result = await this.MatchPriceSvr.update(this.ctx.request.body)
            this.success(result)
        }
    }
    return MatchPriceController;
};
