'use strict'

module.exports = function (sequelize) {
  return sequelize.define('member', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    cardNo: {
      type: sequelize.Sequelize.STRING,
      allowNull: false,
      comment: '会员卡号（默认手机号）'
    },
    level: {
      type: sequelize.Sequelize.INTEGER,
      defaultValue: 1,
      comment: '会员级别'
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
          models.member.belongsTo(models.user)
          models.member.hasOne(models.wechat)
          models.member.hasMany(models.loyaltyPoint)
          models.member.hasMany(models.balance)
          models.member.hasMany(models.signIn)
          models.member.hasMany(models.invitationCode)
          models.member.hasMany(models.attendance)
        }

      }
    })
}
