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

// Para peatón
document.getElementById('formPeaton').onsubmit = async function(e) {
  e.preventDefault();

  const datos = {
    diaIngreso: this.diaIngreso.value,
    nombreVisitante: this.nombreVisitante.value,
    visitanteDocumento: this.visitanteDocumento.value,
    Destino: this.Destino.value,
    nombreAutoriza: this.nombreAutoriza.value
  };

  const respuesta = await fetch('/api/visitantes/peaton', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  const data = await respuesta.json();

  if (respuesta.ok) {
    alert('Registro exitoso');
    document.getElementById('registroDialog').close();
  } else {
    alert(data.error || 'Error al registrar');
  }
};

document.getElementById('formVehicular').onsubmit = async function(e) {
  e.preventDefault();

  const datos = {
    diaIngreso: this.diaIngreso.value,
    nombreVisitante: this.nombreVisitante.value,
    visitanteDocumento: this.visitanteDocumento.value,
    Destino: this.Destino.value,
    nombreAutoriza: this.nombreAutoriza.value,
    placaVehiculo: this.placaVehiculo.value,
    tipoVehiculo: this.tipoVehiculo.value,
    espacioAsignado: this.espacioAsignado.value  
};

  const respuesta = await fetch('/api/visitantes/vehicular', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });

  const data = await respuesta.json();

  if (respuesta.ok) {
    alert('Registro exitoso');
    document.getElementById('registroVehicularDialog').close();
  } else {
    alert(data.error || 'Error al registrar');
  }
};

// Supón que tienes un formulario con id="formSaida"
document.getElementById('formSaida').onsubmit = async function(e) {
  e.preventDefault();
  const placa = this.placaVehiculo.value;

  const respuesta = await fetch('/api/visitantes/vehicular/salida', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ placaVehiculo: placa })
  });

  const data = await respuesta.json();

  if (respuesta.ok) {
    alert('Salida registrada correctamente');
    document.getElementById('salidaVehiculoDialog').close();
  } else {
    alert(data.error || 'Error al registrar la salida');
  }
};