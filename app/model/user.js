'use strict'

module.exports = function (sequelize) {
  return sequelize.define('user', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    phoneNo: {
      type: sequelize.Sequelize.STRING,
      allowNull: false
    },
    idCardNo: {
      type: sequelize.Sequelize.STRING,
      allowNull: false
    },
    gender: {
      type: sequelize.Sequelize.INTEGER
    },
    status: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false
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
        models.user.hasOne(models.member)
        models.user.hasOne(models.wechat)
      }
    }
  })
}
