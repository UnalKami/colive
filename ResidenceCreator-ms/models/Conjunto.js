// Define la estructura simplificada de un conjunto residencial

const mongoose = require('mongoose');

const AmenitySchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true,
    trim: true
  },
  horario: {
    dias: { type: String}, // Ej: "Lunes-Viernes"
    horas: { type: String} // Ej: "8:00-20:00"
  },
  costo: {
    type: Number,
    min: 0,
    default: 0
  },
});

const ConfigSchema = new mongoose.Schema({ 
    tipoParqueadero: {
      type: Number,
      required: true
    },
    numeroParqueadero: {
      type: Number,
    },
    tieneAlmacen: {
      type: Boolean,
      required: true
    },
    numeroAlmacen: {
      type: Number
    }
  });


const ConjuntoSchema = new mongoose.Schema({
  nombreConjunto: { type: String, required: true },
  direccion: { type: String, required: true },
  departamento: {type: String, required: true},
  ciudad: { type: String, required: true },
  amenidades: [AmenitySchema],
  configuraciones: [ConfigSchema]
});

module.exports = mongoose.model('Conjunto', ConjuntoSchema);