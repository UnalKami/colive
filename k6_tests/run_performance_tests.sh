#!/bin/bash

# Script para ejecutar todas las pruebas de rendimiento
# Autor: Sistema Colive
# Fecha: $(date)

set -e  # Salir si cualquier comando falla

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para imprimir mensajes colorados
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Función para verificar si k6 está instalado
check_k6() {
    if ! command -v k6 &> /dev/null; then
        print_error "k6 no está instalado. Por favor instálalo primero:"
        echo "Ubuntu/Debian: sudo apt update && sudo apt install k6"
        echo "macOS: brew install k6"
        echo "Arch Linux: yay -S k6"
        exit 1
    fi
    print_success "k6 encontrado: $(k6 version)"
}

# Función para verificar que el sistema esté en ejecución
check_system() {
    print_status "Verificando que el sistema esté en ejecución..."
    
    # Verificar API Gateway
    if curl -s -f -o /dev/null "http://localhost:8000/health" 2>/dev/null; then
        print_success "API Gateway respondiendo en puerto 8000"
    else
        print_warning "API Gateway no responde en puerto 8000"
        echo "Asegúrate de que docker-compose esté ejecutándose:"
        echo "docker-compose up -d"
    fi
    
    # Verificar base de datos de autenticación
    if curl -s -f -o /dev/null "http://localhost:8080/actuator/health" 2>/dev/null; then
        print_success "Microservicio de autenticación respondiendo"
    else
        print_warning "Microservicio de autenticación no responde en puerto 8080"
    fi
}

# Función para crear directorios necesarios
setup_directories() {
    print_status "Configurando directorios..."
    mkdir -p results
    mkdir -p logs
    print_success "Directorios creados"
}

# Función para ejecutar prueba de registro de usuarios
run_user_registration_test() {
    print_status "Ejecutando pruebas de registro de usuarios..."
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local log_file="logs/registro_usuarios_${timestamp}.log"
    
    k6 run \
        --out json=results/registro_usuarios_${timestamp}.json \
        --summary-trend-stats="avg,min,med,max,p(90),p(95),p(99)" \
        registro_usuarios_load_test.js 2>&1 | tee "$log_file"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_success "Prueba de registro de usuarios completada"
        print_status "Resultados en: results/registro_usuarios_load_test_summary.html"
    else
        print_error "Prueba de registro de usuarios falló"
        return 1
    fi
}

# Función para ejecutar prueba de estrés de visitantes
run_visitors_stress_test() {
    print_status "Ejecutando pruebas de estrés de visitantes..."
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local log_file="logs/visitantes_stress_${timestamp}.log"
    
    k6 run \
        --out json=results/visitantes_stress_${timestamp}.json \
        --summary-trend-stats="avg,min,med,max,p(90),p(95),p(99)" \
        visitantes_stress_advanced_test.js 2>&1 | tee "$log_file"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_success "Prueba de estrés de visitantes completada"
        print_status "Resultados en: results/visitantes_stress_test_summary.html"
    else
        print_error "Prueba de estrés de visitantes falló"
        return 1
    fi
}

# Función para ejecutar prueba de picos
run_spike_test() {
    print_status "Ejecutando pruebas de picos súbitos..."
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local log_file="logs/visitantes_spike_${timestamp}.log"
    
    k6 run \
        --out json=results/visitantes_spike_${timestamp}.json \
        --summary-trend-stats="avg,min,med,max,p(90),p(95),p(99)" \
        visitantes_spike_test_advanced.js 2>&1 | tee "$log_file"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_success "Prueba de picos completada"
        print_status "Resultados en: results/visitantes_spike_test_summary.html"
    else
        print_error "Prueba de picos falló"
        return 1
    fi
}

