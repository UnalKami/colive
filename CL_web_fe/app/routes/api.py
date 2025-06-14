from flask import Blueprint, jsonify
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