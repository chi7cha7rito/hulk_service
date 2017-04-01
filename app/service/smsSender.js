'use strict';
const md5 = require('md5')
module.exports = app => {
    class SmsSender extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.sendSmsApi = this.app.config.sendSmsApi
            this.token = md5(this.app.config.hulk_token)
            this.moment = this.app.moment
        }

        /**
         * @description 余额增加通知
         * @param  {} {phoneNo
         * @param  {} name
         * @param  {} amount
         * @param  {} avlAmt}
         */
        async balancePlus({ phoneNo, name, amount, avlAmt }) {
            try {
                const result = await this.app.curl(this.sendSmsApi.balancePlus, {
                    // 必须指定 method，支持 POST，PUT 和 DELETE
                    method: 'POST',
                    // 不需要设置 contentType，HttpClient 会默认以 application/x-www-form-urlencoded 格式发送请求
                    contentType: 'json',
                    headers: {
                        'hulk_token': this.token
                    },
                    data: {
                        phoneNo,
                        name,
                        datetime: this.moment().format('M月D日 H:mm'),
                        amount,
                        avlAmt
                    },
                    // 明确告诉 HttpClient 以 JSON 格式处理响应 body
                    dataType: 'json'
                })
                return result.data
            } catch (error) {
                this.app.logger.error('SmsSender->balancePlus Error:' + error)
                return false
            }

        }

        /**
         * @description 余额扣减通知
         * @param  {} {phoneNo
         * @param  {} name
         * @param  {} amount
         * @param  {} avlAmt}
         */
        async balanceMinus({ phoneNo, name, amount, avlAmt }) {
            try {
                const result = await this.app.curl(this.sendSmsApi.balanceMinus, {
                    // 必须指定 method，支持 POST，PUT 和 DELETE
                    method: 'POST',
                    // 不需要设置 contentType，HttpClient 会默认以 application/x-www-form-urlencoded 格式发送请求
                    contentType: 'json',
                    headers: {
                        'hulk_token': this.token
                    },
                    data: {
                        phoneNo,
                        name,
                        datetime: this.moment().format('M月D日 H:mm'),
                        amount,
                        avlAmt
                    },
                    // 明确告诉 HttpClient 以 JSON 格式处理响应 body
                    dataType: 'json'
                })
                return result.data
            } catch (error) {
                this.app.logger.error('SmsSender->balanceMinus Error:' + error)
                return false
            }
        }

        /**
         * @description 积分增加通知
         * @param  {} {phoneNo
         * @param  {} name
         * @param  {} points
         * @param  {} avlPts}
         */
        async loyaltyPointPlus({ phoneNo, name, points, avlPts }) {
            try {
                const result = await this.app.curl(this.sendSmsApi.loyaltyPointPlus, {
                    // 必须指定 method，支持 POST，PUT 和 DELETE
                    method: 'POST',
                    // 不需要设置 contentType，HttpClient 会默认以 application/x-www-form-urlencoded 格式发送请求
                    contentType: 'json',
                    headers: {
                        'hulk_token': this.token
                    },
                    data: {
                        phoneNo,
                        name,
                        datetime: this.moment().format('M月D日 H:mm'),
                        points,
                        avlPts
                    },
                    // 明确告诉 HttpClient 以 JSON 格式处理响应 body
                    dataType: 'json'
                })
                return result.data
            } catch (error) {
                this.app.logger.error('SmsSender->loyaltyPointPlus Error:' + error)
                return false
            }
        }

        /**
         * @description 积分扣减通知
         * @param  {} {phoneNo
         * @param  {} name
         * @param  {} points
         * @param  {} avlPts}
         */
        async loyaltyPointMinus({ phoneNo, name, points, avlPts }) {
            try {
                const result = await this.app.curl(this.sendSmsApi.loyaltyPointMinus, {
                    // 必须指定 method，支持 POST，PUT 和 DELETE
                    method: 'POST',
                    // 不需要设置 contentType，HttpClient 会默认以 application/x-www-form-urlencoded 格式发送请求
                    contentType: 'json',
                    headers: {
                        'hulk_token': this.token
                    },
                    data: {
                        phoneNo,
                        name,
                        datetime: this.moment().format('M月D日 H:mm'),
                        points,
                        avlPts
                    },
                    // 明确告诉 HttpClient 以 JSON 格式处理响应 body
                    dataType: 'json'
                })
                return result.data
            } catch (error) {
                this.app.logger.error('SmsSender->loyaltyPointMinus Error:' + error)
                return false
            }
        }
    }
    return SmsSender
};