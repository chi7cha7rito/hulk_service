module.exports = {
    ok(result) {
        return { status: 1, message: "", data: result }
    },
    err(message) {
        return { status: 0, message: message, data: null }
    },
    parsePage(pageIndex, pageSize) {
        let [index, size] = [1, 10]
        try {
            index = parseInt(pageIndex)
            size = parseInt(pageSize)
        } catch (error) {
        }
        return { index, size }
    }
}