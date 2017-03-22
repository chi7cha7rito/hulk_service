'use strict'

module.exports = app => {
    const { INTEGER, DECIMAL, STRING } = app.Sequelize
    return app.model.define('chip', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        unitPrice: {
            type: DECIMAL(10, 2),
            defaultValue: 0
        },
        quantity: {
            type: DECIMAL(10, 2),
            defaultValue: 0
        },
        payType: {
            type: INTEGER,
            allowNull: false,
            comment: '1:余额,2:积分'
        },
        payAmount: {
            type: DECIMAL(10, 2),
            defaultValue: 0
        },
        remark: {
            type: STRING
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
                    app.model.Chip.belongsTo(app.model.Member)
                    app.model.Chip.belongsTo(app.model.Match)
                }
            }
        })
}
