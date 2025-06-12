const Conjunto = require('../models/Conjunto');
const Residence = require('../models/Residence');
const Reserva = require('../models/Reserva');

module.exports = {
  Query: {
    conjuntos: async () => await Conjunto.find(),

    conjunto: async (_, { id }) => await Conjunto.findById(id),

    residences: async () => await Residence.find(),

    residence: async (_, { id }) => await Residence.findById(id),

    reservas: async (_, { conjuntoId, residenciaId }) => {
      const filter = {};
      if (conjuntoId) filter.conjuntoId = conjuntoId;
      if (residenciaId) filter.residenciaId = residenciaId;
      return await Reserva.find(filter);
    },

    validarReservaDisponible: async (_, { amenidad, fecha, horaInicio, horaFin, residenciaId }) => {
      // Busca reservas solapadas para la amenidad
      const solapada = await Reserva.findOne({
        amenidad,
        fecha,
        $or: [
          {
            horaInicio: { $lt: horaFin },
            horaFin: { $gt: horaInicio }
          }
        ]
      });
      if (solapada) {
        return {
          disponible: false,
          motivo: "Ya existe una reserva para esta amenidad en ese horario."
        };
      }

      // Busca doble reserva del mismo usuario (residencia) en la misma franja
      const doble = await Reserva.findOne({
        residenciaId,
        amenidad,
        fecha,
        $or: [
          {
            horaInicio: { $lt: horaFin },
            horaFin: { $gt: horaInicio }
          }
        ]
      });
      if (doble) {
        return {
          disponible: false,
          motivo: "Ya tienes una reserva activa para esta amenidad en ese horario."
        };
      }

      return { disponible: true, motivo: null };
    },
    
  },


  Mutation: {
    createConjunto: async (_, args) => {
      // args incluye: nombre, direccion, ciudad, amenidades, configuraciones
      const conjunto = new Conjunto({
        nombre: args.nombre,
        nombreAdministrador: args.nombreAdministrador,
        direccion: args.direccion,
        ciudad: args.ciudad,
        amenidades: args.amenidades,
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
      });
      await residence.save();
      return residence;
    },

    crearReserva: async (_, args) => {
      const reserva = new Reserva({
        conjuntoId: args.conjuntoId,
        residenciaId: args.residenciaId,
        amenidad: args.amenidad,
        fecha: args.fecha,
        horaInicio: args.horaInicio,
        horaFin: args.horaFin,
        cantidadPersonas: args.cantidadPersonas,
        motivo: args.motivo,
        estado: args.estado,
        observaciones: args.observaciones,
      });
      await reserva.save();
      return reserva;
    },

    editarReserva: async (_, args) => {
      
    }
  },
};