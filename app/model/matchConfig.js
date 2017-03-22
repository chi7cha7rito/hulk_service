'use strict'

module.exports = app => {
  const { STRING, INTEGER, DECIMAL, BOOLEAN, TEXT } = app.Sequelize
  return app.model.define('matchConfig', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: STRING,
      allowNull: false,
      comment: '赛事名称'
    },
    type: {
      type: INTEGER,
      allowNull: false,
      comment: '1:SNG,2:MTT,3:猎人赛---由matchType定义'
    },
    subType: {
      type: INTEGER,
      comment: '1:下午场,2:晚场,3:周末赛,4:月度会员杯赛---由matchType定义'
    },
    description: {
      type: TEXT,
      allowNull: false,
      comment: '赛事描述'
    },
    url: {
      type: STRING,
      comment: '赛事介绍页面url'
    },
    perHand: {
      type: DECIMAL(10, 2),
      defaultValue: 0,
      comment: '每手价格'
    },
    online: {
      type: BOOLEAN,
      defaultValue: false,
      comment: '线上或线下比赛'
    },
    holder: {
      type: STRING,
      allowNull: false,
      comment: '主办方'
    },
    status: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1:启用,2:禁用'
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
          app.model.MatchConfig.belongsTo(app.model.MatchType, { as: 'Type', foreignKey: 'type' })
          app.model.MatchConfig.belongsTo(app.model.MatchType, { as: 'SubType', foreignKey: 'subType' })
          app.model.MatchConfig.hasMany(app.model.Match)
          app.model.MatchConfig.hasMany(app.model.MatchPrice)
          app.model.MatchConfig.hasMany(app.model.MatchReward)
        }
      }
    })
}
