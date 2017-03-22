'use strict'

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize
  return app.model.define('member', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    cardNo: {
      type: STRING,
      allowNull: false,
      comment: '会员卡号（默认手机号）'
    },
    status: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1:正常,2:冻结,3:删除'
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
          app.model.Member.belongsTo(app.model.User)
          app.model.Member.belongsTo(app.model.MemberLevel)
          app.model.Member.hasOne(app.model.Wechat)
          app.model.Member.hasMany(app.model.LoyaltyPoint)
          app.model.Member.hasMany(app.model.Balance)
          app.model.Member.hasMany(app.model.SignIn)
          app.model.Member.hasMany(app.model.InvitationCode)
          app.model.Member.hasMany(app.model.Attendance)
          app.model.Member.hasMany(app.model.Chip)
          app.model.Member.hasMany(app.model.Sprit)
        }
      }
    })
}
