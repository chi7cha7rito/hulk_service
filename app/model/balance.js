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
      allowNull: false
    },
    amount: {
      type: sequelize.Sequelize.DECIMAL
    },
    source: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false
    },
    sourceNo: {
      type: sequelize.Sequelize.STRING,
      allowNull: false
    },
    remark: {
      type: sequelize.Sequelize.STRING,
      allowNull: false
    },
    status: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false
    },
    creator: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false
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
