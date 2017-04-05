'use strict';

module.exports = app => {
    class LoyaltyPoint extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.LoyaltyPoint = this.app.model.LoyaltyPoint
            this.Member = this.app.model.Member
            this.User = this.app.model.User
            this.Helper = this.ctx.helper
            this.moment = this.app.moment
            this.SmsSenderSvr = this.service.smsSender
        }

        async totalByMemberId({ memberId }) {
            const total = await this.LoyaltyPoint.sum('points', {
                where: { memberId: memberId, status: 1 }
            })
            return total || 0
        }

        /**
        * @description 根据手机号获取积分
        * @param  {int} phoneNo
        * @return {decimal} 余额
        */
        async totalByPhoneNo({ phoneNo }) {
            const member = await this.Member.findOne({
                where: { status: 1 },
                include: [{ model: this.User, where: { phoneNo } }]
            })
            if (!member) throw new Error("会员不存在或被冻结")

            const total = await this.LoyaltyPoint.sum('points', {
                where: { memberId: member.id, status: 1 }
            })
            return total || 0
        }

        /**
         * @description 获取积分明细
         * @param  {int} {memberId
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
            let user = await this.User.findOne({ where: { phoneNo: phoneNo }, include: [this.Member] })

            if (user && user.member.id) {
                cond.memberId = user.member.id
            }
            cond.createdAt = {
                $gte: startCreatedAt || this.moment('1971-01-01').format(),
                $lte: endCreatedAt || this.moment('9999-12-31').format(),
            }
            if (type) {
                cond.type = type
            }
            cond.status = 1
            const result = await this.LoyaltyPoint.findAndCount({
                order: 'createdAt DESC',
                where: cond,
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
         * @description 积分扣减
         * @param  {} {phoneNo
         * @param  {} type
         * @param  {} points
         * @param  {} source
         * @param  {} sourceNo
         * @param  {} remark
         * @param  {} operator}
         */
        async decrease({ phoneNo, type, points, source, sourceNo, remark, operator }) {
            const member = await this.Member.findOne({
                where: { status: 1 },
                include: [{ model: this.User, where: { phoneNo } }]
            })
            if (!member) throw new Error("会员不存在或被冻结")
            const total = await this.totalByMemberId({ memberId: member.id })
            points = parseFloat(points)
            if (total < points) throw new Error('可用积分不足')
            const result = await this.create({ memberId: member.id, type, points, source, sourceNo, remark, status: 1, operator })
            //非手工调整需要短信通知
            if (result && source.toString() !== '5') {
                this.SmsSenderSvr.loyaltyPointMinus({
                    phoneNo: member.user.phoneNo,
                    name: member.user.name,
                    points: points,
                    avlPts: total - points
                })
            }
            return result
        }

        /**
         * @description 积分增加
         * @param  {} {phoneNo
         * @param  {} type
         * @param  {} points
         * @param  {} source
         * @param  {} sourceNo
         * @param  {} remark
         * @param  {} operator}
         */
        async increase({ phoneNo, type, points, source, sourceNo, remark, operator }) {
            const member = await this.Member.findOne({
                where: { status: 1 },
                include: [{ model: this.User, where: { phoneNo } }]
            })
            if (!member) throw new Error("会员不存在或被冻结")
            const total = await this.totalByMemberId({ memberId: member.id })
            points = parseFloat(points)
            const result = await this.create({ memberId: member.id, type, points, source, sourceNo, remark, status: 1, operator })
            return result
        }

        /**
         * @description 创建积分记录
         * @param  {int} {memberId
         * @param  {int} type
         * @param  {decimal} points
         * @param  {int} source
         * @param  {string} sourceNo
         * @param  {string} remark
         * @param  {int} status=1
         * @param  {int} operator}
         */
        async create({ memberId, type, points, source, sourceNo, remark, status = 1, operator }) {
            const result = await this.LoyaltyPoint.create({
                memberId: memberId,
                type: type,
                points: points,
                source: source,
                sourceNo: sourceNo,
                remark: remark,
                status: status,
                creator: operator
            })
            return result
        }
    }

    return LoyaltyPoint;
};