import sys, os
from PyQt5 import QtWidgets, QtGui, QtCore
from PyQt5.QtWebEngineWidgets import QWebEngineView
import connect

# Estilos
LIGHT_STYLE = """
QWidget { background-color: #f2f2f2; color: #000; }
QLineEdit {
    height: 30px; border: 1px solid #ccc; border-radius: 12px;
    padding: 4px; font-size: 14px; background-color: #fff;
}
QPushButton {
    border: 1px solid #4CAF50; border-radius: 12px;
    padding: 6px; font-size: 16px;
    color: #4CAF50; background-color: transparent;
}
QPushButton:hover { background-color: #e8f5e9; }
QLabel#link { color: #c5b566; font-size: 13px; }
QCheckBox, QComboBox, QTextEdit {
    background-color: #fff; color: #000;
    border-radius: 8px;
}
"""

DARK_STYLE = """
QWidget { background-color: #121212; color: #fff; }
QLineEdit {
    height: 30px; border: 1px solid #555; border-radius: 12px;
    padding: 4px; font-size: 14px; background-color: #1e1e1e;
}
QPushButton {
    border: 1px solid #00c853; border-radius: 12px;
    padding: 6px; font-size: 16px;
    color: #00c853; background-color: transparent;
}
QPushButton:hover { background-color: #1b5e20; }
QLabel#link { color: #f9a825; font-size: 13px; }
QCheckBox, QComboBox, QTextEdit {
    background-color: #1e1e1e; color: #fff;
    border-radius: 8px;
}
"""

class LoginScreen(QtWidgets.QWidget):
    switch_to_register = QtCore.pyqtSignal()
    login_success = QtCore.pyqtSignal()

    def __init__(self):
        super().__init__()
        self._build_ui()

    def _build_ui(self):
        self.setStyleSheet(LIGHT_STYLE)
        layout = QtWidgets.QVBoxLayout(self)
        layout.setAlignment(QtCore.Qt.AlignTop | QtCore.Qt.AlignHCenter)
        layout.setContentsMargins(10,10,10,10)
        layout.setSpacing(5)

        # Logo
        logo = QtWidgets.QLabel()
        logo_path = os.path.join(os.path.dirname(__file__), 'Colive_Logo_.png')
        pixmap = QtGui.QPixmap(logo_path).scaledToWidth(200, QtCore.Qt.SmoothTransformation)
        logo.setPixmap(pixmap)
        logo.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(logo)

        # Email
        self.email = QtWidgets.QLineEdit()
        self.email.setPlaceholderText("Email")
        layout.addWidget(self._labeled("Usuario", self.email))

        # Password
        self.password = QtWidgets.QLineEdit()
        self.password.setPlaceholderText("Password")
        self.password.setEchoMode(QtWidgets.QLineEdit.Password)
        layout.addWidget(self._labeled("Contraseña", self.password))

        # Buttons
        login_btn = QtWidgets.QPushButton("Iniciar sesión")
        login_btn.clicked.connect(self.handle_login)
        layout.addWidget(login_btn)

        register_link = QtWidgets.QLabel('¿No tienes cuenta? <a href="#">Regístrate</a>')
        register_link.setTextFormat(QtCore.Qt.RichText)
        register_link.linkActivated.connect(lambda: self.switch_to_register.emit())
        register_link.setObjectName("link")
        register_link.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(register_link)

        self.message = QtWidgets.QLabel()
        self.message.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(self.message)

        # Theme toggle
        self.theme_switch = QtWidgets.QCheckBox("Modo oscuro")
        self.theme_switch.stateChanged.connect(self.toggle_theme)
        layout.addWidget(self.theme_switch)

    def _labeled(self, text, widget):
        box = QtWidgets.QVBoxLayout()
        box.setSpacing(2)
        box.addWidget(QtWidgets.QLabel(text))
        box.addWidget(widget)
        w = QtWidgets.QWidget()
        w.setLayout(box)
        return w

    def handle_login(self):
        u = self.email.text().strip()
        p = self.password.text().strip()
        if not u or not p:
            self.message.setText("❌ No dejes campos vacíos.")
            return
        ok, res = connect.login_user(u, p)
        if not ok:
            self.message.setText(f"❌ {res}")
        else:
            self.login_success.emit()

    def toggle_theme(self, state):
        style = DARK_STYLE if state == QtCore.Qt.Checked else LIGHT_STYLE
        QtWidgets.QApplication.instance().setStyleSheet(style)

