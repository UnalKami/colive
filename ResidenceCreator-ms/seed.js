require('dotenv').config();
const mongoose = require('mongoose');
const Conjunto = require('./models/Conjunto');
const Residence = require('./models/Residence');

const conjuntosData = [
  {
    nombre: "Conjunto Altos del Sol",
    nombreAdministrador: "Laura Martínez",
    direccion: "Calle 123 #45-67",
    ciudad: "Bogotá",
    departamento: "Cundinamarca", 
    amenidades: [
      {
        nombre: "Piscina",
        horario: { dias: "Lunes-Domingo", horas: "7:00-20:00" },
        estado: "disponible",
        costo: 0,
        capacidad: 30
      },
      {
        nombre: "Gimnasio",
        horario: { dias: "Lunes-Viernes", horas: "6:00-22:00" },
        estado: "disponible",
        costo: 0,
        capacidad: 20
      }
    ],
  },
  {
    nombre: "Residencial Los Robles",
    nombreAdministrador: "Carlos Pérez",
    direccion: "Av. Central 456",
    ciudad: "Medellín",
    departamento: "Antioquia", 
    amenidades: [
      {
        nombre: "Salón Social",
        horario: { dias: "Sábado-Domingo", horas: "8:00-23:00" },
        estado: "disponible",
        costo: 100000,
        capacidad: 50
      },
      {
        nombre: "Parque Infantil",
        horario: { dias: "Lunes-Domingo", horas: "8:00-18:00" },
        estado: "disponible",
        costo: 0,
        capacidad: 15
      }
    ],
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

  // Insertar conjuntos solo si no existen (por nombre) y obtener sus _id reales
  let conjuntos = [];
  for (const conjunto of conjuntosData) {
    let exists = await Conjunto.findOne({ nombre: conjunto.nombre });
    if (!exists) {
      exists = await Conjunto.create(conjunto);
      console.log(`Conjunto insertado: ${conjunto.nombre}`);
    } else {
      console.log(`Conjunto ya existe: ${conjunto.nombre}`);
    }
    conjuntos.push(exists);
  }

  // AHORA arma residenciasData usando los _id reales de los conjuntos
  const residenciasData = [
    {
      code: "C1R1",
      conjuntoId: conjuntos[0]._id,
      parqueaderos: ["P1"],
      bodegas: ["B1"],
      administracion: {
        valorMensual: 150000,
        ultimoPago: { monto: 150000, fecha: new Date(), metodo: "transferencia", comprobante: "11XYZ" },
        moraAcumulada: 0,
        historialPagos: []
      },
      recibosServicios: []
    },
    {
      code: "C1R2",
      conjuntoId: conjuntos[0]._id,
      parqueaderos: ["P2"],
      bodegas: ["B2"],
      administracion: {
        valorMensual: 150000,
        ultimoPago: { monto: 150000, fecha: new Date(), metodo: "efectivo", comprobante: "12XYZ" },
        moraAcumulada: 0,
        historialPagos: []
      },
      recibosServicios: []
    },
    {
      code: "C1R3",
      conjuntoId: conjuntos[0]._id,
      parqueaderos: ["P3"],
      bodegas: ["B3"],
      administracion: {
        valorMensual: 150000,
        ultimoPago: { monto: 150000, fecha: new Date(), metodo: "transferencia", comprobante: "13XYZ" },
        moraAcumulada: 0,
        historialPagos: []
      },
      recibosServicios: []
    },

    // Residencias para "Residencial Los Robles"
    {
      code: "C2R1",
      conjuntoId: conjuntos[1]._id,
      parqueaderos: ["P1"],
      bodegas: ["B1"],
      administracion: {
        valorMensual: 160000,
        ultimoPago: { monto: 160000, fecha: new Date(), metodo: "efectivo", comprobante: "21XYZ" },
        moraAcumulada: 0,
        historialPagos: []
      },
      recibosServicios: []
    },
    {
      code: "C2R2",
      conjuntoId: conjuntos[1]._id,
      parqueaderos: ["P2"],
      bodegas: ["B2"],
      administracion: {
        valorMensual: 160000,
        ultimoPago: { monto: 160000, fecha: new Date(), metodo: "transferencia", comprobante: "22XYZ" },
        moraAcumulada: 0,
        historialPagos: []
      },
      recibosServicios: []
    },
    {
      code: "C2R3",
      conjuntoId: conjuntos[1]._id,
      parqueaderos: ["P3"],
      bodegas: ["B3"],
      administracion: {
        valorMensual: 160000,
        ultimoPago: { monto: 160000, fecha: new Date(), metodo: "efectivo", comprobante: "23XYZ" },
        moraAcumulada: 0,
        historialPagos: []
      },
      recibosServicios: []
    }
  ];

  // Insertar residencias solo si no existen (por code)
  for (const residencia of residenciasData) {
    const exists = await Residence.findOne({ code: residencia.code });
    if (!exists) {
      await Residence.create(residencia);
      console.log(`Residencia insertada: ${residencia.code}`);
    } else {
      console.log(`Residencia ya existe: ${residencia.code}`);
    }
  }

  console.log("Seed finalizado.");
  process.exit();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
