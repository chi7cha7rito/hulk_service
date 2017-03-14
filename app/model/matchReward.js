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
      allowNull: false,
      comment: '赛事名次'
    },
    rewardPoints: {
      type: sequelize.Sequelize.DECIMAL,
      comment: '赛事奖励积分'
    },
    status: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      comment: '1:启用,2:禁用,3:删除'
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
          models.matchReward.belongsTo(models.match)
        }
      }
    })
}
