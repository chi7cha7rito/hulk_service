'use strict'

module.exports = app => {
  const {  INTEGER, BOOLEAN, DECIMAL } = app.Sequelize
  return app.model.define('matchPrice', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    type: {
      type: INTEGER,
      allowNull: false,
      comment: '1:线上价格,2:线下价格,3:优惠价格'
    },
    price: {
      type: DECIMAL
    },
    status: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1:启用,2:禁用,3:删除'
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
          app.model.MatchPrice.belongsTo(app.model.Match)
        }
      }
    })
}
