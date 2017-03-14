'use strict';

module.exports = app => {
  app.get('/', 'home.index')
  app.get('/user/create', 'user.create')
  app.get('/user/findUsers', 'user.findUsers')
  app.get('/user/findByPhoneNo', 'user.findByPhoneNo')

  /**
   * 会员api
   */
  app.post('/api/member/create', 'member.create')
  app.get('/api/member/findByWechatOpenId', 'member.findByWechatOpenId')
  /**
   * 签到api
   */
  app.post('/api/signIn/create', 'signIn.create')
  /**
   * 帐户api
   */
  app.post('/api/balance/create', 'balance.create')
  app.get('/api/balance/findEntriesByMemberId', 'balance.findEntriesByMemberId')
  /**
   * 积分api
   */
  app.post('/api/point/create', 'loyaltyPoint.create')
  app.get('/api/point/findEntriesByMemberId', 'loyaltyPoint.findEntriesByMemberId')
  /**
   * 赛事api
   */
  app.post('/api/match/create', 'match.create')
  app.get('/api/match/findMatches', 'match.findMatches')
  /**
   * 赛事价格api
   */
  app.post('/api/match/createPrice', 'match.createPrice')
  app.get('/api/match/findMatchPrice', 'match.findMatchPrice')
  /**
   * 赛事奖励api
   */
  app.post('/api/match/createReward', 'match.createReward')
  app.get('/api/match/findMatchRewards', 'match.findMatchRewards')
  /**
   * 赛事参与api
   */
  app.post('/api/match/attend', 'match.attend')
  app.get('/api/match/findAttendances', 'match.findAttendances')
  /**
   * 战绩api
   */
  app.get('/api/match/findRankingByMemberId', 'match.findRankingByMemberId')
  /**
   * 微信token api
   */
  app.post('/api/wechatToken/create', 'wechatToken.create')
  app.get('/api/wechatToken/findByOpenId', 'wechatToken.findByOpenId')
};
