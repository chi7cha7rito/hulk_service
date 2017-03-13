module.exports = {
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