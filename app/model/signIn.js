'use strict'

module.exports = app => {
  const { STRING, INTEGER} = app.Sequelize
  return app.model.define('signIn', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    comment: {
      type: STRING,
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
          app.model.SignIn.belongsTo(app.model.Member)
        }
      }
    })
}
