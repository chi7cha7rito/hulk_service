'use strict';

module.exports = app => {
    class MatchConfig extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.MatchConfig = this.app.model.MatchConfig
            this.MatchType = this.app.model.MatchType
            this.MatchPrice = this.app.model.MatchPrice
            this.MatchReward = this.app.model.MatchReward
            this.MemberLevel = this.app.model.MemberLevel
            this.Helper = this.ctx.helper
            this.moment = this.app.moment
        }

        /**
         * @description 获取赛事配置
         * @param  {} {name
         * @param  {} type
         * @param  {} holder
         * @param  {} status
         * @param  {} pageIndex=1
         * @param  {} pageSize=10}
         * @return {object}
         */
        async findMatchConfigs({ name, type, subType, holder, status, pageIndex = 1, pageSize = 10 }) {
            let cond = {}
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            if (name) {
                cond.name = { $like: '%' + name + '%' }
            }
            if (type) {
                cond.type = type
            }

            if (subType) {
                cond.subType = subType
            }

            if (holder) {
                cond.holder = { $like: '%' + holder + '%' }
            }
            if (status) {
                cond.status = status
            }
            const result = await this.MatchConfig.findAndCount({
                where: cond,
                include: [
                    { model: this.MatchType, as: 'Type' },
                    { 
                        model: this.MatchPrice, 
                        where: { status: { $ne: 3 } },
                        include: [{ model: this.MemberLevel, as: 'Type', attributes: ['id', 'name'] }]
                    },
                    { model: this.MatchReward, where: { status: { $ne: 3 } } }],
                distinct: true,
                offset: (index - 1) * size,
                limit: size
            })
            return result
        }

        /**
         * @description 获取赛事配置
         * @return {object}
         */
        async findAll() {
            const result = await this.MatchConfig.findAll({
                where: { status: 1 },
                include: [
                    { model: this.MatchType, as: 'Type' },
                    { 
                        model: this.MatchPrice, 
                        where: { status: { $ne: 3 } },
                        include: [{ model: this.MemberLevel, as: 'Type', attributes: ['id', 'name'] }]
                    },
                    { model: this.MatchReward, where: { status: { $ne: 3 } } }],
            })
            return result
        }

        /**
         * @description 更新赛事配置
         * @param  {} {name
         * @param  {} type
         * @param  {} subType
         * @param  {} description
         * @param  {} online
         * @param  {} url
         * @param  {} holder
         * @param  {} operator}
         * @return {object}
         */
        async update({ id, name, type, subType, description, online, url, holder, status, operator }) {
            const configCount = await this.MatchConfig.count({ where: { id: id } })
            if (configCount == 0) throw new Error("赛事配置不存在")
            const nameCount = await this.MatchConfig.count({ where: { name: name, id: { $ne: id } } })
            if (nameCount > 0) throw new Error("赛事名称已存在")
            const typeCount = await this.MatchType.count({ where: { id: type } })
            if (typeCount == 0) throw new Error("赛事类型不存在")
            const result = await this.MatchConfig.update({
                name: name,
                type: type,
                subType: subType,
                description: description,
                url: url,
                online: online,
                holder: holder,
                status: status,
                updator: operator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 关闭赛事配置
         * @param  {} {id
         * @param  {} status
         * @param  {} operator}
         */
        async changeStatus({ id, status, operator }) {
            const configCount = await this.MatchConfig.count({ where: { id: id } })
            if (configCount == 0) throw new Error("赛事配置不存在")
            const result = await this.MatchConfig.update({
                status: 2,
                status: status,
                updator: operator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 创建赛事配置
         * @param  {} {name
         * @param  {} type
         * @param  {} subType
         * @param  {} description
         * @param  {} online
         * @param  {} url
         * @param  {} holder
         * @param  {} status=1
         * @param  {} operator}
         * @return {object}
         */
        async create({ name, type, subType, description, online, url, holder, status = 1, operator }) {
            const nameCount = await this.MatchConfig.count({ where: { name: name } })
            if (nameCount > 0) throw new Error("赛事名称已存在")
            const typeCount = await this.MatchType.count({ where: { id: type } })
            if (typeCount == 0) throw new Error("赛事类型不存在")
            const result = await this.MatchConfig.create({
                name: name,
                type: type,
                subType: subType,
                description: description,
                url: url,
                online: online,
                holder: holder,
                status: status,
                creator: operator
            })
            return result
        }

        /**
         * @description 更新赛事配置,赛事价格,赛事奖励配置
         * @param  {} id
         * @param  {} name
         * @param  {} type
         * @param  {} subType
         * @param  {} description
         * @param  {} online
         * @param  {} url
         * @param  {} holder
         * @param  {} status
         * @param  {} operator
         * @param  {} priceList
         * @param  {} rewardList
         */
        async edit({ id, name, type, subType, description, online, url, holder, status = 1, operator, priceList, rewardList }) {
            var classSelf = this;

            const configCount = await this.MatchConfig.count({ where: { id: id } })
            if (configCount == 0) throw new Error("赛事配置不存在")
            const nameCount = await this.MatchConfig.count({ where: { name: name, id: { $ne: id } } })
            if (nameCount > 0) throw new Error("赛事名称已存在")
            const typeCount = await this.MatchType.count({ where: { id: type } })
            if (typeCount == 0) throw new Error("赛事类型不存在")

            return classSelf.app.model.transaction(function (t) {
                return classSelf.MatchConfig.update({
                    name: name,
                    type: type,
                    subType: subType,
                    description: description,
                    url: url,
                    online: online,
                    holder: holder,
                    status: status,
                    updator: operator
                }, { where: { id: id }, transaction: t }).then(function (result) {
                    return classSelf.MatchPrice.destroy({
                        where: {
                            matchConfigId: id
                        },
                        transaction: t
                    }).then(function (result) {
                        priceList.forEach(oPrice => {
                            oPrice.matchConfigId = id;
                        })
                        return classSelf.MatchPrice.bulkCreate(priceList, { transaction: t }).then(function (result) {
                            return classSelf.MatchReward.destroy({
                                where: { matchConfigId: id },
                                transaction: t
                            }).then(function (result) {
                                rewardList.forEach(oReward => {
                                    oReward.matchConfigId = id;
                                })
                                return classSelf.MatchReward.bulkCreate(rewardList, { transaction: t }).then(function (result) {
                                    return result;
                                })
                            })
                        })
                    })
                })
            })
        }


        /**
         * @description 添加赛事配置,赛事价格,赛事奖励配置
         * @param  {} id
         * @param  {} name
         * @param  {} type
         * @param  {} subType
         * @param  {} description
         * @param  {} online
         * @param  {} url
         * @param  {} holder
         * @param  {} status
         * @param  {} operator
         * @param  {} priceList
         * @param  {} rewardList
         */
        async add({ name, type, subType, description, online, url, holder, status = 1, operator, priceList, rewardList }) {
            var classSelf = this;
            let matchConfigId;

            const nameCount = await this.MatchConfig.count({ where: { name: name } })
            if (nameCount > 0) throw new Error("赛事名称已存在")
            const typeCount = await this.MatchType.count({ where: { id: type } })
            if (typeCount == 0) throw new Error("赛事类型不存在")


            return classSelf.app.model.transaction(function (t) {
                return classSelf.MatchConfig.create({
                    name: name,
                    type: type,
                    subType: subType,
                    description: description,
                    url: url,
                    online: online,
                    holder: holder,
                    status: status,
                    updator: operator
                }, { transaction: t }).then(function (result) {
                    matchConfigId = result.id;
                    priceList.forEach(oPrice => {
                        oPrice.matchConfigId = matchConfigId;
                    })
                    return classSelf.MatchPrice.bulkCreate(priceList, { transaction: t })
                        .then(function (result) {
                            rewardList.forEach(oReward => {
                                oReward.matchConfigId = matchConfigId;
                            })
                            return classSelf.MatchReward.bulkCreate(rewardList, { transaction: t }).then(function (result) {
                                return result;
                            })
                        })
                })
            })
        }

        /**
        * @description 获取指定Id的赛事配置
        * @param  {} {id }
        * @return {object}
        */
        async findMatchConfigById({ id }) {
            const result = await this.MatchConfig.findOne({
                where: { id },
                include: [
                    { model: this.MatchType, as: 'Type' },
                    { 
                        model: this.MatchPrice, 
                        where: { status: { $ne: 3 } } ,
                        include: [{ model: this.MemberLevel, as: 'Type', attributes: ['id', 'name'] }]
                    },
                    { model: this.MatchReward, where: { status: { $ne: 3 } } }],
            })
            return result
        }
    }

    return MatchConfig;
};