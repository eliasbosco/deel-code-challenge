const { logger, getCatchErrorMessage } = require('../helpers/logger')
const { updateProfileBalance } = require('../repositories/balances')
const { findOneProfileById } = require('../repositories/profiles')

/**
 * Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay.
 * (at the deposit moment)
 */
const balancesDepositUserId = async (req, res) => {
    try {
        const { userId: id } = req.params
        const { deposit } = req.body

        if (id === undefined) {
            const err = Error(`User not informed`)
            err.status = 404;
            throw err;
        }

        if (req.profile.type !== 'client') {
            const message = { message: 'This endpoint access is only granted to clients' }
            logger.error(message)
            return res.status(401).send(message).end()
        }

        await updateProfileBalance(id, deposit)
        const client = await findOneProfileById(id)

        const message = {
            message: `Deposit value of $${deposit} successfully sent to Client: ${client.dataValues.fullName}`
        }
        logger.info(message)
        res.json(message)
    } catch (e) {
        getCatchErrorMessage(e, res)
        return res.end();
    }
}

module.exports = {
    balancesDepositUserId,
}