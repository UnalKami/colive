const express = require('express');
const router = express.Router();
const Residence = require('../models/Residence');
const Conjunto = require('../models/Conjunto');

// POST /api/residences/crear
router.post('/crear', async (req, res) => {
  try {
    const { nombreAdmin, code, parqueadero, bodega } = req.body;

    // Validar datos requeridos
    if (!nombreAdmin || !code) {
      return res.status(400).json({
        error: 'nombreAdmin y code son campos requeridos'
      });
    }

    // 1. Buscar conjunto por nombreAdministrador
    const conjunto = await Conjunto.findOne({ nombreAdministrador: nombreAdmin });
    
    if (!conjunto) {
      return res.status(404).json({
        error: `No se encontró conjunto para el administrador: ${nombreAdmin}`
      });
    }

    // 2. Crear residence con conjuntoId
    const residenceData = {
      code: code,
      conjuntoId: conjunto._id,
      parqueadero: parqueadero ? parseInt(parqueadero) : null,
      bodega: bodega ? parseInt(bodega) : null
    };

    const nuevaResidence = new Residence(residenceData);
    const residenceGuardada = await nuevaResidence.save();

    // 3. Retornar residence creada
    res.status(201).json({
      success: true,
      message: 'Residence creada exitosamente',
      data: residenceGuardada
    });

  } catch (error) {
    console.error('Error al crear residence:', error);
    
    // Manejar error de código duplicado
    if (error.code === 11000) {
      return res.status(409).json({
        error: 'Ya existe una residence con ese código'
      });
    }

    res.status(500).json({
      error: 'Error interno del servidor',
      details: error.message
    });
  }
});

module.exports = router;