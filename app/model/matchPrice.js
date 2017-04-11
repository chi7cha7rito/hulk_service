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
      comment: 'memberLevel,99:优惠'
    },
    price: {
      defaultValue: 0,
      type: DECIMAL(10, 2)
    },
    points: {
      defaultValue: 0,
      type: DECIMAL(10, 2)
    },
    limitation: {
      type: INTEGER,
      defaultValue: 0
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
          app.model.MatchPrice.belongsTo(app.model.MemberLevel, { as: 'Type', foreignKey: 'type' })
          app.model.MatchPrice.belongsTo(app.model.MatchConfig)
        }
      }
    })
}
