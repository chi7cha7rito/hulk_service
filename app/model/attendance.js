'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize
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
