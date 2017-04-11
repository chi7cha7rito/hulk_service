'use strict';
const md5 = require('md5')
module.exports = app => {
  class User extends app.Service {
    constructor(ctx) {
      super(ctx)
      this.User = this.app.model.User
      this.Helper = this.ctx.helper
      this.defaultPassword="123456";
    }

    /**
     * @description 查找用户
     * @param  {} {name
     * @param  {} phoneNo
     * @param  {} idCardNo
     * @param  {} gender
     * @param  {} status
     * @param  {} pageIndex
     * @param  {} pageSize}
     */
    async findAll({ name, phoneNo, idCardNo, gender, status, pageIndex = 1, pageSize = 10 }) {
      let cond = {}
      let { index, size } = this.Helper.parsePage(pageIndex, pageSize)
      if (name) {
        cond.name = {
          $like: '%' + name + '%'
        }
      }
      if (phoneNo) {
        cond.phoneNo = {
          $like: '%' + phoneNo + '%'
        }
      }
      if (idCardNo) {
        cond.idCardNo = {
          $like: '%' + idCardNo + '%'
        }
      }
      if (gender) {
        cond.gender = gender
      }
      if (status) {
        cond.status = status
      } else {
        cond.status = { $ne: 3 }
      }
      cond.roleType = { $ne: 3 }
      const result = await this.User.findAndCountAll({
        where: cond,
        attributes: { exclude: ['password'] },
        offset: (index - 1) * size,
        limit: size
      })
      return result;
    }

    /**
     * @description 根据手机号查找非会员
     * @param  {} {phoneNo,
     * @param  {} password}
     * }
     */
    async findByPhoneNo({ phoneNo, password }) {
      const user = await this.User.findOne({
        where: { phoneNo: phoneNo,roleType: { $ne: 3 } }  
      })

      if(user){
         let loginError=user.loginError;
         let status=user.status;
         if(status=="2"){
           throw new Error("账号已冻结，请联系管理员")
         }
         if(user.password!=md5(password)){
            loginError=loginError+1;

            if(loginError=="3"){
              let result= await this.User.update({
                  loginError: loginError,
                  status:2
              }, { where: { id: user.id } })
            }
            else{
              let result= await this.User.update({
                  loginError: loginError,
              }, { where: { id: user.id } })
            }
            
            throw new Error("密码错误")
         }
         else{
          let result= await this.User.update({
            loginError: 0,
            status:1
          }, { where: { id: user.id } })
          
          let tmpUser=JSON.parse(JSON.stringify(user))
          delete tmpUser.password;
          return tmpUser;
         }   
      }else{
          throw new Error("账号不存在")
      }
    }

    /**
    * @description 根据Id非会员
    * @param  {} {id}
    */
    async findById({ id }) {
      const user = await this.User.findOne({ where: { id }, attributes: { exclude: ['password'] } })
      return user;
    }

    /**
     * @description 更新用户
     * @param  {} {id
     * @param  {} phoneNo
     * @param  {} name
     * @param  {} idCardNo
     * @param  {} roleType
     * @param  {} gender
     * @param  {} status
     * @param  {} operator}
     */
    async update({ id, phoneNo, name, idCardNo, roleType, gender, status, operator }) {
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

      const result = await this.User.update({
        phoneNo,
        name,
        idCardNo,
        roleType,
        gender,
        status,
        updator: operator
      }, { where: { id } })
      return result
    }

    /**
     * @description 重置密码
     * @param  {} {phoneNo
     * @param  {} password
     * @param  {} comfirmPwd
     * @param  {} operator}
     */
    async resetPwd({ phoneNo, operator }) {
      const admin = await this.User.findOne({ where: { id: operator, roleType: 1 } })
      if (!admin) throw new Error("只有管理员能重置密码")
      const user = await this.User.findOne({ where: { phoneNo } })
      if (!user) throw new Error("用户不存在")
      const result = await this.User.update({
        password: md5(md5(this.defaultPassword)),
        status:1,
        loginError:0,
        updator: operator
      }, { where: { id: user.id } })
      return result
    }

    /**
     * @description 重置密码
     * @param  {} {id
     * @param  {} originalPwd
     * @param  {} newPwd
     * @param  {} comfirmPwd
     * @param  {} operator}
     */
    async editPwd({ id, originalPwd, newPwd, confirmPwd, operator }) {
      if(newPwd != confirmPwd) throw new Error("新密码与确认密码不一致")
      const user = await this.User.findOne({ where: { id ,password: md5(originalPwd)} })
      if (!user) throw new Error("用户不存在或原始密码不正确")
      const result = await this.User.update({
        password: md5(newPwd),
        updator: operator
      }, { where: { id } })
      return result
    }

    /**
     * @description 新建用户
     * @param  {} {phoneNo
     * @param  {} name
     * @param  {} idCardNo
     * @param  {} roleType
     * @param  {} gender
     * @param  {} status
     * @param  {} operator}
     */
    async create({ phoneNo, name, idCardNo, roleType, gender, status, operator }) {
      const admin = await this.User.findOne({ where: { id: operator, roleType: 1 } })
      if (!admin) throw new Error("只有管理员才能新建用户")
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

      const result = this.User.create({
        phoneNo,
        name,
        idCardNo,
        roleType,
        password: md5(md5(this.defaultPassword)),
        gender,
        status,
        creator: operator
      })

      return result
    }
  }
  return User
}
