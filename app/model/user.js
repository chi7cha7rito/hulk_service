'use strict'

module.exports =  app => {
  const { STRING, INTEGER} = app.Sequelize
  return app.model.define('user', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    phoneNo: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: '手机号码（唯一）'
    },
    name: {
      type: STRING,
      allowNull: false
    },
    idCardNo: {
      type: STRING,
      allowNull: false,
      unique: true,
      comment: '身份证号（唯一）'
    },
    gender: {
      type: INTEGER,
      defaultValue: 0,
      comment: '0:未知,1:男,2:女'
    },
    roleType: {
      type: INTEGER,
      allowNull: false,
      comment:'1:管理员,2:员工,3:会员'
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
          app.model.User.hasOne(app.model.Member)
        }
      }
    })
}
