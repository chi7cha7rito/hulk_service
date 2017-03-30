'use strict';

module.exports = app => {

  /**
   * 报名api
   */
  app.post('/attendance/createOnline', 'attendance.createOnline')
  app.post('/attendance/createOffline', 'attendance.createOffline')
  app.post('/attendance/del', 'attendance.del')
  app.get('/attendance/findAttendances', 'attendance.findAttendances')
  app.get('/attendance/findRankingByMemberId', 'attendance.findRankingByMemberId')

  /**
   * 帐户api
   */
  app.post('/balance/create', 'balance.create')
  app.post('/balance/buyPoints', 'balance.buyPoints')
  app.post('/balance/wechatNotify', 'balance.wechatNotify')
  app.get('/balance/findEntries', 'balance.findEntries')
  app.get('/balance/totalByMemberId', 'balance.totalByMemberId')

  /**
   * 微信支付api
   */
  app.post('/wechatPayment/create', 'wechatPayment.create')
  app.post('/wechatPayment/notify', 'wechatPayment.notify')
  app.get('/wechatPayment/findEntry', 'wechatPayment.findEntry')

  /**
   * 充值返现设置api
   */
  app.post('/rechargeSetup/create', 'rechargeSetup.create')
  app.post('/rechargeSetup/update', 'rechargeSetup.update')
  app.get('/rechargeSetup/findAll', 'rechargeSetup.findAll')
  app.get('/rechargeSetup/findById', 'rechargeSetup.findById')
  app.get('/rechargeSetup/findMax', 'rechargeSetup.findMax')

  /**
   * 积分api
   */
  app.post('/point/create', 'loyaltyPoint.create')
  app.get('/point/findEntries', 'loyaltyPoint.findEntries')
  app.get('/point/totalByMemberId', 'loyaltyPoint.totalByMemberId')

  /**
   * 配置api
   */
  app.post('/match/create', 'match.create')
  app.post('/match/update', 'match.update')
  app.post('/match/changeStatus', 'match.changeStatus')
  app.get('/match/findMatches', 'match.findMatches')
  app.get('/match/findMatchById', 'match.findMatchById')

  /**
   * 赛事配置api
   */
  app.post('/matchConfig/create', 'matchConfig.create')
  app.post('/matchConfig/update', 'matchConfig.update')
  app.post('/matchConfig/changeStatus', 'matchConfig.changeStatus')
  app.get('/matchConfig/findMatchConfigs', 'matchConfig.findMatchConfigs')
  app.get('/matchConfig/findAll', 'matchConfig.findAll')
  app.get('/matchConfig/findMatchConfigById', 'matchConfig.findMatchConfigById')
  app.post('/matchConfig/edit', 'matchConfig.edit')

  /**
   * 赛事价格api
   */
  app.post('/matchPrice/create', 'matchPrice.create')
  app.post('/matchPrice/changeStatus', 'matchPrice.changeStatus')
  app.post('/matchPrice/update', 'matchPrice.update')
  app.get('/matchPrice/findAll', 'matchPrice.findAll')

  /**
   * 赛事奖励api
   */
  app.post('/matchReward/create', 'matchReward.create')
  app.post('/matchReward/changeStatus', 'matchReward.changeStatus')
  app.post('/matchReward/update', 'matchReward.update')
  app.get('/matchReward/findAll', 'matchReward.findAll')
  app.get('/matchReward/findAllActive', 'matchReward.findAllActive')

  /**
   * 赛事类型
   */
  app.post('/matchType/create', 'matchType.create')
  app.post('/matchType/changeStatus', 'matchType.changeStatus')
  app.post('/matchType/update', 'matchType.update')
  app.get('/matchType/findByPid', 'matchType.findByPid')

  /**
   * 会员api
   */
  app.post('/member/create', 'member.create')
  app.post('/member/update', 'member.update')
  app.get('/member/findByWechatOpenId', 'member.findByWechatOpenId')
  app.get('/member/findById', 'member.findById')
  app.get('/member/findTotal', 'member.findTotal')
  app.get('/member/findMembers', 'member.findMembers')
  app.get('/member/findMembersBalance', 'member.findMembersBalance')
  app.get('/member/findMembersPoints', 'member.findMembersPoints')

  /**
   * 会员等级设置api
   */
  app.post('/memberLevel/create', 'memberLevel.create')
  app.post('/memberLevel/update', 'memberLevel.update')
  app.get('/memberLevel/findAll', 'memberLevel.findAll')
  app.get('/memberLevel/findById', 'memberLevel.findById')

  /**
   * 签到api
   */
  app.post('/signIn/create', 'signIn.create')
  app.get('/signIn/signInStats', 'signIn.signInStats')

  /**
   * 筹码api
   */
  app.post('/chip/create', 'chip.create')

  /**
   * 微信token api
   */
  app.post('/wechatToken/create', 'wechatToken.create')
  app.post('/wechatToken/update', 'wechatToken.update')
  app.get('/wechatToken/findByOpenId', 'wechatToken.findByOpenId')

  /**
   * 短信api
   */
  app.post('/sms/create', 'sms.create')
  app.post('/sms/successful', 'sms.successful')
  app.post('/sms/failure', 'sms.failure')

  /**
   * 用户api
   */
  app.post('/user/create', 'user.create')
  app.post('/user/update', 'user.update')
  app.get('/user/findAll', 'user.findAll')
  app.get('/user/findByPhoneNo', 'user.findByPhoneNo')
  app.get('/user/findById', 'user.findById')

  /**
   * 豪气api
   */
  app.get('/sprit/spritRanking', 'sprit.spritRanking')

  /**
   * 优惠券api
   */
  app.post('/coupon/create', 'coupon.create')
  app.post('/coupon/update', 'coupon.update')
  app.get('/coupon/findAll', 'coupon.findAll')
};
