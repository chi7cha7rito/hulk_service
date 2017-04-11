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

        async matchChipStats() {
            const result = await this.ChipSvr.matchChipStats(this.ctx.query);
            this.success(result)
        }

        async findAll() {
            const result = await this.ChipSvr.findAll(this.ctx.query);
            this.success(result)
        }
        
    }
    return ChipController;
};
