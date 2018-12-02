import express from 'express'
import compression from 'compression'
import bodyParser from 'body-parser'
import helmet from 'helmet'
import cors from 'cors'
import httpStatus from 'http-status'
import expressWinston from 'express-winston'
import PrettyError from 'pretty-error'
import { NotFoundError } from './errors'
import winstonInstance from './utils/logger'

const app = express()

app.use(compression())
// parse body params and attache them to req.body
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// secure apps by setting various HTTP headers
app.use(helmet())

// enable CORS - Cross Origin Resource Sharing
app.use(cors())

// enable detailed API logging
app.use(
  expressWinston.logger({
    winstonInstance,
    meta: true, // optional: log meta data about request (defaults to true)
    msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    colorStatus: true, // Color the status code (default green, 3XX cyan, 4XX yellow, 5XX red).
  }),
)

app.get('/', (req, res) => {
  // throw new Error('Test Error')
  res.json({ message: 'Hello World!' })
})

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new NotFoundError()
  return next(err)
})

app.use(
  expressWinston.errorLogger({
    winstonInstance,
  }),
)

if (process.env.NODE_ENV !== 'production') {
  // Express error handler middleware
  const pe = new PrettyError()
  pe.skipNodeFiles()
  pe.skipPackage('express')
  app.use((err, req, res, next) => {
    process.stderr.write(pe.render(err))
    next(err)
  })

  // send stacktrace as response
  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    const status = err.code || 500
    res.status(status).json({
      message: httpStatus[status],
      stack: err.stack.split('\n'),
    })
  })
}

export default app
