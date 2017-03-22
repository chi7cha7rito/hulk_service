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
      get: function () {
        let val = this.getDataValue('type')
        let str = ''
        if (val == 1) str = '线上价格'
        if (val == 2) str = '原价'
        if (val == 3) str = '高级会员价'
        if (val == 4) str = '豪客价'
        if (val == 5) str = '豪爵价'
        if (val == 6) str = '优惠价'
        return { val, name: str }
      },
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
