'use strict';

module.exports = app => {
  class UserController extends app.Controller {
    async index() {
      this.ctx.body = 'hi, egg';
    }
    async create() {
      this.ctx.body = await this.ctx.service.user.create();
    }
    async findByPhoneNo() {
      this.ctx.body = await this.ctx.service.user.findByPhoneNo('18918229973');
    }
    async findUsers() {
      //  this.ctx.body = await this.ctx.model.user.findAll()
      // this.ctx.body = await this.ctx.service.user.findUsers({ phoneNo: 1 });
      this.ctx.body = await this.ctx.service.user.findUsers();
    }
  }
  return UserController;
};
