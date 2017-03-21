'use strict';

module.exports = app => {
  class MemberController extends app.Controller {
    constructor(ctx) {
      super(ctx)
      this.MemberSvr = this.service.member
      this.BalanceSvr = this.service.balance
      this.LoyaltyPointSvr = this.service.loyaltyPoint
    }

    /**
     * @description 新建会员
     */
    async create() {
      const result = await this.MemberSvr.create(this.ctx.request.body)
      this.success(result)
    }

    /**
     * @description 更新会员
     */
    async update() {
      const result = await this.MemberSvr.update(this.ctx.request.body)
      this.success(result)
    }

    /**
     * @description 根据openid查找会员
     */
    async findByWechatOpenId() {
      const result = await this.MemberSvr.findByWechatOpenId(this.ctx.query)
      this.success(result)
    }

    async findTotal() {
      const totalBalance = await this.BalanceSvr.totalByMemberId(this.ctx.query)
      const totalPoints = await this.LoyaltyPointSvr.totalByMemberId(this.ctx.query)
      this.success({ balance: totalBalance, points: totalPoints })
    }


    /**
     * @description 根据Id查找会员
     */
    async findById() {
      const result = await this.MemberSvr.findById(this.ctx.query)
      this.success(result)
    }
  }
  return MemberController;
};
