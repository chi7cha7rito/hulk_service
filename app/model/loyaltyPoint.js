'use strict'

module.exports = function (sequelize) {
  return sequelize.define('loyaltyPoint', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      comment: '1:获取,2:消费,3:正调整,4:负调整'
    },
    points: {
      type: sequelize.Sequelize.DECIMAL
    },
    isPositive: {
      type: sequelize.Sequelize.BOOLEAN,
      set: (val) => {
        let boo = type % 2 == 0 ? false : true
        this.setDataValue('isPositive', boo);
      },
      comment: 'true:正向积分,false:负向积分'
    },
    source: {
      type: sequelize.Sequelize.INTEGER,
      comment: '1:充值返现,2:比赛奖励,3:店内消费,4:商城消费,5:手工调整'
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
          models.loyaltyPoint.belongsTo(models.member)
        }
      }
    })
}
