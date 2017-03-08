'use strict'

module.exports = appInfo => {
  const config = {}

  // should change to your own
  config.keys = appInfo.name + 'hulkclub'
  config.sequelize = {
    port: '3306',
    host: 'localhost',
    username: 'root',
    password: '1qaz!QAZ',
    database: 'hulk',
    dialect: 'mysql' // support: mysql, mariadb, postgres, mssql
  }
  return config
}
