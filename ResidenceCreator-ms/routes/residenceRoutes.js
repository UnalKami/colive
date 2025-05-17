const express = require('express');
const router = express.Router();
const controller = require('../controllers/residenceController');

// POST /api/residences/registerApartment
router.post('/residences/registerApartment', controller.registerApartment);
// GET /api/residences
router.get('/residences', controller.getAllResidences);
// POST /api/residences/addResident
router.post('/residences/addResident', controller.addResident);

module.exports = router;
