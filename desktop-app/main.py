# main.py

import sys
import os
from PyQt5 import QtWidgets, QtGui, QtCore
import connect  # nuestro módulo de lógica

# Common stylesheet for inputs and buttons, con campos más redondeados
COMMON_STYLE = """
QWidget { background-color: #f2f2f2; }
QLineEdit {
    height: 30px;
    border: 1px solid #ccc;
    border-radius: 12px;      /* mayor redondeo */
    padding: 4px;
    font-size: 14px;
}
QPushButton {
    border: 1px solid #4CAF50;
    border-radius: 12px;      /* también botones redondeados */
    padding: 6px;
    font-size: 16px;
    color: #4CAF50;
    background-color: transparent;
}
QPushButton:hover {
    background-color: #e8f5e9;
}
QLabel#link {
    color: #c5b566;
    font-size: 13px;
}
"""

class LoginScreen(QtWidgets.QWidget):
    switch_to_register = QtCore.pyqtSignal()

    def __init__(self):
        super().__init__()
        self.setStyleSheet(COMMON_STYLE)
        v = QtWidgets.QVBoxLayout(self)
        v.setAlignment(QtCore.Qt.AlignTop | QtCore.Qt.AlignHCenter)
        v.setContentsMargins(10,10,10,10)
        v.setSpacing(5)

        # Logo
        logo = QtWidgets.QLabel()
        basedir = os.path.dirname(__file__)
        logo_path = os.path.join(basedir, 'Colive_Logo_.png')
        pixmap = QtGui.QPixmap(logo_path).scaledToWidth(200, QtCore.Qt.SmoothTransformation)
        logo.setPixmap(pixmap)
        logo.setAlignment(QtCore.Qt.AlignCenter)
        v.addWidget(logo)
        v.addSpacing(10)

        # Campos
        self.email = QtWidgets.QLineEdit(); self.email.setPlaceholderText('Email')
        v.addWidget(self._labeled('Correo de usuario', self.email))
        self.password = QtWidgets.QLineEdit(); self.password.setPlaceholderText('Password')
        self.password.setEchoMode(QtWidgets.QLineEdit.Password)
        v.addWidget(self._labeled('Contraseña', self.password))

        # Link y botón
        forgot = QtWidgets.QLabel('¿Olvidaste tu contraseña?')
        forgot.setObjectName('link'); forgot.setAlignment(QtCore.Qt.AlignCenter)
        v.addWidget(forgot); v.addSpacing(5)
        login_btn = QtWidgets.QPushButton('Iniciar sesión')
        login_btn.clicked.connect(self.handle_login)
        v.addWidget(login_btn); v.addSpacing(5)
        register_link = QtWidgets.QLabel('¿No tienes cuenta? <a href="#">Regístrate</a>')
        register_link.setTextFormat(QtCore.Qt.RichText)
        register_link.setTextInteractionFlags(QtCore.Qt.TextBrowserInteraction)
        register_link.linkActivated.connect(lambda: self.switch_to_register.emit())
        register_link.setObjectName('link'); register_link.setAlignment(QtCore.Qt.AlignCenter)
        v.addWidget(register_link)

        # Mensaje de error o bienvenida
        self.message = QtWidgets.QLabel(); self.message.setAlignment(QtCore.Qt.AlignCenter)
        v.addWidget(self.message)

    def _labeled(self, text, widget):
        container = QtWidgets.QVBoxLayout()
        container.setContentsMargins(0,0,0,0)
        container.setSpacing(2)
        label = QtWidgets.QLabel(text)
        container.addWidget(label)
        container.addWidget(widget)
        w = QtWidgets.QWidget(); w.setLayout(container)
        return w

    def handle_login(self):
        email = self.email.text().strip()
        pwd = self.password.text().strip()
        if not email or not pwd:
            self.message.setText("No dejes campos vacíos.")
            return
        ok, err = connect.login_user(email, pwd)
        if not ok:
            self.message.setText(err)
        else:
            self.message.setText(f"¡Bienvenido, {email}!")

