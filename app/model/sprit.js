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
                if (val == 4) str = '赛事奖励'
                if (val == 5) str = '负调整'
                if (val == 6) str = '正调整'
                return { val, name: str }
            },
            comment: '1:参赛,2:重入,3:余额消费,4:赛事奖励,5:负调整,6:正调整'
        },
        point: {
            type: DECIMAL(10, 2),
            defaultValue: 0,
            allowNull: false,
        },
        sourceNo: {
            type: STRING,
            comment: '参考号'
        },
        creator: {
            type: INTEGER,
        },
        remark: {
            type: STRING,
            comment: '操作备注'
        },
        status:{
            type: INTEGER,
            defaultValue:1,
            comment: '0:无效,1:有效'
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
