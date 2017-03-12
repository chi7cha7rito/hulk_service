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
      allowNull: false
    },
    level: {
      type: sequelize.Sequelize.INTEGER,
      defaultValue: 1
    },
    status: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
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
