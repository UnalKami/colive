from flask import g, redirect, jsonify, request
from functools import wraps

def require_roles(*required_roles):
    def decorator(f):
        @wraps(f)
        def wrapper(*args, **kwargs):
            user = getattr(g, 'current_user', None)
            # Determinar si es endpoint de API
            is_api_endpoint = request.endpoint.startswith('api.')

            if user is None:
                if is_api_endpoint:
                    return jsonify({"error": "Usuario no autenticado", "code": "NOT_AUTHENTICATED"}), 401
                else:
                    return redirect('/login')

            user_role = user.get('role_name')
            if user_role not in required_roles:
                if is_api_endpoint:
                    return jsonify({
                        "error": "Acceso denegado", 
                        "code": "INSUFFICIENT_PERMISSIONS"                        
                    }), 403
                else:
                    return redirect('/noService')  # Redirigir a página de servicio no disponible

            return f(*args, **kwargs)
        return wrapper
    return decorator
