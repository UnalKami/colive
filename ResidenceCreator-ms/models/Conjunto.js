// Define la estructura simplificada de un conjunto residencial

const mongoose = require('mongoose');

const AmenitySchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  horario: {
    dias: { type: String, required: true }, // Ej: "Lunes-Viernes"
    horas: { type: String, required: true } // Ej: "8:00-20:00"
  },
  estado: {
    type: String,
    required: true,
    enum: ['disponible', 'en_mantenimiento', 'cerrado', 'reservado'],
    default: 'disponible'
  },
  costo: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  capacidad: {
    type: Number,
    required: true,
    min: 1
  }
});

const ConfiguracionesSchema = new mongoose.Schema({
  torresNumeradas: Boolean,
  accesoControlado: Boolean,
}, { _id: false });


const ConjuntoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true },
  ciudad: { type: String, required: true },
  amenidades: [AmenitySchema],
  configuraciones: ConfiguracionesSchema
});

ConjuntoSchema.path('amenidades').validate(function(amenidades) {
  return new Set(amenidades.map(a => a.toLowerCase())).size === amenidades.length;
}, 'Cada amenidad debe tener un nombre único dentro del conjunto');

module.exports = mongoose.model('Conjunto', ConjuntoSchema);