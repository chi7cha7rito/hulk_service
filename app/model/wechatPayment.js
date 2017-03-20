'use strict'

module.exports = app => {
  const { STRING, INTEGER, DECIMAL } = app.Sequelize
  return app.model.define('wechatPayment', {
    id: {
      type: INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    memberId: {
      type: INTEGER,
      allowNull: false,
    },
    appid: {
      type: STRING,
      allowNull: false,
    },
    body: {
      type: STRING,
      defaultValue: 1,
      comment: '商户附带参数'
    },
    mch_id: {
      type: STRING,
      allowNull: false,
      comment: '商户id'
    },
    nonce_str: {
      type: STRING,
      comment: '随机字符串'
    },
    notify_url: {
      type: STRING,
      comment: '微信回调url'
    },
    openid: {
      type: STRING,
      allowNull: false
    },
    out_trade_no: {
      type: STRING,
      allowNull: false,
      comment: '商户订单号'
    },
    spbill_create_ip: {
      type: STRING,
      comment: '发起支付的ip'
    },
    total_fee: {
      type: DECIMAL,
      allowNull: false,
      comment: '支付金额'
    },
    trade_type: {
      type: STRING,
      allowNull: false,
      comment: '支付类型'
    },
    transaction_id: {
      type: STRING,
      comment: '微信支付订单号'
    },
    time_end: {
      type: STRING,
      comment: '支付完成时间'
    },
    status: {
      type: INTEGER,
      allowNull: false,
      defaultValue: 1,
      comment: '1:创建,2:成功,3:失败'
    },
    creator: {
      type: INTEGER,
    },
    updator: {
      type: INTEGER
    }
  })
}
