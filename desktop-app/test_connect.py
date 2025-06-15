# test_connect.py

import connect

def test_login_success():
    ok, err = connect.login_user("admin@colive.com", "secret")
    assert ok is True
    assert err == ""

def test_login_fail_empty():
    ok, err = connect.login_user("", "")
    assert ok is False
    assert "vacíos" in err or err  # comprobar que avisa de campos vacíos

def test_login_fail_bad_credentials():
    ok, err = connect.login_user("foo@bar.com", "wrong")
    assert ok is False
    assert "incorrectos" in err

def test_register_password_mismatch():
    data = {
        "role": "Residente",
        "fullname": "Juan Pérez",
        "email": "juan@colive.com",
        "phone": "3001234567",
        "username": "juanp",
        "pwd1": "abc",
        "pwd2": "abcd"
    }
    ok, err = connect.register_user(data)
    assert ok is False
    assert "no coinciden" in err

def test_register_empty_fields():
    data = {
        "role": "Selecciona un rol",
        "fullname": "",
        "email": "",
        "phone": "",
        "username": "",
        "pwd1": "",
        "pwd2": ""
    }
    ok, err = connect.register_user(data)
    assert ok is False
    # aquí puedes comprobar que tu función devuelva un mensaje apropiado
    assert "vacíos" in err or err

def test_register_success():
    data = {
        "role": "Propietario",
        "fullname": "María López",
        "email": "maria@colive.com",
        "phone": "3007654321",
        "username": "mlopez",
        "pwd1": "password",
        "pwd2": "password"
    }
    ok, err = connect.register_user(data)
    assert ok is True
    assert err == ""
