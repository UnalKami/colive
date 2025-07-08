from flask import request, g, redirect, current_app, jsonify
from .jwt_utils import decode_token

def jwt_auth_middleware(app):    
    @app.before_request
    def _middleware():
        print(f"[Middleware] endpoint: {request.endpoint}, path: {request.path}")

        endpoint = request.endpoint

        print(f"[Middleware] endpoint: {endpoint}")
        
        # Si no hay endpoint o es None
        if request.endpoint is None:
            return
            
        # Excluir archivos estáticos y endpoints especiales de Flask
        if endpoint == 'static' or request.path.startswith('/static/'):
            return  # Permitir archivos estáticos sin validación
            
        # Verificar si el endpoint está marcado como público
        view_func = current_app.view_functions.get(endpoint)
        if view_func and getattr(view_func, '_is_public', False):
            return  # Ruta pública: no validar token

        # Determinar si es endpoint de API o Frontend
        is_api_endpoint = endpoint.startswith('api.')

        # Validar token 
        token = request.cookies.get('authToken')
        if not token:
            if is_api_endpoint:
                return jsonify({"error": "Token de autenticacion requerido", "code": "AUTH_REQUIRED"}), 401
            else:
                return redirect('/login')


        try:
            payload = decode_token(token)
            #Guarda los datos del token en g.current_user para usar en peticiones que necesiten datos del usuario
            g.current_user = {
                "user_id": payload.get("userId"),
                "username": payload.get("username"),
                "role_id": payload.get("roleId"),
                "role_name": payload.get("role_name"),
                "conjunto_id": payload.get("conjuntoId"),
                "hash_conjunto": payload.get("hashConjunto"),
            }
        except Exception:
            if is_api_endpoint:
                return jsonify({"error": "Token inválido o expirado", "code": "INVALID_TOKEN"}), 401
            else:
                return redirect('/login')