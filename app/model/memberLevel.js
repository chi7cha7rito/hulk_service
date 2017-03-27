'use strict'

module.exports = app => {
    const { STRING, INTEGER, DECIMAL } = app.Sequelize
    return app.model.define('memberLevel', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        name: {
            type: STRING,
            allowNull: false,
            comment: '等级名称'
        },
        threshold: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '单笔充值金额达到则升至此等级'
        },
        apply: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '参加比赛获得豪气'
        },
        buyChip: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '参加比赛获得豪气'
        },
        consume: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            comment: '消费获得豪气'
        },
        weeklyTicket: {
            type: INTEGER,
            defaultValue: 0,
            comment: '每月签到多少次获得周票'
        },
        status: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: '1:正常,2:禁用'
        },
        creator: {
            type: INTEGER,
        },
        updator: {
            type: INTEGER
        }
    }, {
            classMethods: {
                associate() {
                    app.model.MemberLevel.hasMany(app.model.Member)
                }

            }
        })
}