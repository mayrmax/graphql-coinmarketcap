const express = require('express')
const graphqlHTTP = require('express-graphql')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const schema = require('./schema')

app.use('/graphql', cors(), bodyParser.json(), graphqlHTTP({
  schema,
  graphiql: true
}))

app.listen(3000, () => {
  console.log('App is listening on port 3000 ...')
})