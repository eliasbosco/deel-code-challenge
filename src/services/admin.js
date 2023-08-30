const adminRep = require('../repositories/admin')
const logger = require('../helpers/logger')

/**
 * GET /admin/best-profession?start=<date>&end=<date>
 * Returns the profession that earned the most money (sum of jobs paid) for any contactor that worked in the query time
 * range.
 */
const adminBestProfession = async (req, res) => {
    try {
        let { start, end } = req.query

        let jobs = await adminRep.findAllJobsByClientsProfessionsAndPaymentDate(start, end)

        if (!jobs) {
            const err = Error(`No Jobs found`)
            err.status = 404;
            throw err;
        }

        res.json(jobs)
    } catch (e) {
        logger.getCatchErrorMessage(e, res)
        return res.end();
    }
}

/**
 * GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>
 * Returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied,
 * default limit is 2.
 */
const adminBestClients = async (req, res) => {
    try {
        let { start, end, limit } = req.query

        let jobs = await adminRep.findAllJobsByPaidNull(start, end, limit)

        if (!jobs) {
            const err = Error(`No Jobs found`)
            err.status = 404;
            throw err;
        }

        res.json(jobs)
    } catch (e) {
        logger.getCatchErrorMessage(e, res)
        return res.end();
    }
}

module.exports = {
    adminBestProfession,
    adminBestClients,
}
