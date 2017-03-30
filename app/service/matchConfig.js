'use strict';

module.exports = app => {
    class MatchConfig extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.MatchConfig = this.app.model.MatchConfig
            this.MatchType = this.app.model.MatchType
            this.MatchPrice = this.app.model.MatchPrice
            this.MatchReward = this.app.model.MatchReward
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
        async findMatchConfigs({ name, type, holder, status, pageIndex = 1, pageSize = 10 }) {
            let cond = {}
            let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
            if (name) {
                cond.name = { $like: '%' + name + '%' }
            }
            if (type) {
                cond.type = type
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
                    { model: this.MatchPrice,where: { status: { $ne: 3 } } },
                    { model: this.MatchReward,where: { status: { $ne: 3 } }}],
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
                include: [
                    { model: this.MatchType, as: 'Type' },
                    { model: this.MatchPrice, where: { status: { $ne: 3 } } },
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
         * @param  {} status=1
         * @param  {} operator
         * @param  {} priceList
         * @param  {} rewardList
         */
        async edit({ id, name, type, subType, description, online, url, holder, status = 1, operator, priceList, rewardList }) {
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

            //handle the prices
            if (priceList && priceList.length) {
                //first update original prices status to deleted
                let orginalPrices = await this.MatchPrice.findAll({ where: { matchConfigId: id } })
                for (let index = 0; index < orginalPrices.length; index++) {
                    let element = orginalPrices[index];
                    await this.MatchPrice.update({
                        status: 3,
                        updator: operator
                    }, { where: { id: element.id } })
                }

                //then create new price
                for (let index = 0; index < priceList.length; index++) {
                    let oPrice = priceList[index];
                    await this.MatchPrice.create({
                        matchConfigId: id,
                        type: oPrice.type,
                        price: oPrice.price,
                        points: oPrice.points,
                        status: oPrice.status,
                        creator: operator
                    })
                }
            }

            if (rewardList && rewardList.length) {
                //first update original reward status to deleted
                let orginalRewards = await this.MatchReward.findAll({ where: { matchConfigId: id } })
                for (let index = 0; index < orginalRewards.length; index++) {
                    let element = orginalRewards[index];
                    await this.MatchReward.update({
                        status: 3,
                        updator: operator
                    }, { where: { id: element.id } })
                }

                //then create new rewards
                for (let index = 0; index < rewardList.length; index++) {
                    let oReward = rewardList[index];
                    await this.MatchReward.create({
                        matchConfigId: id,
                        ranking: oReward.ranking,
                        rewardPoints: oReward.rewardPoints,
                        status: oReward.status,
                        creator: operator
                    })
                }
            }

            return result
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
                    { model: this.MatchPrice, where: { status: { $ne: 3 } } },
                    { model: this.MatchReward, where: { status: { $ne: 3 } } }],
            })
            return result
        }
    }

    return MatchConfig;
};