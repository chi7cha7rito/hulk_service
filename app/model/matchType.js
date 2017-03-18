'use strict'

module.exports = app => {
    const { STRING, INTEGER } = app.Sequelize
    return app.model.define('matchType', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        pid: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        name: {
            type: STRING,
            allowNull: false,
        },
        status: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: '1:正常,2:禁用'
        }
    }, {
            updatedAt: false,
            classMethods: {
                associate() {
                    app.model.MatchType.hasMany(app.model.Match, { as: 'Type', foreignKey: 'type' })
                    app.model.MatchType.hasMany(app.model.Match, { as: 'SubType', foreignKey: 'subType' })
                }
            }
        })
}
