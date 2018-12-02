import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import errors from './errors'

const app = express()

app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

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
