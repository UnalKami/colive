import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Counter } from 'k6/metrics';

// Métricas personalizadas
export let errorRate = new Rate('errors');
export let visitantesRegistrados = new Counter('visitantes_registrados');
export let salidasRegistradas = new Counter('salidas_registradas');

// Configuración de prueba de estrés para visitantes
export let options = {
  stages: [
    { duration: '2m', target: 10 },   // Subir a 10 usuarios
    { duration: '3m', target: 10 },   // Mantener 10 usuarios
    { duration: '2m', target: 25 },   // Subir a 25 usuarios
    { duration: '3m', target: 25 },   // Mantener 25 usuarios
    { duration: '2m', target: 50 },   // Subir a 50 usuarios
    { duration: '3m', target: 50 },   // Mantener 50 usuarios
    { duration: '2m', target: 75 },   // Subir a 75 usuarios
    { duration: '3m', target: 75 },   // Mantener 75 usuarios
    { duration: '2m', target: 100 },  // Subir a 100 usuarios (punto de quiebre esperado)
    { duration: '3m', target: 100 },  // Mantener 100 usuarios
    { duration: '2m', target: 0 },    // Bajar a 0 usuarios
  ],
  thresholds: {
    http_req_duration: ['p(95)<2500'], // 95% de requests < 2.5s
    http_req_failed: ['rate<0.08'],    // Error rate < 8%
    errors: ['rate<0.08'],
  },
};

// URL base del API Gateway
const BASE_URL = 'http://localhost:8000';

// Token de autorización (REEMPLAZAR con token real de usuario VIGILANTE)
const AUTH_TOKEN = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...';

// IDs de conjuntos de prueba
const CONJUNTO_IDS = ['test-conjunto-1', 'test-conjunto-2', 'test-conjunto-3'];

// Tipos de vehículos
const TIPOS_VEHICULO = ['Automóvil', 'Motocicleta', 'Camioneta', 'Bicicleta'];

// Pool de placas para reutilizar en salidas
let placasRegistradas = [];

// Generar datos aleatorios para visitante peatón
function generarDatosPeaton() {
  const visitanteId = Math.floor(Math.random() * 10000);
  const conjuntoId = CONJUNTO_IDS[Math.floor(Math.random() * CONJUNTO_IDS.length)];
  
  return {
    nombreVisitante: `Visitante Peatón ${visitanteId}`,
    visitanteDocumento: `${Math.floor(Math.random() * 100000000)}`,
    destino: `Apartamento ${Math.floor(Math.random() * 500) + 100}`,
    nombreAutoriza: `Residente ${visitanteId}`,
    idConjunto: conjuntoId
  };
}

// Generar datos aleatorios para visitante vehicular
function generarDatosVehicular() {
  const visitanteId = Math.floor(Math.random() * 10000);
  const conjuntoId = CONJUNTO_IDS[Math.floor(Math.random() * CONJUNTO_IDS.length)];
  const placa = `ABC${Math.floor(Math.random() * 900) + 100}`;
  
  // Guardar placa para posibles salidas
  if (placasRegistradas.length < 100) {
    placasRegistradas.push({ placa, conjuntoId });
  }
  
  return {
    nombreVisitante: `Visitante Vehicular ${visitanteId}`,
    visitanteDocumento: `${Math.floor(Math.random() * 100000000)}`,
    destino: `Apartamento ${Math.floor(Math.random() * 500) + 100}`,
    nombreAutoriza: `Residente ${visitanteId}`,
    placaVehiculo: placa,
    tipoVehiculo: TIPOS_VEHICULO[Math.floor(Math.random() * TIPOS_VEHICULO.length)],
    espacioAsignado: Math.floor(Math.random() * 100) + 1,
    idConjunto: conjuntoId
  };
}

export default function () {
  // Headers con autenticación
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': AUTH_TOKEN,
  };

  // Distribución de operaciones para estrés:
  // 35% registrar peatón, 30% registrar vehicular, 20% consultar, 15% registrar salida
  const operacion = Math.random();
  
  if (operacion < 0.35) {
    // Registrar visitante peatón
    registrarVisitantePeaton(headers);
  } else if (operacion < 0.65) {
    // Registrar visitante vehicular
    registrarVisitanteVehicular(headers);
  } else if (operacion < 0.85) {
    // Consultar visitantes
    consultarVisitantes(headers);
  } else {
    // Registrar salida de vehículo
    registrarSalidaVehiculo(headers);
  }

  // Pausa más corta para generar más estrés
  sleep(Math.random() * 1 + 0.3); // 0.3-1.3 segundos
}

