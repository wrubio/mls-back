const axios = require('axios')
const logger = console.log.bind(console, 'items-controller')

module.exports.getItems = async (req, res) => {
  const limit = 4
  const q = encodeURI(req.query.q)
  const url = `${process.env.ML_API_SERVICE_URL}/sites/MLA/search?q=${q}&limit=${limit}`

  logger(`request sent to: ${url}`)

  try {
    const search = await axios.get(url)
    const { results, filters } = getProxy(search.data)
    const categories = filters.length ? createCategories(filters) : [req.query.q]
    const items = results.length ? createItemsArray(results) : []
    const result = {
      author: {
        name: req.headers.name || 'wilmer',
        lastname: req.headers.lastname || 'rubio',
      },
      categories,
      items,
    }

    return res.status(200).send(result)
  } catch (error) {
    logger(`error: ${error.response.status}`)
    logger(`error_description: ${error.response.data.error}`)
    logger(`error_message: ${error.response.data.message}`)

    return res.status(error.response.status || 500).send(error.response.data || error)
  }
}

module.exports.getItem = (req, res) => {
  const { params: { id } } = req
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
    const { id, title, price, currency_id, sold_quantity, pictures: [{ url }], condition, shipping: { free_shipping }} =  item.data
    const { plain_text } = description.data
    const result = {
      author: {
        name: req.headers.name || 'wilmer',
        lastname: req.headers.lastname || 'rubio',
      },
      item: {
        id,
        title,
        price: {
          currency: currency_id,
          amount: price,
          decimals: 2
        },
        picture: url,
        condition,
        free_shipping,
        sold_quantity,
        description: plain_text
      }
    }

    return res.status(description.status || 200).send(result)
  }))
}

function getProxy(obj) {
  return new Proxy(obj, {
    get: function(obj, prop) {
      if ( prop in obj && obj[prop].length) {

        return obj[prop]
      } else {
        return []
      }
    }
  })
}

function createCategories(filter) {
  return filter.reduce((acc, curr) => {
    if (curr.values && curr.values.path_from_root) {
      if (curr.values.path_from_root.length) {
        acc.push(curr.values.path_from_root.map(category => category.name).join())
      } else {
        acc.push(curr.values.name)
      }
    } else {
      acc.push(curr.values[0].name)
    }

    return acc
  }, [])
}

function createItemsArray(items) {
  return items.reduce((acc, curr, i) => {
    acc[i] = {
      id: curr.id,
      title: curr.title,
      price: {
        currency: curr.currency_id,
        amount: curr.price,
        decimals: 2
      },
      picture: curr.thumbnail,
      condition: curr.condition,
      free_shipping: curr.shipping.free_shipping
    }

    return acc
  }, [])
}