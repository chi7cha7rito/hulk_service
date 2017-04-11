'use strict'

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize
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
      get: function () {
        let val = this.getDataValue('gender')
        let str = ''
        if (val == 0) str = '未知'
        if (val == 1) str = '男'
        if (val == 2) str = '女'
        return { val, name: str }
      },
      comment: '0:未知,1:男,2:女'
    },
    password: {
      type: STRING
    },
    roleType: {
      type: INTEGER,
      allowNull: false,
      get: function () {
        let val = this.getDataValue('roleType')
        let str = ''
        if (val == 1) str = '管理员'
        if (val == 2) str = '员工'
        if (val == 3) str = '会员'
        return { val, name: str }
      },
      comment: '1:管理员,2:员工,3:会员'
    },
    loginError: {
      type: INTEGER,
      defaultValue: 0
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
