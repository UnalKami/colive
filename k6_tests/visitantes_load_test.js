import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas personalizadas
export let errorRate = new Rate('errors');

// Configuración de escenarios para encontrar knee point
export let options = {
  scenarios: {
    // Escenario 1: 10 VUs
    load_10_users: {
      executor: 'constant-vus',
      vus: 10,
      duration: '2m',
      tags: { scenario: '10_users' },
      startTime: '0s',
    },
    // Escenario 2: 20 VUs
    load_20_users: {
      executor: 'constant-vus',
      vus: 20,
      duration: '2m',
      tags: { scenario: '20_users' },
      startTime: '3m',
    },
    // Escenario 3: 30 VUs
    load_30_users: {
      executor: 'constant-vus',
      vus: 30,
      duration: '2m',
      tags: { scenario: '30_users' },
      startTime: '6m',
    },
    // Escenario 4: 40 VUs
    load_40_users: {
      executor: 'constant-vus',
      vus: 40,
      duration: '2m',
      tags: { scenario: '40_users' },
      startTime: '9m',
    },
    // Escenario 5: 50 VUs
    load_50_users: {
      executor: 'constant-vus',
      vus: 50,
      duration: '2m',
      tags: { scenario: '50_users' },
      startTime: '12m',
    },
    // Escenario 6: 60 VUs
    load_60_users: {
      executor: 'constant-vus',
      vus: 60,
      duration: '2m',
      tags: { scenario: '60_users' },
      startTime: '15m',
    },
    // Escenario 7: 70 VUs
    load_70_users: {
      executor: 'constant-vus',
      vus: 70,
      duration: '2m',
      tags: { scenario: '70_users' },
      startTime: '18m',
    },
    // Escenario 8: 80 VUs
    load_80_users: {
      executor: 'constant-vus',
      vus: 80,
      duration: '2m',
      tags: { scenario: '80_users' },
      startTime: '21m',
    },
    // Escenario 9: 90 VUs
    load_90_users: {
      executor: 'constant-vus',
      vus: 90,
      duration: '2m',
      tags: { scenario: '90_users' },
      startTime: '24m',
    },
    // Escenario 10: 100 VUs
    load_100_users: {
      executor: 'constant-vus',
      vus: 100,
      duration: '2m',
      tags: { scenario: '100_users' },
      startTime: '27m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% de requests < 2s
    http_req_failed: ['rate<0.1'],     // Error rate < 10%
    errors: ['rate<0.1'],
  },
};

// URL base del API Gateway directo
const BASE_URL = 'http://localhost:8000';

// Token de prueba - deshabilitado para pruebas de rendimiento
const AUTH_TOKEN = 'Bearer test_token_disabled';

export default function () {
  // Headers comunes
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': AUTH_TOKEN,
  };

  // Datos de prueba para visitante peatón
  const peatonData = {
    nombreVisitante: `Visitante_${Math.random().toString(36).substr(2, 9)}`,
    visitanteDocumento: `${Math.floor(Math.random() * 100000000)}`,
    destino: `Apto ${Math.floor(Math.random() * 500) + 1}`,
    nombreAutoriza: `Residente_${Math.random().toString(36).substr(2, 5)}`,
    idConjunto: 'conjunto123'
  };

  // Datos de prueba para visitante vehicular
  const vehicularData = {
    nombreVisitante: `Conductor_${Math.random().toString(36).substr(2, 9)}`,
    visitanteDocumento: `${Math.floor(Math.random() * 100000000)}`,
    destino: `Apto ${Math.floor(Math.random() * 500) + 1}`,
    nombreAutoriza: `Residente_${Math.random().toString(36).substr(2, 5)}`,
    placaVehiculo: `ABC${Math.floor(Math.random() * 999)}`,
    tipoVehiculo: ['automóvil', 'motocicleta', 'camioneta'][Math.floor(Math.random() * 3)],
    espacioAsignado: Math.floor(Math.random() * 100) + 1,
    idConjunto: 'conjunto123'
  };

  // Test 1: Registrar visitante peatón
  let peatonResponse = http.post(
    `${BASE_URL}/residence/visitantes/peaton`,
    JSON.stringify(peatonData),
    { headers }
  );

  check(peatonResponse, {
    'Peatón - Status 200/201': (r) => r.status === 200 || r.status === 201,
    'Peatón - Response time < 1000ms': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  sleep(0.5);

  // Test 2: Registrar visitante vehicular
  let vehicularResponse = http.post(
    `${BASE_URL}/residence/visitantes/vehicular`,
    JSON.stringify(vehicularData),
    { headers }
  );

  check(vehicularResponse, {
    'Vehicular - Status 200/201': (r) => r.status === 200 || r.status === 201,
    'Vehicular - Response time < 1000ms': (r) => r.timings.duration < 1000,
  }) || errorRate.add(1);

  sleep(0.5);

  // Test 3: Consultar visitantes del conjunto
  let consultaResponse = http.get(
    `${BASE_URL}/residence/visitantes/conjunto/conjunto123`,
    { headers }
  );

  check(consultaResponse, {
    'Consulta - Status 200': (r) => r.status === 200,
    'Consulta - Response time < 500ms': (r) => r.timings.duration < 500,
  }) || errorRate.add(1);

  sleep(1);
}