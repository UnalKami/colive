# connect.py

def login_user(email: str, password: str) -> (bool, str):
    """
    Intenta autenticar al usuario.
    Retorna (True, "") si es exitoso, o (False, mensaje_error) en caso contrario.
    """
    # Validación de campos vacíos
    if not email or not password:
        return False, "No dejes campos vacíos."
    # Lógica ejemplo
    if email == "admin@colive.com" and password == "secret":
        return True, ""
    return False, "Correo o contraseña incorrectos."


def register_user(data: dict) -> (bool, str):
    """
    Intenta registrar un nuevo usuario.
    data debe incluir: role, fullname, email, phone, username, pwd1, pwd2
    Retorna (True, "") o (False, mensaje_error).
    """
    # 1) Validar campos vacíos y rol seleccionado
    required = ["role", "fullname", "email", "phone", "username", "pwd1", "pwd2"]
    for key in required:
        if not data.get(key) or (key == "role" and data["role"] == "Selecciona un rol"):
            return False, "No dejes campos vacíos."

    # 2) Validar que coincidan las contraseñas
    if data["pwd1"] != data["pwd2"]:
        return False, "Las contraseñas no coinciden."

    # Aquí iría la lógica real de inserción en BD...
    return True, ""
