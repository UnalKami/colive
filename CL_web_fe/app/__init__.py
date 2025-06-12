from flask import Flask

def create_app():
    app = Flask(__name__)
    app.config.from_object('app.config.Config')

    from .routes.frontend import frontend_bp
    from .routes.api import api_bp

    app.register_blueprint(frontend_bp)
    app.register_blueprint(api_bp, url_prefix='/fe-api')  # ClosedAPI

    return app