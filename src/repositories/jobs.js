const { sequelize, Profile, Job, Contract } = require('../models')

/**
 * Get all unpaid jobs for a user (either a client or contractor), for active contracts only.
 */
const findAllJobsByPaidAndContractStatusAndContractClientId = async (
    clientId, status = 'in_progress', paid = null
) => {
    try {
        return await Job.findAll({
            where: {
                paid,
            },
            include: {
                model: Contract,
                where: {
                    status,
                    ClientId: clientId,
                },
            }
        })
    } catch (e) {
        throw e
    }
}

const findAllJobsByPaidAndContractStatusAndContractContractorId = async (
    contractorId, status = 'in_progress', paid = null
) => {
    try {
        // Active contracts only
        return await Job.findAll({
            where: {
                paid,
            },
            include: {
                model: Contract,
                where: {
                    status,
                    ContractorId: contractorId,
                },
            }
        })
    } catch (e) {
        throw e
    }
}

const findOneJobByPaidAndContractClientIdAndProfileType = async (clientId, paid = null, type = 'client') => {
    try {
        return await Job.findOne({
            attributes: [[sequelize.fn('sum', sequelize.col('price')), 'priceAmount']],
            where: {
                paid,
            },
            include: [
                {
                    model: Contract,
                    as: 'Contract',
                    ClientId: clientId,
                    include: [
                        {
                            attributes: ['balance'],
                            model: Profile,
                            as: 'Client',
                            required: true,
                            where: {
                                type
                            },
                        },
                    ],
                },
            ],
        })
    } catch (e) {
        throw e
    }
}

const findOneJobPriceByIdAndByPaid = async (id, paid = null) => {
    try {
        return await Job.findOne({
            attributes: ['price'],
            where: {
                id,
                paid,
            },
            include: [{
                attributes: ['ContractorId'],
                model: Contract,
                include: [
                    {
                        attributes: ['balance'],
                        model: Profile,
                        as: 'Client',
                        required: true,
                    },
                    {
                        attributes: ['balance', [sequelize.literal("`Contract->Contractor`.`firstName` || ' ' || `Contract->Contractor`.`lastName`"), 'fullName']],
                        model: Profile,
                        as: 'Contractor',
                        required: true,
                    }
                ]
            }]
        })
    } catch (e) {
        throw e
    }
}

/**
 * Pay for a job, a client can only pay if his balance >= the amount to pay. The amount should be moved from the
 * client's balance to the contractor balance.
 */
const updateJobPaidAndPaymentDateById = async (id, paid = true, paymentDate = new Date()) => {
    const trans = await sequelize.transaction();
    try {
        await Job.update({ paid, paymentDate }, {
            where: {
                id,
            },
            transaction: trans,
        })

        await trans.commit();
    } catch (e) {
        await trans.rollback()
        throw e
    }
}

module.exports = {
    findAllJobsByPaidAndContractStatusAndContractClientId,
    findAllJobsByPaidAndContractStatusAndContractContractorId,
    findOneJobByPaidAndContractClientIdAndProfileType,
    findOneJobPriceByIdAndByPaid,
    updateJobPaidAndPaymentDateById,
}
