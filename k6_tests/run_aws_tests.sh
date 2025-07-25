#!/bin/bash

# Script para ejecutar pruebas de rendimiento en AWS
# Colive Performance Testing Suite - AWS Edition

set -e

# Colores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
ORANGE='\033[0;33m'
NC='\033[0m'

# Configuración AWS
AWS_CONFIG_FILE="aws-config.env"

print_aws_header() {
    echo "=========================================="
    echo -e "${ORANGE}☁️  COLIVE AWS PERFORMANCE TESTING  ☁️${NC}"
    echo "=========================================="
    echo ""
}

print_status() {
    echo -e "${BLUE}[AWS-INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[AWS-SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[AWS-WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[AWS-ERROR]${NC} $1"
}

# Cargar configuración AWS
load_aws_config() {
    if [ -f "$AWS_CONFIG_FILE" ]; then
        print_status "Cargando configuración AWS desde $AWS_CONFIG_FILE"
        export $(grep -v '^#' $AWS_CONFIG_FILE | xargs)
        print_success "Configuración AWS cargada"
    else
        print_warning "Archivo de configuración AWS no encontrado"
        print_warning "Usando configuración por defecto"
    fi
}

# Verificar conectividad a AWS
check_aws_connectivity() {
    print_status "Verificando conectividad con AWS..."
    
    local aws_url="${AWS_BASE_URL:-https://your-colive-domain.com}"
    
    if curl -s -f -m 10 "$aws_url/health" > /dev/null 2>&1; then
        print_success "Sistema AWS accesible en $aws_url"
    else
        print_error "No se puede conectar al sistema AWS en $aws_url"
        echo ""
        echo "Verifica:"
        echo "1. La URL está correcta en aws-config.env"
        echo "2. El sistema está desplegado y funcionando"
        echo "3. No hay restricciones de firewall/security groups"
        echo "4. Tu conexión a Internet está funcionando"
        return 1
    fi
}

# Verificar que k6 esté instalado
check_k6() {
    if ! command -v k6 &> /dev/null; then
        print_error "k6 no está instalado"
        echo ""
        echo "Instala k6:"
        echo "Ubuntu/Debian: sudo apt update && sudo apt install k6"
        echo "macOS: brew install k6"
        echo "Windows: winget install k6"
        exit 1
    fi
    print_success "k6 encontrado: $(k6 version)"
}

# Configurar directorios
setup_aws_directories() {
    print_status "Configurando directorios para AWS..."
    mkdir -p results/aws
    mkdir -p logs/aws
    print_success "Directorios AWS configurados"
}

# Obtener token de autenticación para AWS
get_aws_auth_token() {
    local aws_url="${AWS_BASE_URL:-https://your-colive-domain.com}"
    
    print_status "¿Deseas generar un nuevo token de autenticación? (y/n)"
    read -r generate_token
    
    if [[ $generate_token == "y" || $generate_token == "Y" ]]; then
        echo ""
        print_status "Para generar un token, necesitas credenciales de un usuario VIGILANTE:"
        echo -n "Username: "
        read -r username
        echo -n "Password: "
        read -s password
        echo ""
        
        print_status "Obteniendo token de AWS..."
        
        local response=$(curl -s -X POST "$aws_url/fe-api/login" \
            -H "Content-Type: application/json" \
            -d "{\"username\":\"$username\",\"password\":\"$password\"}" \
            2>/dev/null)
        
        if echo "$response" | grep -q "token\|userId"; then
            print_success "Token obtenido exitosamente"
            echo "Copia este token a aws-config.env:"
            echo "$response" | grep -o '"token":"[^"]*"' || echo "$response"
        else
            print_warning "No se pudo obtener el token automáticamente"
            echo "Respuesta: $response"
            echo ""
            echo "Obtén el token manualmente:"
            echo "curl -X POST $aws_url/fe-api/login \\"
            echo "  -H 'Content-Type: application/json' \\"
            echo "  -d '{\"username\":\"tu_usuario\",\"password\":\"tu_password\"}'"
        fi
        echo ""
    fi
}

