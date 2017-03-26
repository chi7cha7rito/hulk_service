'use strict'

module.exports = app => {
    const { INTEGER, STRING } = app.Sequelize
    return app.model.define('coupon', {
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
                if (val == 1) str = '门票'
                return { val, name: str }
            },
            comment: '1:门票'
        },
        source: {
            type: INTEGER,
            allowNull: false,
            get: function () {
                let val = this.getDataValue('source')
                let str = ''
                if (val == 1) str = '签到'
                if (val == 2) str = '豪气'
                return { val, name: str }
            },
            comment: '1:签到,2:豪气'
        },
        remark: {
            type: STRING
        },
        status: {
            type: INTEGER,
            allowNull: false,
            comment: '1:未使用,2:已使用,3:删除'
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
                    app.model.Coupon.belongsTo(app.model.Member)
                }
            }
        })
}
