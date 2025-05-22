const { gql } = require('apollo-server-express');

module.exports = gql`
  type Amenidad {
    nombre: String!
    horario: Horario!
    estado: String!
    costo: Float!
    capacidad: Int!
  }

  type Horario {
    dias: String!
    horas: String!
  }

  input AmenidadInput {
    nombre: String!
    horario: HorarioInput!
    estado: String!
    costo: Float!
    capacidad: Int!
  }

  input HorarioInput {
    dias: String!
    horas: String!
  }

  type Configuraciones {
    torresNumeradas: Boolean
    accesoControlado: Boolean
  }

  input ConfiguracionesInput {
    torresNumeradas: Boolean
    accesoControlado: Boolean
  }

  type Conjunto {
    id: ID!
    nombre: String!
    direccion: String!
    ciudad: String!
    amenidades: [Amenidad]
    configuraciones: Configuraciones
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
    
  type Query {
    conjuntos: [Conjunto]
    conjunto(id: ID!): Conjunto
    residences: [Residence]
    residence(id: ID!): Residence
  }

  type Mutation {
    createConjunto(
      nombre: String!
      direccion: String!
      ciudad: String!
      amenidades: [AmenidadInput]
      configuraciones: ConfiguracionesInput
    ): Conjunto

    createResidence(
      code: String!
      conjuntoId: ID!
      parqueaderos: [String]
      bodegas: [String]
      administracion: AdministracionInput!
      recibosServicios: [ReciboServicioInput]
    ): Residence
  }
`;

