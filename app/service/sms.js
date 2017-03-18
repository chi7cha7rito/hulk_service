'use strict';

module.exports = app => {
    class Sms extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Sms = this.app.model.Sms
        }

        /**
         * @description 新建短信记录
         * @param  {} {type
         * @param  {} phoneNo
         * @param  {} content
         * @param  {} request}
         */
        async create({ type, phoneNo, content, request }) {
            const result = await this.Sms.create({
                type: type,
                phoneNo: phoneNo,
                content: content,
                request: request
            })
            return result
        }

        /**
        * @description 更新成功状态
        * @param  {} {id
        * @param  {} response}
        */
        async success({ id, response }) {
            const result = await this.Sms.update({
                response: response,
                status: 2
            }, { where: { id: id } })
            return result
        }

        /**
        * @description 更新失败状态
        * @param  {} {id
        * @param  {} response}
        */
        async failure({ id, response }) {
            const result = await this.Sms.update({
                response: response,
                status: 3
            }, { where: { id: id } })
            return result
        }
    }
    return Sms
};