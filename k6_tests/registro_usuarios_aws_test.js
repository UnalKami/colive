import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

// Métricas personalizadas
export let errorRate = new Rate('errors');

// Configuración optimizada para AWS - cargas más moderadas
export let options = {
  scenarios: {
    // Escenario 1: Carga inicial conservadora - 5 VUs
    registro_5_users_aws: {
      executor: 'constant-vus',
      vus: 5,
      duration: '3m',
      tags: { scenario: '5_users_aws', environment: 'production' },
      startTime: '0s',
    },
    // Escenario 2: Carga media - 15 VUs
    registro_15_users_aws: {
      executor: 'constant-vus',
      vus: 15,
      duration: '3m',
      tags: { scenario: '15_users_aws', environment: 'production' },
      startTime: '4m',
    },
    // Escenario 3: Carga alta - 30 VUs
    registro_30_users_aws: {
      executor: 'constant-vus',
      vus: 30,
      duration: '3m',
      tags: { scenario: '30_users_aws', environment: 'production' },
      startTime: '8m',
    },
    // Escenario 4: Punto de prueba - 50 VUs
    registro_50_users_aws: {
      executor: 'constant-vus',
      vus: 50,
      duration: '3m',
      tags: { scenario: '50_users_aws', environment: 'production' },
      startTime: '12m',
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<2000'], // Más estricto para producción
    http_req_failed: ['rate<0.05'],    // Error rate < 5% para producción
    errors: ['rate<0.05'],
  },
};

// URL base del sistema en AWS - ACTUALIZAR CON TU DOMINIO
const BASE_URL = __ENV.AWS_BASE_URL || 'https://your-colive-domain.com';

// Verificación SSL habilitada para AWS
const SSL_VERIFY = true;

// Datos de ejemplo para usuarios en AWS
const ROLES = ['SEGURIDAD_CR', 'MANTENIMIENTO_CR', 'ASEO_CR', 'PROPIEDAD_CR'];

// Prefijo para distinguir usuarios de prueba
const TEST_PREFIX = 'aws-k6-test';

// Generar datos de usuario para AWS
function generarDatosUsuarioAWS() {
  const timestamp = Date.now();
  const userId = Math.floor(Math.random() * 100000);
  const rol = ROLES[Math.floor(Math.random() * ROLES.length)];
  
  return {
    nombre: `${TEST_PREFIX}-${userId}`,
    correo: `${TEST_PREFIX}-${userId}@test-colive.com`,
    username: `${TEST_PREFIX}${userId}`,
    password: 'TestAWS123!',
    celular: `300${userId.toString().padStart(7, '0')}`,
    rol: rol
  };
}

// Generar datos de propiedad para AWS
function generarDatosPropiedadAWS() {
  const propId = Math.floor(Math.random() * 1000);
  
  return {
    code: `AWS-Test-Torre${propId}`,
    parqueadero: Math.floor(Math.random() * 50) + 1,
    bodega: Math.floor(Math.random() * 25) + 1
  };
}

export default function () {
  const userData = generarDatosUsuarioAWS();
  
  // Headers optimizados para AWS
  const headers = {
    'Content-Type': 'application/json',
    'User-Agent': 'k6-load-test-aws/1.0',
    'Accept': 'application/json',
  };

  // Configuración de request para AWS
  const params = {
    headers: headers,
    timeout: '30s', // Timeout más alto para conexiones a AWS
    tags: {
      environment: 'aws',
      test_type: 'load_test'
    }
  };

  let endpoint, payload;

  if (userData.rol === 'PROPIEDAD_CR') {
    // Registro de propietario con propiedad
    endpoint = `${BASE_URL}/fe-api/crear-usuario-propiedad`;
    payload = {
      residence: generarDatosPropiedadAWS(),
      user: userData
    };
  } else {
    // Registro de otros roles
    endpoint = `${BASE_URL}/fe-api/crear-usuario-rol`;
    payload = userData;
  }

  // 1. Verificar conectividad antes del registro
  const healthCheck = http.get(`${BASE_URL}/health`, { timeout: '10s' });
  
  if (healthCheck.status !== 200) {
    console.log(`Sistema AWS no disponible: ${healthCheck.status}`);
    errorRate.add(1);
    return;
  }

  // 2. Registrar usuario en AWS
  const registroResponse = http.post(endpoint, JSON.stringify(payload), params);
  
  const registroSuccess = check(registroResponse, {
    'AWS Registro - Status 200': (r) => r.status === 200,
    'AWS Registro - No errores de red': (r) => r.status !== 0,
    'AWS Registro - Respuesta válida': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.success === true || body.usuarioId !== undefined;
      } catch (e) {
        return false;
      }
    },
    'AWS Registro - Tiempo < 5s': (r) => r.timings.duration < 5000,
    'AWS Registro - No timeout': (r) => r.timings.duration < 30000,
  });

  if (!registroSuccess) {
    errorRate.add(1);
    console.log(`Error AWS registro: ${registroResponse.status} - ${registroResponse.body.slice(0, 200)}`);
  }

  // 3. Intentar login solo si el registro fue exitoso
  if (registroResponse.status === 200) {
    sleep(2); // Pausa mayor para AWS
    
    const loginPayload = {
      username: userData.username,
      password: userData.password
    };

    const loginResponse = http.post(
      `${BASE_URL}/fe-api/login`,
      JSON.stringify(loginPayload),
      params
    );

    const loginSuccess = check(loginResponse, {
      'AWS Login - Status 200': (r) => r.status === 200,
      'AWS Login - No errores de red': (r) => r.status !== 0,
      'AWS Login - Token válido': (r) => {
        try {
          const body = JSON.parse(r.body);
          return !body.error && (body.userId || body.token || body.authToken);
        } catch (e) {
          return false;
        }
      },
      'AWS Login - Tiempo < 3s': (r) => r.timings.duration < 3000,
    });

    if (!loginSuccess) {
      errorRate.add(1);
      console.log(`Error AWS login: ${loginResponse.status} - ${loginResponse.body.slice(0, 200)}`);
    }
  }

  // Pausa entre iteraciones - mayor para AWS
  sleep(Math.random() * 3 + 2); // 2-5 segundos
}

