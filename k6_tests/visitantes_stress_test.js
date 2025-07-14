import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

// Prueba de estrés para encontrar punto de quiebre
export let options = {
  stages: [
    { duration: '2m', target: 10 },   // Ramp up to 10 users
    { duration: '2m', target: 20 },   // Stay at 20 users
    { duration: '2m', target: 30 },   // Ramp up to 30 users
    { duration: '2m', target: 40 },   // Stay at 40 users
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '2m', target: 60 },   // Stay at 60 users
    { duration: '2m', target: 70 },   // Ramp up to 70 users
    { duration: '2m', target: 80 },   // Stay at 80 users
    { duration: '2m', target: 90 },   // Ramp up to 90 users
    { duration: '2m', target: 100 },  // Stay at 100 users
    { duration: '2m', target: 120 },  // Push beyond expected limit
    { duration: '2m', target: 0 },    // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'],
    http_req_failed: ['rate<0.15'],
    errors: ['rate<0.15'],
  },
};

const BASE_URL = 'http://localhost:8000';
const AUTH_TOKEN = 'Bearer test_token_disabled';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': AUTH_TOKEN,
  };

  // Simular carga mixta de operaciones
  const operations = [
    () => registrarPeaton(headers),
    () => registrarVehicular(headers),
    () => consultarVisitantes(headers),
    () => registrarSalida(headers)
  ];

  // Ejecutar operación aleatoria
  const operation = operations[Math.floor(Math.random() * operations.length)];
  operation();

  sleep(Math.random() * 2 + 0.5); // Sleep between 0.5-2.5 seconds
}

function registrarPeaton(headers) {
  const data = {
    nombreVisitante: `Peatón_${Math.random().toString(36).substr(2, 9)}`,
    visitanteDocumento: `${Math.floor(Math.random() * 100000000)}`,
    destino: `Apto ${Math.floor(Math.random() * 500) + 1}`,
    nombreAutoriza: `Residente_${Math.random().toString(36).substr(2, 5)}`,
    idConjunto: 'conjunto123'
  };

  let response = http.post(
    `${BASE_URL}/residence/visitantes/peaton`,
    JSON.stringify(data),
    { headers }
  );

  check(response, {
    'Peatón registrado': (r) => r.status === 200 || r.status === 201,
  }) || errorRate.add(1);
}

function registrarVehicular(headers) {
  const data = {
    nombreVisitante: `Conductor_${Math.random().toString(36).substr(2, 9)}`,
    visitanteDocumento: `${Math.floor(Math.random() * 100000000)}`,
    destino: `Apto ${Math.floor(Math.random() * 500) + 1}`,
    nombreAutoriza: `Residente_${Math.random().toString(36).substr(2, 5)}`,
    placaVehiculo: `XYZ${Math.floor(Math.random() * 999)}`,
    tipoVehiculo: ['automóvil', 'motocicleta', 'camioneta'][Math.floor(Math.random() * 3)],
    espacioAsignado: Math.floor(Math.random() * 100) + 1,
    idConjunto: 'conjunto123'
  };

  let response = http.post(
    `${BASE_URL}/residence/visitantes/vehicular`,
    JSON.stringify(data),
    { headers }
  );

  check(response, {
    'Vehículo registrado': (r) => r.status === 200 || r.status === 201,
  }) || errorRate.add(1);
}

function consultarVisitantes(headers) {
  let response = http.get(
    `${BASE_URL}/residence/visitantes/conjunto/conjunto123`,
    { headers }
  );

  check(response, {
    'Consulta exitosa': (r) => r.status === 200,
  }) || errorRate.add(1);
}

function registrarSalida(headers) {
  const data = {
    placaVehiculo: `ABC${Math.floor(Math.random() * 999)}`,
    idConjunto: 'conjunto123'
  };

  let response = http.post(
    `${BASE_URL}/residence/visitantes/vehicular/salida`,
    JSON.stringify(data),
    { headers }
  );

  // Salida puede fallar si no existe el vehículo, es normal
  check(response, {
    'Salida procesada': (r) => r.status === 200 || r.status === 404,
  });
}