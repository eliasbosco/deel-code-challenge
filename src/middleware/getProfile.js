const { findOneProfileById } = require('../repositories/profiles')
const { logger, getCatchErrorMessage } = require('../helpers/logger')

const getProfile = async (req, res, next) => {
    try {
        if (!req?.cookies?.profile_id) {
            throw Error('Unauthorized')
        }

        const profile = await findOneProfileById(req.cookies.profile_id)
        if (!profile) throw Error('Unauthorized')
        req.profile = profile.dataValues
        next()
    } catch (e) {
        e.status = 401
        getCatchErrorMessage(e, res)
        return res.end()
    }
}

module.exports = { getProfile }