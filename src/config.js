module.exports.config = () => {
  process.env = {
    ...process.env,
    ml_api_service: process.env.ML_API_SERVICE_URL,
    port: process.env.PORT
  }
}