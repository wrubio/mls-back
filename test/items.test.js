const app = require('../src/app')
const request = require('supertest')

describe('GET', () => {
  it ('should respond with a list of items in json format', (done) => {
    request(app)
      .get('/api/items?q=iphone')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        if (err) return done(err)
        done()
      })
  })

  it ('should respond with a json of type item', (done) => {
    request(app)
      .get('/api/items/MLA804577211')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(err => {
        if (err) return done(err)
        done()
      })
  })
})