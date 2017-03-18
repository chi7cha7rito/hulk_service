'use strict'

module.exports =  app => {
  const { STRING, INTEGER} = app.Sequelize
  return app.model.define('wechat', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    wechatOpenId: {
      type: STRING,
      allowNull: false
    },
    nickName: {
      type: STRING,
      comment: '昵称'
    },
    headImgUrl: {
      type: STRING,
      comment: '头像Url'
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
          app.model.Wechat.belongsTo(app.model.Member)
        }
      }
    })
}
