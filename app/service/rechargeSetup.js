'use strict';

module.exports = app => {
    class RechargeSetup extends app.Service {
        constructor(ctx) {
            super(ctx)
            this.RechargeSetup = this.app.model.RechargeSetup
            this.Sequelize = this.app.model
        }

        /**
         * @description 查询所有返现记录
         */
        async findAll() {
            const result = await this.RechargeSetup.findAll();
            return result
        }

        /**
         * @description 查询返现记录
         */
        async findById({ id }) {
            const result = await this.RechargeSetup.findById(id);
            return result
        }

        /**
         * @description 查找最大返现值
         * @param  {} {val}
         */
        async findMax({ threshold = 0 }) {
            const max = await this.RechargeSetup.max('reward', { where: { threshold: { $lte: threshold }, status: 1 } })
            return max
        }

        /**
         * @description 更新记录
         * @param  {} {id
         * @param  {} threshold
         * @param  {} reward
         * @param  {} remark
         * @param  {} status
         * @param  {} operator}
         */
        async update({ id, threshold, reward, remark, status, operator }) {
            const rec = await this.RechargeSetup.findById(id)
            if (!rec) throw new Error("返现记录不存在")

            const setupCount = await this.RechargeSetup.count({
                where: { threshold: threshold, id: { $ne: id, } }
            })
            if (setupCount > 0) throw new Error("存在重复的返现记录")
            const result = await this.RechargeSetup.update({
                threshold,
                reward,
                remark,
                status,
                updator: operator
            }, { where: { id: id } })
            return result
        }


        /**
         * @description 创建记录
         * @param  {} {threshold
         * @param  {} reward
         * @param  {} remark
         * @param  {} status
         * @param  {} operator}
         */
        async create({ threshold, reward, remark, status, operator }) {
            const setupCount = await this.RechargeSetup.count({
                where: { threshold: threshold }
            })
            if (setupCount > 0) throw new Error("存在重复的返现记录")
            const result = await this.RechargeSetup.create({
                threshold: threshold,
                reward: reward,
                remark: remark,
                status: status,
                creator: operator
            })
            return result
        }
    }
    return RechargeSetup;
};