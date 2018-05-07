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

        async totalByMemberId() {
            const result = await this.SpritSvr.totalByMemberId(this.ctx.query);
            this.success(result)
        }

        async adjust(){
            const result = await this.SpritSvr.adjust(this.ctx.request.body);
            this.success(result)
        }

        async list(){
            const result = await this.SpritSvr.list(this.ctx.query);
            this.success(result)
        }
    }
    return SpritController;
};
