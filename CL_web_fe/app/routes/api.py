from flask import Blueprint, jsonify, request, g
from app.auth.public_routes import public_route
from app.auth.decorators import require_roles
import requests

api_bp = Blueprint('api', __name__)
ESPERA_MAXIMA = 10  # Tiempo máximo de espera en segundos para las peticiones al gateway

# TODAS las rutas de la API deben comenzar con /fe-api en el frontend

# NOMBRE ROLES:
#  ADMIN_CR
#  PROPIEDAD_CR
#  RESIDENTE_CR
#  ADMINISTRATIVO_CR
#  SEGURIDAD_CR
#  MANTENIMIENTO_CR
#  ASEO_CR


@api_bp.route('/status', methods=['GET'])
@public_route
def status():
    return jsonify({"status": "ok"})


@api_bp.route('/testAuth', methods=['GET'])
@public_route
def testAuth():
    try:
        response = requests.get('http://CL_ag:8000/auth/saludo')
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route('/registrarUsuarioConjunto', methods=['POST'])
@public_route
def registrar_usuario_conjunto():
    try:
        # Obtén el JSON enviado por el frontend
        payload = request.get_json()

        # Envía la petición POST al gateway
        response = requests.post(
            'http://CL_ag:8000/orc/registerUserCR',
            json=payload
        )
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except requests.RequestException as e:
        return jsonify({"error en api al registrarUsuarioConjunto": str(e)}), 500


@api_bp.route('/login', methods=['POST'])
@public_route
def login():
    try:
        payload = request.get_json()
        response = requests.post(
            'http://CL_ag:8000/auth/login',
            json=payload
        )
        response.raise_for_status()
        data = response.json()
        flask_response = jsonify(data)
        # Copiar la cabecera Set-Cookie si existe
        
        if 'set-cookie' in response.headers:
            flask_response.headers['Set-Cookie'] = response.headers['set-cookie']
        return flask_response
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
@api_bp.route('/crearReserva', methods=['POST'])
@require_roles('USER_CR', 'ADMIN_CR',)
def crear_reserva():
    datos = request.json
    hash_conjunto = g.current_user.get('hash_conjunto')
    datos['hashConjunto'] = hash_conjunto  # Añadir el hash del conjunto al payload
    try:
        response = requests.post('http://CL_ag:8000/residence/crearReserva', json=datos)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        print("Error al llamar al gateway:", e)
        return jsonify({"error": str(e)}), 500

@api_bp.route('/editarReserva', methods=['POST'])
def editar_reserva():
    datos = request.json
    try:
        response = requests.post('http://CL_ag:8000/residence/editarReserva', json=datos)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        print("Error al llamar al gateway:", e)
        return jsonify({"success": False, "motivo": str(e)}), 500

@api_bp.route('/eliminarReserva', methods=['POST'])
def eliminar_reserva():
    datos = request.json
    try:
        response = requests.post('http://CL_ag:8000/residence/eliminarReserva', json=datos)
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        print("Error al llamar al gateway:", e)
        return jsonify({"success": False, "motivo": str(e)}), 500

# esto es temporal, debe usar el token 
@api_bp.route('/conjuntosResidencias', methods=['GET'])
@require_roles('RESIDENTE_CR', 'ADMIN_CR')
def conjuntos_residencias():
    try:
        response = requests.get('http://CL_ag:8000/residence/conjuntosResidencias')
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        print("Error al llamar al gateway:", e)
        return jsonify({"error": str(e)}), 500
    
# esto es temporal, debe usar el token 
@api_bp.route('/reservas', methods=['GET'])
def obtener_reservas():
    residencia_id = request.args.get('residenciaId')
    try:
        response = requests.get(f'http://CL_ag:8000/residence/reservas?residenciaId={residencia_id}')
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        print("Error al llamar al gateway:", e)
        return jsonify({"error": str(e)}), 500

ENDPOINT_MENSAJERIA = 'http://CL_messaging_ms:7000/msg'
    
@api_bp.route('/registrarSMTP', methods=['POST'])
def registrar_smtp():
    try:
        payload = request.get_json()
        #TODO: @jhuertasd validar el payload antes de enviarlo
        """
        verifica que el usuario tenga rol administrador, 
        si no lo tiene, retorna un error 403 Forbidden.
        """
        
        response = requests.post(
            ENDPOINT_MENSAJERIA +'/smtp/registrar',
            json=payload
        )
        if(response.elapsed.total_seconds() > ESPERA_MAXIMA):
            return jsonify({"error": "La solicitud tardó demasiado tiempo"}), 504
        
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500
    
@api_bp.route('/enviarCorreo', methods=['POST'])
def enviar_correo():
    try:
        payload = request.get_json()
        #TODO: @jhuertasd validar el payload antes de enviarlo
        """
        verifica que el usuario tenga rol administrador, 
        si no lo tiene, retorna un error 403 Forbidden.
        """
        
        response = requests.post(
            ENDPOINT_MENSAJERIA +'/smtp/enviar',
            json=payload
        )
        if(response.elapsed.total_seconds() > ESPERA_MAXIMA):
            return jsonify({"error": "La solicitud tardó demasiado tiempo"}), 504
        
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500

@api_bp.route('/panelPropietario', methods=['GET'])
@require_roles('RESIDENTE_CR', 'PROPIEDAD_CR', 'ADMIN_CR')
def panel_propietario():
    try:
        response = requests.get('http://CL_ag:8000/residence/panelPropietario')
        response.raise_for_status()
        return jsonify(response.json())
    except Exception as e:
        print("Error al llamar al gateway:", e)
        return jsonify({"error": str(e)}), 500