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
        subType: {
            type: INTEGER,
            get: function () {
                let val = this.getDataValue('subType')
                let str = ''
                if (val == 1) str = '平日赛'
                if (val == 2) str = '周赛'
                if (val == 3) str = '月度会员杯'
                if (val == 4) str = '年度会员杯'
                return { val, name: str }
            },
            comment: '1:平日赛,2:周赛,3:月度会员杯,4:年度会员杯'
        },
        source: {
            type: INTEGER,
            allowNull: false,
            get: function () {
                let val = this.getDataValue('source')
                let str = ''
                if (val == 1) str = '签到'
                if (val == 2) str = '豪气排名'
                return { val, name: str }
            },
            comment: '1:签到,2:豪气排名'
        },
        remark: {
            type: STRING
        },
        status: {
            type: INTEGER,
            allowNull: false,
            comment: '1:未使用,2:已使用,3:已作废'
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
