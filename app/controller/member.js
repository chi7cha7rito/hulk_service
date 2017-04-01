'use strict';

module.exports = app => {
  class MemberController extends app.Controller {
    constructor(ctx) {
      super(ctx)
      this.MemberSvr = this.service.member
      this.BalanceSvr = this.service.balance
      this.CouponSvr = this.service.coupon
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

    async findMembers() {
      const result = await this.MemberSvr.findMembers(this.ctx.query)
      this.success(result)
    }

    async findAllMembers() {
      const result = await this.MemberSvr.findAllMembers(this.ctx.query)
      this.success(result)
    }

    async findMembersBalance() {
      const result = await this.MemberSvr.findMembersBalance(this.ctx.query)
      this.success(result)
    }

    async findMembersPoints() {
      const result = await this.MemberSvr.findMembersPoints(this.ctx.query)
      this.success(result)
    }

    async findAccountInfo() {
      const balance = await this.BalanceSvr.totalByPhoneNo(this.ctx.query)
      const points = await this.LoyaltyPointSvr.totalByPhoneNo(this.ctx.query)
      const coupon = await this.CouponSvr.findFreeTicketsByPhoneNo(this.ctx.query)
      const user = await this.MemberSvr.findByPhoneNo(this.ctx.query)
      this.success({
        balance, points, coupon, name: user.name,
        memberLevel: {
          id: user.member.memberLevel.id,
          name: user.member.memberLevel.name
        }
      })
    }
  }
  return MemberController;
};
