import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import errors from './errors'

const app = express()

app.use(compression())
// parse body params and attache them to req.body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// secure apps by setting various HTTP headers
app.use(helmet())

app.get('/', (req, res) => {
  // throw new Error('Test Error')
  res.json({ message: 'Hello World!' })
})

app.use(
  errors.handler({
    pretty: process.env.NODE_ENV !== 'production',
  }),
)

export default app
