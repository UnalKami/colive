document.addEventListener('DOMContentLoaded', async function() {
  // Simulación: ID de residencia (en producción, obtén esto del login/session)
  const residenciaId = "ID_RESIDENCIA_DEL_USUARIO";

  const listaReservas = document.getElementById('listaReservas');
  const resumenNotificaciones = document.getElementById('resumenNotificaciones');

  // Mensaje de carga inicial con clases de Bootstrap
  listaReservas.innerHTML = '<li class="list-group-item text-muted">Cargando reservas...</li>';
  resumenNotificaciones.innerHTML = '<li class="text-muted">Cargando notificaciones...</li>';

  
    const openModalBtn = document.getElementById('btnAbrirModalReserva');
    const modalEl = document.getElementById('modalReservarAmenidad');
    const conjuntoSel = document.getElementById('conjuntoId');
    const residenciaSel = document.getElementById('residenciaId');
    const amenidadSel = document.getElementById('amenidad');
    const mensajeDiv = document.getElementById('mensaje');
    const precioTexto = document.getElementById('precioAmenidadTexto');
    const costoDiv = document.getElementById('costoAmenidad');

    let conjuntos = [];
    let residencias = [];

    if (openModalBtn && modalEl) {
      openModalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
      });
    }

async function cargarDatosPanelPropietario() {
  const res = await fetch('/fe-api/panelPropietario');
  const data = await res.json();

  // Referencias a los selects
  const conjuntoSel = document.getElementById('conjuntoId');
  const residenciaSel = document.getElementById('residenciaId');
  const amenidadSel = document.getElementById('amenidad');
  const precioTexto = document.getElementById('precioAmenidadTexto');

  // Variables globales para conjuntos y residencias
  window.conjuntos = data.conjuntos || [];
  window.residencias = data.residencias || [];

  // Rellenar select de conjuntos
  conjuntoSel.innerHTML = '<option value="">Seleccione un conjunto</option>' +
    window.conjuntos.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');

  // Limpiar selects dependientes
  residenciaSel.innerHTML = '<option value="">Seleccione su residencia</option>';
  amenidadSel.innerHTML = '<option value="">Seleccione una amenidad</option>';
  precioTexto.textContent = "Seleccione una amenidad";

  // Evento para actualizar residencias y amenidades al cambiar conjunto
  conjuntoSel.addEventListener('change', function() {
    const conjunto = window.conjuntos.find(c => c.id === conjuntoSel.value);

    // Rellenar amenidades del conjunto seleccionado
    if (conjunto) {
      amenidadSel.innerHTML = '<option value="">Seleccione una amenidad</option>' +
        (conjunto.amenidades || []).map(a => `<option value="${a.nombre}" data-costo="${a.costo}">${a.nombre}</option>`).join('');
    } else {
      amenidadSel.innerHTML = '<option value="">Seleccione una amenidad</option>';
    }

    // Rellenar residencias del conjunto seleccionado
    const resFiltradas = window.residencias.filter(r => String(r.conjuntoId) === conjuntoSel.value);
    residenciaSel.innerHTML = '<option value="">Seleccione su residencia</option>' +
      resFiltradas.map(r => `<option value="${r.id}">${r.code}</option>`).join('');

    precioTexto.textContent = "Seleccione una amenidad";
  });

  // Evento para mostrar el precio de la amenidad seleccionada
  amenidadSel.addEventListener('change', function() {
    const selectedOption = amenidadSel.options[amenidadSel.selectedIndex];
    const costo = selectedOption ? selectedOption.getAttribute('data-costo') : "";
    precioTexto.textContent = costo !== "" ? `$${costo}` : "Seleccione una amenidad";
  });
}

cargarDatosPanelPropietario();

    conjuntoSel.addEventListener('change', function() {
      const conjunto = conjuntos.find(c => c.id === conjuntoSel.value);
      if (conjunto) {
        amenidadSel.innerHTML = '<option value="">Seleccione una amenidad</option>' +
          (conjunto.amenidades || []).map(a => `<option value="${a.nombre}" data-costo="${a.costo}">${a.nombre}</option>`).join('');
      } else {
        amenidadSel.innerHTML = '<option value="">Seleccione una amenidad</option>';
      }
      // Residencias
      const resFiltradas = residencias.filter(r => String(r.conjuntoId) === conjuntoSel.value);
      residenciaSel.innerHTML = '<option value="">Seleccione su residencia</option>' +
        resFiltradas.map(r => `<option value="${r.id}">${r.code}</option>`).join('');
      precioTexto.textContent = "Seleccione una amenidad";
    });

    amenidadSel.addEventListener('change', function() {
      const selectedOption = amenidadSel.options[amenidadSel.selectedIndex];
      const costo = selectedOption ? selectedOption.getAttribute('data-costo') : "";
      precioTexto.textContent = costo !== "" ? `$${costo}` : "Seleccione una amenidad";
    });

    document.getElementById('reservaForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      mensajeDiv.textContent = '';

      const form = e.target;

      // Crear objeto con los valores del formulario (incluyendo estado)
      const reservaData = {
        conjuntoId: form.conjuntoId.value,
        residenciaId: form.residenciaId.value,
        amenidad: form.amenidad.value,
        fecha: form.fecha.value,
        horaInicio: form.horaInicio.value,
        horaFin: form.horaFin.value,
        cantidadPersonas: parseInt(form.cantidadPersonas.value, 10),
        motivo: form.motivo.value,
        estado: "pendiente", // Valor por defecto requerido
        observaciones: form.observaciones.value,
      };
      //console.log('Datos de reserva:', reservaData);

      console.log("fecha de reserva:", reservaData.fecha);

      const inicio = new Date(`${reservaData.fecha}T${reservaData.horaInicio}`);
      const fin = new Date(`${reservaData.fecha}T${reservaData.horaFin}`);
      const ahora = new Date();

      if (inicio >= fin) {
        mensajeDiv.textContent = "La hora de inicio debe ser anterior a la hora de fin.";
        return;
      }

      const duracionMinutos = (fin - inicio) / (1000 * 60);
      if (duracionMinutos < 30 || duracionMinutos > 360) {
        mensajeDiv.textContent = "La duración debe ser entre 30 minutos y 6 horas.";
        return;
      }

      if (inicio < ahora) {
        mensajeDiv.textContent = "No se puede reservar en el pasado.";
        return;
      }

  const res = await fetch('/fe-api/crearReserva', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservaData)
  });

  const result = await res.json();

  // Revisa si la amenidad ya esta reservada o si el usuario ya tiene una reserva activa
  if (result.disponible === false) {
    mensajeDiv.textContent = result.motivo || "La amenidad ya está reservada para ese horario o ya tienes una reserva activa.";
    return;
  }

  if (result.disponible === true && result.reserva) {
    mensajeDiv.textContent = 'Reserva enviada correctamente. Estado: ' + result.reserva.estado;
    form.reset();
    precioTexto.textContent = "Seleccione una amenidad";
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();
  } else {
    mensajeDiv.textContent = 'Error al reservar.';
  }

    });
});