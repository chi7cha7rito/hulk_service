'use strict'

module.exports = function (sequelize) {
  return sequelize.define('signIn', {
    id: {
      type: sequelize.Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    comment: {
      type: sequelize.Sequelize.STRING,
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
          models.signIn.belongsTo(models.member)
        }
      }
    })
}
