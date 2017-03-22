'use strict'

module.exports = app => {
    const { STRING, INTEGER, DATE, BOOLEAN, TEXT } = app.Sequelize
    return app.model.define('match', {
        id: {
            type: INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        closingDatetime: {
            type: DATE,
            allowNull: false,
            comment: '报名截止时间'
        },
        openingDatetime: {
            type: DATE,
            allowNull: false,
            comment: '比赛开始时间'
        },
        // matchConfig: {
        //     type: INTEGER,
        //     allowNull: false,
        // },
        status: {
            type: INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: '1:开始,2:结束'
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
                    // app.model.Match.hasOne(app.model.MatchConfig, { as: 'MatchConfig', foreignKey: 'matchConfig' })
                    app.model.Match.belongsTo(app.model.MatchConfig)
                    app.model.Match.hasMany(app.model.Attendance)
                    app.model.Match.hasMany(app.model.Chip)
                }
            }
        })
}
