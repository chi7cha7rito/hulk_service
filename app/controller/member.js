'use strict';

module.exports = app => {
  class MemberController extends app.Controller {
    constructor(ctx) {
      super(ctx)
      this.MemberSvr = this.service.member
    }
    async create() {
      const result = await this.MemberSvr.create(this.ctx.request.body)
      this.success(result)
    }
    async findByWechatOpenId() {
      const result = await this.MemberSvr.findByWechatOpenId(this.ctx.query.wechatOpenId)
      this.success(result)
    }
    async findByPhoneNo(phoneNo) {
      const result = await this.MemberSvr.findByPhoneNo(phoneNo)
      this.success(result)
    }
    async findByIdCardNo(idCardNo) {
      const result = await this.MemberSvr.findByIdCardNo(idCardNo)
      this.success(result)
    }
    async findByCardNo(cardNo) {
      const result = await this.MemberSvr.findByCardNo(cardNo)
      this.success(result)
    }
    async findById(id) {
      const result = await this.MemberSvr.findById(id)
      this.success(result)
    }
  }
  return MemberController;
};
