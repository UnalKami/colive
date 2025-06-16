// Define la estructura simplificada de un conjunto residencial

const mongoose = require('mongoose');

const AmenitySchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  horario: {
    dias: { type: String }, // Ej: "Lunes-Viernes"
    horas: { type: String } // Ej: "8:00-20:00"
  },
  estado: {
    type: String,
    enum: ['disponible', 'en_mantenimiento', 'cerrado', 'reservado'],
    default: 'disponible'
  },
  costo: {
    type: Number,
    min: 0,
    default: 0
  },
  capacidad: {
    type: Number,
    min: 1
  }
});


const ConjuntoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  nombreAdministrador: { type: String, required: true },
  direccion: { type: String, required: true },
  ciudad: { type: String, required: true },
  amenidades: [AmenitySchema],
});

ConjuntoSchema.path('amenidades').validate(function(amenidades) {
  const nombres = amenidades.map(a => a.nombre.toLowerCase());
  return new Set(nombres).size === nombres.length;
}, 'Cada amenidad debe tener un nombre único dentro del conjunto');

module.exports = mongoose.model('Conjunto', ConjuntoSchema);