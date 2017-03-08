'use strict'

module.exports = function (sequelize) {
  return sequelize.define('matchReward', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ranking: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false
    },
    rewardPoints: {
      type: sequelize.Sequelize.DECIMAL
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
        models.matchReward.belongsTo(models.match)
      }
    }
  })
}
