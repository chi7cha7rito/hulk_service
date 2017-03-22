'use strict'

module.exports = app => {
  const { INTEGER, BOOLEAN, DECIMAL } = app.Sequelize
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
      comment: '1:线上价格,2:原价,3:高级会员价,4:豪客价,5:豪爵价,6:优惠价'
    },
    price: {
      defaultValue: 0,
      type: DECIMAL(10, 2)
    },
    points: {
      defaultValue: 0,
      type: DECIMAL(10, 2)
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
          app.model.MatchPrice.belongsTo(app.model.MatchConfig)
        }
      }
    })
}
