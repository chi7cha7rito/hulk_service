'use strict'

module.exports = function (sequelize) {
  return sequelize.define('match', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: sequelize.Sequelize.STRING,
      allowNull: false
    },
    type: {
      type: sequelize.Sequelize.INTEGER
    },
    opening: {
      type: sequelize.Sequelize.DATE,
      allowNull: false
    },
    description: {
      type: sequelize.Sequelize.TEXT,
      allowNull: false
    },
    holder: {
      type: sequelize.Sequelize.STRING,
      allowNull: false
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
        models.match.hasMany(models.matchPrice)
        models.match.hasMany(models.attendance)
        models.match.hasMany(models.matchReward)
      }
    }
  })
}
