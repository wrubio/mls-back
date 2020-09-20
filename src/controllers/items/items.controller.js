const axios = require('axios')
const logger = console.log.bind(console, 'items-controller')

module.exports.getItems = async ({ query }, res) => {

  const url = `${process.env.ML_API_SERVICE_URL}/sites/MLA/search?q=${encodeURI(query.q)}`

  logger(`request sent to: ${url}`)

  try {
    const search = await axios.get(url)

    return res.status(search.status || 200).send(search.data)
  } catch (error) {
    logger(`error: ${error.response.status}`)
    logger(`error_description: ${error.response.data.error}`)
    logger(`error_message: ${error.response.data.message}`)

    return res.status(error.response.status || 500).send(error.response.data || error)
  }
}

module.exports.getItem = ({ params: { id } }, res) => {

  const itemUrl = `${process.env.ML_API_SERVICE_URL}/items/${id}`
  const descriptionUrl = `${process.env.ML_API_SERVICE_URL}/items/${id}/description`
  const promiseArray = [axios.get(itemUrl), axios.get(descriptionUrl)]

  logger(`request sent to: ${itemUrl}`)
  logger(`request sent to: ${descriptionUrl}`)

  axios.all(promiseArray.map(promise => promise.catch(error => {
    logger(`error: ${error.response.status}`)
    logger(`error_description: ${error.response.data.error}`)
    logger(`error_message: ${error.response.data.message}`)

    return res.status(error.response.status || 500).send(error.response.data || error)
  }))).then(axios.spread((item, description) => {
    return res.status(description.status || 200).send({ item: item.data, desciption: description.data })
  }))
}