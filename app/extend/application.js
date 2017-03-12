'use strict'
const _ = require('lodash')
const moment = require('moment')
module.exports = {
    get _() {
        return _
    },
    get moment() {
        return moment
    }
}
