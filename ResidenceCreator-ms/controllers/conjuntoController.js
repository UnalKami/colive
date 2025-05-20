const Conjunto = require('../models/Conjunto');

// Crear un nuevo conjunto
exports.createConjunto = async (req, res) => {
  try {
    const { nombre, direccion, ciudad, amenidades, divisiones } = req.body;
    
    const conjunto = new Conjunto({ 
      nombre, 
      direccion, 
      ciudad, 
      amenidades: amenidades || [],
      divisiones: divisiones || []
    });
    
    await conjunto.save();
    res.status(201).json({ success: true, hash_conjunto: conjunto._id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener todos los conjuntos
exports.getConjuntos = async (req, res) => {
  try {
    const conjuntos = await Conjunto.find().populate('amenidades');
    res.status(200).json({ success: true, data: conjuntos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Obtener un conjunto por ID
exports.getConjuntoById = async (req, res) => {
  try {
    const conjunto = await Conjunto.findById(req.params.id);
    if (!conjunto) {
      return res.status(404).json({ success: false, message: 'Conjunto no encontrado' });
    }
    res.status(200).json({ success: true, data: conjunto });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Actualizar un conjunto
exports.updateConjunto = async (req, res) => {
  try {
    const { nombre, direccion, ciudad, amenidades, divisiones } = req.body;
    
    const conjunto = await Conjunto.findByIdAndUpdate(
      req.params.id,
      { 
        nombre, 
        direccion, 
        ciudad, 
        amenidades,
        divisiones 
      },
      { new: true, runValidators: true }
    );
    
    if (!conjunto) {
      return res.status(404).json({ success: false, message: 'Conjunto no encontrado' });
    }
    res.status(200).json({ success: true, data: conjunto });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Eliminar un conjunto
exports.deleteConjunto = async (req, res) => {
  try {
    const conjunto = await Conjunto.findByIdAndDelete(req.params.id);
    if (!conjunto) {
      return res.status(404).json({ success: false, message: 'Conjunto no encontrado' });
    }
    res.status(200).json({ success: true, message: 'Conjunto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};