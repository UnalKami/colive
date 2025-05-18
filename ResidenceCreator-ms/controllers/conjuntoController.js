//Lógica para manejar conjuntos residenciales

const Conjunto = require('../models/Conjunto');
// Crear un nuevo conjunto y devolver su _id
exports.createConjunto = async (req, res) => {
  try {
    const { name, address, amenities, config } = req.body;
    const conjunto = new Conjunto({ name, address, amenities, config });
    await conjunto.save();
    res.status(201).json({ success: true, hash_conjunto: conjunto._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};