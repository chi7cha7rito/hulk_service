'use strict'

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN, DECIMAL } = app.Sequelize
  return app.model.define('balance', {
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
        if (val == 1) str = '充值'
        if (val == 2) str = '消费'
        if (val == 3) str = '正调整'
        if (val == 4) str = '提现'
        if (val == 6) str = '负调整'
        return str
      },
      comment: '1:充值,2:消费,3:正调整,4:提现,6:负调整'
    },
    isPositive: {
      type: BOOLEAN,
      comment: 'true:正向金额,false:负向金额'
    },
    amount: {
      type: DECIMAL
    },
    source: {
      type: INTEGER,
      allowNull: false,
      get: function () {
        let val = this.getDataValue('source')
        let str = ''
        if (val == 1) str = '微信充值'
        if (val == 2) str = '支付宝充值'
        if (val == 3) str = '刷卡充值'
        if (val == 4) str = '现金充值'
        if (val == 5) str = '店内消费'
        if (val == 6) str = '商城消费'
        if (val == 7) str = '赛事门票'
        if (val == 8) str = '手动调整'
        return str
      },
      comment: '1:微信充值,2:支付宝充值,3:刷卡充值,4:现金充值,5:店内消费,6:商城消费,7:赛事门票,8:手动调整'
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
          app.model.Balance.belongsTo(app.model.Member)
        }
      }
    })
}
