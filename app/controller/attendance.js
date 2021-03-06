'use strict';

module.exports = app => {
    class AttendanceController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.AttendanceSvr = this.service.attendance
        }

        /**
         * @description 线上报名参赛
         */
        async createOnline() {
            const result = await this.AttendanceSvr.createOnline(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 线下报名参赛
        */
        async createOffline() {
            const result = await this.AttendanceSvr.createOffline(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 取消参赛
         */
        async del() {
            const result = await this.AttendanceSvr.del(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 颁奖
        */
        async award() {
            const result = await this.AttendanceSvr.award(this.ctx.request.body)
            this.success(result)
        }

        /**
        * @description 确认参赛
        */
        async confirmJoin() {
            const result = await this.AttendanceSvr.confirmJoin(this.ctx.request.body)
            this.success(result)
        }

        /**
       * @description 发放奖励
       */
        async issueReward() {
            const result = await this.AttendanceSvr.issueReward(this.ctx.request.body)
            this.success(result)
        }

        /**
         * @description 根据matchId查找参赛者
         */
        async findAttendances() {
            const result = await this.AttendanceSvr.findAttendances(this.ctx.query)
            this.success(result)
        }

        /**
        * @description 获取参赛信息
        */
        async findAll() {
            const result = await this.AttendanceSvr.findAll(this.ctx.query)
            this.success(result)
        }

        /**
        * @description 获取参赛信息
        */
        async findResult() {
            const result = await this.AttendanceSvr.findResult(this.ctx.query)
            this.success(result)
        }

        /**
         * @description 根据memberId查询成绩
         */
        async findRankingByMemberId() {
            const result = await this.AttendanceSvr.findRankingByMemberId(this.ctx.query)
            this.success(result)
        }

    }
    return AttendanceController;
};
