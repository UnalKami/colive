
document.addEventListener('DOMContentLoaded', function() {
    //-- Validacion visul de la contraseña --//
    document.getElementById('administratorPassword').addEventListener('input', function () {
    const pw1 = document.getElementById("administratorPassword").value;
    const mensajes = {
        longitud: document.getElementById('lengthPassword'),
        mayuscula: document.getElementById('uppercasePassword'),
        numero: document.getElementById('numberPassword')
    };
        if (pw1.length >= 8) {
            mensajes.longitud.style.color = 'green';
            mensajes.longitud.innerHTML = '✓ La contraseña tiene al menos 8 caracteres.';
        } else {
            mensajes.longitud.style.color = 'red';
            mensajes.longitud.innerHTML = 'La contraseña debe tener al menos 8 caracteres.';
        }

        if (/[A-Z]/.test(pw1)) {
            mensajes.mayuscula.style.color = 'green';
            mensajes.mayuscula.innerHTML = '✓ La contraseña tiene al menos una letra mayúscula.';
        } else {
            mensajes.mayuscula.style.color = 'red';
            mensajes.mayuscula.innerHTML = 'La contraseña debe tener al menos una letra mayúscula.';
        }

        if (/[0-9]/.test(pw1)) {
            mensajes.numero.style.color = 'green';
            mensajes.numero.innerHTML = '✓ La contraseña tiene al menos un número.';
        } else {
            mensajes.numero.style.color = 'red';
            mensajes.numero.innerHTML = 'La contraseña debe tener al menos un número.';
        }
    });
    //-- Revelar/ocultar contraseña --//
    document.querySelectorAll('.toggle-password').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const inputId = this.getAttribute('data-target');
            const input = document.getElementById(inputId);
            if (input) {
                if (input.type === "password") {
                    input.type = "text";
                    this.querySelector('i').classList.remove('fa-eye');
                    this.querySelector('i').classList.add('fa-eye-slash');
                } else {
                    input.type = "password";
                    this.querySelector('i').classList.remove('fa-eye-slash');
                    this.querySelector('i').classList.add('fa-eye');
                }
            }
        });
    });

    //--Transicioon de formularios--//
    const adminForm = document.querySelector('.administratorRegister');
    const complexForm = document.querySelector('.complexRegister');
    const nextBtn = document.getElementById('nextForm');
    const backBtn = document.getElementById('backBtn');

    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const termsCheck = document.getElementById('termsCheck');
            if (!termsCheck.checked) {
                alert('Debes aceptar los términos y condiciones para continuar.');
                termsCheck.focus();
                return;
            }
            const pw1 = document.getElementById("administratorPassword").value;
            const pw2 = document.getElementById("confirmPassword").value;
            if (pw1 !== pw2) {
                alert('Las contraseñas no coinciden');
                return;
            }
            if (pw1.length <= 8) {
                alert('La contraseña no cumple con los requisitos');
                return;
            }
            if (!(/[A-Z]/.test(pw1))) {
                alert('La contraseña no cumple con los requisitos');
                return;
            }
            if (!(/[0-9]/.test(pw1))) {
                alert('La contraseña no cumple con los requisitos');
                return;
            }
            adminForm.classList.remove('active');
            complexForm.classList.add('active');
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            complexForm.classList.remove('active');
            adminForm.classList.add('active');
        });
    }


    //-- Terminos y condiciones --//
    const openLink       = document.getElementById('openTermsLink');
    const termsDialog    = document.getElementById('termsDialog');
    const closeButtons   = termsDialog.querySelectorAll('[data-action="close"]');

    openLink.addEventListener('click', function (e) {
        e.preventDefault();
        if (typeof termsDialog.showModal === 'function') {
        termsDialog.showModal();
        } else {
        alert('Tu navegador no soporta <dialog>. Actualiza tu navegador.');
        }
    });
    closeButtons.forEach(btn => {
        btn.addEventListener('click', () => termsDialog.close());
    });

    //--Codigo para poner los campos para numero de parqueaderos y almacenes--//
    var parking = document.getElementById('parking');
    var parkingNumberGroup = document.getElementById('parkingNumberGroup');
    var storage = document.getElementById('storage');
    var storageNumberGroup = document.getElementById('storageNumberGroup');

    parking.addEventListener('change', function() {
        if (this.value === "1" || this.value === "2") {
            parkingNumberGroup.style.display = "block";
        } else {
            parkingNumberGroup.style.display = "none";
        }
    });

    storage.addEventListener('change', function() {
        if (this.value === "1") {
            storageNumberGroup.style.display = "block";
        } else {
            storageNumberGroup.style.display = "none";
        }
    });

    document.getElementById('submitBtn').addEventListener('click', function(e) {
        e.preventDefault();

        const variables = {
            nombre: document.getElementById('complex_name').value,
            nombreAdministrador: document.getElementById('administratorFullname').value,
            direccion: document.getElementById('address').value,
            ciudad: document.getElementById('city').value,
            departamentos: document.getElementById('department').value,
            amenidades: Array.from(document.querySelectorAll('input[name="amenities"]:checked')).map(cb => ({
                nombre: cb.value,
            })),
            configuraciones: [{
                tipoParqueadero: document.getElementById('parking').value === "1",
                numParqueadero: parseInt(document.getElementById('parkingNumber').value) || 0,
                tipoAlmacen: document.getElementById('storage').value === "1",
                numAlmacen: parseInt(document.getElementById('storageNumber').value) || 0
            }]
        };
        
        const query = `
        mutation CrearConjunto(
            $nombre: String!,
            $nombreAdministrador: String!,
            $direccion: String!,
            $ciudad: String!,
            $departamentos: String!,
            $amenidades: [AmenidadInput],
            $configuraciones: [ConfigInput]
        ) {
            createConjunto(
                nombre: $nombre,
                nombreAdministrador: $nombreAdministrador,
                direccion: $direccion,
                ciudad: $ciudad,
                departamentos: $departamentos,
                amenidades: $amenidades,
                configuraciones: $configuraciones
            ) {
                id
                nombre
                direccion
                ciudad
            }
        }
        `;

        fetch('/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables })
        })
        .then(res => res.json())
        .then(data => {
            console.log(data);
            alert('¡Registro enviado!');
        })
        .catch(err => {
            alert('Error al enviar el registro');
            console.error(err);
        });
    });
});