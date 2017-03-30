'use strict';

module.exports = app => {
    class RechargeSetupController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.RechargeSetupSvr = this.service.rechargeSetup
        }
        async create() {
            const result = await this.RechargeSetupSvr.create(this.ctx.request.body)
            this.success(result)
        }

        async findAll() {
            const result = await this.RechargeSetupSvr.findAll(this.ctx.query)
            this.success(result)
        }

        async findById() {
            const result = await this.RechargeSetupSvr.findById(this.ctx.query)
            this.success(result)
        }

        async findMax() {
            const result = await this.RechargeSetupSvr.findMax(this.ctx.query)
            this.success(result)
        }

        async update() {
            const result = await this.RechargeSetupSvr.update(this.ctx.request.body)
            this.success(result)
        }
    }
    return RechargeSetupController;
};