# Función para generar reporte consolidado
generate_consolidated_report() {
    print_status "Generando reporte consolidado..."
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local report_file="results/reporte_consolidado_${timestamp}.html"
    
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Reporte Consolidado de Pruebas de Rendimiento - Colive</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                  color: white; padding: 20px; border-radius: 10px; text-align: center; }
        .summary { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; 
                   box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .metric { padding: 15px; border-radius: 5px; border-left: 4px solid #007bff; }
        .success { border-left-color: #28a745; background: #d4edda; }
        .warning { border-left-color: #ffc107; background: #fff3cd; }
        .error { border-left-color: #dc3545; background: #f8d7da; }
        .test-link { display: inline-block; margin: 10px; padding: 10px 15px; 
                     background: #007bff; color: white; text-decoration: none; 
                     border-radius: 5px; }
        .test-link:hover { background: #0056b3; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Reporte Consolidado de Pruebas de Rendimiento</h1>
        <h2>Sistema Colive - Módulos de Usuarios y Visitantes</h2>
        <p>Generado el: $(date)</p>
    </div>
    
    <div class="summary">
        <h2>📊 Resumen Ejecutivo</h2>
        <p>Este reporte consolida los resultados de las pruebas de rendimiento ejecutadas sobre los módulos críticos del sistema Colive:</p>
        <ul>
            <li><strong>Registro de Usuarios:</strong> Evaluación de capacidad de registro masivo</li>
            <li><strong>Gestión de Visitantes:</strong> Pruebas de estrés en operaciones CRUD</li>
            <li><strong>Resistencia a Picos:</strong> Comportamiento ante tráfico súbito</li>
        </ul>
    </div>
    
    <div class="grid">
        <div class="summary">
            <h3>👥 Pruebas de Registro de Usuarios</h3>
            <p>Evaluación de la capacidad del sistema para manejar registros masivos de usuarios con diferentes roles.</p>
            <a href="registro_usuarios_load_test_summary.html" class="test-link">Ver Reporte Detallado</a>
        </div>
        
        <div class="summary">
            <h3>🚗 Pruebas de Estrés - Visitantes</h3>
            <p>Análisis del punto de quiebre del sistema bajo carga sostenida de operaciones de visitantes.</p>
            <a href="visitantes_stress_test_summary.html" class="test-link">Ver Reporte Detallado</a>
        </div>
        
        <div class="summary">
            <h3>⚡ Pruebas de Picos Súbitos</h3>
            <p>Evaluación de la resistencia y recuperación del sistema ante picos súbitos de tráfico.</p>
            <a href="visitantes_spike_test_summary.html" class="test-link">Ver Reporte Detallado</a>
        </div>
    </div>
    
    <div class="summary">
        <h2>🎯 Métricas Clave</h2>
        <div class="grid">
            <div class="metric">
                <h4>Throughput Máximo</h4>
                <p>Verificar en reportes individuales el throughput máximo sostenible</p>
            </div>
            <div class="metric">
                <h4>Tiempo de Respuesta</h4>
                <p>P95 debe mantenerse bajo 2000ms para operaciones críticas</p>
            </div>
            <div class="metric">
                <h4>Tasa de Error</h4>
                <p>Debe mantenerse bajo 5% en condiciones normales</p>
            </div>
        </div>
    </div>
    
    <div class="summary">
        <h2>📈 Recomendaciones Generales</h2>
        <ul>
            <li><strong>Monitoreo:</strong> Implementar dashboards en tiempo real para las métricas clave</li>
            <li><strong>Alertas:</strong> Configurar alertas cuando P95 > 2000ms o error rate > 5%</li>
            <li><strong>Escalabilidad:</strong> Considerar auto-scaling basado en CPU y memoria</li>
            <li><strong>Cache:</strong> Implementar cache distribuido para consultas frecuentes</li>
            <li><strong>Base de Datos:</strong> Optimizar consultas lentas identificadas</li>
        </ul>
    </div>
    
    <div class="summary">
        <h2>📁 Archivos Generados</h2>
        <p>Los siguientes archivos fueron generados durante la ejecución:</p>
        <ul>
            <li>Reportes HTML detallados por cada tipo de prueba</li>
            <li>Datos JSON con métricas completas en el directorio results/</li>
            <li>Logs de ejecución en el directorio logs/</li>
        </ul>
    </div>
</body>
</html>
EOF
    
    print_success "Reporte consolidado generado: $report_file"
}

# Función para mostrar ayuda
show_help() {
    echo "Uso: $0 [OPCIÓN]"
    echo ""
    echo "Ejecuta pruebas de rendimiento para el sistema Colive"
    echo ""
    echo "Opciones:"
    echo "  all         Ejecutar todas las pruebas"
    echo "  users       Solo pruebas de registro de usuarios"
    echo "  stress      Solo pruebas de estrés de visitantes"
    echo "  spike       Solo pruebas de picos súbitos"
    echo "  check       Verificar configuración del sistema"
    echo "  help        Mostrar esta ayuda"
    echo ""
    echo "Ejemplos:"
    echo "  $0 all           # Ejecutar todas las pruebas"
    echo "  $0 users         # Solo pruebas de usuarios"
    echo "  $0 check         # Verificar que el sistema esté funcionando"
}

# Función principal
main() {
    local command=${1:-"help"}
    
    echo "=========================================="
    echo "🚀 COLIVE - PRUEBAS DE RENDIMIENTO K6"
    echo "=========================================="
    echo ""
    
    case $command in
        "all")
            check_k6
            check_system
            setup_directories
            
            print_status "Iniciando suite completa de pruebas..."
            echo ""
            
            run_user_registration_test
            echo ""
            print_status "Esperando 2 minutos entre pruebas para estabilizar el sistema..."
            sleep 120
            
            run_visitors_stress_test
            echo ""
            print_status "Esperando 2 minutos entre pruebas..."
            sleep 120
            
            run_spike_test
            echo ""
            
            generate_consolidated_report
            
            echo ""
            print_success "¡Todas las pruebas completadas exitosamente!"
            print_status "Revisa los reportes HTML en el directorio results/"
            ;;
            
        "users")
            check_k6
            check_system
            setup_directories
            run_user_registration_test
            ;;
            
        "stress")
            check_k6
            check_system
            setup_directories
            run_visitors_stress_test
            ;;
            
        "spike")
            check_k6
            check_system
            setup_directories
            run_spike_test
            ;;
            
        "check")
            check_k6
            check_system
            print_success "Sistema verificado y listo para pruebas"
            ;;
            
        "help"|*)
            show_help
            ;;
    esac
}

# Ejecutar función principal con todos los argumentos
main "$@"
