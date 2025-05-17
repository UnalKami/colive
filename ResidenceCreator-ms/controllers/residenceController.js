const Residence = require('../models/Residence');
const Resident = require('../models/Resident');
const bcrypt = require('bcrypt');

// Registrar un nuevo apartamento junto con su propietario
exports.registerApartment = async (req, res) => {
  try {
    const { code, hasParking, hasStorage, username, password, fullName, email } = req.body;
    // Crear propietario
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const owner = new Resident({ username, passwordHash: hash, fullName, email });
    await owner.save();
    // Crear residencia
    const residence = new Residence({ code, hasParking, hasStorage, owner: owner._id });
    await residence.save();
    res.status(201).json({ success: true, residence });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener todas las residencias
exports.getAllResidences = async (req, res) => {
  try {
    const list = await Residence.find().populate('owner', 'username fullName').populate('residents', 'username fullName');
    res.json({ success: true, residences: list });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Agregar un residente a una residencia existente
exports.addResident = async (req, res) => {
  try {
    const { residenceCode, username, password, fullName, email } = req.body;
    const residence = await Residence.findOne({ code: residenceCode });
    if (!residence) return res.status(404).json({ success: false, message: 'Residencia no encontrada' });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const resident = new Resident({ username, passwordHash: hash, fullName, email });
    await resident.save();
    residence.residents.push(resident._id);
    await residence.save();
    res.status(201).json({ success: true, resident });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
