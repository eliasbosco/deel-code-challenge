const { sequelize, Profile, Job, Contract } = require('../models')
const { findOneJobByPaidAndContractClientIdAndProfileType } = require('./jobs')

/**
 * Deposits money into the the the balance of a client, a client can't deposit more than 25% his total of jobs to pay.
 * (at the deposit moment)
 */
const updateProfileBalance = async (id, deposit) => {
    const trans = await sequelize.transaction();
    try {
        const jobs = await findOneJobByPaidAndContractClientIdAndProfileType(id)

        if (!jobs) {
            const err = Error(`No Jobs found`)
            err.status = 404;
            throw err;
        }

        if (deposit > jobs.dataValues.priceAmount * 0.25) {
            throw Error(`Client can't deposit more than 25% his total of jobs to pay`)
        }

        // Make the deposit to Client balance
        await Profile.update({ balance: jobs.Contract.Client.balance + deposit }, {
            where: {
                id,
            },
            transaction: trans,
        })

        await trans.commit();
    } catch (e) {
        trans.rollback()
        throw e
    }
}

module.exports = {
    updateProfileBalance,
}