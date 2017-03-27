'use strict';

module.exports = app => {
    class Balance extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Balance = this.app.model.Balance
            this.LoyaltyPoint = this.app.model.LoyaltyPoint
            this.Member = this.app.model.Member
            this.User = this.app.model.User
            this.Helper = this.ctx.helper
            this.moment = this.app.moment
        }
        /**
         * @description 根据memberId获取余额
         * @param  {int} memberId
         * @return {decimal} 余额
         */
        async totalByMemberId({ memberId }) {
            const total = await this.Balance.sum('amount', {
                where: { memberId: memberId, status: 1 }
            })
            return total || 0
        }

        /**
         * @description 获取余额明细
         * @param  {int} {phoneNo
         * @param  {int} type
         * @param  {int} startCreatedAt
         * @param  {int} endCreatedAt
         * @param  {int} pageIndex=1
         * @param  {int} pageSize=10}
         * @return {object}
         */
        async findEntries({ phoneNo, type, startCreatedAt, endCreatedAt, pageIndex = 1, pageSize = 10 }) {
            let cond = {}
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            let member = await this.User.findOne({ where: { phoneNo: phoneNo } })

            if (member && member.memberId) {
                cond.memberId = member.memberId
            }
            cond.createdAt = {
                $gte: startCreatedAt || this.moment('1971-01-01').format(),
                $lte: endCreatedAt || this.moment('9999-12-31').format(),
            }
            if (type) {
                cond.type = type
            }
            cond.status = 1
            const result = await this.Balance.findAndCount({
                where: cond,
                order: 'createdAt DESC',
                include: [
                    {
                        model: this.Member,
                        include: [{ model: this.User }],
                    }
                ],
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @description 余额买积分
         * @param  {} {memberId
         * @param  {} amount
         * @param  {} remark
         * @param  {} operator}
         */
        async buyPoints({ memberId, amount, operator, remark }) {
            const classSelf = this
            const memberCount = await this.Member.count({
                where: { id: memberId, status: 1 }
            })
            if (memberCount == 0) throw new Error("会员不存在或被冻结")

            const total = await this.totalByMemberId({ memberId })
            if (total < amount) throw new Error("帐户余额不足")

            return classSelf.app.model.transaction(function (t) {
                return classSelf.Balance.create({
                    memberId,
                    type: 2,
                    amount,
                    source: 11,
                    remark,
                    status: 1,
                    creator: operator
                }, { transaction: t }).then(function (result) {
                    return classSelf.LoyaltyPoint.create({
                        memberId,
                        type: 1,
                        points: amount,
                        source: 8,
                        sourceNo: result.id,
                        remark,
                        status: 1,
                        creator: operator
                    }, { transaction: t }).then(function (result) {
                        return result
                    })
                })
            })
        }

        /**
         * @description 创建余额记录
         * @param  {int} {memberId
         * @param  {int} type
         * @param  {decimal} amount
         * @param  {int} source
         * @param  {string} sourceNo
         * @param  {string} remark
         * @param  {int} status=1
         * @param  {int} creator=1}
         */
        async create({ memberId, type, amount, source, sourceNo, remark, status, operator }) {
            const memberCount = await this.Member.count({
                where: { id: memberId, status: 1 }
            })
            if (memberCount == 0) throw new Error("会员不存在或被冻结")
            const total = await this.totalByMemberId({ memberId })
            if (total < amount) throw new Error('帐户余额不足')
            const result = await this.Balance.create({
                memberId: memberId,
                type: type,
                amount: amount,
                source: source,
                sourceNo: sourceNo,
                remark: remark,
                status: 1,
                creator: operator
            })
            return result
        }
    }
    return Balance;
};