const { Contract } = require('../models')

const findOneContractById = async (id) => {
    try {
        return await Contract.findOne({
            where: { id }
        })
    } catch (e) {
        throw e
    }
}

const findAllContractsByClientId = async (id) => {
    try {
        return await Contract.findAll({
            where: {
                ClientId: id,
            },
        })
    } catch (e) {
        throw e
    }
}

const findAllContractsByContractorId = async (id) => {
    try {
        return await Contract.findAll({
            where: {
                ContractorId: id,
            },
        })
    } catch (e) {
        throw e
    }
}

module.exports = {
    findOneContractById,
    findAllContractsByClientId,
    findAllContractsByContractorId,
}
