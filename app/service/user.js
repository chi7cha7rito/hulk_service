'use strict';

module.exports = app => {
  class User extends app.Service {
    async findUsers({ phoneNo, idCardNo, gender, status, pageIndex, pageSize }) {
      const user = await this.ctx.model.User.findAndCountAll({
        where: {
          phoneNo: {
            $like: phoneNo + '%'
          },
          idCardNo: {
            $like: idCardNo + '%'
          },
          gender: gender,
          status: status
        },
        offset: 0,
        limit: 20
      })
      return user;
    }
    async findByPhoneNo(phoneNo) {
      const user = await this.ctx.model.User.findOne({
        where: { phoneNo: phoneNo },
        include: [{
          model: this.ctx.model.member,
          include: [{
            model: this.ctx.model.invitationCode,
            where: { code: { $like: "%ab%" } }
          }]
        }]
      })
      return user;
    }
    async create(userParam) {
      // const user = await this.ctx.model.user.create({ phoneNo: '18912341234', idCardNo: '310115198709091010', gender: 1, status: 1, creator: 1 })
      // return user;
      let classSelf = this
      return classSelf.ctx.app.model.transaction(function (t) {
        return classSelf.ctx.model.User.create({
          phoneNo: '18912341234',
          idCardNo: '310115198709091010',
          gender: 1,
          status: 1,
          creator: 1
        }, { transaction: t }).then(function (user) {
          return classSelf.ctx.model.Member.create({
            cardNo: "777",
            level: 2,
            status: 1,
            userId: user.id,
            creator: 1
          }, { transaction: t }).then(function (member) {
            return member
          })
        });
      });
    }
  }
  return User;
};