function registrarVisitantePeaton(headers) {
  const datos = generarDatosPeaton();
  
  const response = http.post(
    `${BASE_URL}/residence/visitantes/peaton`,
    JSON.stringify(datos),
    { headers }
  );

  const success = check(response, {
    'Estrés Peatón - Status 201': (r) => r.status === 201,
    'Estrés Peatón - Respuesta válida': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.message && body.visitante;
      } catch (e) {
        return false;
      }
    },
    'Estrés Peatón - Tiempo < 2.5s': (r) => r.timings.duration < 2500,
  });

  if (success) {
    visitantesRegistrados.add(1);
  } else {
    errorRate.add(1);
    console.log(`Error estrés peatón: ${response.status} - ${response.body}`);
  }
}

function registrarVisitanteVehicular(headers) {
  const datos = generarDatosVehicular();
  
  const response = http.post(
    `${BASE_URL}/residence/visitantes/vehicular`,
    JSON.stringify(datos),
    { headers }
  );

  const success = check(response, {
    'Estrés Vehicular - Status 201': (r) => r.status === 201,
    'Estrés Vehicular - Respuesta válida': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.message && body.visitante;
      } catch (e) {
        return false;
      }
    },
    'Estrés Vehicular - Tiempo < 2.5s': (r) => r.timings.duration < 2500,
  });

  if (success) {
    visitantesRegistrados.add(1);
  } else {
    errorRate.add(1);
    console.log(`Error estrés vehicular: ${response.status} - ${response.body}`);
  }
}

function consultarVisitantes(headers) {
  const conjuntoId = CONJUNTO_IDS[Math.floor(Math.random() * CONJUNTO_IDS.length)];
  const fecha = new Date().toISOString().split('T')[0];
  
  const response = http.get(
    `${BASE_URL}/residence/visitantes/conjunto/${conjuntoId}?fecha=${fecha}`,
    { headers }
  );

  const success = check(response, {
    'Estrés Consulta - Status 200': (r) => r.status === 200,
    'Estrés Consulta - Respuesta válida': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.peatones !== undefined && body.vehiculares !== undefined;
      } catch (e) {
        return false;
      }
    },
    'Estrés Consulta - Tiempo < 1.5s': (r) => r.timings.duration < 1500,
  });

  if (!success) {
    errorRate.add(1);
    console.log(`Error estrés consulta: ${response.status} - ${response.body}`);
  }
}

function registrarSalidaVehiculo(headers) {
  let placa, conjuntoId;
  
  // Usar placa registrada o generar una nueva
  if (placasRegistradas.length > 0) {
    const vehiculo = placasRegistradas[Math.floor(Math.random() * placasRegistradas.length)];
    placa = vehiculo.placa;
    conjuntoId = vehiculo.conjuntoId;
  } else {
    placa = `ABC${Math.floor(Math.random() * 900) + 100}`;
    conjuntoId = CONJUNTO_IDS[Math.floor(Math.random() * CONJUNTO_IDS.length)];
  }
  
  const datos = {
    placaVehiculo: placa,
    idConjunto: conjuntoId
  };
  
  const response = http.post(
    `${BASE_URL}/residence/visitantes/vehicular/salida`,
    JSON.stringify(datos),
    { headers }
  );

  const success = check(response, {
    'Estrés Salida - Status 200 o 404': (r) => r.status === 200 || r.status === 404,
    'Estrés Salida - Respuesta válida': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.message || body.error;
      } catch (e) {
        return false;
      }
    },
    'Estrés Salida - Tiempo < 1.5s': (r) => r.timings.duration < 1500,
  });

  if (response.status === 200) {
    salidasRegistradas.add(1);
  } else if (!success) {
    errorRate.add(1);
    console.log(`Error estrés salida: ${response.status} - ${response.body}`);
  }
}

export function handleSummary(data) {
  return {
    'results/visitantes_stress_test_summary.json': JSON.stringify(data, null, 2),
    'results/visitantes_stress_test_summary.html': generateHTMLReport(data),
  };
}

