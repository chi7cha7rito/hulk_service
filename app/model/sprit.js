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