class RegisterScreen(QtWidgets.QWidget):
    switch_to_login = QtCore.pyqtSignal()

    def __init__(self):
        super().__init__()
        self._build_ui()

    def _build_ui(self):
        self.setStyleSheet(LIGHT_STYLE)
        layout = QtWidgets.QVBoxLayout(self)
        layout.setAlignment(QtCore.Qt.AlignTop | QtCore.Qt.AlignHCenter)
        layout.setContentsMargins(10,10,10,10)
        layout.setSpacing(5)

        # Logo
        logo = QtWidgets.QLabel()
        logo_path = os.path.join(os.path.dirname(__file__), 'Colive_Logo_.png')
        pixmap = QtGui.QPixmap(logo_path).scaledToWidth(200, QtCore.Qt.SmoothTransformation)
        logo.setPixmap(pixmap)
        logo.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(logo)

        # Role combo
        self.role_cb = QtWidgets.QComboBox()
        self.role_cb.addItems(['Selecciona un rol','Administrador','Propietario','Residente','Seguridad','Mantenimiento','Aseo'])
        layout.addWidget(self._labeled("Rol de usuario", self.role_cb))

        # Full name
        self.fullname = QtWidgets.QLineEdit()
        self.fullname.setPlaceholderText("Juan Pérez")
        layout.addWidget(self._labeled("Nombre completo", self.fullname))

        # Email & Phone
        row1 = QtWidgets.QHBoxLayout()
        self.email = QtWidgets.QLineEdit()
        self.email.setPlaceholderText("correo@ejemplo.com")
        self.phone = QtWidgets.QLineEdit()
        self.phone.setPlaceholderText("3001234567")
        row1.addWidget(self._labeled("Correo electrónico", self.email))
        row1.addWidget(self._labeled("Celular", self.phone))
        layout.addLayout(row1)

        # Username
        self.username = QtWidgets.QLineEdit()
        self.username.setPlaceholderText("usuario123")
        layout.addWidget(self._labeled("Nombre de usuario", self.username))

        # Passwords
        row2 = QtWidgets.QHBoxLayout()
        self.pwd1 = QtWidgets.QLineEdit()
        self.pwd1.setPlaceholderText("********")
        self.pwd1.setEchoMode(QtWidgets.QLineEdit.Password)
        self.pwd2 = QtWidgets.QLineEdit()
        self.pwd2.setPlaceholderText("********")
        self.pwd2.setEchoMode(QtWidgets.QLineEdit.Password)
        row2.addWidget(self._labeled("Contraseña", self.pwd1))
        row2.addWidget(self._labeled("Confirmar", self.pwd2))
        layout.addLayout(row2)

        # Terms
        self.terms = QtWidgets.QCheckBox("Acepto términos y condiciones")
        layout.addWidget(self.terms)

        # Buttons
        reg_btn = QtWidgets.QPushButton("Registrarse")
        reg_btn.clicked.connect(self.handle_register)
        layout.addWidget(reg_btn)

        back_btn = QtWidgets.QPushButton("Volver al login")
        back_btn.clicked.connect(lambda: self.switch_to_login.emit())
        layout.addWidget(back_btn)

        self.message = QtWidgets.QLabel()
        self.message.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(self.message)

        # Theme toggle
        self.theme_switch = QtWidgets.QCheckBox("Modo oscuro")
        self.theme_switch.stateChanged.connect(self.toggle_theme)
        layout.addWidget(self.theme_switch)

    def _labeled(self, text, widget):
        box = QtWidgets.QVBoxLayout()
        box.setSpacing(2)
        box.addWidget(QtWidgets.QLabel(text))
        box.addWidget(widget)
        w = QtWidgets.QWidget()
        w.setLayout(box)
        return w

    def handle_register(self):
        fields = {
            "role": self.role_cb.currentText(),
            "fullname": self.fullname.text().strip(),
            "email": self.email.text().strip(),
            "phone": self.phone.text().strip(),
            "username": self.username.text().strip(),
            "pwd1": self.pwd1.text().strip(),
            "pwd2": self.pwd2.text().strip()
        }
        if "" in fields.values() or fields["role"] == "Selecciona un rol":
            self.message.setText("❌ No dejes campos vacíos.")
            return
        if not self.terms.isChecked():
            self.message.setText("❌ Acepta los términos.")
            return
        if fields["pwd1"] != fields["pwd2"]:
            self.message.setText("❌ Contraseñas no coinciden.")
            return
        ok, res = connect.register_user(fields)
        self.message.setText("✅ Registro exitoso." if ok else f"❌ {res}")

    def toggle_theme(self, state):
        style = DARK_STYLE if state == QtCore.Qt.Checked else LIGHT_STYLE
        QtWidgets.QApplication.instance().setStyleSheet(style)

class WebAppView(QtWidgets.QWidget):
    def __init__(self, url):
        super().__init__()
        self.browser = QWebEngineView()
        self.browser.load(QtCore.QUrl(url))
        layout = QtWidgets.QVBoxLayout(self)
        layout.setContentsMargins(0,0,0,0)
        layout.addWidget(self.browser)

class MainWindow(QtWidgets.QStackedWidget):
    def __init__(self):
        super().__init__()
        self.login = LoginScreen()
        self.register = RegisterScreen()
        self.webview = WebAppView("http://localhost:5000/admin#")

        self.addWidget(self.login)
        self.addWidget(self.register)
        self.addWidget(self.webview)

        self.login.switch_to_register.connect(lambda: self.setCurrentWidget(self.register))
        self.register.switch_to_login.connect(lambda: self.setCurrentWidget(self.login))
        self.login.login_success.connect(lambda: self.setCurrentWidget(self.webview))

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    win = MainWindow()
    win.setWindowTitle("Colive - Escritorio")
    win.setFixedSize(420, 800)
    win.show()
    sys.exit(app.exec_())
