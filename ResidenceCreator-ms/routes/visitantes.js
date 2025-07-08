const express = require('express');
const router = express.Router();
const VisitanteP = require('../models/Visitante_peaton');
const VisitanteV = require('../models/Visitante_vehicular');
const { Op } = require('sequelize');

// Validaciones
const validarVisitante = (req, res, next) => {
  const { nombreVisitante, visitanteDocumento, destino, nombreAutoriza, idConjunto } = req.body;
  if (!nombreVisitante || !visitanteDocumento || !destino || !nombreAutoriza || !idConjunto) {
    return res.status(400).json({ error: 'Faltan campos obligatorios' });
  }
  next();
};

const validarVehicular = (req, res, next) => {
  const { placaVehiculo, tipoVehiculo, espacioAsignado } = req.body;
  if (!placaVehiculo || !tipoVehiculo || !espacioAsignado) {
    return res.status(400).json({ error: 'Faltan campos específicos del vehículo' });
  }
  next();
};

// Registrar visitante peatón
router.post('/peaton', validarVisitante, async (req, res) => {
  try {
    const visitante = await VisitanteP.create(req.body);
    res.status(201).json({ message: 'Visitante peatón registrado', visitante });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Registrar visitante vehicular
router.post('/vehicular', validarVisitante, validarVehicular, async (req, res) => {
  try {
    // Verificar si el espacio está ocupado
    const espacioOcupado = await VisitanteV.findOne({
      where: {
        espacioAsignado: req.body.espacioAsignado,
        idConjunto: req.body.idConjunto,
        salidaVehiculo: null
      }
    });
    
    if (espacioOcupado) {
      return res.status(400).json({ error: 'El espacio de parqueadero ya está ocupado' });
    }
    
    const visitante = await VisitanteV.create(req.body);
    res.status(201).json({ message: 'Visitante vehicular registrado', visitante });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Consultar visitantes por conjunto
router.get('/conjunto/:idConjunto', async (req, res) => {
  try {
    const { idConjunto } = req.params;
    const { fecha } = req.query;
    
    const filtro = { idConjunto };
    if (fecha) {
      const fechaInicio = new Date(fecha);
      fechaInicio.setHours(0,0,0,0);
      const fechaFin = new Date(fechaInicio);
      fechaFin.setDate(fechaInicio.getDate() + 1);
      filtro.diaIngreso = { [Op.gte]: fechaInicio, [Op.lt]: fechaFin };
    }
    
    const [peatones, vehiculares] = await Promise.all([
      VisitanteP.findAll({ where: filtro, order: [['diaIngreso', 'DESC']] }),
      VisitanteV.findAll({ where: filtro, order: [['diaIngreso', 'DESC']] })
    ]);
    
    res.json({ peatones, vehiculares });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Registrar salida de vehículo
router.post('/vehicular/salida', async (req, res) => {
  try {
    const { placaVehiculo, idConjunto } = req.body;
    
    if (!placaVehiculo || !idConjunto) {
      return res.status(400).json({ error: 'Placa del vehículo e ID del conjunto son obligatorios' });
    }
    
    const visitante = await VisitanteV.findOne({
      where: {
        placaVehiculo,
        idConjunto,
        salidaVehiculo: null
      },
      order: [['diaIngreso', 'DESC']]
    });

    if (!visitante) {
      return res.status(404).json({ error: 'Vehículo no encontrado o ya registró salida' });
    }

    visitante.salidaVehiculo = new Date();
    await visitante.save();

    res.json({ message: 'Salida registrada exitosamente', visitante });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Consultar espacios de parqueadero disponibles
router.get('/espacios-disponibles/:idConjunto', async (req, res) => {
  try {
    const { idConjunto } = req.params;
    const espaciosOcupados = await VisitanteV.findAll({
      where: {
        idConjunto,
        salidaVehiculo: null
      },
      attributes: ['espacioAsignado']
    });
    
    const ocupados = espaciosOcupados.map(v => v.espacioAsignado);
    res.json({ espaciosOcupados: ocupados });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;