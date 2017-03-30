'use strict';

module.exports = app => {
    class MemberLevel extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.MemberLevel = this.app.model.MemberLevel
            this.Sequelize = this.app.model
        }

        /**
         * @description 查询所有会员等级
         */
        async findAll() {
            const result = await this.MemberLevel.findAll();
            return result
        }

        /**
        * @description 查询所有会员等级
        * @param  {} {id}
        */
        async findById({ id }) {
            const result = await this.MemberLevel.findById(id);
            return result
        }

        /**
        * @description 更新会员等级
        * @param  {} {id
        * @param  {} name
        * @param  {} threshold
        * @param  {} apply
        * @param  {} buyChip
        * @param  {} consume
        * @param  {} status
        * @param  {} updator}
        */
        async update({ id, name, threshold, apply, buyChip, consume, status, operator }) {
            const nameCount = await this.MemberLevel.count({
                where: { name: name, id: { $ne: id } }
            })
            if (nameCount > 0) throw new Error("存在重复的等级名称")

            const thresholdCount = await this.MemberLevel.count({
                where: { threshold: threshold, id: { $ne: id } }
            })
            if (thresholdCount > 0) throw new Error("存在重复的晋升金额")

            const result = await this.MemberLevel.update({
                name: name,
                threshold: threshold,
                apply: apply,
                buyChip: buyChip,
                consume: consume,
                status: status,
                updator: operator
            }, { where: { id: id } })
            return result
        }

        /**
         * @description 创建会员等级
         * @param  {} {name
         * @param  {} threshold
         * @param  {} apply
         * @param  {} buyChip
         * @param  {} consume
         * @param  {} status
         * @param  {} creator}
         */
        async create({ name, threshold, apply, buyChip, consume, status, operator }) {
            const nameCount = await this.MemberLevel.count({
                where: { name: name }
            })
            if (nameCount > 0) throw new Error("存在重复的等级名称")

            const thresholdCount = await this.MemberLevel.count({
                where: { threshold: threshold }
            })
            if (thresholdCount > 0) throw new Error("存在重复的晋升金额")

            const result = await this.MemberLevel.create({
                name: name,
                threshold: threshold,
                apply: apply,
                buyChip: buyChip,
                consume: consume,
                status: status,
                creator: operator
            })
            return result
        }
    }
    return MemberLevel;
};