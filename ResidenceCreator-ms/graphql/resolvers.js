const Conjunto = require('../models/Conjunto');
const Residence = require('../models/Residence');

module.exports = {
  Query: {
    conjuntos: async () => await Conjunto.find(),
    conjunto: async (_, { id }) => await Conjunto.findById(id),
    residences: async () => await Residence.find(),
    residence: async (_, { id }) => await Residence.findById(id),
  },
  Mutation: {
    createConjunto: async (_, args) => {
      // args incluye: nombre, direccion, ciudad, amenidades, configuraciones
      const conjunto = new Conjunto({
        nombre: args.nombre,
        direccion: args.direccion,
        ciudad: args.ciudad,
        amenidades: args.amenidades,
        configuraciones: args.configuraciones
      });
      await conjunto.save();
      return conjunto;
    },
    createResidence: async (_, args) => {
      // args incluye: code, conjuntoId
      const residence = new Residence({
        code: args.code,
        conjuntoId: args.conjuntoId,
        parqueaderos: args.parqueaderos,
        bodegas: args.bodegas,
        administracion: args.administracion,
        recibosServicios: args.recibosServicios
      });
      await residence.save();
      return residence;
    },
  },
};