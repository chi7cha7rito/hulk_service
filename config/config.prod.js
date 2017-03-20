'use strict'

module.exports = appInfo => {
  const config = {}
  // should change to your own
  config.keys = appInfo.name + 'hulkclub'

  // service调用token
  config.hulk_token = "hulk_club_20170312"

  // 数据库配置
  config.sequelize = {
    port: '3306',
    host: '115.159.94.198',
    username: 'root',
    password: 'hulk@2017',
    database: 'hulk',
    dialect: 'mysql' // support: mysql, mariadb, postgres, mssql
  }

  // 微信token过期时间配置,6000秒
  config.expires = 6000

  // 中间件配置
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