class RegisterScreen(QtWidgets.QWidget):
    switch_to_login = QtCore.pyqtSignal()

    def __init__(self):
        super().__init__()
        self.setStyleSheet(COMMON_STYLE)
        v = QtWidgets.QVBoxLayout(self)
        v.setAlignment(QtCore.Qt.AlignTop | QtCore.Qt.AlignHCenter)
        v.setContentsMargins(10,10,10,10)
        v.setSpacing(5)

        # Logo y título
        logo = QtWidgets.QLabel()
        basedir = os.path.dirname(__file__)
        logo_path = os.path.join(basedir, 'Colive_Logo_.png')
        pixmap = QtGui.QPixmap(logo_path).scaledToWidth(200, QtCore.Qt.SmoothTransformation)
        logo.setPixmap(pixmap); logo.setAlignment(QtCore.Qt.AlignCenter)
        v.addWidget(logo); v.addSpacing(10)
        title = QtWidgets.QLabel('Elige el tipo de usuario')
        title.setStyleSheet('font-size:18px; font-weight:bold;')
        v.addWidget(title); v.addSpacing(5)

        # Campos de registro
        self.role = QtWidgets.QComboBox()
        self.role.addItems(['Selecciona un rol','Administrador','Propietario','Residente','Seguridad','Mantenimiento','Aseo'])
        v.addWidget(self._labeled('Rol de usuario', self.role)); v.addSpacing(5)

        self.fullname = QtWidgets.QLineEdit(); self.fullname.setPlaceholderText('Juan Pérez')
        v.addWidget(self._labeled('Nombre completo', self.fullname)); v.addSpacing(5)

        row1 = QtWidgets.QHBoxLayout(); row1.setSpacing(5)
        self.email = QtWidgets.QLineEdit(); self.email.setPlaceholderText('ejemplo@dominio.com')
        self.phone = QtWidgets.QLineEdit(); self.phone.setPlaceholderText('3001234567')
        row1.addWidget(self._labeled('Correo electrónico', self.email))
        row1.addWidget(self._labeled('Celular', self.phone))
        v.addLayout(row1); v.addSpacing(5)

        self.username = QtWidgets.QLineEdit(); self.username.setPlaceholderText('usuario123')
        v.addWidget(self._labeled('Nombre de usuario', self.username)); v.addSpacing(5)

        row2 = QtWidgets.QHBoxLayout(); row2.setSpacing(5)
        self.pwd1 = QtWidgets.QLineEdit(); self.pwd1.setPlaceholderText('********'); self.pwd1.setEchoMode(QtWidgets.QLineEdit.Password)
        self.pwd2 = QtWidgets.QLineEdit(); self.pwd2.setPlaceholderText('********'); self.pwd2.setEchoMode(QtWidgets.QLineEdit.Password)
        row2.addWidget(self._labeled('Contraseña', self.pwd1))
        row2.addWidget(self._labeled('Confirmar contraseña', self.pwd2))
        v.addLayout(row2); v.addSpacing(5)

        # Términos y botones
        self.terms = QtWidgets.QCheckBox('Acepto los términos y condiciones')
        v.addWidget(self.terms); v.addSpacing(5)

        reg_btn = QtWidgets.QPushButton('Registrarse')
        reg_btn.clicked.connect(self.handle_register)
        v.addWidget(reg_btn); v.addSpacing(5)

        back = QtWidgets.QPushButton('Volver al login')
        back.clicked.connect(lambda: self.switch_to_login.emit())
        v.addWidget(back)

        self.message = QtWidgets.QLabel(); self.message.setAlignment(QtCore.Qt.AlignCenter)
        v.addWidget(self.message)

    def _labeled(self, text, widget):
        container = QtWidgets.QVBoxLayout()
        container.setContentsMargins(0,0,0,0)
        container.setSpacing(2)
        label = QtWidgets.QLabel(text)
        container.addWidget(label)
        container.addWidget(widget)
        w = QtWidgets.QWidget(); w.setLayout(container)
        return w

    def handle_register(self):
        # Validar campos vacíos
        fields = {
            "role": self.role.currentText(),
            "fullname": self.fullname.text().strip(),
            "email": self.email.text().strip(),
            "phone": self.phone.text().strip(),
            "username": self.username.text().strip(),
            "pwd1": self.pwd1.text().strip(),
            "pwd2": self.pwd2.text().strip()
        }
        # Ninguno vacío y rol seleccionado
        if ("" in fields.values()
            or fields["role"] == "Selecciona un rol"):
            self.message.setText("No dejes campos vacíos.")
            return
        if not self.terms.isChecked():
            self.message.setText("Debes aceptar los términos.")
            return

        ok, err = connect.register_user(fields)
        if not ok:
            self.message.setText(err)
        else:
            self.message.setText("Registro exitoso.")
            # opcional: cambiar a login automáticamente
            # self.switch_to_login.emit()

class MainWindow(QtWidgets.QStackedWidget):
    def __init__(self):
        super().__init__()
        self.login = LoginScreen()
        self.register = RegisterScreen()
        self.addWidget(self.login)
        self.addWidget(self.register)
        self.login.switch_to_register.connect(lambda: self.setCurrentWidget(self.register))
        self.register.switch_to_login.connect(lambda: self.setCurrentWidget(self.login))

if __name__ == '__main__':
    app = QtWidgets.QApplication(sys.argv)
    win = MainWindow()
    win.setWindowTitle('Colive - Escritorio')
    win.setFixedSize(400, 750)
    win.show()
    sys.exit(app.exec_())
