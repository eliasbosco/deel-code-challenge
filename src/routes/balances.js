const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile')

const balances = require('../services/balances')

router.post('/balances/deposit/:userId', getProfile, balances.balancesDepositUserId)

module.exports = router
