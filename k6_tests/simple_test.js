import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 5,
  duration: '30s',
  insecureSkipTLSVerify: true,
};

export default function () {
  // Datos de prueba simples
  const visitanteData = {
    nombreVisitante: `Test_${__VU}_${__ITER}`,
    visitanteDocumento: `${Math.floor(Math.random() * 100000000)}`,
    destino: `Apto ${Math.floor(Math.random() * 100) + 1}`,
    nombreAutoriza: `Auth_${__VU}`,
    idConjunto: 'test123'
  };

  // Simular registro sin autenticación real
  let response = http.post(
    'https://localhost/residence/visitantes/peaton',
    JSON.stringify(visitanteData),
    { 
      headers: { 'Content-Type': 'application/json' },
      timeout: '10s'
    }
  );

  check(response, {
    'Status is not 404': (r) => r.status !== 404,
    'Response time < 2000ms': (r) => r.timings.duration < 2000,
  });

  console.log(`VU ${__VU} - Status: ${response.status}, Time: ${response.timings.duration}ms`);
  
  sleep(1);
}