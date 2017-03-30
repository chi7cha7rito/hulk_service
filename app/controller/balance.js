'use strict';

module.exports = app => {
    class BalanceController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.BalanceSvr = this.service.balance
        }

        /**
         * @description 余额增加
         */
        async increase() {
            const result = await this.BalanceSvr.increase(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 余额扣减
        */
        async decrease() {
            const result = await this.BalanceSvr.decrease(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 余额转积分
        */
        async buyPoints() {
            const result = await this.BalanceSvr.buyPoints(this.ctx.request.body)
            this.success(result)
        }

        async wechatNotify() {
            const result = await this.BalanceSvr.wechatNotify(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 查询余额记录
         */
        async findEntries() {
            const result = await this.BalanceSvr.findEntries(this.ctx.query)
            this.success(result)

        }

        /**
        * @description 根据memberId查询余额
        */
        async totalByMemberId() {
            const result = await this.BalanceSvr.totalByMemberId(this.ctx.query)
            this.success(result)

        }

        /**
        * @description 根据phoneNo查询余额
        */
        async totalByPhoneNo() {
            const result = await this.BalanceSvr.totalByPhoneNo(this.ctx.query)
            this.success(result)

        }
    }
    return BalanceController;
};
