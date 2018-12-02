import { createLogger, format, transports } from 'winston'

const { combine, timestamp, json } = format

const logger = createLogger({
  format: combine(timestamp(), json()),
  transports: [new transports.Console()],
  silent: process.env.NODE_ENV !== 'production',
})

export default logger
