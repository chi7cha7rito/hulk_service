'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN, DECIMAL } = app.Sequelize
  return app.model.define('loyaltyPoint', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: INTEGER,
      allowNull: false,
      set: function (val) {
        let boo = val % 2 == 0 ? false : true
        this.setDataValue('type', val)
        this.setDataValue('isPositive', boo);
      },
      get: function () {
        let val = this.getDataValue('type')
        let str = ''
        if (val == 1) str = '获取'
        if (val == 2) str = '消费'
        if (val == 3) str = '正调整'
        if (val == 4) str = '负调整'
        return str
      },
      comment: '1:获取,2:消费,3:正调整,4:负调整'
    },
    points: {
      type: DECIMAL
    },
    isPositive: {
      type: BOOLEAN,
      comment: 'true:正向积分,false:负向积分'
    },
    source: {
      type: INTEGER,
      get: function () {
        let val = this.getDataValue('type')
        let str = ''
        if (val == 1) str = '充值返现'
        if (val == 2) str = '比赛奖励'
        if (val == 3) str = '店内消费'
        if (val == 4) str = '商城消费'
        if (val == 5) str = '手工调整'
        return str
      },
      comment: '1:充值返现,2:比赛奖励,3:店内消费,4:商城消费,5:手工调整'
    },
    sourceNo: {
      type: STRING,
      comment: '参考号'
    },
    remark: {
      type: STRING,
      comment: '操作备注'
    },
    status: {
      type: INTEGER,
      allowNull: false,
      comment: '1:正常,2:冻结,3:失败'
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
          app.model.LoyaltyPoint.belongsTo(app.model.Member)
        }
      }
    })
}
