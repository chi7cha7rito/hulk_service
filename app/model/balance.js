'use strict'

module.exports = function (sequelize) {
  return sequelize.define('balance', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      comment: '1:线上充值,2:消费,3:线下充值,4:提现,5:正调整,6:负调整'
    },
    isPositive: {
      type: sequelize.Sequelize.BOOLEAN,
      set: (val) => {
        let boo = type % 2 == 0 ? false : true
        this.setDataValue('isPositive', boo);
      },
      comment: 'true:正向金额,false:负向金额'
    },
    amount: {
      type: sequelize.Sequelize.DECIMAL
    },
    source: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      comment: '1:微信充值,2:支付宝充值,3:刷卡充值,4:现金充值,5:店内消费,6:商城消费,7:手动调整'
    },
    sourceNo: {
      type: sequelize.Sequelize.STRING,
      comment: '参考号'
    },
    remark: {
      type: sequelize.Sequelize.STRING,
      comment: '操作备注'
    },
    status: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      comment: '1:正常,2:冻结,3:失败'
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
          models.balance.belongsTo(models.member)
        }
      }
    })
}
