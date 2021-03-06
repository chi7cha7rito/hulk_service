'use strict';

module.exports = app => {
    class Member extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.Member = this.app.model.Member
            this.User = this.app.model.User
            this.Balance = this.app.model.Balance
            this.LoyaltyPoint = this.app.model.LoyaltyPoint
            this.Wechat = this.app.model.Wechat
            this.MemberLevel = this.app.model.MemberLevel
            this.Helper = this.ctx.helper
            this.Sequelize = this.app.model
            this.moment = this.app.moment
        }

        /**
         * @description 查找会员
         * @param  {} {phoneNo
         * @param  {} name
         * @param  {} idCardNo
         * @param  {} gender
         * @param  {} status
         * @param  {} level
         * @param  {} startCreatedAt
         * @param  {} endCreatedAt
         * @param  {} pageIndex
         * @param  {} pageSize}
         */
        async findMembers({ phoneNo, name, idCardNo, gender, status, level, startCreatedAt, endCreatedAt, pageIndex = 1, pageSize = 10 }) {
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            let cond = {}
            let memberCond = {}
            cond.createdAt = {
                $gte: startCreatedAt || this.moment('1971-01-01').format(),
                $lte: (endCreatedAt && this.moment(endCreatedAt).endOf('day')) || this.moment('9999-12-31').format(),
            }
            if (phoneNo) cond.phoneNo = { $like: '%' + phoneNo + '%' }
            if (name) cond.name = { $like: '%' + name + '%' }
            if (idCardNo) cond.idCardNo = { $like: '%' + idCardNo + '%' }
            if (gender) cond.gender = gender
            if (status) cond.status = status
            if (level) memberCond.memberLevelId = level
            const result = await this.User.findAndCount({
                where: cond,
                include: [{
                    where: memberCond,
                    model: this.Member,
                    include: [{
                        model: this.MemberLevel,
                    }],
                }],
                distinct: true,
                offset: (index - 1) * size,
                limit: size,
            })
            return result
        }

        /**
         * @description 查找所有有效的会员，即status=1
         * @param  {} {phoneNo}
         */
        async findAllMembers({ phoneNo }) {
            let cond = {}

            if (phoneNo) cond.phoneNo = { $like: '%' + phoneNo + '%' }

            cond.status = 1
            cond.roleType = 3
            const result = await this.User.findAndCount({
                where: cond
            })

            return result
        }

        /**
         * @description 查找会员余额
         * @param  {} {phoneNo
         * @param  {} name
         * @param  {} idCardNo
         * @param  {} gender
         * @param  {} status
         * @param  {} level
         * @param  {} startCreatedAt
         * @param  {} endCreatedAt
         * @param  {} pageIndex
         * @param  {} pageSize}
         */
        async findMembersBalance({ phoneNo, name, idCardNo, gender, status, level, startCreatedAt, endCreatedAt, pageIndex = 1, pageSize = 10 }) {
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            let cond = {}
            let memberCond = {}
            cond.createdAt = {
                $gte: startCreatedAt || this.moment('1971-01-01').format(),
                $lte: (endCreatedAt && this.moment(endCreatedAt).endOf('day')) || this.moment('9999-12-31').format(),
            }
            if (phoneNo) cond.phoneNo = { $like: '%' + phoneNo + '%' }
            if (name) cond.name = { $like: '%' + name + '%' }
            if (idCardNo) cond.idCardNo = { $like: '%' + idCardNo + '%' }
            if (gender) cond.gender = gender
            if (status) cond.gender = status
            if (level) memberCond.memberLevelId = level
            const result = await this.User.findAndCount({
                where: cond,
                include: [{
                    where: memberCond,
                    attributes: ['cardNo', [this.Sequelize.fn('SUM', this.Sequelize.col('member.balances.amount')), 'total']],
                    model: this.Member,
                    include: [{
                        model: this.MemberLevel,
                    }, {
                        model: this.Balance,
                        duplicating: false,
                        attributes: []
                    }],
                }],
                group: ['member.id'],
                offset: (index - 1) * size,
                limit: size,

            })
            result.count = result.count.length
            return result
        }

        /**
         * @description 查找会员积分
         * @param  {} {phoneNo
         * @param  {} name
         * @param  {} idCardNo
         * @param  {} gender
         * @param  {} status
         * @param  {} level
         * @param  {} startCreatedAt
         * @param  {} endCreatedAt
         * @param  {} pageIndex
         * @param  {} pageSize}
         */
        async findMembersPoints({ phoneNo, name, idCardNo, gender, status, level, startCreatedAt, endCreatedAt, pageIndex = 1, pageSize = 10 }) {
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            let cond = {}
            let memberCond = {}
            cond.createdAt = {
                $gte: startCreatedAt || this.moment('1971-01-01').format(),
                $lte: (endCreatedAt && this.moment(endCreatedAt).endOf('day')) || this.moment('9999-12-31').format(),
            }
            if (phoneNo) cond.phoneNo = { $like: '%' + phoneNo + '%' }
            if (name) cond.name = { $like: '%' + name + '%' }
            if (idCardNo) cond.idCardNo = { $like: '%' + idCardNo + '%' }
            if (gender) cond.gender = gender
            if (status) cond.gender = status
            if (level) memberCond.memberLevelId = level
            const result = await this.User.findAndCount({
                where: cond,
                include: [{
                    where: memberCond,
                    attributes: ['cardNo', [this.Sequelize.fn('SUM', this.Sequelize.col('member.loyaltyPoints.points')), 'total']],
                    model: this.Member,
                    include: [{
                        model: this.MemberLevel,
                    }, {
                        model: this.LoyaltyPoint,
                        duplicating: false,
                        attributes: []
                    }],
                }],
                group: ['member.id'],
                offset: (index - 1) * size,
                limit: size,

            })
            result.count = result.count.length
            return result
        }

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
                    }, {
                        model: this.MemberLevel
                    }],
                }],
                where: { id }
            })
            return result
        }

        /**
        * @description:根据会员phoneNo查询会员
        * @param {int} phoneNo
        * @return {object} 会员信息
        */
        async findByPhoneNo({ phoneNo }) {
            const result = await this.User.findOne({
                include: [{
                    model: this.Member,
                    include: [{
                        model: this.MemberLevel
                    }],
                }],
                where: { phoneNo }
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
                    }, {
                        model: this.MemberLevel
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
         * @param  {int} status
         * @param  {int} updator}
         * @return {object}
         */
        async update({ id, name, phoneNo, idCardNo, cardNo, gender, status, operator }) {
            const classSelf = this
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

            //卡号判重
            const cardNoCount = await this.Member.count({
                where: { id: { $ne: user.memberId }, cardNo: cardNo }
            })
            if (cardNoCount > 0) throw new Error("卡号已经存在")

            return classSelf.app.model.transaction(function (t) {
                return classSelf.User.update({
                    name,
                    phoneNo,
                    idCardNo,
                    gender,
                    status,
                    updator: operator,
                }, { where: { id: user.id }, transaction: t }).then(function (result) {
                    return classSelf.Member.update({
                        cardNo,
                        status,
                        updator: operator
                    }, { where: { id: user.member.id }, transaction: t }).then(function (result) {
                        return result
                    })
                })
            })
        }

        /**
         * @description:创建会员
         * @param  {string} {name
         * @param  {string} phoneNo
         * @param  {string} idCardNo
         * @param  {int} gender
         * @param  {int} memberLevelId
         * @param  {string} wechatOpenId
         * @param  {string} nickName
         * @param  {string} headImgUrl
         * @param  {int} operator}
         * @return {object}
         */
        async create({ name, phoneNo, idCardNo, gender, memberLevelId = 1, wechatOpenId, nickName, headImgUrl, operator }) {
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

            const memberLevelCount = await this.MemberLevel.count({
                where: { id: memberLevelId, status: 1 }
            })
            if (memberLevelCount == 0) throw new Error("会员等级不存在或已禁用")

            //创建会员及用户
            const result = await this.User.create({
                name: name,
                phoneNo: phoneNo,
                idCardNo: idCardNo,
                gender: gender,
                creator: operator,
                roleType: 3,
                member: {
                    cardNo: phoneNo,
                    memberLevelId: memberLevelId,
                    creator: operator,
                    wechat: {
                        wechatOpenId: wechatOpenId,
                        nickName: nickName,
                        headImgUrl: headImgUrl,
                        creator: operator
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