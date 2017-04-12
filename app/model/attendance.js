'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN, DECIMAL } = app.Sequelize
  return app.model.define('attendance', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    result: {
      type: INTEGER,
      comment: '比赛成绩,同比赛奖励的ranking'
    },
    rewards: {
      type: DECIMAL(10, 2)
    },
    rewardsRemark: {
      type: STRING
    },
    issue: {
      type: BOOLEAN,
      defaultValue: false,
      comment: '是否发放奖励'
    },
    payType: {
      type: INTEGER,
      comment: '1:余额,2:积分,3:优惠券'
    },
    priceType: {
      type: INTEGER
    },
    matchPrice: {
      type: DECIMAL(10, 2),
      defaultValue: 0
    },
    status: {
      type: INTEGER,
      allowNull: false,
      comment: '1:正常,2:删除'
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
          app.model.Attendance.belongsTo(app.model.Match)
          app.model.Attendance.belongsTo(app.model.Member)
        }
      }
    })
}