# Ejecutar prueba de registro de usuarios en AWS
run_aws_user_registration() {
    print_status "Ejecutando pruebas de registro de usuarios en AWS..."
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local log_file="logs/aws/registro_usuarios_aws_${timestamp}.log"
    
    # Exportar variables de entorno para k6
    export AWS_BASE_URL="${AWS_BASE_URL:-https://your-colive-domain.com}"
    
    k6 run \
        --out json=results/aws/registro_usuarios_aws_${timestamp}.json \
        --summary-trend-stats="avg,min,med,max,p(90),p(95),p(99)" \
        --tag environment=aws \
        --tag test_type=user_registration \
        registro_usuarios_aws_test.js 2>&1 | tee "$log_file"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_success "Prueba AWS de registro completada"
        print_status "Log: $log_file"
        print_status "Resultados HTML generados automáticamente"
    else
        print_error "Prueba AWS de registro falló"
        return 1
    fi
}

# Ejecutar prueba de visitantes en AWS (versión adaptada)
run_aws_visitors_test() {
    print_status "Ejecutando pruebas de visitantes en AWS..."
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local log_file="logs/aws/visitantes_aws_${timestamp}.log"
    
    # Crear versión AWS del test de visitantes
    local aws_visitors_test="visitantes_aws_test.js"
    
    if [ ! -f "$aws_visitors_test" ]; then
        print_status "Creando versión AWS del test de visitantes..."
        
        # Crear test de visitantes adaptado para AWS
        sed 's|http://localhost:8000|'${AWS_BASE_URL:-https://your-colive-domain.com}'|g' \
            visitantes_stress_advanced_test.js > "$aws_visitors_test"
        
        # Ajustar configuración para AWS
        sed -i 's/vus: 80/vus: 40/g' "$aws_visitors_test"
        sed -i 's/vus: 100/vus: 50/g' "$aws_visitors_test"
        sed -i 's/vus: 150/vus: 60/g' "$aws_visitors_test"
        
        print_success "Test de visitantes AWS creado"
    fi
    
    export AWS_BASE_URL="${AWS_BASE_URL:-https://your-colive-domain.com}"
    export AWS_VIGILANTE_TOKEN="${AWS_VIGILANTE_TOKEN:-Bearer your-token-here}"
    
    k6 run \
        --out json=results/aws/visitantes_aws_${timestamp}.json \
        --summary-trend-stats="avg,min,med,max,p(90),p(95),p(99)" \
        --tag environment=aws \
        --tag test_type=visitors \
        "$aws_visitors_test" 2>&1 | tee "$log_file"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        print_success "Prueba AWS de visitantes completada"
    else
        print_error "Prueba AWS de visitantes falló"
        return 1
    fi
}

# Generar reporte consolidado AWS
generate_aws_report() {
    print_status "Generando reporte consolidado AWS..."
    local timestamp=$(date +"%Y%m%d_%H%M%S")
    local report_file="results/aws/reporte_aws_consolidado_${timestamp}.html"
    
    cat > "$report_file" << EOF
<!DOCTYPE html>
<html>
<head>
    <title>Reporte AWS Consolidado - Colive Performance Testing</title>
    <style>
        body { font-family: 'Arial', sans-serif; margin: 0; padding: 20px; 
               background: linear-gradient(135deg, #232F3E 0%, #FF9900 100%); min-height: 100vh; }
        .container { background: white; border-radius: 15px; padding: 30px; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.3); }
        .aws-header { background: linear-gradient(135deg, #232F3E 0%, #FF9900 100%); 
                     color: white; padding: 30px; border-radius: 10px; text-align: center; }
        .aws-logo { font-size: 3em; margin-bottom: 10px; }
        .metric { margin: 20px 0; padding: 20px; border-radius: 10px; 
                  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); 
                  border-left: 5px solid #FF9900; }
        .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }
        .test-summary { background: white; border: 2px solid #232F3E; 
                       border-radius: 10px; padding: 20px; margin: 15px 0; }
        .aws-badge { background: #FF9900; color: white; padding: 5px 15px; 
                    border-radius: 20px; font-size: 0.8em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="aws-header">
            <div class="aws-logo">☁️</div>
            <h1>Reporte Consolidado AWS</h1>
            <div class="aws-badge">Amazon Web Services</div>
            <p>Sistema Colive - Pruebas de Rendimiento en Producción</p>
            <p><strong>Generado:</strong> $(date)</p>
        </div>
        
        <div class="test-summary">
            <h2>🎯 Resumen de Pruebas Ejecutadas</h2>
            <div class="grid">
                <div>
                    <h3>👥 Registro de Usuarios</h3>
                    <p>Prueba de carga gradual en ambiente AWS</p>
                    <ul>
                        <li>5, 15, 30, 50 usuarios virtuales</li>
                        <li>Duración: 3 minutos por escenario</li>
                        <li>Operaciones: Registro + Login</li>
                    </ul>
                </div>
                
                <div>
                    <h3>🚗 Gestión de Visitantes</h3>
                    <p>Pruebas de operaciones CRUD de visitantes</p>
                    <ul>
                        <li>Registro de peatones y vehículos</li>
                        <li>Consultas y salidas</li>
                        <li>Carga distribuida y realista</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="metric">
            <h2>☁️ Configuración AWS Utilizada</h2>
            <div class="grid">
                <div>
                    <h4>🌐 Infraestructura</h4>
                    <ul>
                        <li><strong>Load Balancer:</strong> Application Load Balancer</li>
                        <li><strong>Auto Scaling:</strong> Configurado</li>
                        <li><strong>RDS:</strong> Base de datos gestionada</li>
                        <li><strong>SSL/TLS:</strong> Certificados válidos</li>
                    </ul>
                </div>
                
                <div>
                    <h4>📊 Métricas Monitoreadas</h4>
                    <ul>
                        <li><strong>Tiempo de respuesta:</strong> P95 < 2000ms</li>
                        <li><strong>Tasa de error:</strong> < 5%</li>
                        <li><strong>Throughput:</strong> Requests/segundo</li>
                        <li><strong>Disponibilidad:</strong> > 99%</li>
                    </ul>
                </div>
            </div>
        </div>
        
        <div class="metric">
            <h2>📈 Archivos Generados</h2>
            <p>Los siguientes archivos están disponibles en el directorio results/aws/:</p>
            <ul>
                <li>Reportes HTML detallados por cada prueba</li>
                <li>Datos JSON con métricas completas</li>
                <li>Logs de ejecución con timestamps</li>
            </ul>
        </div>
        
        <div class="metric">
            <h2>🔧 Próximos Pasos</h2>
            <ol>
                <li><strong>Revisar métricas:</strong> Analizar reportes HTML individuales</li>
                <li><strong>CloudWatch:</strong> Correlacionar con métricas de AWS</li>
                <li><strong>Optimización:</strong> Identificar cuellos de botella</li>
                <li><strong>Escalado:</strong> Ajustar políticas de Auto Scaling si es necesario</li>
            </ol>
        </div>
    </div>
</body>
</html>
EOF
    
    print_success "Reporte AWS consolidado generado: $report_file"
}

# Mostrar ayuda
show_aws_help() {
    echo "Uso: $0 [OPCIÓN]"
    echo ""
    echo "Ejecuta pruebas de rendimiento en AWS para el sistema Colive"
    echo ""
    echo "Opciones:"
    echo "  all         Ejecutar todas las pruebas AWS"
    echo "  users       Solo pruebas de registro de usuarios"
    echo "  visitors    Solo pruebas de visitantes"
    echo "  check       Verificar conectividad AWS"
    echo "  token       Obtener token de autenticación"
    echo "  config      Crear archivo de configuración de ejemplo"
    echo "  help        Mostrar esta ayuda"
    echo ""
    echo "Configuración:"
    echo "  Edita aws-config.env con tu configuración AWS específica"
}

# Crear archivo de configuración de ejemplo
create_config_example() {
    if [ -f "$AWS_CONFIG_FILE" ]; then
        print_warning "El archivo $AWS_CONFIG_FILE ya existe"
        echo -n "¿Sobreescribir? (y/n): "
        read -r overwrite
        if [[ $overwrite != "y" && $overwrite != "Y" ]]; then
            print_status "Configuración no modificada"
            return
        fi
    fi
    
    print_status "Creando archivo de configuración de ejemplo..."
    
    cat > "$AWS_CONFIG_FILE" << 'EOF'
# CONFIGURACIÓN AWS PARA PRUEBAS DE RENDIMIENTO COLIVE
# Actualiza estos valores con tu configuración específica

# URL principal de tu sistema en AWS
AWS_BASE_URL="https://tu-dominio-colive.com"

# URLs específicas si usas subdominios
AWS_API_GATEWAY_URL="https://api.tu-dominio-colive.com"
AWS_AUTH_SERVICE_URL="https://auth.tu-dominio-colive.com"

# Configuración AWS
AWS_REGION="us-east-1"
AWS_LOADBALANCER_URL="https://tu-loadbalancer.us-east-1.elb.amazonaws.com"

# Tokens de autenticación - OBTENER HACIENDO LOGIN
AWS_ADMIN_TOKEN="Bearer your-admin-token-here"
AWS_VIGILANTE_TOKEN="Bearer your-vigilante-token-here"

# IDs de conjuntos residenciales reales
AWS_CONJUNTO_1="conjunto-real-id-1"
AWS_CONJUNTO_2="conjunto-real-id-2"
AWS_CONJUNTO_3="conjunto-real-id-3"

# Configuración de pruebas (conservadora para producción)
MAX_VUS_AWS=50
RAMP_UP_TIME_AWS="5m"

# Umbrales para AWS
AWS_ERROR_RATE_THRESHOLD=0.05
AWS_RESPONSE_TIME_P95=2000

# SSL/TLS
VERIFY_SSL=true
EOF
    
    print_success "Archivo de configuración creado: $AWS_CONFIG_FILE"
    print_warning "¡IMPORTANTE! Edita este archivo con tu configuración AWS real antes de ejecutar pruebas"
}

# Función principal
main() {
    local command=${1:-"help"}
    
    print_aws_header
    load_aws_config
    
    case $command in
        "all")
            check_k6
            check_aws_connectivity
            setup_aws_directories
            get_aws_auth_token
            
            print_status "Iniciando suite completa de pruebas AWS..."
            
            run_aws_user_registration
            echo ""
            print_status "Esperando 3 minutos entre pruebas para no sobrecargar AWS..."
            sleep 180
            
            run_aws_visitors_test
            echo ""
            
            generate_aws_report
            
            print_success "¡Todas las pruebas AWS completadas!"
            print_status "Revisa los reportes en results/aws/"
            ;;
            
        "users")
            check_k6
            check_aws_connectivity
            setup_aws_directories
            run_aws_user_registration
            ;;
            
        "visitors")
            check_k6
            check_aws_connectivity
            setup_aws_directories
            run_aws_visitors_test
            ;;
            
        "check")
            check_k6
            check_aws_connectivity
            print_success "Sistema AWS verificado y listo"
            ;;
            
        "token")
            check_aws_connectivity
            get_aws_auth_token
            ;;
            
        "config")
            create_config_example
            ;;
            
        "help"|*)
            show_aws_help
            ;;
    esac
}

main "$@"
