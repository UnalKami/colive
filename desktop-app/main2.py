# main2.py
import sys, os
from PyQt5 import QtWidgets, QtGui, QtCore
import connect2

# ---------------------------
# Estilos generales
# ---------------------------
STYLE = """
QWidget { background: #f7f7f7; font-family: "Segoe UI", sans-serif; }
QLineEdit, QComboBox, QSpinBox {
    border: 1px solid #bbb;
    border-radius: 8px;
    padding: 8px;
    background: #fff;
}
QPushButton {
    background: #c5ae85;
    color: #333;
    border: none;
    border-radius: 20px;
    padding: 10px 20px;
    font-size: 14px;
}
QPushButton:hover {
    background: #b39b73;
}
QLabel#title {
    font-size: 18px;
    font-weight: bold;
    margin: 12px 0;
}
QCheckBox {
    spacing: 8px;
}
"""

# ---------------------------
# Pantalla 1: Administrador
# ---------------------------
class AdminScreen(QtWidgets.QWidget):
    switch_to_complex = QtCore.pyqtSignal(dict)  # emitirá los datos admin

    def __init__(self):
        super().__init__()
        self.setStyleSheet(STYLE)
        v = QtWidgets.QVBoxLayout(self)
        v.setContentsMargins(40,40,40,40)
        v.setSpacing(16)

        # Logo
        logo = QtWidgets.QLabel(alignment=QtCore.Qt.AlignCenter)
        img = QtGui.QPixmap(os.path.join(os.path.dirname(__file__), "Colive_Logo_.png"))
        if not img.isNull():
            logo.setPixmap(img.scaledToWidth(120, QtCore.Qt.SmoothTransformation))
        v.addWidget(logo)

        # Título
        t = QtWidgets.QLabel("Registrar administrador", objectName="title", alignment=QtCore.Qt.AlignCenter)
        v.addWidget(t)

        # Campos
        self.fullname  = QtWidgets.QLineEdit(); self.fullname.setPlaceholderText("NOMBRE DEL ADMINISTRADOR")
        self.email     = QtWidgets.QLineEdit(); self.email.setPlaceholderText("DIRECCIÓN DE CORREO")
        self.pwd       = QtWidgets.QLineEdit(); self.pwd.setPlaceholderText("CONTRASEÑA")
        self.pwd.setEchoMode(QtWidgets.QLineEdit.Password)
        self.confirm   = QtWidgets.QLineEdit(); self.confirm.setPlaceholderText("CONFIRMAR CONTRASEÑA")
        self.confirm.setEchoMode(QtWidgets.QLineEdit.Password)
        self.terms     = QtWidgets.QCheckBox("Acepto los términos y condiciones")

        for w in (
            self.fullname, self.email, self.pwd, self.confirm, self.terms
        ):
            v.addWidget(w)

        # Mensajes de validación
        self.msg = QtWidgets.QLabel(""); self.msg.setStyleSheet("color:#c00;")
        v.addWidget(self.msg)

        # Botón continuar
        btn = QtWidgets.QPushButton("Continuar registro")
        btn.clicked.connect(self.on_continue)
        v.addWidget(btn)

    def on_continue(self):
        # validaciones mínimas
        if not all([
            self.fullname.text().strip(),
            self.email.text().strip(),
            self.pwd.text().strip(),
            self.confirm.text().strip(),
            self.terms.isChecked()
        ]):
            self.msg.setText("❌ Completa todos los campos y acepta términos.")
            return
        if self.pwd.text() != self.confirm.text():
            self.msg.setText("❌ Las contraseñas no coinciden.")
            return
        # Emitir datos de usuario
        user = {
            "username": self.email.text().split("@")[0],
            "nombre": self.fullname.text().strip(),
            "correo": self.email.text().strip(),
            "password": self.pwd.text().strip(),
            "celular": 0
        }
        self.msg.clear()
        self.switch_to_complex.emit(user)

