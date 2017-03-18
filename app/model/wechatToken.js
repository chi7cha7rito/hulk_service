'use strict'

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize
    return app.model.define('wechatToken', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        access_token: {
            type: STRING,
            allowNull: false,
        },
        expires_in: {
            type: INTEGER,
            allowNull: false,
            comment: 'token过期时间（秒）'
        },
        refresh_token: {
            type: STRING,
        },
        openid: {
            type: STRING,
            allowNull: false
        },
        scope: {
            type: STRING,
            allowNull: false,
            comment: '授权范围（逗号分隔）'
        }
    }, { updatedAt: false })
}
