# main2.py
import sys, os
from PyQt5 import QtWidgets, QtGui, QtCore
import connect2

# Aplica esto a tu app con: app.setStyleSheet(estilos)
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



class RegisterWindow(QtWidgets.QWidget):
    back_to_login = QtCore.pyqtSignal()

    def __init__(self, app):
        super().__init__()
        self.setWindowTitle("Registro Colive")
        self.setFixedSize(420, 700)
        app.setStyleSheet(estilos)

        self.stacked = QtWidgets.QStackedLayout()
        self.setLayout(self.stacked)

        self.user_fields = {}
        self._screen_admin()
        self._screen_conjunto()

        self.stacked.addWidget(self.admin_widget)
        self.stacked.addWidget(self.conjunto_widget)
        

    def _add_password_toggle(self, line_edit):
        button = QtWidgets.QToolButton()
        
        eye_open = QtGui.QIcon(os.path.join(os.path.dirname(__file__), "eye.png"))
        eye_closed = QtGui.QIcon(os.path.join(os.path.dirname(__file__), "eye-off.png"))

        button.setIcon(eye_closed)
        button.setCursor(QtCore.Qt.PointingHandCursor)
        button.setStyleSheet("border: none; padding: 0px;")
        button.setIconSize(QtCore.QSize(16, 16))

        def toggle():
            if line_edit.echoMode() == QtWidgets.QLineEdit.Password:
                line_edit.setEchoMode(QtWidgets.QLineEdit.Normal)
                button.setIcon(eye_open)
            else:
                line_edit.setEchoMode(QtWidgets.QLineEdit.Password)
                button.setIcon(eye_closed)

        button.clicked.connect(toggle)

        # Crear un botón personalizado como widget
        action = QtWidgets.QWidgetAction(line_edit)
        action.setDefaultWidget(button)
        line_edit.addAction(action, QtWidgets.QLineEdit.TrailingPosition)

        # Ajustar márgenes si es necesario
        line_edit.setTextMargins(0, 0, 30, 0)
    def _validar_password(self):
        text = self.password.text()

        if not text:
            # Estado neutral
            self._actualizar_lbl(self.lbl_len, False, "La contraseña debe tener al menos 8 caracteres.", neutro=True)
            self._actualizar_lbl(self.lbl_upper, False, "La contraseña debe tener al menos una letra mayúscula.", neutro=True)
            self._actualizar_lbl(self.lbl_digit, False, "La contraseña debe tener al menos un número.", neutro=True)
            return

        # Evaluar reglas
        tiene_longitud = len(text) >= 8
        tiene_mayus = any(c.isupper() for c in text)
        tiene_digito = any(c.isdigit() for c in text)

        self._actualizar_lbl(self.lbl_len, tiene_longitud, "La contraseña debe tener al menos 8 caracteres.")
        self._actualizar_lbl(self.lbl_upper, tiene_mayus, "La contraseña debe tener al menos una letra mayúscula.")
        self._actualizar_lbl(self.lbl_digit, tiene_digito, "La contraseña debe tener al menos un número.")

    def _actualizar_lbl(self, label, estado, texto, neutro=False):
        if neutro:
            label.setText(f"• {texto}")
            label.setStyleSheet("color: black; font-size: 12px;")
        elif estado:
            label.setText(f"✅ {texto}")
            label.setStyleSheet("color: #007700; font-size: 12px;")
        else:
            label.setText(f"❌ {texto}")
            label.setStyleSheet("color: #D8000C; font-size: 12px;")
    def _validar_correo(self):
        correo = self.correo.text().strip()
        valido = False

        if "@" in correo:
            partes = correo.split("@")
            if len(partes) == 2 and "." in partes[1]:
                valido = True

        if not correo:
            self.correo.setStyleSheet("")  # Neutral
        elif valido:
            self.correo.setStyleSheet("border: 1px solid green;")
        else:
            self.correo.setStyleSheet("border: 1px solid red;")

    def _capitalizar(self, line_edit):
        cursor = line_edit.cursorPosition()
        line_edit.setText(line_edit.text().upper())
        line_edit.setCursorPosition(cursor)


    def _screen_admin(self):
        # --- Pantalla 1: Administrador ---
        self.admin_widget = QtWidgets.QWidget()
        layout = QtWidgets.QVBoxLayout(self.admin_widget)
        layout.setAlignment(QtCore.Qt.AlignTop)

        # Logo
        logo = QtWidgets.QLabel(alignment=QtCore.Qt.AlignCenter)
        path = os.path.join(os.path.dirname(__file__), "Colive_Logo.png")
        pix = QtGui.QPixmap(path).scaledToWidth(180, QtCore.Qt.SmoothTransformation)
        logo.setPixmap(pix)
        layout.addWidget(logo)

        # Campos
        self.username  = QtWidgets.QLineEdit(); self.username.setPlaceholderText("Nombre de usuario")
        self.nombre    = QtWidgets.QLineEdit(); self.nombre.setPlaceholderText("Nombre completo")
        self.correo    = QtWidgets.QLineEdit(); self.correo.setPlaceholderText("Correo electrónico")

        # CONVERTIR A MAYÚSCULAS
        self.username.textChanged.connect(lambda: self._capitalizar(self.username))
        self.nombre.textChanged.connect(lambda: self._capitalizar(self.nombre))

        # VALIDAR CORREO EN TIEMPO REAL
        self.correo.textChanged.connect(self._validar_correo)

        self.password  = QtWidgets.QLineEdit(); self.password.setPlaceholderText("Contraseña")
        self.password.setEchoMode(QtWidgets.QLineEdit.Password)
        self._add_password_toggle(self.password)
        self.password.textChanged.connect(self._validar_password)  # Validación dinámica

        self.password2 = QtWidgets.QLineEdit(); self.password2.setPlaceholderText("Confirmar contraseña")
        self.password2.setEchoMode(QtWidgets.QLineEdit.Password)
        self._add_password_toggle(self.password2)

        # Indicadores de validación de contraseña (estado inicial neutro)
        self.lbl_len = QtWidgets.QLabel("• La contraseña debe tener al menos 8 caracteres.")
        self.lbl_upper = QtWidgets.QLabel("• La contraseña debe tener al menos una letra mayúscula.")
        self.lbl_digit = QtWidgets.QLabel("• La contraseña debe tener al menos un número.")
        for lbl in (self.lbl_len, self.lbl_upper, self.lbl_digit):
            lbl.setStyleSheet("color: black; font-size: 12px;")


        self.celular   = QtWidgets.QLineEdit(); self.celular.setPlaceholderText("Celular (7–15 dígitos)")
        rx = QtCore.QRegExp(r'^\d{0,15}$')
        self.celular.setValidator(QtGui.QRegExpValidator(rx, self))

        self.terms     = QtWidgets.QCheckBox("Acepto los términos y condiciones")
        self.btn_next  = QtWidgets.QPushButton("Continuar registro")
        self.msg1      = QtWidgets.QLabel(objectName="msg"); self.msg1.setWordWrap(True)

        # Agregar campos y etiquetas al layout
        for w in (self.username, self.nombre, self.correo,
                self.password, self.password2,
                self.lbl_len, self.lbl_upper, self.lbl_digit,
                self.celular, self.terms, self.btn_next, self.msg1):
            layout.addWidget(w)

            self.btn_next.clicked.connect(self.on_admin_next)

    def _screen_conjunto(self):
        self.conjunto_widget = QtWidgets.QWidget()
        layout = QtWidgets.QVBoxLayout(self.conjunto_widget)
        layout.setAlignment(QtCore.Qt.AlignTop)

        # Logo
        logo = QtWidgets.QLabel(alignment=QtCore.Qt.AlignCenter)
        path = os.path.join(os.path.dirname(__file__), "Colive_Logo_.png")
        pix = QtGui.QPixmap(path).scaledToWidth(120, QtCore.Qt.SmoothTransformation)
        logo.setPixmap(pix)
        layout.addWidget(logo)

        # Campos básicos
        self.cnombre = QtWidgets.QLineEdit(); self.cnombre.setPlaceholderText("Nombre del conjunto")
        self.direccion = QtWidgets.QLineEdit(); self.direccion.setPlaceholderText("Dirección")
        self.ciudad = QtWidgets.QLineEdit(); self.ciudad.setPlaceholderText("Ciudad")
        self.depto = QtWidgets.QLineEdit(); self.depto.setPlaceholderText("Departamento")

        layout.addWidget(self.cnombre)
        layout.addWidget(self.direccion)
        layout.addWidget(self.ciudad)
        layout.addWidget(self.depto)

        # Amenidades (2 columnas)
        layout.addWidget(QtWidgets.QLabel("Amenidades:"))
        amenidades_nombres = [
            "PISCINA", "GIMNASIO", "PARQUE INFANTIL", "BBQ",
            "SALÓN COMUNAL", "SALÓN DE JUEGOS", "ZONAS HUMEDAS", "CANCHA MULTIPROPOSITO"
        ]

        self.amenidades_checkboxes = []
        grid_amen = QtWidgets.QGridLayout()
        grid_amen.setHorizontalSpacing(20)
        grid_amen.setVerticalSpacing(10)

        for i, nombre in enumerate(amenidades_nombres):
            chk = QtWidgets.QCheckBox(nombre)
            self.amenidades_checkboxes.append(chk)
            fila = i // 2
            col = i % 2
            grid_amen.addWidget(chk, fila, col)

        group_amen = QtWidgets.QGroupBox()
        group_amen.setLayout(grid_amen)
        layout.addWidget(group_amen)

        # Parqueadero: combo + spinbox en la misma fila
        parking_row = QtWidgets.QHBoxLayout()
        self.parking_type = QtWidgets.QComboBox()
        self.parking_type.addItems(["Seleccione...", "1 a 1", "Sorteo", "No aplica"])
        self.parking_num = QtWidgets.QSpinBox()
        self.parking_num.setRange(0, 100)
        self.parking_num.setEnabled(False)

        parking_row.addWidget(QtWidgets.QLabel("Parqueadero:"))
        parking_row.addWidget(self.parking_type)
        parking_row.addWidget(QtWidgets.QLabel("N°:"))
        parking_row.addWidget(self.parking_num)
        layout.addLayout(parking_row)

        # Bodegas: combo + spinbox en la misma fila
        storage_row = QtWidgets.QHBoxLayout()
        self.storage_type = QtWidgets.QComboBox()
        self.storage_type.addItems(["Seleccione...", "Sí aplica", "No aplica"])
        self.storage_num = QtWidgets.QSpinBox()
        self.storage_num.setRange(0, 100)
        self.storage_num.setEnabled(False)

        storage_row.addWidget(QtWidgets.QLabel("Bodegas:"))
        storage_row.addWidget(self.storage_type)
        storage_row.addWidget(QtWidgets.QLabel("N°:"))
        storage_row.addWidget(self.storage_num)
        layout.addLayout(storage_row)

        # Conectar señales
        self.parking_type.currentIndexChanged.connect(self._toggle_parking_num)
        self.storage_type.currentIndexChanged.connect(self._toggle_storage_num)

        # Botón registrar
        self.btn_reg = QtWidgets.QPushButton("Registrar conjunto")
        self.msg2 = QtWidgets.QLabel(objectName="msg"); self.msg2.setWordWrap(True)
        layout.addWidget(self.btn_reg)
        layout.addWidget(self.msg2)

        self.btn_reg.clicked.connect(self.on_register)



    def _toggle_parking_num(self, idx):
        # Solo habilita número si "1 a 1" o "Sorteo"
        self.parking_num.setEnabled(idx in (1, 2))

    def _toggle_storage_num(self, idx):
        self.storage_num.setEnabled(idx == 1)

    def on_admin_next(self):
        # Validaciones
        if not all([
            self.username.text().strip(),
            self.nombre.text().strip(),
            self.correo.text().strip(),
            self.password.text(),
            self.password2.text(),
            self.terms.isChecked()
        ]):
            self.msg1.setText("❌ Completa todos los campos y acepta los términos.")
            return
        if self.password.text() != self.password2.text():
            self.msg1.setText("❌ Las contraseñas no coinciden.")
            return
        if len(self.password.text()) < 8:
            self.msg1.setText("❌ La contraseña debe tener al menos 8 caracteres.")
            return

        # Guardar datos y avanzar
        self.user_fields = {
            "username": self.username.text().strip(),
            "nombre":   self.nombre.text().strip(),
            "correo":   self.correo.text().strip(),
            "password": self.password.text(),
            "celular":  int(self.celular.text() or 0)
        }
        self.msg1.setText("")
        self.stacked.setCurrentIndex(1)

    def on_register(self):
        if not all([
            self.cnombre.text().strip(),
            self.direccion.text().strip(),
            self.ciudad.text().strip(),
            self.depto.text().strip()
        ]):
            self.msg2.setText("❌ Completa todos los campos obligatorios.")
            return

        # Recolectar amenidades seleccionadas
        amenidades = [
            {"nombre": chk.text()}
            for chk in self.amenidades_checkboxes if chk.isChecked()
        ]

        # Configuraciones de parqueadero y bodegas
        config = {
            "tipoParqueadero": self.parking_type.currentIndex() in (1, 2),
            "numParqueadero": self.parking_num.value(),
            "tipoAlmacen": self.storage_type.currentIndex() == 1,
            "numAlmacen": self.storage_num.value()
        }

        conjunto_fields = {
            "nombre": self.cnombre.text().strip(),
            "nombreAdministrador": self.user_fields["nombre"],
            "direccion": self.direccion.text().strip(),
            "ciudad": self.ciudad.text().strip(),
            "departamento": self.depto.text().strip(),
            "amenidades": amenidades,
            "configuraciones": [config]
        }

        ok, res = connect2.register_user(self.user_fields, conjunto_fields)
        if ok:
            self.msg2.setStyleSheet("color: #007700;")
            self.msg2.setText("✅ ¡Registro exitoso!\n" + str(res))
        else:
            self.msg2.setStyleSheet("color: #D8000C;")
            self.msg2.setText("❌ " + str(res))

class MainWindow(QtWidgets.QWidget):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Colive - Escritorio")
        self.setFixedSize(420, 700)
        app.setStyleSheet(estilos)

        self.stack = QtWidgets.QStackedLayout(self)

        # Instancia pantallas
        self.login_screen = LoginScreen()
        self.register = RegisterWindow(app)

        # Añadir al stack
        self.stack.addWidget(self.login_screen)   # índice 0
        self.stack.addWidget(self.register)       # índice 1

        # Señales
        self.login_screen.login_success.connect(lambda: self.stack.setCurrentIndex(1))
        self.login_screen.switch_to_register.connect(lambda: self.stack.setCurrentIndex(1))
        self.register.back_to_login.connect(lambda: self.stack.setCurrentIndex(0))

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    win = MainWindow()
    win.show()
    sys.exit(app.exec_())
