from flask import Blueprint, render_template

frontend_bp = Blueprint('frontend', __name__)

@frontend_bp.route('/')
def index():
    return render_template('index.html')

@frontend_bp.route('/about')
def about():
    return render_template('about.html')

@frontend_bp.route('/login')
def login():
    return render_template('login.html')

@frontend_bp.route('/registerCR')
def registerCR():
    return render_template('create_complex.html')

@frontend_bp.route('/testAuth')
def pruebaConexionAuth():
    return render_template('pruebaSaludo.html')

@frontend_bp.route('/propietario')
def propietario():
    return render_template('panel_propietario.html')

@frontend_bp.route('/reservas')
def reservas():
    return render_template('reservas.html')

@frontend_bp.route('/admin')
def reservas():
    return render_template('adminhome.html')