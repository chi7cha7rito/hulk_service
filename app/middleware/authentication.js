
module.exports = (app) => {
    return function* authentication(next) {
        try {
            //todo:md5加密
            const requestToken = this.headers["hulk_token"]
            const token = this.app.config["hulk_token"]
            this.logger.info(`Request Headers:${JSON.stringify(this.headers)}`)
            if (this.request.body) this.logger.info(`Request Body:${JSON.stringify(this.request.body)}`)
            if (requestToken !== token) {
                throw new Error("未受信任的请求")
            }
            yield next;
        } catch (err) {
            // 注意：自定义的错误统一处理函数捕捉到错误后也要 `app.emit('error', err, this)`
            // 框架会统一监听，并打印对应的错误日志
            this.app.emit('error', err, this);
            // 自定义错误时异常返回的格式
            this.body = {
                status: 0,
                message: err.message,
            };
        }
    };
};