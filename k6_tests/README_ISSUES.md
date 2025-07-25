# Problemas Identificados en las Pruebas K6

## Estado Actual
❌ **Las pruebas NO pueden ejecutarse** debido a problemas de configuración de red.

## Problemas Encontrados

### 1. Endpoints No Disponibles
- Todas las peticiones devuelven **404 Not Found**
- Los endpoints `/auth/saludo` y `/residence/visitantes/*` no están accesibles
- El proxy web no está enrutando correctamente al API Gateway

### 2. Configuración de Red
```
Servicios corriendo:
✅ cl-ag (API Gateway) - Puerto interno 8000
✅ cl-residence-ms - Puerto interno 3001  
✅ cl-web-rp (Proxy Web) - Puerto 80/443
❌ Routing incorrecto entre proxy y gateway
```

### 3. Arquitectura de Red
```
Cliente → cl-web-rp (nginx) → ??? → cl-ag (FastAPI) → cl-residence-ms
                               ↑
                        Conexión faltante
```

## Soluciones Requeridas

### Opción 1: Configurar Nginx Proxy
Agregar en `cl-web-rp/nginx/nginx.conf`:
```nginx
location /auth/ {
    proxy_pass http://cl-ag:8000/auth/;
}

location /residence/ {
    proxy_pass http://cl-ag:8000/residence/;
}
```

### Opción 2: Exponer API Gateway Directamente
Modificar `docker-compose.yml`:
```yaml
cl-ag:
  ports:
    - "8000:8000"
```

### Opción 3: Usar Red Interna de Docker
Ejecutar pruebas desde dentro del contenedor:
```bash
docker exec -it cl-ag k6 run /tests/visitantes_load_test.js
```

## Recomendación

**Para las pruebas de rendimiento**, la mejor opción es:

1. **Exponer API Gateway** en puerto 8000
2. **Actualizar URLs** en pruebas K6 a `http://localhost:8000`
3. **Generar token JWT** válido para autenticación
4. **Ejecutar pruebas** directamente contra el gateway

## Próximos Pasos

1. Decidir arquitectura de red definitiva
2. Configurar routing correcto
3. Generar credenciales de prueba
4. Ejecutar pruebas de rendimiento
5. Analizar knee point

## Estado de Archivos K6

✅ **Creados y listos**:
- `visitantes_load_test.js` - Prueba principal knee point
- `visitantes_stress_test.js` - Prueba de estrés  
- `visitantes_spike_test.js` - Prueba de picos
- `simple_test.js` - Prueba básica de conectividad
- `run_tests.sh` - Script de ejecución

❌ **Bloqueados por**: Configuración de red