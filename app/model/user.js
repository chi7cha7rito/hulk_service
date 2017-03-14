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
      allowNull: false,
      unique: true,
      comment: '手机号码（唯一）'
    },
    name: {
      type: sequelize.Sequelize.STRING,
      allowNull: false
    },
    idCardNo: {
      type: sequelize.Sequelize.STRING,
      allowNull: false,
      unique: true,
      comment: '身份证号（唯一）'
    },
    gender: {
      type: sequelize.Sequelize.INTEGER,
      comment: '0:未知,1:男,2:女'
    },
    status: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1:正常,2:冻结,3:删除'
    },
    creator: {
      type: sequelize.Sequelize.INTEGER,
    },
    updator: {
      type: sequelize.Sequelize.INTEGER
    }
  }, {
      classMethods: {
        associate(models) {
          models.user.hasOne(models.member)
        }
      }
    })
}
