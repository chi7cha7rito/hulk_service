'use strict'

module.exports = appInfo => {
  const config = {}

  // should change to your own
  config.keys = appInfo.name + 'hulkclub'
  config.sequelize = {
    port: '3306',
    host: '115.159.94.198',
    username: 'root',
    password: 'hulk@2017',
    database: 'hulk',
    dialect: 'mysql' // support: mysql, mariadb, postgres, mssql
  }
  config.security = {
    csrf: {
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    }
  }
  return config
}
