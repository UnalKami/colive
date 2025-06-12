// ————————————————————————————————————————————————————————————
    // 1) Lógica para abrir / cerrar el dialog de Términos y Condiciones
    // ————————————————————————————————————————————————————————————
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

    // ————————————————————————————————————————————————————————————
    // 2) Función auxiliar: convierte un formulario en un objeto JS
    // ————————————————————————————————————————————————————————————
    function formToObject(formElement) {
      const formData = new FormData(formElement);
      const obj = {};
      for (let [key, value] of formData.entries()) {
        obj[key] = value;
      }
      return obj;
    }

    // ————————————————————————————————————————————————————————————
    // 3) Validación y envío con fetch al endpoint según el rol
    // ————————————————————————————————————————————————————————————
    (function () {
      'use strict';

      const form      = document.getElementById('register-form');
      const rolSelect = document.getElementById('rolSelect');

      form.addEventListener('submit', async function (event) {
        event.preventDefault();
        event.stopPropagation();

        // 1) Validación nativa de HTML5 + contraseñas coincidentes
        if (!form.checkValidity()) {
          form.classList.add('was-validated');
          return;
        }
        // Verificar que contraseña y confirmPassword coincidan
        const pwd  = document.getElementById('password').value;
        const pwd2 = document.getElementById('confirmPassword').value;
        if (pwd !== pwd2) {
          document.getElementById('confirmPassword').classList.add('is-invalid');
          return;
        }

        // 2) Determinar endpoint según el rol seleccionado
        const rolValue = rolSelect.value; 
        if (!rolValue) {
          rolSelect.classList.add('is-invalid');
          return;
        }
        // Mapeo de valor del <select> a ruta de tu servicio
        const rutaMap = {
          admin:        '/admin',
          propietario:  '/propietario',
          residente:    '/recidente',
          seguridad:    '/seguridad',
          mantenimiento:'/mantenimiento',
          aseo:         '/aseo'
        };
        const endpoint = "auth/api/registro/"+rutaMap[rolValue];
        if (!endpoint) {
          alert('Rol no válido');
          return;
        }

        // 3) Armar el JSON con los campos requeridos por RegistroRequestDTO
        //    Asumo que RegistroRequestDTO tiene: nombre, correo, celular, username, password
        const payload = {
          nombre:    document.getElementById('nombre').value.trim(),
          correo:    document.getElementById('correo').value.trim(),
          celular:   document.getElementById('celular').value.trim(),
          username:  document.getElementById('username').value.trim(),
          password:  pwd
        };

        // 4) Realizar fetch POST con JSON
        try {
          const response = await fetch(`${location.origin}${endpoint}`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload)
          });

          if (response.ok) {
            // Éxito: mostrar alerta o toast, luego reiniciar formulario
            alert('Registro exitoso');
            form.reset();
            form.classList.remove('was-validated');
            // También puedes recargar la página o redirigir, según tu necesidad:
            // window.location.href = '/otra-página';
          } else {
            // Error de validación / excepción del backend
            const errorText = await response.text();
            alert('Error en el registro: ' + errorText);
          }
        } catch (err) {
          console.error(err);
          alert('Ocurrió un error al comunicarse con el servidor');
        }
      }, false);
    })();