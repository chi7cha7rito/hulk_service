'use strict';

module.exports = app => {
    class SpritController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.SpritSvr = this.service.sprit
        }
        async spritRanking() {
            const result = await this.SpritSvr.spritRanking(this.ctx.query);
            this.success(result)
        }
    }
    return SpritController;
};
