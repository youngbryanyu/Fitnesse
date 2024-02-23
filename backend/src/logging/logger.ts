/* Setup for logger */
import DailyRotateFile from 'winston-daily-rotate-file';
import winston from 'winston';
import { Environments } from '../features/common/constants';

/* Set up file transport and rotation */
const fileTransport = new DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH-MM',
  zippedArchive: true,
  maxSize: '20m' /* File size before rotating to a new file */,
  maxFiles: '14d' /* How long to keep files before auto-deleting */
});

/* Handle log rotation */
fileTransport.on('rotate', (oldFilename, newFilename) => {
  console.log(`Log file rotated: ${oldFilename} -> ${newFilename}`);
});

/* Set up console transport */
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
    winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  )
});

/* Set up logger configuration */
const level = process.env.NODE_ENV === Environments.Prod ? 'info' : 'debug';
const logger = winston.createLogger({
  level:
    level /* Minimum level of message to be logged, ranked: silly, debug, verbose, http, info, warn, error */,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    /* No default transports */
  ]
});

// logger.stream({ start: -1 }).on('log', (log) => {
//   process.stdout.write(log.message + '\n');
// });

/* Print logging errors */
logger.on('error', (error) => {
  console.error('Logging error:', error);
});

/* Enable file logging in non-test environments */
if (process.env.NODE_ENV !== Environments.Test) {
  logger.add(fileTransport);
}

/* Enable console logging in all environments */
logger.add(consoleTransport);

export default logger;
