//Define la estructura de una vivienda (apartamento/casa)

const { Schema, model } = require('mongoose');
const ResidenceSchema = new Schema({
  code: { type: String, required: true, unique: true },
  conjuntoId: { type: Schema.Types.ObjectId, ref: 'Conjunto', required: true },
  hasParking: { type: Boolean, default: false },
  hasStorage: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});
module.exports = model('Residence', ResidenceSchema);