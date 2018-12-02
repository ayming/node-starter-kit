import express from 'express';
import compression from 'compression'
import bodyParser from 'body-parser'
import PrettyError from 'pretty-error'

const app = express()

app.use(compression())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

const pe = new PrettyError()
pe.skipNodeFiles()
pe.skipPackage('express')

app.use((err, req, res, next) => {
  process.stderr.write(pe.render(err))
  next()
})

export default app
