import sys, os
from PyQt5 import QtWidgets, QtCore, QtGui
from PyQt5.QtWebEngineWidgets import QWebEngineView
import connect2
from main2 import RegisterWindow  # Importa tu ventana de registro avanzada



estilos = """
QWidget {
    background-color: white;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
}

QLineEdit, QComboBox, QSpinBox {
    border: 1px solid #c4c4c4;
    border-radius: 6px;
    padding: 8px;
    background: #f9f9f9;
}

QLineEdit:focus, QComboBox:focus {
    border: 1px solid #a08f7f;
}

QPushButton {
    background-color: qlineargradient(spread:pad, x1:0, y1:0, x2:1, y2:1,
                                      stop:0 #d8bfa5, stop:1 #b69776);
    border: none;
    color: #3c2c1f;
    padding: 10px 20px;
    border-radius: 20px;
    font-weight: bold;
}

QPushButton:hover {
    background-color: #cdb096;
}

QPushButton:pressed {
    background-color: #b89f86;
}

QLabel {
    color: #3c3c3c;
    font-weight: 500;
}

QGroupBox {
    font-weight: bold;
    border: none;
    margin-top: 10px;
}

QCheckBox {
    spacing: 10px;
    font-weight: 500;
    color: #444;
}

QCheckBox::indicator {
    width: 16px;
    height: 16px;
}
"""


# Pantalla de Login
class LoginScreen(QtWidgets.QWidget):
    login_success = QtCore.pyqtSignal()
    switch_to_register = QtCore.pyqtSignal()

    def __init__(self):
        super().__init__()
        self.setWindowTitle("Iniciar sesión")
        layout = QtWidgets.QVBoxLayout(self)
        layout.setAlignment(QtCore.Qt.AlignTop | QtCore.Qt.AlignHCenter)
        app.setStyleSheet(estilos)

        # Logo
        logo = QtWidgets.QLabel(alignment=QtCore.Qt.AlignCenter)
        path = os.path.join(os.path.dirname(__file__), "Colive_Logo.png")
        pix = QtGui.QPixmap(path).scaledToWidth(180, QtCore.Qt.SmoothTransformation)
        logo.setPixmap(pix)
        layout.addWidget(logo)

        # Campos
        self.username = QtWidgets.QLineEdit()
        self.username.setPlaceholderText("Usuario")
        self.password = QtWidgets.QLineEdit()
        self.password.setPlaceholderText("Contraseña")
        self.password.setEchoMode(QtWidgets.QLineEdit.Password)
        layout.addWidget(self.username)
        layout.addWidget(self.password)

        # Botones
        btn_login = QtWidgets.QPushButton("Iniciar sesión")
        layout.addWidget(btn_login)
        btn_register = QtWidgets.QPushButton("Regístrate")
        layout.addWidget(btn_register)

        self.msg = QtWidgets.QLabel()
        layout.addWidget(self.msg)

        # Conexiones
        btn_login.clicked.connect(self.on_login)
        btn_register.clicked.connect(lambda: self.switch_to_register.emit())

    def on_login(self):
        u = self.username.text().strip()
        p = self.password.text().strip()
        if not u or not p:
            self.msg.setText("❌ No dejes campos vacíos.")
            return
        ok, res = connect2.login_user(u, p)
        if not ok:
            self.msg.setText(f"❌ {res}")
        else:
            self.login_success.emit()

class WebAppView(QtWidgets.QWidget):
    def __init__(self, url):
        super().__init__()
        self.browser = QWebEngineView()
        self.browser.load(QtCore.QUrl(url))
        layout = QtWidgets.QVBoxLayout(self)
        layout.setContentsMargins(0, 0, 0, 0)
        layout.addWidget(self.browser)

class MainWindow(QtWidgets.QStackedWidget):
    def __init__(self):
        super().__init__()
        self.login = LoginScreen()
        self.register = RegisterWindow(QtWidgets.QApplication.instance())

        self.webview = WebAppView("https://localhost/admin")


        self.addWidget(self.login)
        self.addWidget(self.register)
        self.addWidget(self.webview)

        self.login.switch_to_register.connect(lambda: self.setCurrentWidget(self.register))
        self.register.btn_next.clicked.connect(lambda: self.setCurrentWidget(self.register.conjunto_widget))
        self.login.login_success.connect(lambda: self.setCurrentWidget(self.webview))

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    win = MainWindow()
    win.setWindowTitle("Colive Escritorio")
    win.setFixedSize(420, 800)
    win.show()
    sys.exit(app.exec_())
