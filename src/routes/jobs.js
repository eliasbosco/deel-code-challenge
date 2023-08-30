
const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile')

const jobs = require('../services/jobs')

router.get('/jobs/unpaid', getProfile, jobs.jobsUnpaid)
router.post('/jobs/:jobId/pay', getProfile, jobs.jobsJobIdPay)

module.exports = router
