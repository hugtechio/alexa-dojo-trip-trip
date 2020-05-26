const axios = require('axios')

const get = async (keyword) => {
    const result = await axios.get(`https://ja.wikipedia.org/wiki/${encodeURI(keyword)}`)
    return result.data
}


module.exports = get