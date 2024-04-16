// logger.js
import winston from 'winston'
import 'winston-daily-rotate-file'

const myFormat = winston.format.printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
})

const transport = new winston.transports.DailyRotateFile({
  filename: './log',
  datePattern: 'yyyy-MM-dd.',
  prepend: true,
  level: 'info'
})

const logger = winston.createLogger({
  format: winston.format.combine(
    winston.format.label({ label: 'APP_NODE_API_BCV' }),
    winston.format.timestamp(),
    myFormat
  ),
  transports: [
    transport
  ]
})


export default logger

