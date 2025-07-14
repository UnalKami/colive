import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

export let errorRate = new Rate('errors');

// Prueba de picos para evaluar recuperación del sistema
export let options = {
  stages: [
    { duration: '1m', target: 10 },   // Normal load
    { duration: '30s', target: 100 }, // Spike to 100 users
    { duration: '1m', target: 10 },   // Back to normal
    { duration: '30s', target: 150 }, // Bigger spike
    { duration: '1m', target: 10 },   // Back to normal
    { duration: '30s', target: 200 }, // Maximum spike
    { duration: '2m', target: 0 },    // Recovery
  ],
  thresholds: {
    http_req_duration: ['p(95)<5000'],
    http_req_failed: ['rate<0.2'],
    errors: ['rate<0.2'],
  },
};

const BASE_URL = 'http://localhost:8000';
const AUTH_TOKEN = 'Bearer test_token_disabled';

export default function () {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': AUTH_TOKEN,
  };

  // Datos simplificados para prueba de picos
  const peatonData = {
    nombreVisitante: `Spike_${__VU}_${__ITER}`,
    visitanteDocumento: `${__VU}${__ITER}${Math.floor(Math.random() * 1000)}`,
    destino: `Apto ${__VU}`,
    nombreAutoriza: `Auth_${__VU}`,
    idConjunto: 'conjunto123'
  };

  let response = http.post(
    `${BASE_URL}/residence/visitantes/peaton`,
    JSON.stringify(peatonData),
    { headers }
  );

  check(response, {
    'Spike test - Status OK': (r) => r.status === 200 || r.status === 201,
    'Spike test - Response time acceptable': (r) => r.timings.duration < 5000,
  }) || errorRate.add(1);

  sleep(0.1); // Minimal sleep for spike test
}