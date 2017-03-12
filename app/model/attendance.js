'use strict'

module.exports = function (sequelize) {
  return sequelize.define('attendance', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    result: {
      type: sequelize.Sequelize.INTEGER,
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
        models.attendance.belongsTo(models.match)
        models.attendance.belongsTo(models.member)
      }
    }
  })
}
