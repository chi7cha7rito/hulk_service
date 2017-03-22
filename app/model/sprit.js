'use strict'

module.exports = app => {
    const { STRING, INTEGER, DECIMAL } = app.Sequelize
    return app.model.define('sprit', {
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
                if (val == 1) str = '参赛'
                if (val == 2) str = '重入'
                if (val == 3) str = '余额消费'
                return { val, name: str }
            },
            comment: '1:参赛,2:重入,3:余额消费,'
        },
        point: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false,
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
                    app.model.Sprit.belongsTo(app.model.Member)
                }
            }
        })
}
