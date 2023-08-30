const express = require('express');
const router = express.Router();
const { getProfile } = require('../middleware/getProfile')

const admin = require('../services/admin')

router.get('/admin/best-profession', getProfile, admin.adminBestProfession)
router.get('/admin/best-clients', getProfile, admin.adminBestClients)

module.exports = router
