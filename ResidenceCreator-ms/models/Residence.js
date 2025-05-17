const { Schema, model } = require('mongoose');

const ResidenceSchema = new Schema({
  code: { type: String, required: true, unique: true }, // p.ej. T3-202
  hasParking: { type: Boolean, default: false },
  hasStorage: { type: Boolean, default: false },
  owner: { type: Schema.Types.ObjectId, ref: 'Resident', required: true },
  residents: [{ type: Schema.Types.ObjectId, ref: 'Resident' }],
  commonAreas: [{ name: String, reservations: [{ date: Date, resident: { type: Schema.Types.ObjectId, ref: 'Resident' } }] }]
});

module.exports = model('Residence', ResidenceSchema);
