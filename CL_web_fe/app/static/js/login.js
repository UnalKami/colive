// URL base de la API backend
const api_url = "http://localhost:8000";

// Referencias al formulario y elementos
const form = document.getElementById("login-form");
const btnLogin = document.getElementById("btnLogin");
const spinner = document.getElementById("spinner");
const alertContainer = document.getElementById("alert-container");

// Función para mostrar mensajes de alerta
function showAlert(message, type = "danger") {
  alertContainer.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
    </div>
  `;
}

// Mostrar/ocultar contraseña y cambiar imagen del ícono
function togglePasswordVisibility() {
  const passwordField = document.getElementById("password");
  const eyeIcon = document.getElementById("eye-icon");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    eyeIcon.src = "../static/img/eye-open.png";
  } else {
    passwordField.type = "password";
    eyeIcon.src = "../static/img/eye-closed.png";
  }
}


// Manejador del evento de envío del formulario
form.addEventListener("submit", async function(event) {
  event.preventDefault();
  event.stopPropagation();
  alertContainer.innerHTML = "";

  // Validar campos
  const emailInput = document.getElementById("username");
  const passwordInput = document.getElementById("password");

  emailInput.classList.remove("is-invalid");
  passwordInput.classList.remove("is-invalid");

  let valid = true;

  if (!emailInput.value || !emailInput.checkValidity()) {
    emailInput.classList.add("is-invalid");
    valid = false;
  }

  if (!passwordInput.value) {
    passwordInput.classList.add("is-invalid");
    valid = false;
  }

  if (!valid) return;

  // Mostrar spinner y deshabilitar botón
  btnLogin.disabled = true;
  spinner.style.display = "inline-block";

  try {
    // Enviar credenciales al backend
    const res = await fetch(`${api_url}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: emailInput.value,
        password: passwordInput.value
      })
    });

    const data = await res.json();

    // Manejo de respuesta
    if (data.error) {
      showAlert("Inicio de sesión fallido. Verifica tus datos.");
    } else {
      // Guardar datos en localStorage y redirigir
      localStorage.setItem("token", data.body.token);
      localStorage.setItem("rol", data.body.rol);
      localStorage.setItem("id", data.body.user[0].USUARIO_ID_Usuario);

      showAlert("¡Bienvenido!", "success");
      setTimeout(() => window.location.href = "../templates/adminhome.html", 1000);
    }
  } catch (err) {
    showAlert("Error del servidor. Intenta más tarde.");
    console.error(err);
  } finally {
    btnLogin.disabled = false;
    spinner.style.display = "none";
  }
});
