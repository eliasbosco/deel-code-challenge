const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile')

const contracts = require('../services/contracts')

router.get('/contracts/:id', getProfile, contracts.contractsId)
router.get('/contracts', getProfile, contracts.contracts)

module.exports = router
