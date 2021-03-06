/* eslint-disable no-console */

import env from 'dotenv-extended'
import app from './app'
// import redis from './redis'
import errors from './errors'

// Environment config with respect to the schema
env.load({
  errorOnMissing: true,
  errorOnExtra: true,
})
const port = process.env.PORT
const host = process.env.HOSTNAME

// Launch Node.js server
const server = app.listen(port, host, () => {
  console.log(`Node.js API server is listening on http://${host}:${port}/`)
})

// Shutdown Node.js app gracefully
function handleExit(options, error) {
  if (options.cleanup) {
    const actions = [
      server.close,
      // redis.quit,
    ]
    actions.forEach((close, i) => {
      try {
        close(() => {
          if (i === actions.length - 1) process.exit()
        })
      } catch (_) {
        if (i === actions.length - 1) process.exit()
      }
    })
  }
  if (error) errors.report(error)
  if (options.exit) process.exit()
}

process.on('exit', handleExit.bind(null, { cleanup: true }))
process.on('SIGINT', handleExit.bind(null, { exit: true }))
process.on('SIGTERM', handleExit.bind(null, { exit: true }))
process.on('uncaughtException', handleExit.bind(null, { exit: true }))
