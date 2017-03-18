'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN, DECIMAL, TEXT } = app.Sequelize
  return app.model.define('match', {
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
      // references: {
      //   // This is a reference to another model
      //   model: "matchTypes",
      //   // This is the column name of the referenced model
      //   key: 'id'
      // },
      comment: '1:SNG,2:MTT,3:猎人赛---由matchType定义'
    },
    subType: {
      type: INTEGER,
      // references: {
      //   // This is a reference to another model
      //   model: "matchTypes",
      //   // This is the column name of the referenced model
      //   key: 'id'
      // },
      comment: '1:下午场,2:晚场,3:周末赛,4:月度会员杯赛---由matchType定义'
    },
    opening: {
      type: DATE,
      allowNull: false,
      comment: '比赛时间'
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
          app.model.Match.belongsTo(app.model.MatchType, { as: 'Type', foreignKey: 'type' })
          app.model.Match.belongsTo(app.model.MatchType, { as: 'SubType', foreignKey: 'subType' })
          app.model.Match.hasMany(app.model.MatchPrice)
          app.model.Match.hasMany(app.model.Attendance)
          app.model.Match.hasMany(app.model.MatchReward)
        }
      }
    })
}
