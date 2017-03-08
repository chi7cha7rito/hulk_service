'use strict'

module.exports = function (sequelize) {
  return sequelize.define('invitationCode', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    code: {
      type: sequelize.Sequelize.STRING,
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
        models.invitationCode.belongsTo(models.member)
      }
    }
  })
}
