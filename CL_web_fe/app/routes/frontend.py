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