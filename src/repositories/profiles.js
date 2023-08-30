const { sequelize, Profile } = require('../models')

const findOneProfileById = async (id) => {
    try {
        return await Profile.findOne({
            attributes: [
                'id', 'balance', 'firstName', 'lastName', 'profession', 'type',
                [sequelize.literal("`firstName` || ' ' || `lastName`"), 'fullName']
            ],
            where: {
                id,
            }
        })
    } catch (e) {
        throw e
    }
}

const updateProfileBalanceById = async (id, balance) => {
    const trans = await sequelize.transaction();
    try {
        await Profile.update({ balance }, {
            where: {
                id,
            },
            transaction: trans,
        })
        trans.commit()
    } catch (e) {
        trans.rollback()
        throw e
    }
}

module.exports = {
    findOneProfileById,
    updateProfileBalanceById,
}
