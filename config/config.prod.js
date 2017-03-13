'use strict'

module.exports = appInfo => {
  const config = {}
  // should change to your own
  config.keys = appInfo.name + 'hulkclub'
  config.hulk_token = "abcd1234"
  config.sequelize = {
    port: '3306',
    host: '',
    username: 'root',
    password: 'hulk@2017',
    database: 'hulk',
    dialect: 'mysql' // support: mysql, mariadb, postgres, mssql
  }
  config.middleware = ['authentication', 'errorHandler']
  config.authentication = {
    enable: true
  }
  config.security = {
    csrf: {
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
    }
  }
  return config
}
