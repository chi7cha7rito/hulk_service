'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    constructor(ctx) {
      super(ctx)
      this.UserSvr = this.service.user
    }

    async findAll() {
      const result = await this.UserSvr.findAll(this.ctx.query);
      this.success(result)
    }

    async findByPhoneNo() {
      const result = await this.UserSvr.findByPhoneNo(this.ctx.query);
      this.success(result)
    }

    async findById() {
      const result = await this.UserSvr.findById(this.ctx.query);
      this.success(result)
    }

    async update() {
      const result = await this.UserSvr.update(this.ctx.request.body);
      this.success(result)
    }

    async create() {
      const result = await this.UserSvr.create(this.ctx.request.body);
      this.success(result)
    }
  }
  return UserController;
};
