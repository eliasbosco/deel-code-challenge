const { getCatchErrorMessage } = require('../helpers/logger')
const {
    findAllJobsByPaidAndContractStatusAndContractClientId,
    findAllJobsByPaidAndContractStatusAndContractContractorId,
    findOneJobPriceByIdAndByPaid,
    updateJobPaidAndPaymentDateById,
} = require('../repositories/jobs')

const { updateProfileBalanceById } = require('../repositories/profiles')

/**
 * Get all unpaid jobs for a user (either a client or contractor), for active contracts only.
 */
const jobsUnpaid = async (req, res) => {
    try {
        let jobs
        if (req.profile.type === 'client') {
            jobs = await findAllJobsByPaidAndContractStatusAndContractClientId(req.profile.id)
        } else {
            jobs = await findAllJobsByPaidAndContractStatusAndContractContractorId(req.profile.id)
        }

        if (!jobs || jobs.length === 0) {
            return res.status(404).end()
        }

        res.json(jobs)
    } catch (e) {
        getCatchErrorMessage(e, res)
        return res.end();
    }
}

/**
 * Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the
 * client's balance to the contractor balance.
 */
const jobsJobIdPay = async (req, res) => {
    try {
        if (req.profile.type !== 'client') {
            return res.status(401).send({ message: 'This endpoint is only accessible by clients' }).end()
        }

        const { jobId: id } = req.params
        const jobs = await findOneJobPriceByIdAndByPaid(id)

        if (!jobs) {
            const err = Error(`No such Job or Job is already paid`)
            err.status = 404;
            throw err;
        }

        if (req.profile.balance < jobs.price) {
            throw Error('Payment declined due to insufficient balance')
        }

        // Update Client balance
        const clientBalance = req.profile.balance - jobs.price;
        await updateProfileBalanceById(req.profile.id, clientBalance)

        // Update Contractor balance
        const contractorBalance = jobs.Contract.Contractor.balance + jobs.price;
        await updateProfileBalanceById(jobs.Contract.ContractorId, contractorBalance)

        // Update job to paid: true and paymentDate
        await updateJobPaidAndPaymentDateById(id)

        res.json({
            message: `Job #${id} updated successfully.
Client: ${req.profile.fullName} balance amount is now $${clientBalance}.
Contractor: ${jobs.dataValues.Contract.dataValues.Contractor.dataValues.fullName} balance amount is now $${contractorBalance}.`
        })
    } catch (e) {
        getCatchErrorMessage(e, res)
        return res.end();
    }
}

module.exports = {
    jobsUnpaid,
    jobsJobIdPay,
}
