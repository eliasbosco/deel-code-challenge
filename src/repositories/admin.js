const { sequelize, Profile, Job, Contract } = require('../models')
const { Op } = require('sequelize')

const findAllJobsByClientsProfessionsAndPaymentDate = async (start, end) => {
    try {
        // In case start is not provided, set start to 30 days ago
        if (start === undefined) {
            start = new Date();
            start.setDate(start.getDate() - 30)
        }
        end = end === undefined ? new Date() : end

        let jobs = await Job.findAll({
            attributes: [[sequelize.fn('sum', sequelize.col('price')), 'paid']],
            where: {
                paid: {
                    [Op.ne]: null
                },
                paymentDate: {
                    [Op.between]: [start, end],
                }
            },
            include: [
                {
                    attributes: ['id'],
                    model: Contract,
                    as: 'Contract',
                    include: [
                        {
                            attributes: [
                                'profession',
                            ],
                            model: Profile,
                            as: 'Contractor',
                            required: true,
                            where: {
                                type: 'contractor'
                            },
                        },
                    ],
                },
            ],
            order: [
                ['paid', 'DESC'],
            ],
            group: [
                'profession'
            ]
        })

        if (jobs) {
            // Workaround for fetching only required columns
            jobs = jobs.map((row) => {
                row.dataValues.profession = row.dataValues.Contract.dataValues.Contractor.dataValues.profession
                delete row.dataValues.Contract
                return row
            });
        }

        return jobs
    } catch (e) {
        throw e
    }
}

/**
 * GET /admin/best-clients?start=<date>&end=<date>&limit=<integer>
 * Returns the clients the paid the most for jobs in the query time period. limit query parameter should be applied,
 * default limit is 2.
 */
const findAllJobsByPaidNull = async (start, end, limit) => {
    try {

        // In case start is not provided, set start to 30 days ago
        if (start === undefined) {
            start = new Date();
            start.setDate(start.getDate() - 30)
        }
        end = end === undefined ? new Date() : Date.parse(end)
        limit = limit === undefined ? 2 : limit


        let jobs = await Job.findAndCountAll({
            attributes: [[sequelize.fn('sum', sequelize.col('price')), 'paid']],
            where: {
                paid: {
                    [Op.ne]: null
                },
                paymentDate: {
                    [Op.between]: [start, end],
                }
            },
            include: [
                {
                    attributes: ['id'],
                    model: Contract,
                    as: 'Contract',
                    required: true,
                    include: [
                        {
                            attributes: [
                                'id',
                                [sequelize.literal("`Contract->Client`.`firstName` || ' ' || `Contract->Client`.`lastName`"), 'fullName']
                            ],
                            model: Profile,
                            as: 'Client',
                            required: true,
                            where: {
                                type: 'client'
                            },
                        },
                    ],
                },
            ],
            order: [
                ['paid', 'DESC'],
            ],
            group: [
                sequelize.literal("`Contract->Client`.`id`"),
            ],
            offset: 0,
            limit,
        })

        if (jobs) {
            // Workaround for fetching only required columns
            jobs.rows = jobs.rows.map((row) => {
                row.dataValues.id = row.dataValues.Contract.dataValues.Client.dataValues.id
                row.dataValues.fullName = row.dataValues.Contract.dataValues.Client.dataValues.fullName
                delete row.dataValues.Contract
                return row
            });
            delete jobs.count
            jobs = [ ...jobs.rows ]
        }

        return jobs
    } catch (e) {
        throw e
    }
}

module.exports = {
    findAllJobsByClientsProfessionsAndPaymentDate,
    findAllJobsByPaidNull,
}
