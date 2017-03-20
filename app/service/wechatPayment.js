'use strict';

module.exports = app => {
    class WechatPayment extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Balance = this.app.model.Balance
            this.Member = this.app.model.Member
            this.WechatPayment = this.app.model.WechatPayment
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
         * @param  {} out_trade_no
         * @param  {} spbill_create_ip
         * @param  {} total_fee
         * @param  {} trade_type
         * @param  {} creator=1}
         */
        async create({ memberId, appid, body, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type, creator = 1 }) {
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
                out_trade_no: out_trade_no,
                spbill_create_ip: spbill_create_ip,
                total_fee: total_fee,
                trade_type: trade_type,
                status: 1,
                creator: creator
            })
            return result
        }

        /**
         * @description 微信回调成功更新
         * @param  {} {out_trade_no,
         * @param  {} transaction_id
         * @param  {} time_end}
         */
        async notify({ out_trade_no, transaction_id, time_end }) {
            const classSelf = this;
            const entry = await this.WechatPayment.findOne({
                where: { out_trade_no: out_trade_no }
            })
            if (!entry) throw new Error("找不到该条微信充值记录")

            //微信充值回调transaction
            return classSelf.app.model.transaction(function (t) {
                return classSelf.WechatPayment.update({
                    transaction_id: transaction_id,
                    time_end: time_end,
                    status: 2,
                }, { where: { out_trade_no: out_trade_no }, transaction: t }).then(function (payment) {
                    return classSelf.Balance.create({
                        memberId: entry.memberId,
                        type: 1,  //充值
                        amount: entry.total_fee,
                        source: 1,  //微信充值
                        sourceNo: entry.id,
                        remark: "微信公众号充值",
                        status: 1,
                    }, { transaction: t }).then(function (result) {
                        return result
                    })
                });
            });
        }
    }
    return WechatPayment;
};