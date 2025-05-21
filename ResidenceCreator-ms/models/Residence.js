//Define la estructura de una vivienda (apartamento/casa)
const { Schema, model } = require('mongoose');

const PagoSchema = new Schema({
  monto: { type: Number, required: true },
  fecha: { type: Date, required: true },
  metodo: { type: String, required: true },
  comprobante: { type: String }
}, { _id: false });

const AdministracionSchema = new Schema({
  valorMensual: { type: Number, required: true },
  ultimoPago: { type: PagoSchema, required: true },
  moraAcumulada: { type: Number, default: 0 },
  historialPagos: [PagoSchema]
}, { _id: false });

const ReciboServicioSchema = new Schema({
  tipoServicio: { type: String, required: true },
  fechaLlegada: { type: Date, required: true },
  estado: { type: String, required: true },
  observaciones: { type: String }
}, { _id: false });

const ResidenceSchema = new Schema({
  code: { type: String, required: true, unique: true },
  conjuntoId: { type: Schema.Types.ObjectId, ref: 'Conjunto', required: true },
  parqueaderos: [{ type: String }],
  bodegas: [{ type: String }],
  administracion: { type: AdministracionSchema, required: true },
  recibosServicios: [ReciboServicioSchema]
}, { timestamps: true });

module.exports = model('Residence', ResidenceSchema);