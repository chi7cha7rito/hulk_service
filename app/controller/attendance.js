'use strict';

module.exports = app => {
    class AttendanceController extends app.Controller {
        constructor(ctx) {
            super(ctx)
            this.AttendanceSvr = this.service.attendance
        }

        /**
         * @description 报名参赛
         */
        async create() {
            const result = await this.AttendanceSvr.create(this.ctx.request.body)
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
         * @description 根据matchId查找参赛者
         */
        async findAttendances() {
            const result = await this.AttendanceSvr.findAttendances(this.ctx.query)
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
