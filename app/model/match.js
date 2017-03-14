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
      allowNull: false,
      comment: '赛事名称'
    },
    type: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      comment: '1:SNG,2:MTT,3:猎人赛---由matchType定义'
    },
    subType: {
      type: sequelize.Sequelize.INTEGER,
      comment: '1:下午场,2:晚场,3:周末赛,4:月度会员杯赛---由matchType定义'
    },
    opening: {
      type: sequelize.Sequelize.DATE,
      allowNull: false,
      comment: '比赛时间'
    },
    description: {
      type: sequelize.Sequelize.TEXT,
      allowNull: false,
      comment: '赛事描述'
    },
    url: {
      type: sequelize.Sequelize.STRING,
      comment: '赛事介绍页面url'
    },
    holder: {
      type: sequelize.Sequelize.STRING,
      allowNull: false,
      comment: '主办方'
    },
    status: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1:启用,2:禁用'
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
          models.match.hasMany(models.matchPrice)
          models.match.hasMany(models.attendance)
          models.match.hasMany(models.matchReward)
        }
      }
    })
}
