'use strict';

module.exports = app => {

  /**
   * 报名api
   */
  app.post('/attendance/createOnline', 'attendance.createOnline')
  app.post('/attendance/createOffline', 'attendance.createOffline')
  app.post('/attendance/del', 'attendance.del')
  app.post('/attendance/award', 'attendance.award')
  app.post('/attendance/confirmJoin', 'attendance.confirmJoin')
  app.post('/attendance/issueReward', 'attendance.issueReward')
  app.get('/attendance/findAttendances', 'attendance.findAttendances')
  app.get('/attendance/findAll', 'attendance.findAll')
  app.get('/attendance/findResult', 'attendance.findResult')
  app.get('/attendance/findRankingByMemberId', 'attendance.findRankingByMemberId')

  /**
   * 帐户api
   */
  app.post('/balance/increase', 'balance.increase')
  app.post('/balance/decrease', 'balance.decrease')
  app.post('/balance/buyPoints', 'balance.buyPoints')
  app.post('/balance/wechatNotify', 'balance.wechatNotify')
  app.get('/balance/findEntries', 'balance.findEntries')
  app.get('/balance/findAll', 'balance.findAll')
  app.get('/balance/totalByMemberId', 'balance.totalByMemberId')
  app.get('/balance/totalByPhoneNo', 'balance.totalByPhoneNo')

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
  app.post('/point/decrease', 'loyaltyPoint.decrease')
  app.post('/point/increase', 'loyaltyPoint.increase')
  app.get('/point/findEntries', 'loyaltyPoint.findEntries')
  app.get('/point/findAll', 'loyaltyPoint.findAll')
  app.get('/point/totalByMemberId', 'loyaltyPoint.totalByMemberId')
  app.get('/point/totalByPhoneNo', 'loyaltyPoint.totalByPhoneNo')

  /**
   * 赛事api
   */
  app.post('/match/create', 'match.create')
  app.post('/match/update', 'match.update')
  app.post('/match/changeStatus', 'match.changeStatus')
  app.get('/match/findMatches', 'match.findMatches')
  app.get('/match/findAvailable', 'match.findAvailable')
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
  app.post('/matchConfig/add', 'matchConfig.add')

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
  app.get('/member/findAccountInfo', 'member.findAccountInfo')
  app.get('/member/findAllMembers', 'member.findAllMembers')


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
  app.get('/chip/matchChipStats', 'chip.matchChipStats')
  app.get('/chip/findAll', 'chip.findAll')

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
  app.post('/user/resetPwd', 'user.resetPwd')
  app.post('/user/editPwd', 'user.editPwd')
  app.get('/user/findAll', 'user.findAll')
  app.get('/user/findByPhoneNo', 'user.findByPhoneNo')
  app.get('/user/findById', 'user.findById')

  /**
   * 豪气api
   */
  app.get('/sprit/spritRanking', 'sprit.spritRanking')
  app.get('/sprit/totalByMemberId', 'sprit.totalByMemberId')
  app.post('/sprit/adjust','sprit.adjust')
  app.get('/sprit/list','sprit.list')

  /**
   * 优惠券api
   */
  app.post('/coupon/create', 'coupon.create')
  app.post('/coupon/update', 'coupon.update')
  app.get('/coupon/findAll', 'coupon.findAll')
};
