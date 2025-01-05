import log4js from 'log4js'
import { logLevel } from '../const'

const logger = log4js.getLogger()

logger.level = logLevel

logger.info('logLevel:', logLevel)

export default logger
