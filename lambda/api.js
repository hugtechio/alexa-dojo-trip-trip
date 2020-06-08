const axios = require('axios')

const get = async (keyword) => {
    try {
        const result = await axios.get(`https://ja.wikipedia.org/wiki/${encodeURI(keyword)}`)
        return result.data
    } catch (error) {
        return {}
    }
}


module.exports = get