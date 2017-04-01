'use strict';

module.exports = app => {
    class Coupon extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Coupon = this.app.model.Coupon
            this.Member = this.app.model.Member
            this.User = this.app.model.User
            this.Helper = this.ctx.helper
            this.moment = this.app.moment
        }

        /**
         * @description 获取优惠券明细
         * @param  {int} {phoneNo
         * @param  {int} type
         * @param  {int} source
         * @param  {int} status
         * @param  {int} pageIndex=1
         * @param  {int} pageSize=10}
         * @return {object}
         */
        async findAll({ phoneNo, type, source, status, pageIndex = 1, pageSize = 10 }) {
            let cond = {}
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            let member = await this.User.findOne({ where: { phoneNo: phoneNo } })

            if (member && member.memberId) {
                cond.memberId = member.memberId
            }
            if (type) {
                cond.type = type
            }
            if (source) {
                cond.source = source
            }
            if (status) {
                cond.status = status
            }
            const result = await this.Coupon.findAndCount({
                where: cond,
                order: 'createdAt DESC',
                include: [
                    {
                        model: this.Member,
                        include: [{ model: this.User, attributes: ['id', 'name', 'phoneNo'] }],
                        attributes: ['id', 'cardNo']
                    }
                ],
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @description 更改优惠券状态
         * @param  {int} {id
         * @param  {int} status
         * @param  {int} operator}
         */
        async update({ id, memberId, status, remark, operator }) {
            const coupon = await this.Coupon.findOne({
                where: { id }
            })
            if (!coupon) throw new Error("优惠券不存在")
            if (coupon.status == 2) throw new Error("优惠券已使用")
            if (coupon.status == 3) throw new Error("优惠券已作废")
            const result = await this.Coupon.update({
                status,
                remark,
                updator: operator
            }, { where: { id } })
            return result
        }

        /**
         * @description 创建优惠券
         * @param  {int} {phoneNo
         * @param  {int} type
         * @param  {int} subType
         * @param  {int} source
         * @param  {string} remark
         * @param  {int} operator}
         */
        async create({ phoneNo, type, subType, source, remark, operator }) {
            const member = await this.Member.findOne({
                where: { status: 1 },
                include: [{ model: this.User, where: { phoneNo, status: 1 } }]
            })
            if (!member) throw new Error("会员不存在或被冻结")
            const result = await this.Coupon.create({
                memberId: member.id,
                type,
                subType,
                source,
                remark,
                status: 1,
                creator: operator
            })
            return result
        }
    }
    return Coupon;
};