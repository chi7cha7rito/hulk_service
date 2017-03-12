'use strict';

module.exports = app => {
    class Member extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Member = this.app.model.member
            this.User = this.app.model.user
            this.Wechat = this.app.model.wechat
            this.Balance = this.app.model.balance
            this.LoyaltyPoint = this.app.model.loyaltyPoint
            this.Sequelize = this.app.sequelize
            this.Helper = this.ctx.helper
        }

        /**
         * @description:根据卡号查询会员
         * @param {string} cardNo
         * @return {object} 会员信息
         */
        async findByCardNo({ cardNo }) {
            const result = await this.Member.findOne({
                where: {
                    cardNo: cardNo
                },
                include: [{
                    model: this.Wechat,
                }, {
                    model: this.User,
                }]
            })

            return this.Helper.ok(result)
        }

        /**
        * @description:根据会员id查询会员
        * @param {int} id
        * @return {object} 会员信息
        */
        async findById({ id }) {
            const result = await this.Member.findOne({
                where: { id: id },
                include: [{
                    model: this.Wechat,
                    where: { wechatOpenId: wechatOpenId }
                }, {
                    model: this.User,
                }]
            })
            return this.Helper.ok(result)
        }

        /**
        * @description:根据微信openid查询会员
        * @param {string} wechatOpenId
        * @return {object} 会员信息
        */
        async findByWechatOpenId({ wechatOpenId }) {
            const result = await this.Member.findOne({
                include: [{
                    model: this.Wechat,
                    where: { wechatOpenId: wechatOpenId }
                }, {
                    model: this.User,
                }]
            })
            return this.Helper.ok(result)
        }

        /**
        * @description:根据手机号查询会员
        * @param {string} wechatOpenId
        * @return {object} 会员信息
        */
        async findByPhoneNo({ phoneNo }) {
            const result = await this.Member.findOne({
                include: [{
                    model: this.Wechat,
                }, {
                    model: this.User,
                    where: { phoneNo: phoneNo }
                }]
            })
            return this.Helper.ok(result)
        }

        /**
        * @description:根据身份证查询会员
        * @param {string} idCardNo
        * @return {object} 会员信息
        */
        async findByIdCardNo({ idCardNo }) {
            const result = await this.Member.findOne({
                include: [{
                    model: this.Wechat,
                }, {
                    model: this.User,
                    where: { idCardNo: idCardNo }
                }]
            })
            return this.Helper.ok(result)
        }

        /**
         * @description:创建会员
         * @param  {string} {name
         * @param  {string} phoneNo
         * @param  {string} idCardNo
         * @param  {int} gender=2
         * @param  {string} wechatOpenId
         * @param  {int} creator}
         * @return {object}
         */
        async create({ name, phoneNo, idCardNo, gender = 2, wechatOpenId, creator = 1 }) {
            try {
                const result = await this.Member.create({
                    cardNo: phoneNo,
                    user: {
                        name: name,
                        phoneNo: phoneNo,
                        idCardNo: idCardNo,
                        gender: gender,
                        creator: creator,
                    },
                    wechat: {
                        wechatOpenId: wechatOpenId,
                        creator: creator
                    },
                    creator: creator
                }, {
                        include: [this.User, this.Wechat]
                    })
                return this.Helper.ok(result)
            } catch (error) {
                return this.Helper.err(JSON.stringify(error.errors))
            }
        }
    }
    return Member;
};