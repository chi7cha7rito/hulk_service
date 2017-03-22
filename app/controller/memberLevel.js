'use strict';

module.exports = app => {
    class MemberLevelController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.MemberLevelSvr = this.service.memberLevel
        }
        async create() {
            const result = await this.MemberLevelSvr.create(this.ctx.request.body)
            this.success(result)
        }

        async findAll() {
            const result = await this.MemberLevelSvr.findAll(this.ctx.query)
            this.success(result)
        }

        async update() {
            const result = await this.MemberLevelSvr.update(this.ctx.request.body)
            this.success(result)
        }
    }
    return MemberLevelController;
};