function generateHTMLReport(data) {
  const date = new Date().toISOString();
  const duration = Math.round(data.state.testRunDurationMs / 1000);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Reporte de Pruebas de Estrés - Visitantes</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; background-color: #f5f5f5; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      color: white; padding: 20px; border-radius: 10px; }
            .metric { margin: 15px 0; padding: 15px; border-radius: 8px; 
                      background: white; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .error { border-left: 5px solid #dc3545; }
            .success { border-left: 5px solid #28a745; }
            .warning { border-left: 5px solid #ffc107; }
            .info { border-left: 5px solid #17a2b8; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .chart-placeholder { height: 200px; background: #e9ecef; border-radius: 5px; 
                                 display: flex; align-items: center; justify-content: center; }
        </style>
    </head>
    <body>
        <div class="header">
            <h1>🔥 Reporte de Pruebas de Estrés - Sistema de Visitantes</h1>
            <p><strong>Fecha:</strong> ${date}</p>
            <p><strong>Duración Total:</strong> ${duration}s (${Math.round(duration/60)} minutos)</p>
            <p><strong>Objetivo:</strong> Encontrar punto de quiebre del sistema hasta 100 VUs</p>
        </div>
        
        <div class="grid">
            <div>
                <h2>📊 Métricas de Rendimiento</h2>
                
                <div class="metric ${data.metrics.http_req_failed.values.rate > 0.08 ? 'error' : 'success'}">
                    <h3>Tasa de Error</h3>
                    <p><strong>${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%</strong></p>
                    <small>Umbral: < 8% | ${data.metrics.http_req_failed.values.fails} errores de ${data.metrics.http_reqs.values.count} requests</small>
                </div>
                
                <div class="metric ${data.metrics.http_req_duration.values.p95 > 2500 ? 'warning' : 'success'}">
                    <h3>Tiempo de Respuesta P95</h3>
                    <p><strong>${data.metrics.http_req_duration.values.p95.toFixed(0)}ms</strong></p>
                    <small>Umbral: < 2500ms | Promedio: ${data.metrics.http_req_duration.values.avg.toFixed(0)}ms</small>
                </div>
                
                <div class="metric info">
                    <h3>Throughput</h3>
                    <p><strong>${data.metrics.http_reqs.values.rate.toFixed(2)} req/s</strong></p>
                    <small>Total de requests: ${data.metrics.http_reqs.values.count}</small>
                </div>
            </div>
            
            <div>
                <h2>🎯 Métricas de Visitantes</h2>
                
                <div class="metric success">
                    <h3>Visitantes Registrados</h3>
                    <p><strong>${data.metrics.visitantes_registrados?.values?.count || 0}</strong></p>
                    <small>Tasa: ${((data.metrics.visitantes_registrados?.values?.count || 0) / duration * 60).toFixed(1)} visitantes/min</small>
                </div>
                
                <div class="metric success">
                    <h3>Salidas Procesadas</h3>
                    <p><strong>${data.metrics.salidas_registradas?.values?.count || 0}</strong></p>
                    <small>Eficiencia de salida: ${(((data.metrics.salidas_registradas?.values?.count || 0) / (data.metrics.visitantes_registrados?.values?.count || 1)) * 100).toFixed(1)}%</small>
                </div>
                
                <div class="metric info">
                    <h3>Distribución de Carga</h3>
                    <p>35% Peatones | 30% Vehiculares</p>
                    <small>20% Consultas | 15% Salidas</small>
                </div>
            </div>
        </div>

        <h2>📈 Análisis de Estrés</h2>
        <div class="grid">
            <div class="metric ${data.metrics.http_req_duration.values.p95 > 3000 ? 'error' : 
                                 data.metrics.http_req_duration.values.p95 > 2500 ? 'warning' : 'success'}">
                <h3>Estado del Sistema</h3>
                ${data.metrics.http_req_failed.values.rate > 0.08 ? 
                  '<p>⚠️ <strong>Sistema bajo estrés</strong> - Tasa de error alta</p>' :
                  data.metrics.http_req_duration.values.p95 > 2500 ?
                  '<p>⚠️ <strong>Degradación detectada</strong> - Tiempos de respuesta elevados</p>' :
                  '<p>✅ <strong>Sistema estable</strong> - Métricas dentro de umbrales</p>'
                }
            </div>
            
            <div class="metric info">
                <h3>Punto de Quiebre</h3>
                <p>Máximo: 100 VUs concurrentes</p>
                <small>Revisar logs detallados para identificar el punto exacto de degradación</small>
            </div>
        </div>

        <h2>💡 Recomendaciones</h2>
        <div class="metric">
            <ul>
                <li><strong>Rendimiento:</strong> ${data.metrics.http_req_duration.values.p95 > 2500 ? 
                    'Optimizar consultas a base de datos y cache' : 
                    'Rendimiento óptimo en condiciones de estrés'}</li>
                <li><strong>Escalabilidad:</strong> ${data.metrics.http_req_failed.values.rate > 0.05 ? 
                    'Considerar escalamiento horizontal o optimización de recursos' : 
                    'Sistema escalable para la carga actual'}</li>
                <li><strong>Monitoreo:</strong> Implementar alertas para cuando P95 > 2000ms o error rate > 5%</li>
                <li><strong>Capacidad:</strong> El sistema puede manejar ${data.metrics.http_reqs.values.rate.toFixed(0)} req/s de forma sostenida</li>
            </ul>
        </div>
    </body>
    </html>
  `;
}
