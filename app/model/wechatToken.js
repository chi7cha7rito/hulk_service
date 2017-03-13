'use strict'

module.exports = function (sequelize) {
    return sequelize.define('wechatToken', {
        id: {
            type: sequelize.Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        access_token: {
            type: sequelize.Sequelize.STRING,
            allowNull: false
        },
        expires_in: {
            type: sequelize.Sequelize.INTEGER,
            allowNull: false
        },
        openid: {
            type: sequelize.Sequelize.STRING,
            allowNull: false
        },
        scope: {
            type: sequelize.Sequelize.STRING,
            allowNull: false
        }
    }, { updatedAt: false })
}
