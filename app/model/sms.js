'use strict'

module.exports = app => {
  const { STRING, INTEGER} = app.Sequelize
    return app.model.define('sms', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        type: {
            type: INTEGER,
            allowNull: false,
            comemt: '1:短信,2:语音'
        },
        phoneNo: {
            type: STRING,
            allowNull: false
        },
        content: {
            type: STRING,
            allowNull: false,
            comemt: '短信内容'
        },
        request: {
            type: STRING
        },
        response: {
            type: STRING
        },
        status: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 1,
            comemt: '1:未发送,2:成功,3:失败'
        }
    })
}
