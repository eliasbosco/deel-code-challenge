const { createLogger, format, transports } = require("winston")

const logLevels = {
    fatal: 0,
    error: 1,
    warn: 2,
    info: 3,
    debug: 4,
    trace: 5,
}

const logger = createLogger({
    levels: logLevels,
    transports: [new transports.Console()],
})

const getCatchErrorMessage = (e, res) => {
    logger.error(e)
    res.status(e?.status || 500).send({ message: e.message || `There's a unexpected error, please contact support` })
}

module.exports = {
    logger,
    getCatchErrorMessage,
}