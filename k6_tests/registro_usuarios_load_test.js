import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas personalizadas
export let errorRate = new Rate('errors');

// Configuración de escenarios para registro de usuarios
export let options = {
  scenarios: {
    // Escenario 1: Registro de usuarios básico - 10 VUs
    registro_10_users: {
      executor: 'constant-vus',
      vus: 10,
      duration: '2m',
      tags: { scenario: '10_users_registro' },
      startTime: '0s',
    },
    // Escenario 2: Registro de usuarios medio - 25 VUs
    registro_25_users: {
      executor: 'constant-vus',
      vus: 25,
      duration: '2m',
      tags: { scenario: '25_users_registro' },
      startTime: '3m',
    },
    // Escenario 3: Registro de usuarios alto - 50 VUs
    registro_50_users: {
      executor: 'constant-vus',
      vus: 50,
      duration: '2m',
      tags: { scenario: '50_users_registro' },
      startTime: '6m',
    },
    // Escenario 4: Registro de usuarios extremo - 75 VUs
    registro_75_users: {
      executor: 'constant-vus',
      vus: 75,
      duration: '2m',
      tags: { scenario: '75_users_registro' },
      startTime: '9m',
    },
    // Escenario 5: Punto de quiebre - 100 VUs
    registro_100_users: {
      executor: 'constant-vus',
      vus: 100,
      duration: '2m',
      tags: { scenario: '100_users_registro' },
      startTime: '12m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% de requests < 3s
    http_req_failed: ['rate<0.1'],     // Error rate < 10%
    errors: ['rate<0.1'],
  },
};

// URL base del API Gateway en AWS
const BASE_URL = 'https://your-aws-domain.com'; // REEMPLAZAR con tu dominio de AWS

// Datos de ejemplo para diferentes tipos de usuarios
const ROLES = ['SEGURIDAD_CR', 'MANTENIMIENTO_CR', 'ASEO_CR', 'PROPIEDAD_CR'];

// Generar datos aleatorios para usuario
function generarDatosUsuario() {
  const userId = Math.floor(Math.random() * 1000000);
  const rol = ROLES[Math.floor(Math.random() * ROLES.length)];
  
  return {
    nombre: `Usuario Test ${userId}`,
    correo: `test${userId}@colive.com`,
    username: `user${userId}`,
    password: 'Password123!',
    celular: `300${userId.toString().padStart(7, '0')}`,
    rol: rol
  };
}

// Generar datos de propiedad para propietarios
function generarDatosPropiedad() {
  const propId = Math.floor(Math.random() * 1000);
  
  return {
    code: `Torre 1 Apto ${propId}`,
    parqueadero: Math.floor(Math.random() * 100) + 1,
    bodega: Math.floor(Math.random() * 50) + 1
  };
}

export default function () {
  const userData = generarDatosUsuario();
  
  // Configurar headers
  const headers = {
    'Content-Type': 'application/json',
  };

  let endpoint, payload;

  if (userData.rol === 'PROPIEDAD_CR') {
    // Registro de propietario con propiedad
    endpoint = `${BASE_URL}/fe-api/crear-usuario-propiedad`;
    payload = {
      residence: generarDatosPropiedad(),
      user: userData
    };
  } else {
    // Registro de otros roles
    endpoint = `${BASE_URL}/fe-api/crear-usuario-rol`;
    payload = userData;
  }

  // 1. Registrar usuario
  const registroResponse = http.post(endpoint, JSON.stringify(payload), { headers });
  
  const registroSuccess = check(registroResponse, {
    'Registro - Status 200': (r) => r.status === 200,
    'Registro - Respuesta válida': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true || body.usuarioId !== undefined;
      } catch (e) {
        return false;
      }
    },
    'Registro - Tiempo de respuesta < 5s': (r) => r.timings.duration < 5000,
  });

  if (!registroSuccess) {
    errorRate.add(1);
    console.log(`Error en registro: ${registroResponse.status} - ${registroResponse.body}`);
  }

  // 2. Intentar login con el usuario creado (si el registro fue exitoso)
  if (registroResponse.status === 200) {
    sleep(1); // Esperar 1 segundo antes del login
    
    const loginPayload = {
      username: userData.username,
      password: userData.password
    };

    const loginResponse = http.post(
      `${BASE_URL}/fe-api/login`,
      JSON.stringify(loginPayload),
      { headers }
    );

    const loginSuccess = check(loginResponse, {
      'Login - Status 200': (r) => r.status === 200,
      'Login - Token recibido': (r) => {
        try {
          const body = JSON.parse(r.body);
          return !body.error && (body.userId || body.token);
        } catch (e) {
          return false;
        }
      },
      'Login - Tiempo de respuesta < 3s': (r) => r.timings.duration < 3000,
    });

    if (!loginSuccess) {
      errorRate.add(1);
      console.log(`Error en login: ${loginResponse.status} - ${loginResponse.body}`);
    }
  }

  // Pausa entre iteraciones
  sleep(Math.random() * 2 + 1); // 1-3 segundos de pausa aleatoria
}

export function handleSummary(data) {
  return {
    'results/registro_usuarios_load_test_summary.json': JSON.stringify(data, null, 2),
    'results/registro_usuarios_load_test_summary.html': generateHTMLReport(data),
  };
}

function generateHTMLReport(data) {
  const date = new Date().toISOString();
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Reporte de Pruebas de Carga - Registro de Usuarios</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { background-color: #f0f0f0; padding: 15px; border-radius: 5px; }
            .metric { margin: 10px 0; padding: 10px; border-left: 4px solid #007bff; }
            .error { border-left-color: #dc3545; }
            .success { border-left-color: #28a745; }
            .warning { border-left-color: #ffc107; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>📊 Reporte de Pruebas de Carga - Registro de Usuarios</h1>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Duración Total:</strong> ${data.state.testRunDurationMs}ms</p>
        </div>
        
        <h2>🎯 Resumen de Métricas</h2>
        <div class="metric ${data.metrics.http_req_failed.values.rate > 0.1 ? 'error' : 'success'}">
            <strong>Tasa de Error:</strong> ${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%
        </div>
        
        <div class="metric ${data.metrics.http_req_duration.values.p95 > 3000 ? 'warning' : 'success'}">
            <strong>P95 Tiempo de Respuesta:</strong> ${data.metrics.http_req_duration.values.p95.toFixed(2)}ms
        </div>
        
        <div class="metric">
            <strong>Requests Totales:</strong> ${data.metrics.http_reqs.values.count}
        </div>
        
        <div class="metric">
            <strong>Throughput:</strong> ${data.metrics.http_reqs.values.rate.toFixed(2)} req/s
        </div>

        <h2>📈 Detalles por Escenario</h2>
        <p>Los resultados detallados están disponibles en el archivo JSON.</p>
    </body>
    </html>
  `;
}
