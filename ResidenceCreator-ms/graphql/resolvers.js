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

    validarReservaDisponible: async (_, { amenidad, fecha, horaInicio, horaFin, residenciaId, conjuntoId, excluirId }) => {
      // Busca reservas solapadas para la amenidad
      const filtro = {
        amenidad,
        fecha,
        conjuntoId,
        $or: [
          {
            horaInicio: { $lt: horaFin },
            horaFin: { $gt: horaInicio }
          }
        ]
      };
      if (excluirId) {
        filtro._id = { $ne: excluirId };
      }
      const solapada = await Reserva.findOne(filtro);

      if (solapada) {
        return {
          disponible: false,
          motivo: "Ya existe una reserva para esta amenidad en ese horario en este conjunto."
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
        departamento: args.departamento,
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
        conjuntoId: args.reserva.conjuntoId,
        residenciaId: args.reserva.residenciaId,
        amenidad: args.reserva.amenidad,
        fecha: args.reserva.fecha,
        horaInicio: args.reserva.horaInicio,
        horaFin: args.reserva.horaFin,
        cantidadPersonas: args.reserva.cantidadPersonas,
        motivo: args.reserva.motivo,
        estado: args.reserva.estado,
        observaciones: args.reserva.observaciones,
      });
      await reserva.save();
      return reserva;
    },

    editarReserva: async (_, { id, reserva }) => {
      // Busca y actualiza la reserva por ID usando los datos del input
      const reservaActualizada = await Reserva.findByIdAndUpdate(
        id,
        {
          $set: {
            conjuntoId: reserva.conjuntoId,
            residenciaId: reserva.residenciaId,
            amenidad: reserva.amenidad,
            fecha: reserva.fecha,
            horaInicio: reserva.horaInicio,
            horaFin: reserva.horaFin,
            cantidadPersonas: reserva.cantidadPersonas,
            motivo: reserva.motivo,
            estado: reserva.estado,
            observaciones: reserva.observaciones
          }
        },
        { new: true }
      );
      return reservaActualizada;
    },

  eliminarReserva: async (_, { id }) => {
    const result = await Reserva.findByIdAndDelete(id);
    return !!result;
  },
    
  },
};