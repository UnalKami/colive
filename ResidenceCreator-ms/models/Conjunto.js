//Define la estructura de un conjunto residencial en la BD

const { Schema, model } = require('mongoose');

const AmenitySchema = new Schema({
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

const ConjuntoSchema = new Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true,
    maxlength: 100
  },
  direccion: {
    type: String,
    required: true,
    trim: true
  },
  ciudad: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50
  },
  amenidades: [AmenitySchema],
  configuraciones: {
    torresNumeradas: { type: Boolean, default: false },
    accesoControlado: { type: Boolean, default: true }
  }
}, {
  timestamps: true 
});

ConjuntoSchema.path('amenidades').validate(function(amenidades) {
  const nombres = amenidades.map(a => a.nombre.toLowerCase());
  return new Set(nombres).size === nombres.length;
}, 'Cada amenidad debe tener un nombre único dentro del conjunto');

module.exports = model('Conjunto', ConjuntoSchema);