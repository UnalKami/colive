// models/Residence.js
// Esquema unificado para residencias con todas las propiedades requeridas

const { Schema, model } = require('mongoose');

const ResidenceSchema = new Schema({
  code: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    uppercase: true
  },

  conjuntoId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Conjunto', 
    required: true 
  },

  parqueaderos: [{ 
    type: String,
    trim: true
  }],

  bodegas: [{
    type: String,
    trim: true
  }],

  administracion: {
    valorMensual: { type: Number, required: false, min: 0 },
    ultimoPago: {
      fecha: Date,
      monto: Number,
      metodo: { type: String, enum: ['efectivo', 'transferencia', 'tarjeta'] }
    },
    moraAcumulada: { type: Number, default: 0, min: 0 },
    historialPagos: [{
      monto: Number,
      fecha: { type: Date, default: Date.now },
      metodo: String,
      comprobante: String
    }]
  },

  recibosServicios: [{
    tipoServicio: { 
      type: String, 
      required: false,
      enum: ['agua', 'luz', 'gas', 'internet', 'ascensor'] 
    },
    fechaLlegada: { type: Date, required: false },
    estado: {
      type: String,
      required: false,
      enum: ['pendiente', 'recibido', 'reclamado'],
      default: 'pendiente'
    },
    observaciones: String
  }],

  // Metadata
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  versionKey: false
});

// Actualizar automáticamente updatedAt
ResidenceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Validación para códigos únicos por conjunto
ResidenceSchema.index({ code: 1, conjuntoId: 1 }, { unique: true });

module.exports = model('Residence', ResidenceSchema);