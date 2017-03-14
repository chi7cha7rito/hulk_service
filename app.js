// app.js
module.exports = app => {
  //CustomController
  class CustomController extends app.Controller {
    get user() {
      return this.ctx.session.user;
    }
    success(data) {
      this.ctx.body = {
        status: 1,
        message: "",
        data,
      };
    }
    error(message, data) {
      this.ctx.body = {
        status: 0,
        message,
        data
      }
    }
  }
  app.Controller = CustomController
  app.beforeStart(function* () {
    // 应用会等待这个函数执行完成才启动
    app.sequelize.sync({force:true})
    // app.sequelize.sync()
  })
}
