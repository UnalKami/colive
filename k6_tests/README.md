# Pruebas de Rendimiento K6 - Funcionalidad Visitantes

## Descripción
Conjunto de pruebas de rendimiento para evaluar la funcionalidad de registro de visitantes y encontrar el **knee point** del sistema.

## Archivos de Prueba

### 1. `visitantes_load_test.js`
**Objetivo**: Encontrar el knee point del sistema
- **Escenarios**: 10 escenarios incrementales (10, 20, 30... hasta 100 VUs)
- **Duración**: 2 minutos por escenario
- **Total**: ~30 minutos
- **Operaciones**: Registro peatón, registro vehicular, consulta visitantes

### 2. `visitantes_stress_test.js`
**Objetivo**: Encontrar el punto de quiebre del sistema
- **Patrón**: Incremento gradual hasta 120 VUs
- **Duración**: ~24 minutos
- **Operaciones**: Carga mixta de todas las funcionalidades

### 3. `visitantes_spike_test.js`
**Objetivo**: Evaluar recuperación ante picos súbitos
- **Patrón**: Picos de 100, 150, 200 VUs
- **Duración**: ~7 minutos
- **Operaciones**: Registro masivo de peatones

## Configuración Previa

### 1. Instalar K6
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install k6

# macOS
brew install k6
```

### 2. Generar Token de Autenticación
Antes de ejecutar las pruebas, necesitas un token JWT válido para un usuario con rol VIGILANTE:

```bash
# 1. Hacer login y obtener token
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "vigilante_user", "password": "password"}'

# 2. Copiar el token y reemplazar en los archivos de prueba
# Buscar: const AUTH_TOKEN = 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 3. Verificar Servicios
Asegúrate de que estén corriendo:
- API Gateway (puerto 8000)
- ResidenceCreator-ms (puerto 3001)
- Base de datos PostgreSQL

## Ejecución

### Ejecutar todas las pruebas
```bash
./run_tests.sh
```

### Ejecutar pruebas individuales
```bash
# Prueba de carga (knee point)
k6 run visitantes_load_test.js

# Prueba de estrés
k6 run visitantes_stress_test.js

# Prueba de picos
k6 run visitantes_spike_test.js
```

## Análisis de Resultados

### Métricas Clave
- **http_req_duration**: Tiempo de respuesta (p50, p90, p95)
- **http_req_failed**: Tasa de error
- **http_reqs**: Throughput (requests/segundo)
- **vus**: Usuarios virtuales concurrentes

### Identificar Knee Point
El knee point se identifica cuando:
1. **Response Time**: p95 > 2000ms
2. **Error Rate**: > 10%
3. **Throughput**: Deja de crecer linealmente

### Ejemplo de Análisis
```
VUs | p95 Response Time | Error Rate | Throughput
----|------------------|------------|------------
10  | 850ms           | 2%         | 15 req/s
20  | 1200ms          | 3%         | 28 req/s
30  | 1800ms          | 5%         | 35 req/s  ← Knee point candidato
40  | 2500ms          | 12%        | 32 req/s  ← Knee point confirmado
```

## Resultados Esperados

### Recursos del Sistema
- **CPU**: Ryzen 7 7435HS (16 núcleos)
- **RAM**: 8GB DDR4/DDR5
- **Storage**: SSD 215GB
- **Network**: 100 Mbps

### Estimación de Knee Point
Basado en la arquitectura, se espera encontrar el knee point entre:
- **30-50 VUs** para operaciones de escritura (registro visitantes)
- **50-70 VUs** para operaciones mixtas
- **Degradación significativa** después de 60 VUs

## Troubleshooting

### Error: Token inválido
```bash
# Verificar que el token sea válido
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:8000/auth/verify-token
```

### Error: Conexión rechazada
```bash
# Verificar que los servicios estén corriendo
docker-compose ps
curl http://localhost:8000/health
```

### Error: Base de datos
```bash
# Verificar conexión a PostgreSQL
docker-compose logs CL_residence_db
```