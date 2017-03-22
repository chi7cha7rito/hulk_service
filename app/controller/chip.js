'use strict';

module.exports = app => {
    class ChipController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.ChipSvr = this.service.chip
        }
        async create() {
            const result = await this.ChipSvr.create(this.ctx.request.body);
            this.success(result)
        }
    }
    return ChipController;
};
