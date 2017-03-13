'use strict'

module.exports = function (sequelize) {
  return sequelize.define('wechat', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    wechatOpenId: {
      type: sequelize.Sequelize.STRING,
      allowNull: false
    },
    nickName: {
      type: sequelize.Sequelize.STRING,
    },
    headImgUrl: {
      type: sequelize.Sequelize.STRING,
    },
    creator: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false
    },
    updator: {
      type: sequelize.Sequelize.INTEGER
    }
  }, {
      classMethods: {
        associate(models) {
          models.wechat.belongsTo(models.member)
        }
      }
    })
}
