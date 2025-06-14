// URL base del backend
const api_url = "http://localhost:8080";

// Referencias al formulario y al contenedor de alertas
const form = document.getElementById("change-form");
const alertContainer = document.getElementById("alert-container");

// Escuchar el evento de envío del formulario
form.addEventListener("submit", async function (e) {
  e.preventDefault(); // Evita que el formulario recargue la página

  // Obtener valores de los campos
  const email = document.getElementById("email").value;
  const newPassword = document.getElementById("new-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;

  // Limpiar alertas previas
  alertContainer.innerHTML = "";

  // Validación: las contraseñas deben coincidir
  if (newPassword !== confirmPassword) {
    alertContainer.innerHTML = `<div class="alert alert-danger">Las contraseñas no coinciden.</div>`;
    return;
  }

  try {
    // Enviar solicitud al backend para cambiar la contraseña
    const res = await fetch(`${api_url}/auth/direct-password-reset`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: email,
        newPassword: newPassword
      })
    });

    const data = await res.json();

    // Mostrar mensaje de éxito o error según respuesta del backend
    if (res.ok) {
      alertContainer.innerHTML = `<div class="alert alert-success">Contraseña actualizada correctamente.</div>`;
      setTimeout(() => window.location.href = "login.html", 2000); // Redirige al login tras 2 segundos
    } else {
      alertContainer.innerHTML = `<div class="alert alert-danger">${data.message || 'No se pudo actualizar la contraseña.'}</div>`;
    }

  } catch (err) {
    // Manejo de errores del servidor o de red
    console.error(err);
    alertContainer.innerHTML = `<div class="alert alert-danger">Error del servidor.</div>`;
  }
});
