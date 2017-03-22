'use strict';

module.exports = app => {
  class User extends app.Service {
    constructor(ctx) {
      super(ctx)
      this.User = this.app.model.User
      this.Helper = this.ctx.helper
    }

    /**
     * @description 查找用户
     * @param  {} {phoneNo
     * @param  {} idCardNo
     * @param  {} gender
     * @param  {} status
     * @param  {} pageIndex
     * @param  {} pageSize}
     */
    async findAll({ phoneNo, idCardNo, gender, status, pageIndex = 1, pageSize = 10 }) {
      let cond = {}
      let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
      if (phoneNo) {
        cond.phoneNo = {
          $like: phoneNo + '%'
        }
      }
      if (idCardNo) {
        cond.idCardNo = {
          $like: idCardNo + '%'
        }
      }
      if (gender) {
        cond.gender = gender
      }
      if (status) {
        cond.status = status
      }
      const result = await this.User.findAndCountAll({
        where: cond,
        offset: (index - 1) * size,
        limit: size
      })
      return result;
    }

    /**
     * @description 根据手机号查找非会员
     * @param  {} {phoneNo}
     */
    async findByPhoneNo({ phoneNo }) {
      const user = await this.User.findOne({
        where: { phoneNo: phoneNo, roleType: { $ne: 3 } },
      })
      return user;
    }

    /**
     * @description 新建用户
     * @param  {} {id
     * @param  {} phoneNo
     * @param  {} name
     * @param  {} idCardNo
     * @param  {} roleType
     * @param  {} gender
     * @param  {} status
     * @param  {} creator}
     */
    async update({ id, phoneNo, name, idCardNo, roleType, gender, status, creator }) {
      //手机号判重
      const phoneNoCount = await this.User.count({
        where: { phoneNo: phoneNo, id: { $ne: id } }
      })
      if (phoneNoCount > 0) throw new Error("手机号已经存在")

      //身份证判重
      const idCardNoCount = await this.User.count({
        where: { idCardNo: idCardNo, id: { $ne: id } }
      })
      if (idCardNoCount > 0) throw new Error("身份证号已经存在")

      return this.User.update({
        phoneNo,
        name,
        idCardNo,
        roleType,
        gender,
        status,
        creator
      }, { where: { id } })
    }

    /**
     * @description 新建拥有
     * @param  {} {phoneNo
     * @param  {} name
     * @param  {} idCardNo
     * @param  {} roleType
     * @param  {} gender
     * @param  {} status
     * @param  {} creator}
     */
    async create({ phoneNo, name, idCardNo, roleType, gender, status, creator }) {
      //手机号判重
      const phoneNoCount = await this.User.count({
        where: { phoneNo: phoneNo }
      })
      if (phoneNoCount > 0) throw new Error("手机号已经存在")

      //身份证判重
      const idCardNoCount = await this.User.count({
        where: { idCardNo: idCardNo }
      })
      if (idCardNoCount > 0) throw new Error("身份证号已经存在")

      return this.User.create({
        phoneNo,
        name,
        idCardNo,
        roleType,
        gender,
        status,
        creator
      })
    }
  }
  return User
}
