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
        models.member.belongsTo(models.user)
        models.member.hasMany(models.loyaltyPoints)
        models.member.hasMany(models.balance)
        models.member.hasMany(models.signIn)
        models.member.hasMany(models.invitationCode)
        models.member.hasMany(models.attendance)
      }
    }
  })
}
