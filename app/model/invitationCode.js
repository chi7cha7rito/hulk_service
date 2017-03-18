'use strict'

module.exports =app => {
  const { STRING, INTEGER } = app.Sequelize
  return app.model.define('invitationCode', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    code: {
      type: STRING,
      primaryKey: true,
      allowNull: false
    },
    creator: {
      type: INTEGER,
      allowNull: false
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