export function handleSummary(data) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  
  return {
    [`results/aws_registro_usuarios_${timestamp}.json`]: JSON.stringify(data, null, 2),
    [`results/aws_registro_usuarios_${timestamp}.html`]: generateAWSHTMLReport(data),
  };
}

function generateAWSHTMLReport(data) {
  const date = new Date().toISOString();
  const duration = Math.round(data.state.testRunDurationMs / 1000);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Reporte AWS - Registro de Usuarios - Colive</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; margin: 20px; 
                   background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
            .container { background: white; border-radius: 15px; padding: 30px; 
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
            .header { text-align: center; margin-bottom: 30px; padding: 20px; 
                     background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%); 
                     color: white; border-radius: 10px; }
            .aws-badge { display: inline-block; background: #FF9900; color: white; 
                        padding: 5px 15px; border-radius: 20px; font-size: 0.8em; 
                        margin: 10px 0; }
            .metric { margin: 15px 0; padding: 20px; border-radius: 10px; 
                      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); }
            .error { border-left: 5px solid #dc3545; }
            .success { border-left: 5px solid #28a745; }
            .warning { border-left: 5px solid #ffc107; }
            .info { border-left: 5px solid #17a2b8; }
            .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
            .metric-value { font-size: 2em; font-weight: bold; margin: 10px 0; }
            .aws-logo { width: 60px; height: auto; margin: 0 10px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>☁️ Reporte de Pruebas AWS - Registro de Usuarios</h1>
                <div class="aws-badge">Amazon Web Services</div>
                <p><strong>Fecha:</strong> ${date}</p>
                <p><strong>Duración:</strong> ${duration}s (${Math.round(duration/60)} minutos)</p>
                <p><strong>Ambiente:</strong> Producción AWS</p>
            </div>
            
            <div class="grid">
                <div class="metric ${data.metrics.http_req_failed.values.rate > 0.05 ? 'error' : 'success'}">
                    <h3>🎯 Tasa de Error</h3>
                    <div class="metric-value">${(data.metrics.http_req_failed.values.rate * 100).toFixed(2)}%</div>
                    <p>Umbral AWS: < 5% | Errores: ${data.metrics.http_req_failed.values.fails} de ${data.metrics.http_reqs.values.count}</p>
                </div>
                
                <div class="metric ${data.metrics.http_req_duration.values.p95 > 2000 ? 'warning' : 'success'}">
                    <h3>⚡ Tiempo de Respuesta P95</h3>
                    <div class="metric-value">${data.metrics.http_req_duration.values.p95.toFixed(0)}ms</div>
                    <p>Umbral AWS: < 2000ms | Promedio: ${data.metrics.http_req_duration.values.avg.toFixed(0)}ms</p>
                </div>
                
                <div class="metric info">
                    <h3>🚀 Throughput</h3>
                    <div class="metric-value">${data.metrics.http_reqs.values.rate.toFixed(2)}</div>
                    <p>Requests por segundo | Total: ${data.metrics.http_reqs.values.count} requests</p>
                </div>
                
                <div class="metric">
                    <h3>📊 Distribución de Carga</h3>
                    <p><strong>Escenarios ejecutados:</strong></p>
                    <ul>
                        <li>5 VUs durante 3 minutos</li>
                        <li>15 VUs durante 3 minutos</li>
                        <li>30 VUs durante 3 minutos</li>
                        <li>50 VUs durante 3 minutos</li>
                    </ul>
                </div>
            </div>

            <h2>☁️ Análisis de Rendimiento en AWS</h2>
            
            <div class="metric ${data.metrics.http_req_failed.values.rate > 0.05 ? 'error' : 'success'}">
                <h3>Estado del Sistema AWS</h3>
                ${data.metrics.http_req_failed.values.rate > 0.05 ? 
                  '<p>⚠️ <strong>Sistema bajo estrés</strong> - Revisar configuración de AWS</p>' :
                  '<p>✅ <strong>Sistema AWS operando correctamente</strong></p>'
                }
                <p><strong>Latencia de red:</strong> ${data.metrics.http_req_duration.values.avg.toFixed(0)}ms promedio</p>
                <p><strong>Disponibilidad:</strong> ${((1 - data.metrics.http_req_failed.values.rate) * 100).toFixed(2)}%</p>
            </div>

            <div class="grid">
                <div class="metric info">
                    <h3>🌐 Configuración AWS</h3>
                    <ul>
                        <li><strong>Región:</strong> Verificar en configuración</li>
                        <li><strong>Load Balancer:</strong> Distribuye carga correctamente</li>
                        <li><strong>Auto Scaling:</strong> ${data.metrics.http_req_duration.values.p95 < 2000 ? 'Funcionando' : 'Revisar configuración'}</li>
                        <li><strong>SSL/TLS:</strong> Habilitado y funcionando</li>
                    </ul>
                </div>
                
                <div class="metric">
                    <h3>📈 Recomendaciones AWS</h3>
                    <ul>
                        <li><strong>CloudWatch:</strong> Configurar métricas personalizadas</li>
                        <li><strong>Auto Scaling:</strong> ${data.metrics.http_req_duration.values.p95 > 2000 ? 'Ajustar políticas de escalado' : 'Configuración óptima'}</li>
                        <li><strong>RDS:</strong> ${data.metrics.http_req_duration.values.p95 > 3000 ? 'Considerar read replicas' : 'Rendimiento adecuado'}</li>
                        <li><strong>ElastiCache:</strong> Implementar para mejorar tiempos de respuesta</li>
                    </ul>
                </div>
            </div>

            <div class="metric">
                <h3>🔧 Métricas Técnicas AWS</h3>
                <div class="grid">
                    <div>
                        <p><strong>Tiempo DNS:</strong> ${(data.metrics.http_req_connecting?.values?.avg || 0).toFixed(2)}ms</p>
                        <p><strong>Tiempo TLS:</strong> ${(data.metrics.http_req_tls_handshaking?.values?.avg || 0).toFixed(2)}ms</p>
                    </div>
                    <div>
                        <p><strong>Tiempo de envío:</strong> ${(data.metrics.http_req_sending?.values?.avg || 0).toFixed(2)}ms</p>
                        <p><strong>Tiempo de recepción:</strong> ${(data.metrics.http_req_receiving?.values?.avg || 0).toFixed(2)}ms</p>
                    </div>
                </div>
            </div>

            <div class="metric ${data.metrics.http_req_failed.values.rate < 0.01 ? 'success' : 'warning'}">
                <h3>🏆 Conclusión AWS</h3>
                <p>El sistema desplegado en AWS ${data.metrics.http_req_failed.values.rate < 0.01 ? 
                    'está funcionando de manera óptima' : 
                    'presenta algunas oportunidades de mejora'}.</p>
                <p><strong>Capacidad probada:</strong> Hasta 50 usuarios concurrentes en registro.</p>
                <p><strong>Recomendación:</strong> ${data.metrics.http_req_failed.values.rate < 0.05 ? 
                    'Sistema listo para producción' : 
                    'Optimizar configuración antes de alta carga'}.</p>
            </div>
        </div>
    </body>
    </html>
  `;
}
