'use strict';

module.exports = app => {
  class MemberController extends app.Controller {
    constructor(ctx) {
      super(ctx)
      this.MemberSvr = this.service.member
    }
    async create() {
      this.ctx.body = await this.MemberSvr.create(this.ctx.request.body);
    }
    async findByWechatOpenId() {
      this.ctx.body = await this.MemberSvr.findByWechatOpenId(this.ctx.query.wechatOpenId)
    }
    async findByPhoneNo(phoneNo) {
      this.ctx.body = await this.MemberSvr.findByPhoneNo(phoneNo)
    }
    async findByIdCardNo(idCardNo) {
      this.ctx.body = await this.MemberSvr.findByIdCardNo(idCardNo)
    }
    async findByCardNo(cardNo) {
      this.ctx.body = await this.MemberSvr.findByCardNo(cardNo)
    }
    async findById(id) {
      this.ctx.body = await this.MemberSvr.findById(id)
    }
  }
  return MemberController;
};
