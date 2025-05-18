const Residence = require('../models/Residence');
// Crear una residencia y devolver su _id (hash_apartamento)
exports.registerResidence = async (req, res) => {
  try {
    const { code, conjuntoHash, hasParking, hasStorage } = req.body;
    const residence = new Residence({
      code,
      conjuntoId: conjuntoHash,
      hasParking,
      hasStorage
    });
    await residence.save();
    res.status(201).json({ success: true, hash_apartamento: residence._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
