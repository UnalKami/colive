const { Schema, model } = require('mongoose');

const ReservaSchema = new Schema({
  conjuntoId: {
    type: Schema.Types.ObjectId,
    ref: 'Conjunto',
    required: [true, 'El conjunto es obligatorio']
  },
  residenciaId: {
    type: Schema.Types.ObjectId,
    ref: 'Residence',
    required: [true, 'La residencia es obligatoria']
  },
  amenidad: {
    type: String,
    required: [true, 'El nombre de la amenidad es obligatorio']
  },
  fecha: {
    type: Date,
    required: [true, 'La fecha es obligatoria']
  },
  horaInicio: {
    type: String,
    required: [true, 'La hora de inicio es obligatoria'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora no válido (HH:MM)']
  },
  horaFin: {
    type: String,
    required: [true, 'La hora de fin es obligatoria'],
    match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Formato de hora no válido (HH:MM)']
  },
  cantidadPersonas: {
    type: Number,
    required: [true, 'La cantidad de personas es obligatoria'],
    min: [1, 'Debe haber al menos una persona']
  },
  motivo: { type: String },
  estado: {
    type: String,
    enum: ['pendiente', 'aprobada', 'rechazada', 'cancelada'],
    default: 'pendiente'
  },
  observaciones: { type: String }
}, { timestamps: true });

module.exports = model('Reserva', ReservaSchema);