# ---------------------------
# Pantalla 2: Conjunto
# ---------------------------
class ComplexScreen(QtWidgets.QWidget):
    def __init__(self, user_data):
        super().__init__()
        self.user = user_data
        self.setStyleSheet(STYLE)
        v = QtWidgets.QVBoxLayout(self)
        v.setContentsMargins(40,40,40,40)
        v.setSpacing(16)

        # Logo
        logo = QtWidgets.QLabel(alignment=QtCore.Qt.AlignCenter)
        img = QtGui.QPixmap(os.path.join(os.path.dirname(__file__), "Colive_Logo_.png"))
        if not img.isNull():
            logo.setPixmap(img.scaledToWidth(120, QtCore.Qt.SmoothTransformation))
        v.addWidget(logo)

        # Título
        t = QtWidgets.QLabel("Registrar conjunto", objectName="title", alignment=QtCore.Qt.AlignCenter)
        v.addWidget(t)

        # Campos básicos
        self.nombre      = QtWidgets.QLineEdit(); self.nombre.setPlaceholderText("NOMBRE DEL CONJUNTO")
        self.direccion   = QtWidgets.QLineEdit(); self.direccion.setPlaceholderText("DIRECCIÓN DEL CONJUNTO")
        self.departamento= QtWidgets.QComboBox();
        self.departamento.addItems([
            "SELECCIONA UN DEPARTAMENTO",
            "AMAZONAS","ANTIOQUIA","ARAUCA","ATLÁNTICO","BOLÍVAR","BOYACÁ",
            "CALDAS","CAQUETÁ","CASANARE","CAUCA","CESAR","CHOCÓ","CÓRDOBA",
            "CUNDINAMARCA","GUAJÍA","GUAVIARE","HUILA","LA GUAJIRA","MAGDALENA",
            "META","NARIÑO","NORTE DE SANTANDER","PUTUMAYO","QUINDÍO","RISARALDA",
            "SAN ANDRÉS Y PROVIDENCIA","SANTANDER","SUCRE","TOLIMA","VALLE DEL CAUCA",
            "VAUPÉS","VICHADA"
        ])
        self.ciudad      = QtWidgets.QLineEdit(); self.ciudad.setPlaceholderText("CIUDAD")

        v.addWidget(self.nombre)
        v.addWidget(self.direccion)
        h = QtWidgets.QHBoxLayout()
        h.addWidget(self.departamento)
        h.addWidget(self.ciudad)
        v.addLayout(h)

        # Amenidades
        v.addWidget(QtWidgets.QLabel("Amenidades"))
        grid = QtWidgets.QGridLayout()
        self.amenidades = []
        opts = ["Piscina","Gimnasio","Parque Infantil","BBQ","Salón Comunal","Salón de Juegos","Zonas Húmedas","Cancha Multipropósito"]
        for i,opt in enumerate(opts):
            cb = QtWidgets.QCheckBox(opt)
            self.amenidades.append(cb)
            grid.addWidget(cb, i//2, i%2)
        v.addLayout(grid)

        # Configuraciones
        v.addWidget(QtWidgets.QLabel("Configuraciones"))
        h2 = QtWidgets.QHBoxLayout()
        self.tipo_parq = QtWidgets.QComboBox()
        self.tipo_parq.addItems(["TIPOS DE PARQUEADEROS","A 1 A 1","Sorteo","No disponible"])
        self.num_parq = QtWidgets.QSpinBox(); self.num_parq.setMinimum(1); self.num_parq.setVisible(False)
        self.tipo_parq.currentIndexChanged.connect(self._on_parq_type_changed)

        self.tipo_bod  = QtWidgets.QComboBox()
        self.tipo_bod.addItems(["BODEGAS","Sí aplica","No aplica"])
        self.num_bod   = QtWidgets.QSpinBox(); self.num_bod.setMinimum(1); self.num_bod.setVisible(False)
        self.tipo_bod.currentIndexChanged.connect(self._on_bod_type_changed)

        h2.addWidget(self.tipo_parq)
        h2.addWidget(self.num_parq)
        h2.addWidget(self.tipo_bod)
        h2.addWidget(self.num_bod)
        v.addLayout(h2)

        # Mensaje de error/success
        self.msg = QtWidgets.QLabel(""); self.msg.setStyleSheet("color:#c00;")
        v.addWidget(self.msg)

        # Botón registrar conjunto
        btn = QtWidgets.QPushButton("Registrar conjunto")
        btn.clicked.connect(self.on_register)
        v.addWidget(btn)

    def _on_parq_type_changed(self, idx):
        # mostrar número solo si aplica (índices 1 o 2)
        self.num_parq.setVisible(idx in (1,2))

    def _on_bod_type_changed(self, idx):
        # mostrar número solo si aplica (índice 1)
        self.num_bod.setVisible(idx == 1)

    def on_register(self):
        # validaciones
        if not all([
            self.nombre.text().strip(),
            self.direccion.text().strip(),
            self.departamento.currentIndex()>0,
            self.ciudad.text().strip(),
            self.tipo_parq.currentIndex()>0,
            self.tipo_bod.currentIndex()>0
        ]):
            self.msg.setText("❌ Completa todos los campos y selecciones.")
            return

        conj = {
            "nombre":              self.nombre.text().strip(),
            "nombreAdministrador": self.user["nombre"],
            "direccion":           self.direccion.text().strip(),
            "ciudad":              self.ciudad.text().strip(),
            "departamento":        self.departamento.currentText(),
            "amenidades":          [{"nombre": cb.text()} for cb in self.amenidades if cb.isChecked()],
            "configuraciones": [{
                "tipoParqueadero": self.tipo_parq.currentIndex()==1,
                "numParqueadero":  self.num_parq.value() if self.num_parq.isVisible() else 0,
                "tipoAlmacen":     self.tipo_bod.currentIndex()==1,
                "numAlmacen":      self.num_bod.value() if self.num_bod.isVisible() else 0
            }]
        }

        ok, res = connect2.register_user(self.user, conj)
        if ok:
            self.msg.setStyleSheet("color:#060;")
            self.msg.setText("✅ ¡Conjunto registrado exitosamente!")
        else:
            self.msg.setStyleSheet("color:#c00;")
            self.msg.setText(f"❌ {res}")

# ---------------------------
# Ventana principal
# ---------------------------
class MainWindow(QtWidgets.QStackedWidget):
    def __init__(self):
        super().__init__()
        self.admin = AdminScreen()
        self.addWidget(self.admin)
        self.admin.switch_to_complex.connect(self.open_complex)

    def open_complex(self, user_data):
        self.complex = ComplexScreen(user_data)
        self.addWidget(self.complex)
        self.setCurrentWidget(self.complex)

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    win = MainWindow()
    win.setWindowTitle("Colive - Registro Completo")
    win.setFixedSize(500, 700)
    win.show()
    sys.exit(app.exec_())
