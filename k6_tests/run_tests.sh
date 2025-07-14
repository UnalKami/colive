#!/bin/bash

# Script para ejecutar todas las pruebas de rendimiento de visitantes
# Asegúrate de tener K6 instalado y los servicios corriendo

echo "=== Iniciando Pruebas de Rendimiento - Funcionalidad Visitantes ==="
echo "Fecha: $(date)"
echo ""

# Crear directorio para resultados
mkdir -p results
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

echo "1. Ejecutando Prueba de Carga (Load Test) - Knee Point Analysis"
echo "   Duración estimada: 30 minutos"
k6 run --out json=results/load_test_${TIMESTAMP}.json visitantes_load_test.js

echo ""
echo "2. Ejecutando Prueba de Estrés (Stress Test)"
echo "   Duración estimada: 24 minutos"
k6 run --out json=results/stress_test_${TIMESTAMP}.json visitantes_stress_test.js

echo ""
echo "3. Ejecutando Prueba de Picos (Spike Test)"
echo "   Duración estimada: 7 minutos"
k6 run --out json=results/spike_test_${TIMESTAMP}.json visitantes_spike_test.js

echo ""
echo "=== Pruebas Completadas ==="
echo "Resultados guardados en: results/"
echo ""
echo "Para analizar los resultados:"
echo "1. Revisa los archivos JSON en results/"
echo "2. Busca el knee point donde response time aumenta significativamente"
echo "3. Identifica el punto donde error rate supera el 10%"
echo ""
echo "Métricas clave a analizar:"
echo "- http_req_duration (p50, p90, p95)"
echo "- http_req_failed (error rate)"
echo "- http_reqs (throughput)"
echo "- vus (virtual users)"