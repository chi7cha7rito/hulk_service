'use strict'

module.exports = app => {
  const { INTEGER, DECIMAL } = app.Sequelize
  return app.model.define('matchReward', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    ranking: {
      type: INTEGER,
      allowNull: false,
      comment: '赛事名次'
    },
    rewardPoints: {
      type: DECIMAL(10, 2),
      comment: '赛事奖励积分'
    },
    remark: {
      type: STRING,
      comment: '奖励备注'
    },
    status: {
      type: INTEGER,
      allowNull: false,
      comment: '1:启用,2:禁用,3:删除'
    },
    creator: {
      type: INTEGER,
    },
    updator: {
      type: INTEGER
    }
  }, {
      classMethods: {
        associate() {
          app.model.MatchReward.belongsTo(app.model.MatchConfig)
        }
      }
    })
}
