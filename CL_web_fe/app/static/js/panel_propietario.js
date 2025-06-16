document.addEventListener('DOMContentLoaded', async function() {
  // Simulación: ID de residencia (en producción, obtén esto del login/session)
  const residenciaId = "ID_RESIDENCIA_DEL_USUARIO";

  const listaReservas = document.getElementById('listaReservas');
  const resumenNotificaciones = document.getElementById('resumenNotificaciones');

  // Mensaje de carga inicial con clases de Bootstrap
  listaReservas.innerHTML = '<li class="list-group-item text-muted">Cargando reservas...</li>';
  resumenNotificaciones.innerHTML = '<li class="text-muted">Cargando notificaciones...</li>';

  async function cargarPanelPropietario() {
    try {
      const query = `
        query {
          reservas(residenciaId: "${residenciaId}") {
            amenidad
            fecha
            horaInicio
            horaFin
            estado
          }
          notificacionesResidencia(residenciaId: "${residenciaId}") {
            mensaje
            fecha
          }
        }
      `;
      const res = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();

      // Mostrar reservas activas/próximas
      if (data?.data?.reservas?.length > 0) {
        listaReservas.innerHTML = data.data.reservas.map(res =>
          `<li class="list-group-item">
            <b>${res.amenidad}</b> - ${new Date(res.fecha).toLocaleDateString()} 
            ${res.horaInicio} a ${res.horaFin} 
            <span style="color:${res.estado === 'aprobada' ? 'green' : 'orange'}">[${res.estado}]</span>
          </li>`
        ).join('');
      } else {
        listaReservas.innerHTML = '<li class="list-group-item text-muted">No tienes reservas activas.</li>';
      }

      // Mostrar notificaciones
      if (data?.data?.notificacionesResidencia?.length > 0) {
        resumenNotificaciones.innerHTML = data.data.notificacionesResidencia.map(n =>
          `<li class="mb-2">${n.mensaje} <small class="text-muted">(${new Date(n.fecha).toLocaleDateString()})</small></li>`
        ).join('');
      } else {
        resumenNotificaciones.innerHTML = '<li class="text-muted">No tienes notificaciones recientes.</li>';
      }
    } catch (err) {
      console.error('Error:', err);
      listaReservas.innerHTML = '<li class="list-group-item text-danger">Error al cargar reservas.</li>';
      resumenNotificaciones.innerHTML = '<li class="text-danger">Error al cargar notificaciones.</li>';
    }
  }

  
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

    async function cargarDatos() {
      const query = `
        query {
          conjuntos {
            id
            nombre
            amenidades {
              nombre
              costo
            }
          }
          residences {
            id
            code
            conjuntoId
          }
        }
      `;
      const res = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      const data = await res.json();
      if (data.data) {
        conjuntos = data.data.conjuntos;
        residencias = data.data.residences;
        conjuntoSel.innerHTML = '<option value="">Seleccione un conjunto</option>' +
          conjuntos.map(c => `<option value="${c.id}">${c.nombre}</option>`).join('');
      }
    }

    cargarDatos();

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

      // Validación de solapamiento y doble reserva
      const validacionQuery = `
        query ValidarDisponibilidad($amenidad: String!, $fecha: String!, $horaInicio: String!, $horaFin: String!, $residenciaId: ID!) {
          validarReservaDisponible(amenidad: $amenidad, fecha: $fecha, horaInicio: $horaInicio, horaFin: $horaFin, residenciaId: $residenciaId) {
            disponible
            motivo
          }
        }
      `;

      const validacionRes = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: validacionQuery,
          variables: {
            amenidad: reservaData.amenidad,
            fecha: reservaData.fecha,
            horaInicio: reservaData.horaInicio,
            horaFin: reservaData.horaFin,
            residenciaId: reservaData.residenciaId
          }
        })
      });

      const validacionData = await validacionRes.json();
      const validacion = validacionData.data && validacionData.data.validarReservaDisponible;
      if (!validacion || !validacion.disponible) {
        mensajeDiv.textContent = validacion && validacion.motivo
          ? validacion.motivo
          : "La amenidad ya está reservada para ese horario o ya tienes una reserva activa.";
        return;
      }

      // Enviar reserva
      const mutation = `
        mutation CrearReserva($reserva: ReservaInput!) {
          crearReserva(reserva: $reserva) {
            id
            conjuntoId
            residenciaId
            amenidad
            fecha
            horaInicio
            horaFin
            cantidadPersonas
            motivo
            estado
            observaciones
          }
}
      `;

    const variables = {
    reserva: {
      conjuntoId: reservaData.conjuntoId,
      residenciaId: reservaData.residenciaId,
      amenidad: reservaData.amenidad,
      fecha: reservaData.fecha,
      horaInicio: reservaData.horaInicio,
      horaFin: reservaData.horaFin,
      cantidadPersonas: reservaData.cantidadPersonas,
      motivo: reservaData.motivo,
      estado: reservaData.estado,
      observaciones: reservaData.observaciones
  }
    };

      const res = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          query: mutation, 
          variables : variables,
        })
      });

      console.log("fecha enviada:", variables.reserva.fecha);

      const result = await res.json();
      //console.log('Resultado de la reserva:', result);
      if (result.data && result.data.crearReserva) {
        mensajeDiv.textContent = 'Reserva enviada correctamente. Estado: ' + result.data.crearReserva.estado;
        form.reset();
        precioTexto.textContent = "Seleccione una amenidad";
        // Cierra el modal automáticamente SOLO si fue exitoso
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      } else {
        mensajeDiv.textContent = 'Error al reservar.';
        // NO cerrar el modal aquí
      }
    });
});