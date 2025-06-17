# main.py
import sys, os
from PyQt5 import QtWidgets, QtGui, QtCore
import connect

COMMON_STYLE = """
QWidget { background-color: #f2f2f2; }
QLineEdit {
    height: 30px; border: 1px solid #ccc; border-radius: 12px;
    padding: 4px; font-size: 14px;
}
QPushButton {
    border: 1px solid #4CAF50; border-radius: 12px;
    padding: 6px; font-size: 16px;
    color: #4CAF50; background-color: transparent;
}
QPushButton:hover { background-color: #e8f5e9; }
QLabel#link { color: #c5b566; font-size: 13px; }
"""

class LoginScreen(QtWidgets.QWidget):
    switch_to_register = QtCore.pyqtSignal()
    def __init__(self):
        super().__init__()
        self.setStyleSheet(COMMON_STYLE)
        layout = QtWidgets.QVBoxLayout(self)
        layout.setAlignment(QtCore.Qt.AlignTop | QtCore.Qt.AlignHCenter)
        layout.setContentsMargins(10,10,10,10)
        layout.setSpacing(5)

        # Logo
        logo = QtWidgets.QLabel()
        basedir = os.path.dirname(__file__)
        logo_path = os.path.join(basedir, 'Colive_Logo_.png')
        pixmap = QtGui.QPixmap(logo_path).scaledToWidth(200, QtCore.Qt.SmoothTransformation)
        logo.setPixmap(pixmap)
        logo.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(logo)
        layout.addSpacing(10)

        # Email
        self.email = QtWidgets.QLineEdit()
        self.email.setPlaceholderText("Email")
        layout.addWidget(self._labeled("Usuario", self.email))

        # Password
        self.password = QtWidgets.QLineEdit()
        self.password.setPlaceholderText("Password")
        self.password.setEchoMode(QtWidgets.QLineEdit.Password)
        layout.addWidget(self._labeled("Contraseña", self.password))

        # Login button
        login_btn = QtWidgets.QPushButton("Iniciar sesión")
        login_btn.clicked.connect(self.handle_login)
        layout.addWidget(login_btn)
        layout.addSpacing(5)

        # Switch to register
        register_link = QtWidgets.QLabel('¿No tienes cuenta? <a href="#">Regístrate</a>')
        register_link.setTextFormat(QtCore.Qt.RichText)
        register_link.linkActivated.connect(lambda: self.switch_to_register.emit())
        register_link.setObjectName("link")
        register_link.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(register_link)
        layout.addSpacing(5)

        # Message
        self.message = QtWidgets.QLabel()
        self.message.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(self.message)

    def _labeled(self, text, widget):
        container = QtWidgets.QVBoxLayout()
        container.setContentsMargins(0,0,0,0)
        container.setSpacing(2)
        container.addWidget(QtWidgets.QLabel(text))
        container.addWidget(widget)
        w = QtWidgets.QWidget()
        w.setLayout(container)
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
            self.message.setText(f"✅ ¡Bienvenido, {u}!")

class RegisterScreen(QtWidgets.QWidget):
    switch_to_login = QtCore.pyqtSignal()
    def __init__(self):
        super().__init__()
        self.setStyleSheet(COMMON_STYLE)
        layout = QtWidgets.QVBoxLayout(self)
        layout.setAlignment(QtCore.Qt.AlignTop | QtCore.Qt.AlignHCenter)
        layout.setContentsMargins(10,10,10,10)
        layout.setSpacing(5)

        # Logo
        logo = QtWidgets.QLabel()
        basedir = os.path.dirname(__file__)
        logo_path = os.path.join(basedir, 'Colive_Logo_.png')
        pixmap = QtGui.QPixmap(logo_path).scaledToWidth(200, QtCore.Qt.SmoothTransformation)
        logo.setPixmap(pixmap)
        logo.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(logo)
        layout.addSpacing(10)

        # Role combobox
        self.role_cb = QtWidgets.QComboBox()
        self.role_cb.addItems(['Selecciona un rol','Administrador','Propietario','Residente','Seguridad','Mantenimiento','Aseo'])
        layout.addWidget(self._labeled("Rol de usuario", self.role_cb))
        layout.addSpacing(5)

        # Full name
        self.fullname = QtWidgets.QLineEdit()
        self.fullname.setPlaceholderText("Juan Pérez")
        layout.addWidget(self._labeled("Nombre completo", self.fullname))
        layout.addSpacing(5)

        # Email + Phone
        row1 = QtWidgets.QHBoxLayout()
        row1.setSpacing(5)
        self.email = QtWidgets.QLineEdit()
        self.email.setPlaceholderText("ejemplo@dominio.com")
        self.phone = QtWidgets.QLineEdit()
        self.phone.setPlaceholderText("3001234567")
        row1.addWidget(self._labeled("Correo electrónico", self.email))
        row1.addWidget(self._labeled("Celular", self.phone))
        layout.addLayout(row1)
        layout.addSpacing(5)

        # Username
        self.username = QtWidgets.QLineEdit()
        self.username.setPlaceholderText("usuario123")
        layout.addWidget(self._labeled("Nombre de usuario", self.username))
        layout.addSpacing(5)

        # Passwords
        row2 = QtWidgets.QHBoxLayout()
        row2.setSpacing(5)
        self.pwd1 = QtWidgets.QLineEdit()
        self.pwd1.setPlaceholderText("********")
        self.pwd1.setEchoMode(QtWidgets.QLineEdit.Password)
        self.pwd2 = QtWidgets.QLineEdit()
        self.pwd2.setPlaceholderText("********")
        self.pwd2.setEchoMode(QtWidgets.QLineEdit.Password)
        row2.addWidget(self._labeled("Contraseña", self.pwd1))
        row2.addWidget(self._labeled("Confirmar", self.pwd2))
        layout.addLayout(row2)
        layout.addSpacing(5)

        # Terms
        self.terms = QtWidgets.QCheckBox("Acepto términos y condiciones")
        layout.addWidget(self.terms)
        layout.addSpacing(5)

        # Buttons
        reg_btn = QtWidgets.QPushButton("Registrarse")
        reg_btn.clicked.connect(self.handle_register)
        layout.addWidget(reg_btn)
        layout.addSpacing(5)

        back_btn = QtWidgets.QPushButton("Volver al login")
        back_btn.clicked.connect(lambda: self.switch_to_login.emit())
        layout.addWidget(back_btn)

        # Message
        self.message = QtWidgets.QLabel()
        self.message.setAlignment(QtCore.Qt.AlignCenter)
        layout.addWidget(self.message)

    def _labeled(self, text, widget):
        container = QtWidgets.QVBoxLayout()
        container.setContentsMargins(0,0,0,0)
        container.setSpacing(2)
        container.addWidget(QtWidgets.QLabel(text))
        container.addWidget(widget)
        w = QtWidgets.QWidget()
        w.setLayout(container)
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
        # Validaciones
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
        if not ok:
            self.message.setText(f"❌ {res}")
        else:
            self.message.setText("✅ Registro exitoso.")

class MainWindow(QtWidgets.QStackedWidget):
    def __init__(self):
        super().__init__()
        self.login = LoginScreen()
        self.register = RegisterScreen()
        self.addWidget(self.login)
        self.addWidget(self.register)
        self.login.switch_to_register.connect(lambda: self.setCurrentWidget(self.register))
        self.register.switch_to_login.connect(lambda: self.setCurrentWidget(self.login))

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    win = MainWindow()
    win.setWindowTitle("Colive - Escritorio")
    win.setFixedSize(400, 750)
    win.show()
    sys.exit(app.exec_())
