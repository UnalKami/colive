const { gql } = require('apollo-server-express');

module.exports = gql`
  type Amenidad {
    nombre: String!
    horario: Horario
    estado: String
    costo: Float
    capacidad: Int
  }

  type Horario {
    dias: String!
    horas: String!
  }

  type Config {
    tipoParqueadero: Boolean!
    numParqueadero: Int
    tipoAlmacen: Boolean!
    numAlmacen: Int
  }

  input AmenidadInput {
    nombre: String!
    horario: HorarioInput
    estado: String
    costo: Float
    capacidad: Int
  }

  input HorarioInput {
    dias: String!
    horas: String!
  }

  input ConfigInput {
    tipoParqueadero: Boolean!
    numParqueadero: Int
    tipoAlmacen: Boolean!
    numAlmacen: Int
  }

  type Conjunto {
    id: ID!
    nombre: String!
    nombreAdministrador: String!
    direccion: String!
    departamento: String!
    ciudad: String!
    amenidades: [Amenidad]
    configuraciones: [Config]
  }

  type Residence {
    id: ID!
    code: String!
    conjuntoId: ID!
    parqueaderos: [String]
    bodegas: [String]
    createdAt: String
    updatedAt: String
  }

  type Reserva {
    id: ID!
    conjuntoId: ID!
    residenciaId: ID!
    amenidad: String!
    fecha: String!
    horaInicio: String!
    horaFin: String!
    cantidadPersonas: Int!
    motivo: String
    estado: String
    observaciones: String
  }

  input ReservaInput {
    conjuntoId: ID!
    residenciaId: ID!
    amenidad: String!
    fecha: String!
    horaInicio: String!
    horaFin: String!
    cantidadPersonas: Int!
    motivo: String
    estado: String
    observaciones: String
  }

  type ValidacionReservaResult {
    disponible: Boolean!
    motivo: String
  }
    

  type Query {
    conjuntos: [Conjunto]

    conjunto(id: ID!): Conjunto

    residences: [Residence]

    residence(id: ID!): Residence

    reservas(conjuntoId: ID, residenciaId: ID): [Reserva]

    validarReservaDisponible(
      amenidad: String!
      fecha: String!
      horaInicio: String!
      horaFin: String!
      residenciaId: ID!
      conjuntoId: ID!
      excluirId: ID
    ): ValidacionReservaResult!
    
  }


  type Mutation {
    createConjunto(
      nombre: String!
      nombreAdministrador: String!
      direccion: String!
      ciudad: String!
      departamento: String!
      amenidades: [AmenidadInput]
      configuraciones: [ConfigInput]
    ): Conjunto

    createResidence(
      code: String!
      conjuntoId: ID!
      parqueaderos: [String]
      bodegas: [String]
    ): Residence

    crearReserva(
      reserva: ReservaInput!
    ): Reserva

    editarReserva(
      id: ID!
      reserva: ReservaInput!
    ): Reserva

    eliminarReserva(
      id: ID!
    ): Boolean

  }
`;

