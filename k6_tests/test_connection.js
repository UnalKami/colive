import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 1,
  duration: '10s',
  insecureSkipTLSVerify: true,
};

export default function () {
  // Test 1: Verificar conexión básica
  console.log('Testing basic connection...');
  let response1 = http.get('https://localhost/auth/saludo', {
    headers: { 'Accept': 'application/json' }
  });
  
  console.log(`Auth saludo response: ${response1.status} - ${response1.body}`);
  
  // Test 2: Verificar endpoint de visitantes (sin auth)
  console.log('Testing visitantes endpoint...');
  let response2 = http.get('https://localhost/residence/visitantes/conjunto/test123');
  
  console.log(`Visitantes response: ${response2.status} - ${response2.body}`);
  
  // Test 3: Verificar estructura de respuesta de error de auth
  console.log('Testing auth error response...');
  let response3 = http.post('https://localhost/residence/visitantes/peaton', 
    JSON.stringify({
      nombreVisitante: 'Test',
      visitanteDocumento: '123',
      destino: 'Test',
      nombreAutoriza: 'Test',
      idConjunto: 'test'
    }), 
    { headers: { 'Content-Type': 'application/json' } }
  );
  
  console.log(`Auth test response: ${response3.status} - ${response3.body}`);
}