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
      comment: '1:线上充值,2:消费,3:线下充值,4:提现,5:正调整,6:负调整'
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
      comment: '1:微信充值,2:支付宝充值,3:刷卡充值,4:现金充值,5:店内消费,6:商城消费,7:手动调整'
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
