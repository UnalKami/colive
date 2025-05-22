const express = require('express');
const router = express.Router();
const conjuntoController = require('../controllers/conjuntoController'); // Asegúrate que la ruta es correcta

router.post('/conjuntos', conjuntoController.createConjunto);
router.get('/conjuntos', conjuntoController.getConjuntos);
router.get('/conjuntos/:id', conjuntoController.getConjuntoById);
router.put('/conjuntos/:id', conjuntoController.updateConjunto);
router.delete('/conjuntos/:id', conjuntoController.deleteConjunto);

module.exports = router;