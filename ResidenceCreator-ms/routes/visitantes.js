const express = require('express');
const router = express.Router();
const VisitanteP = require('../models/Visitante_peaton');
const VisitanteV = require('../models/Visitante_vehicular');
const { Op } = require('sequelize')

router.post('/peaton', async (req, res) => {
  try {
    const visitante = await VisitanteP.create(req.body);
    res.status(201).json(visitante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/vehicular', async (req, res) => {
  try {
    const visitante = await VisitanteV.create(req.body);
    res.status(201).json(visitante);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/vehicular/salida', async (req, res) => {
  try {
    const { placaVehiculo } = req.body;
    const hoy = new Date();
    hoy.setHours(0,0,0,0);
    const mañana = new Date(hoy);
    mañana.setDate(hoy.getDate() + 1);

    // Busca el registro de hoy con esa placa y sin salida registrada
    const visitante = await VisitanteV.findOne({
      where: {
        placaVehiculo,
        diaIngreso: { [Op.gte]: hoy, [Op.lt]: mañana },
        salidaVehiculo: null
      }
    });

    if (!visitante) {
      return res.status(404).json({ error: 'Vehículo no encontrado o ya salió.' });
    }

    visitante.salidaVehiculo = new Date();
    await visitante.save();

    res.json({ message: 'Salida registrada', visitante });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;