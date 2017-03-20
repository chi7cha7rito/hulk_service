'use strict';

module.exports = app => {
    class BalanceController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.BalanceSvr = this.service.balance
        }

        /**
         * @description 创建充值记录
         */
        async create() {
            const result = await this.BalanceSvr.create(this.ctx.request.body)
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
    }
    return BalanceController;
};
