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
      allowNull: false,
      get: function () {
        let val = this.getDataValue('subType')
        let str = ''
        if (val == 1) str = '平日赛'
        if (val == 2) str = '周末赛'
        if (val == 3) str = '月度会员杯赛'
        if (val == 4) str = '年度会员杯赛'
        return { val, name: str }
      },
      comment: '1:平日赛,2:周末赛,3:月度会员杯赛,4:年度会员杯赛'
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
          app.model.MatchConfig.belongsTo(app.model.MatchType, { as: 'Type', foreignKey: 'type' })
          app.model.MatchConfig.hasMany(app.model.Match)
          app.model.MatchConfig.hasMany(app.model.MatchPrice)
          app.model.MatchConfig.hasMany(app.model.MatchReward)
        }
      }
    })
}
