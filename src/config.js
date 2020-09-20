const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  ml_api_service: process.env.ML_API_SERVICE_URL,
  port: process.env.PORT
}