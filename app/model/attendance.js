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
      comment: '比赛成绩,同比赛奖励的ranking'
    },
    status: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      comment: '1:正常,2:删除'
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
          models.attendance.belongsTo(models.match)
          models.attendance.belongsTo(models.member)
        }
      }
    })
}
