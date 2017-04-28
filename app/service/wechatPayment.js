'use strict';

module.exports = app => {
    class WechatPayment extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Balance = this.app.model.Balance
            this.Member = this.app.model.Member
            this.User = this.app.model.User
            this.WechatPayment = this.app.model.WechatPayment
            this.RechargeSetup = this.app.model.RechargeSetup
            this.MemberLevel = this.app.model.MemberLevel
            this.LoyaltyPoint = this.app.model.LoyaltyPoint
            this.BalanceSvr = this.service.balance
            this.LoyaltyPointSvr = this.service.loyaltyPoint
            this.SmsSenderSvr = this.service.smsSender
            this.Helper = this.ctx.helper
        }


        /**
         * @description 获取余额明细
         * @param  {int} {memberId
         * @param  {string} out_trade_no}
         * @return {object}
         */
        async findEntry({ memberId, out_trade_no }) {
            const result = await this.WechatPayment.findOne({
                where: { memberId: memberId, out_trade_no: out_trade_no }
            })
            return result
        }

        /**
         * @description 创建微信支付记录
         * @param  {} {memberId
         * @param  {} appid
         * @param  {} body
         * @param  {} mch_id
         * @param  {} nonce_str
         * @param  {} notify_url
         * @param  {} openid
         * @param  {} attach
         * @param  {} out_trade_no
         * @param  {} spbill_create_ip
         * @param  {} total_fee
         * @param  {} trade_type
         * @param  {} operator=1}
         */
        async create({ memberId, appid, body, mch_id, nonce_str, notify_url, openid, attach, out_trade_no, spbill_create_ip, total_fee, trade_type, operator }) {
            const memberCount = await this.Member.count({
                where: { id: memberId, status: 1 }
            })
            if (memberCount == 0) throw new Error("会员不存在或被冻结")
            const result = await this.WechatPayment.create({
                memberId: memberId,
                appid: appid,
                body: body,
                mch_id: mch_id,
                nonce_str: nonce_str,
                notify_url: notify_url,
                openid: openid,
                attach: attach,
                out_trade_no: out_trade_no,
                spbill_create_ip: spbill_create_ip,
                total_fee: total_fee,
                trade_type: trade_type,
                status: 1,
                creator: operator
            })
            return result
        }

        /**
         * @description 微信回调成功更新
         * @param  {} {out_trade_no
         * @param  {} transaction_id
         * @param  {} time_end
         * @param  {} status}
         */
        async notify({ out_trade_no, transaction_id, time_end, status }) {
            const classSelf = this;
            const entry = await this.WechatPayment.findOne({
                where: { out_trade_no: out_trade_no }
            })
            if (!entry) throw new Error("找不到该条微信充值记录")
            const member = await this.Member.findOne({ where: { id: entry.memberId }, include: [this.User, this.MemberLevel] })
            const amount = entry.total_fee ? (entry.total_fee / 100) : 0
            //微信充值回调transaction
            return classSelf.app.model.transaction(function (t) {
                return classSelf.WechatPayment.update({
                    transaction_id: transaction_id,
                    time_end: time_end,
                    status: status,
                }, { where: { out_trade_no: out_trade_no }, transaction: t, lock: t.LOCK }).then(function (payment) {
                    return classSelf.Balance.create({
                        memberId: entry.memberId,
                        type: 1,  //充值
                        amount: amount,
                        source: 1,  //微信充值
                        sourceNo: entry.id,
                        remark: "微信公众号充值",
                        status: 1,
                        creator: member.user.id
                    }, { transaction: t }).then(async (balance) => {
                        let memberLevel = await classSelf.MemberLevel.findOne({ order: 'threshold DESC', where: { threshold: { $lte: amount }, status: 1 } })
                        if (member.memberLevel.threshold < memberLevel.threshold) {
                            return classSelf.Member.update({
                                memberLevelId: memberLevel.id,
                            }, { where: { id: entry.memberId }, transaction: t }).then(async (result) => {
                                let max = await classSelf.RechargeSetup.max('reward', { where: { threshold: { $lte: amount }, status: 1 } })
                                let totalBalance = await classSelf.BalanceSvr.totalByMemberId({ memberId: member.id })
                                classSelf.SmsSenderSvr.balancePlus({
                                    phoneNo: member.user.phoneNo,
                                    name: member.user.name,
                                    amount: amount,
                                    avlAmt: totalBalance + amount
                                })
                                if (max) {
                                    return classSelf.LoyaltyPoint.create({
                                        memberId: entry.memberId,
                                        type: 1,    //获取
                                        points: max,
                                        source: 1,  //充值返现
                                        sourceNo: balance.id,
                                        status: 1,  //状态正常
                                        remark: "充值积分返现",
                                        creator: member.user.id
                                    }, { transaction: t }).then(async (points) => {
                                        let totalPoints = await classSelf.LoyaltyPointSvr.totalByMemberId({ memberId: member.id })
                                        classSelf.SmsSenderSvr.loyaltyPointPlus({
                                            phoneNo: member.user.phoneNo,
                                            name: member.user.name,
                                            points: max,
                                            avlPts: totalPoints + max
                                        })
                                        return points
                                    })
                                } else {
                                    return balance
                                }
                            })
                        } else {
                            let max = await classSelf.RechargeSetup.max('reward', { where: { threshold: { $lte: amount }, status: 1 } })
                            let totalBalance = await classSelf.BalanceSvr.totalByMemberId({ memberId: member.id })
                            classSelf.SmsSenderSvr.balancePlus({
                                phoneNo: member.user.phoneNo,
                                name: member.user.name,
                                amount: amount,
                                avlAmt: totalBalance + amount
                            })
                            if (max) {
                                return classSelf.LoyaltyPoint.create({
                                    memberId: entry.memberId,
                                    type: 1,    //获取
                                    points: max,
                                    source: 1,  //充值返现
                                    sourceNo: balance.id,
                                    status: 1,  //状态正常
                                    remark: "充值积分返现",
                                    creator: member.user.id
                                }, { transaction: t }).then(async (points) => {
                                    let totalPoints = await classSelf.LoyaltyPointSvr.totalByMemberId({ memberId: member.id })
                                    classSelf.SmsSenderSvr.loyaltyPointPlus({
                                        phoneNo: member.user.phoneNo,
                                        name: member.user.name,
                                        points: max,
                                        avlPts: totalPoints + max
                                    })
                                    return points
                                })
                            } else {
                                return balance
                            }
                        }
                    })
                })
            })
        }
    }
    return WechatPayment;
};