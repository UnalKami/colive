// Event listeners para abrir modales
document.getElementById('btnPeaton').addEventListener('click', function(e) {
  e.preventDefault();
  new bootstrap.Modal(document.getElementById('modalPeaton')).show();
});

document.getElementById('btnVehiculo').addEventListener('click', function(e) {
  e.preventDefault();
  new bootstrap.Modal(document.getElementById('modalVehiculo')).show();
});

document.getElementById('btnSalida').addEventListener('click', function(e) {
  e.preventDefault();
  new bootstrap.Modal(document.getElementById('modalSalida')).show();
});

// Funciones para registrar visitantes
async function registrarPeaton() {
  const form = document.getElementById('formPeaton');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch('/residence/visitantes/peaton', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Visitante peatón registrado exitosamente');
      bootstrap.Modal.getInstance(document.getElementById('modalPeaton')).hide();
      form.reset();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Error de conexión: ' + error.message);
  }
}

async function registrarVehiculo() {
  const form = document.getElementById('formVehiculo');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  data.espacioAsignado = parseInt(data.espacioAsignado);
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch('/residence/visitantes/vehicular', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Visitante vehicular registrado exitosamente');
      bootstrap.Modal.getInstance(document.getElementById('modalVehiculo')).hide();
      form.reset();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Error de conexión: ' + error.message);
  }
}

async function registrarSalida() {
  const form = document.getElementById('formSalida');
  const formData = new FormData(form);
  const data = Object.fromEntries(formData);
  const token = localStorage.getItem('authToken');

  try {
    const response = await fetch('/residence/visitantes/vehicular/salida', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (response.ok) {
      alert('Salida registrada exitosamente');
      bootstrap.Modal.getInstance(document.getElementById('modalSalida')).hide();
      form.reset();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Error de conexión: ' + error.message);
  }
}