const express = require('express');
const router = express.Router();
const { createConjunto } = require('../controllers/conjuntoController');
router.post('/conjuntos', createConjunto);
module.exports = router;