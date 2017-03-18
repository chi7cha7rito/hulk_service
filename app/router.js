'use strict';

module.exports = app => {

  /**
   * 报名api
   */
  app.post('/attendance/createOnline', 'attendance.createOnline')
  app.post('/attendance/del', 'attendance.del')
  app.get('/attendance/findAttendances', 'attendance.findAttendances')
  app.get('/attendance/findRankingByMemberId', 'attendance.findRankingByMemberId')

  /**
   * 帐户api
   */
  app.post('/balance/create', 'balance.create')
  app.get('/balance/findEntries', 'balance.findEntries')
  app.get('/balance/totalByMemberId', 'balance.totalByMemberId')

  /**
   * 积分api
   */
  app.post('/point/create', 'loyaltyPoint.create')
  app.get('/point/findEntries', 'loyaltyPoint.findEntries')
  app.get('/point/totalByMemberId', 'loyaltyPoint.totalByMemberId')

  /**
   * 赛事api
   */
  app.post('/match/create', 'match.create')
  app.post('/match/update', 'match.update')
  app.post('/match/changeStatus', 'match.changeStatus')
  app.get('/match/findMatches', 'match.findMatches')

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

  /**
   * 签到api
   */
  app.post('/signIn/create', 'signIn.create')

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
};
