const express = require('express');
const router = express.Router();
const { registerResidence } = require('../controllers/residenceController');
router.post('/residences', registerResidence);
module.exports = router;