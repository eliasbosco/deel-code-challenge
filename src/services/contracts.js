const { getCatchErrorMessage } = require('../helpers/logger')
const {
    findOneContractById,
    findAllContractsByClientId,
    findAllContractsByContractorId
} = require('../repositories/contracts')

/**
 * Return the contract only if it belongs to the profile calling
 */
const contractsId = async (req, res) => {
    try {
        const { id } = req.params
        const contract = await findOneContractById(id, req.profile)
        if (!contract) {
            return res.status(404).end()
        }

        res.json(contract)
    } catch (e) {
        getCatchErrorMessage(e, res)
        return res.end();
    }
}

/**
 * Returns a list of contracts belonging to a user (client or contractor), the list should only contain non terminated
 * contracts.
 */
const contracts = async (req, res) => {
    try {
        let contracts
        if (req.profile.type === 'client') {
            contracts = await findAllContractsByClientId(req.profile.id)
        } else {
            contracts = await findAllContractsByContractorId(req.profile.id)
        }

        if (!contracts) {
            return res.status(404).end()
        }

        res.json(contracts)
    } catch (e) {
        getCatchErrorMessage(e, res)
        return res.end();
    }
}

module.exports = {
    contractsId,
    contracts
}