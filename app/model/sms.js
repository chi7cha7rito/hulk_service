'use strict'

module.exports = function (sequelize) {
    return sequelize.define('sms', {
        id: {
            type: sequelize.Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        type: {
            type: sequelize.Sequelize.INTEGER,
            allowNull: false,
            comemt: '1:短信,2:语音'
        },
        phoneNo: {
            type: sequelize.Sequelize.STRING,
            allowNull: false
        },
        content: {
            type: sequelize.Sequelize.STRING,
            allowNull: false,
            comemt: '短信内容'
        },
        status: {
            type: sequelize.Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comemt: '1:未发送,2:成功,3:失败'
        }
    })
}
