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
            comment: '1:门票'
        },
        source: {
            type: INTEGER,
            allowNull: false,
            comment: '1:签到'
        },
        remark: {
            type: STRING
        },
        status: {
            type: INTEGER,
            allowNull: false,
            comment: '1:未使用,2:已使用'
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
