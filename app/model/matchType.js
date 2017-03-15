'use strict'

module.exports = function (sequelize) {
    return sequelize.define('matchType', {
        id: {
            type: sequelize.Sequelize.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        pid: {
            type: sequelize.Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0
        },
        name: {
            type: sequelize.Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: sequelize.Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
            comment: '1:正常,2:禁用'
        }
    }, {
            updatedAt: false,
            classMethods: {
                associate(models) {
                    models.matchType.hasMany(models.match,{as:'Type',foreignKey:'type'})
                    models.matchType.hasMany(models.match,{as:'SubType',foreignKey:'subType'})
                }
            }
        })
}
