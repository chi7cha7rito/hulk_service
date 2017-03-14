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

            return result
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
            return result
        }

        /**
        * @description:根据微信openid查询会员
        * @param {string} wechatOpenId
        * @return {object} 会员信息
        */
        async findByWechatOpenId({ wechatOpenId }) {
            const result = await this.User.findOne({
                include: [{
                    model: this.Member,
                    include: [{
                        model: this.Wechat,
                        where: { wechatOpenId: wechatOpenId }
                    }],
                }],
            })
            return result
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
            return result
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
            return result
        }

        /**
         * @description:创建会员
         * @param  {string} {name
         * @param  {string} phoneNo
         * @param  {string} idCardNo
         * @param  {int} gender=2
         * @param  {string} wechatOpenId
         * @param  {string} nickName
         * @param  {string} headImgUrl
         * @param  {int} creator}
         * @return {object}
         */
        async create({ name, phoneNo, idCardNo, gender, wechatOpenId, nickName, headImgUrl, creator = 1 }) {
            //姓名判重
            const nameCount = await this.Member.count({
                include: [
                    { model: this.User, where: { name: name } }
                ]
            })
            if (nameCount > 0) throw new Error("姓名已经存在")

            //手机号判重
            const phoneNoCount = await this.Member.count({
                include: [
                    { model: this.User, where: { phoneNo: phoneNo } }
                ]
            })
            if (phoneNoCount > 0) throw new Error("手机号已经存在")

            //身份证判重
            const idCardNoCount = await this.Member.count({
                include: [{
                    model: this.User, where: { idCardNo: idCardNo }
                }]
            })
            if (idCardNoCount > 0) throw new Error("身份证号已经存在")

            //微信openId判重
            const wechatOpenIdCount = await this.Member.count({
                include: [{
                    model: this.Wechat, where: { wechatOpenId: wechatOpenId }
                }]
            })
            if (wechatOpenIdCount > 0) throw new Error("微信账号已被绑定")

            //创建会员及用户
            const result = await this.User.create({
                name: name,
                phoneNo: phoneNo,
                idCardNo: idCardNo,
                gender: gender,
                creator: creator,
                member: {
                    cardNo: phoneNo,
                    creator: creator,
                    wechat: {
                        wechatOpenId: wechatOpenId,
                        nickName: nickName,
                        headImgUrl: headImgUrl,
                        creator: creator
                    }
                }
            }, {
                    include: [{ model: this.Member, include: [this.Wechat] }]
                })
            return result
        }
    }
    return Member;
};