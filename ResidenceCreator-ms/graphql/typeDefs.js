const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Amenidad {
    nombre: String!
    horario: Horario!
    costo: Float!
  }

  type Horario {
    dias: String!
    horas: String!
  }

  input AmenidadInput {
    nombre: String!
    horario: HorarioInput!
    costo: Float!
  }

  input HorarioInput {
    dias: String!
    horas: String!
  }

  input ConfigInput {
    tipoParqueadero: String!
    numeroParqueadero: Int!
    tieneAlmacen: Boolean!
    numeroAlmacen: Int!
  }

  type Config {
    tipoParqueadero: String!
    numeroParqueadero: Int!
    tieneAlmacen: Boolean!
    numeroAlmacen: Int!
  }

  type Conjunto {
    id: ID!
    nombreConjunto: String!
    direccion: String!
    departamento: String!
    ciudad: String!
    amenidades: [Amenidad]
    configuraciones: [Config]
  }

  type Pago {
    monto: Float!
    fecha: String!
    metodo: String!
    comprobante: String
  }

  input PagoInput {
    monto: Float!
    fecha: String!
    metodo: String!
    comprobante: String
  }

  type Administracion {
    valorMensual: Float!
    ultimoPago: Pago!
    moraAcumulada: Float
    historialPagos: [Pago]
  }

  input AdministracionInput {
    valorMensual: Float!
    ultimoPago: PagoInput!
    moraAcumulada: Float
    historialPagos: [PagoInput]
  }

  type ReciboServicio {
    tipoServicio: String!
    fechaLlegada: String!
    estado: String!
    observaciones: String
  }

  input ReciboServicioInput {
    tipoServicio: String!
    fechaLlegada: String!
    estado: String!
    observaciones: String
  }

  type Residence {
    id: ID!
    code: String!
    conjuntoId: ID!
    parqueaderos: [String]
    bodegas: [String]
    administracion: Administracion!
    recibosServicios: [ReciboServicio]
    createdAt: String
    updatedAt: String
  }

  input ResidenceInput {
    code: String!
    conjuntoId: ID!
    parqueaderos: [String]
    bodegas: [String]
    administracion: AdministracionInput!
    recibosServicios: [ReciboServicioInput]
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
    estado: String!
    observaciones: String
    createdAt: String
    updatedAt: String
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
    observaciones: String
  }
    
  type Query {
    conjuntos: [Conjunto]
    conjunto(id: ID!): Conjunto
    residences: [Residence]
    residence(id: ID!): Residence
    reservas(conjuntoId: ID, residenciaId: ID): [Reserva]
  }

  type Mutation {
    createConjunto(
      nombre: String!
      nombreAdministrador: String!
      direccion: String!
      ciudad: String!
      amenidades: [AmenidadInput]
      configuraciones: [ConfigInput]
    ): Conjunto

    createResidence(
      code: String!
      conjuntoId: ID!
      parqueaderos: [String]
      bodegas: [String]
      administracion: AdministracionInput!
      recibosServicios: [ReciboServicioInput]
    ): Residence

    crearReserva(input: ReservaInput!): Reserva
  }
`;

module.exports = typeDefs;