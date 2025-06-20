from flask import Blueprint, jsonify, request
import requests

api_bp = Blueprint('api', __name__)

@api_bp.route('/status', methods=['GET'])
def status():
    return jsonify({"status": "ok"})


@api_bp.route('/testAuth', methods=['GET'])
def testAuth():
    try:
        response = requests.get('http://CL_ag:8000/auth/saludo')
        response.raise_for_status()
        data = response.json()
        return jsonify(data)
    except requests.RequestException as e:
        return jsonify({"error": str(e)}), 500


@api_bp.route('/registrarUsuarioConjunto', methods=['POST'])
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
        return jsonify({"error": str(e)}), 500


@api_bp.route('/login', methods=['POST'])
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
def crear_reserva():
    datos = request.json
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