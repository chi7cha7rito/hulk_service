'use strict'

module.exports = app => {
    const { STRING, INTEGER, DECIMAL } = app.Sequelize
    return app.model.define('rechargeSetup', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        threshold: {
            type: DECIMAL,
            allowNull: false,
            comment: '返现阀值,取大于等于'
        },
        reward: {
            type: DECIMAL,
            allowNull: false,
            comment: '返现数值'
        },
        remark: {
            type: STRING,
            comment: '备注'
        },
        status: {
            type: INTEGER,
            allowNull: false,
            comment: '1:启用,2禁用'
        },
        creator: {
            type: INTEGER,
        },
        updator: {
            type: INTEGER
        }
    })
}
