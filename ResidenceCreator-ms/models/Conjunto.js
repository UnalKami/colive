// Define la estructura simplificada de un conjunto residencial

const { Schema, model } = require('mongoose');

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
  amenidades: [{  
    type: String,
    trim: true,
    lowercase: true
  }],
  divisiones: [{ 
    tipo: { type: String, required: true }, // El nombre de la division, como torre, apartamento, bloque, manzana, etc.
    cantidad: { type: Number, required: true } // Número de torres, apartamentos, bloques, etc.
  }]

}, {
  timestamps: true // Mantiene createdAt y updatedAt
});

ConjuntoSchema.path('amenidades').validate(function(amenidades) {
  return new Set(amenidades.map(a => a.toLowerCase())).size === amenidades.length;
}, 'Cada amenidad debe tener un nombre único dentro del conjunto');

module.exports = model('Conjunto', ConjuntoSchema);