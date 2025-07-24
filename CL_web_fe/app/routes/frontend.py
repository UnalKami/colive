from flask import Blueprint, render_template    
from app.auth.public_routes import public_route
from app.auth.decorators import require_roles

frontend_bp = Blueprint('frontend', __name__)

# NOMBRE ROLES:
#  ADMIN_CR
#  PROPIEDAD_CR
#  RESIDENTE_CR
#  ADMINISTRATIVO_CR
#  SEGURIDAD_CR
#  MANTENIMIENTO_CR
#  ASEO_CR

@frontend_bp.route('/')
@public_route
def index():
    return render_template('index.html')

@frontend_bp.route("/terminos-condiciones")
@public_route
def terminos_condiciones():
    return render_template("terminos-condiciones.html")

@frontend_bp.route('/noService')
@public_route
def contacto():
    return render_template('No_disponible.html')

@frontend_bp.route('/about')
@public_route
def about():
    return render_template('about.html')

@frontend_bp.route('/login')
@public_route
def login():
    return render_template('login.html')

@frontend_bp.route('/registerCR')
@public_route
def registerCR():
    return render_template('create_complex.html')

@frontend_bp.route('/testAuth')
@public_route
def pruebaConexionAuth():
    return render_template('pruebaSaludo.html')

@frontend_bp.route('/propietario')
@require_roles('PROPIEDAD_CR')
def propietario():
    return render_template('panel_propietario.html')

@frontend_bp.route('/reservas')
@require_roles('RESIDENTE_CR', 'ADMIN_CR')
def reservas():
    return render_template('reservas.html')


@frontend_bp.route('/admin')
@require_roles('ADMIN_CR')
def admin():
    return render_template('adminhome.html')

@frontend_bp.route('/registro-rol')
@require_roles('ADMIN_CR')
def registro_rol():
    return render_template('registroUsuarioRol.html')

@frontend_bp.route('/setSMTP')
@require_roles('ADMIN_CR')
def setSMTP():
    return render_template('setSMTP.html')

@frontend_bp.route('/sendMail')
@require_roles('ADMIN_CR', 'ADMINISTRATIVO_CR')
def sendEmail():
    return render_template('sendMail.html')