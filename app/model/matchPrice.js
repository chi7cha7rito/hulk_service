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
      allowNull: false
    },
    price: {
      type: sequelize.Sequelize.DECIMAL
    },
    status: {
      type: sequelize.Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1
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
          models.matchPrice.belongsTo(models.match)
        }
      }
    })
}
