document.getElementById('btnPeaton').onclick = function(e) {
  e.preventDefault();
  document.getElementById('dialogPeaton').showModal();
};
document.getElementById('btnVehiculo').onclick = function(e) {
  e.preventDefault();
  document.getElementById('dialogVehiculo').showModal();
};

document.getElementById('btnPeaton').onclick = function(e) {
  e.preventDefault();
  // Obtener fecha y hora actual en formato compatible con datetime-local
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - (offset * 60000));
  document.getElementById('diaIngreso').value = localDate.toISOString().slice(0,16);
  document.getElementById('dialogPeaton').showModal();
};

document.getElementById('btnVehiculo').onclick = function(e) {
  e.preventDefault();
  // Obtener fecha y hora actual en formato compatible con datetime-local
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - (offset * 60000));
  document.getElementById('diaIngresoVehicular').value = localDate.toISOString().slice(0,16);
  document.getElementById('registroVehicularDialog').showModal();
};


document.getElementById('btnSalida').onclick = function(e) {
  e.preventDefault();
  document.getElementById('salidaVehiculoDialog').showModal();
};

// Opcional: puedes agregar lógica para manejar el submit del formulario
document.getElementById('formSaida').onsubmit = function(e) {
  // Aquí puedes agregar la lógica para verificar la placa
  // Por ejemplo, enviar los datos por fetch/AJAX
  // e.preventDefault(); // Descomenta si quieres manejar el envío manualmente
};