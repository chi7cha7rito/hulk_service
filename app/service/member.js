'use strict';

module.exports = app => {
    class Member extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Member = this.app.model.Member
            this.User = this.app.model.User
            this.Wechat = this.app.model.Wechat
            this.Helper = this.ctx.helper
        }

        //todo:findAll

        /**
        * @description:根据会员id查询会员
        * @param {int} id
        * @return {object} 会员信息
        */
        async findById({ id }) {
            const result = await this.User.findOne({
                include: [{
                    model: this.Member,
                    include: [{
                        model: this.Wechat,
                    }],
                    where: { id: id }
                }],
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
         * @description:更新会员
         * @param  {string} {id
         * @param  {string} name
         * @param  {string} phoneNo
         * @param  {string} idCardNo
         * @param  {int} gender
         * @param  {int} updator}
         * @return {object}
         */
        async update({ id, name, phoneNo, idCardNo, gender, updator }) {
            const user = await this.User.findOne({
                include: [{
                    model: this.Member,
                    where: { id: id }
                }],
            })
            if (!user) throw new Error("会员不存在")

            //手机号判重
            const phoneNoCount = await this.User.count({
                where: { id: { $ne: user.id }, phoneNo: phoneNo }
            })
            if (phoneNoCount > 0) throw new Error("手机号已经存在")

            //身份证判重
            const idCardNoCount = await this.User.count({
                where: { id: { $ne: user.id }, idCardNo: idCardNo }
            })
            if (idCardNoCount > 0) throw new Error("身份证号已经存在")

            const result = await this.User.update({
                name: name,
                phoneNo: phoneNo,
                idCardNo: idCardNo,
                gender: gender,
                updator: updator,
            }, { where: { id: user.id } })
            return result
        }

        /**
         * @description:创建会员
         * @param  {string} {name
         * @param  {string} phoneNo
         * @param  {string} idCardNo
         * @param  {int} gender
         * @param  {string} wechatOpenId
         * @param  {string} nickName
         * @param  {string} headImgUrl
         * @param  {int} creator}
         * @return {object}
         */
        async create({ name, phoneNo, idCardNo, gender, wechatOpenId, nickName, headImgUrl, creator = 1 }) {
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
                roleType: 3,
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