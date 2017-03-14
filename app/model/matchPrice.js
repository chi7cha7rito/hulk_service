'use strict'

module.exports = function (sequelize) {
  return sequelize.define('matchPrice', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      comment: '1:线上价格,2:线下价格,3:优惠价格'
    },
    price: {
      type: sequelize.Sequelize.DECIMAL
    },
    status: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1:启用,2:禁用,3:删除'
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
          models.matchPrice.belongsTo(models.match)
        }
      }
    })
}
