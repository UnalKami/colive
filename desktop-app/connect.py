# connect2.py
import requests
import urllib3

urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://localhost:8443"
ENDPOINT = f"{BASE_URL}/orc/registerUserCR"
LOGIN_URL = f"{BASE_URL}/auth/login"


def login_user(username: str, password: str):
    """
    Realiza autenticación de usuario.
    Retorna (True, datos) si es exitoso, o (False, mensaje) si falla.
    """
    payload = {"username": username, "password": password}
    try:
        r = requests.post(LOGIN_URL, json=payload, timeout=5, verify=False)
    except requests.RequestException as e:
        return False, f"Error de red: {e}"
    if r.ok:
        return True, r.json()
    try:
        detail = r.json().get("detail") or r.json().get("error")
    except ValueError:
        detail = r.text
    return False, detail


def register_user(user_fields: dict, conjunto_fields: dict):
    """
    Envía el registro de usuario + conjunto al Orquestador.
    user_fields debe tener:
      - username
      - nombre
      - correo
      - password
      - celular
    conjunto_fields debe tener:
      - nombre
      - nombreAdministrador
      - direccion
      - ciudad
      - departamento
      - amenidades (lista de { nombre: str })
      - configuraciones (lista de { tipoParqueadero: bool,
                                   numParqueadero: int,
                                   tipoAlmacen: bool,
                                   numAlmacen: int })
    Retorna (True, respuesta-json) o (False, detalle-error).
    """
    query = """
    mutation CrearConjunto(
        $nombre: String!,
        $nombreAdministrador: String!,
        $direccion: String!,
        $ciudad: String!,
        $departamento: String!,
        $amenidades: [AmenidadInput],
        $configuraciones: [ConfigInput]
    ) {
        createConjunto(
            nombre: $nombre,
            nombreAdministrador: $nombreAdministrador,
            direccion: $direccion,
            ciudad: $ciudad,
            departamento: $departamento,
            amenidades: $amenidades,
            configuraciones: $configuraciones
        ) {
            id
            nombre
            direccion
            ciudad
        }
    }
    """
    payload = {
        "user": user_fields,
        "conjunto": {
            "query": query,
            "variables": conjunto_fields
        }
    }
    try:
        r = requests.post(ENDPOINT, json=payload, timeout=10, verify=False)
    except requests.RequestException as e:
        return False, f"Error de red: {e}"
    if r.ok:
        return True, r.json()
    try:
        detail = r.json().get("detail") or r.json().get("errors")
    except ValueError:
        detail = r.text
    return False, detail
