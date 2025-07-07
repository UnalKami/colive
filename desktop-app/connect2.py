# connect2.py
import requests, urllib3
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

BASE_URL = "https://localhost/fe-api/registrarUsuarioConjunto"

def register_user(user_fields: dict, conjunto_fields: dict):
    """
    user_fields debe incluir:
      username, nombre, correo, password, celular
    conjunto_fields debe incluir:
      nombre, nombreAdministrador, direccion, ciudad, departamento,
      amenidades (lista), configuraciones (lista)
    """
    payload = {
        "user": user_fields,
        "conjunto": conjunto_fields
    }
    try:
        r = requests.post(BASE_URL, json=payload, verify=False, timeout=8)
    except requests.RequestException as e:
        return False, f"Error de red: {e}"
    if r.ok:
        return True, "Registro completado."
    # leer mensaje de error
    try:
        err = r.json().get("detail") or r.json().get("error") or r.text
    except ValueError:
        err = r.text
    return False, err
