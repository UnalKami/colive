const { Schema, model } = require('mongoose');

const ReservaSchema = new Schema({
  conjuntoId: { type: Schema.Types.ObjectId, ref: 'Conjunto', required: true },
  residenciaId: { type: Schema.Types.ObjectId, ref: 'Residence', required: true },
  amenidad: { type: String, required: true },
  fecha: { type: Date, required: true },
  horaInicio: { type: String, required: true },
  horaFin: { type: String, required: true },
  cantidadPersonas: { type: Number, required: true },
  motivo: { type: String },
  estado: { type: String, enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'], default: 'pendiente' },
  observaciones: { type: String }
}, { timestamps: true });

module.exports = model('Reserva', ReservaSchema);