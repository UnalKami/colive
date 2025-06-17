# connect.py
import requests

BASE_URL = "http://localhost:8000"

def login_user(username: str, password: str):
    url = f"{BASE_URL}/auth/login"
    payload = {"username": username, "password": password}
    try:
        r = requests.post(url, json=payload, timeout=5)
    except requests.RequestException as e:
        return False, f"Error de red: {e}"
    if r.ok:
        return True, r.json()
    # extraemos mensaje de error
    try:
        detail = r.json().get("detail") or r.json().get("error")
    except ValueError:
        detail = r.text
    return False, detail

def register_user(user_fields: dict, conjunto_fields: dict):
    """
    user_fields debe contener:
      username, nombre, correo, contraseña
    conjunto_fields debe contener las variables de tu GraphQL:
      nombre, nombreAdministrador, direccion, ciudad, departamentos, amenidades, configuraciones
    """
    # Tu query GraphQL
    query = """
    mutation CrearConjunto(
        $nombre: String!, $nombreAdministrador: String!,
        $direccion: String!, $ciudad: String!, $departamentos: String!,
        $amenidades: [AmenidadInput], $configuraciones: [ConfigInput]
    ) {
        createConjunto(
            nombre: $nombre,
            nombreAdministrador: $nombreAdministrador,
            direccion: $direccion,
            ciudad: $ciudad,
            departamentos: $departamentos,
            amenidades: $amenidades,
            configuraciones: $configuraciones
        ) { id nombre direccion ciudad }
    }
    """
    payload = {
        "conjunto": {
            "query": query,
            "variables": conjunto_fields
        },
        "user": user_fields
    }

    url = f"{BASE_URL}/orc/registerUserCR"
    try:
        r = requests.post(url, json=payload, timeout=5)
    except requests.RequestException as e:
        return False, f"Error de red: {e}"

    if r.ok:
        return True, "✅ Registro exitoso."
    try:
        # Orchestrator suele devolver {"detail":"…"} o {"errors":[…]}
        detail = r.json().get("detail") or r.json().get("errors") or r.text
    except ValueError:
        detail = r.text
    return False, detail
