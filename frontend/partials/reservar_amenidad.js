document.addEventListener('DOMContentLoaded', function() {
  // Cargar el modal desde el archivo externo
  fetch('../../partials/reservar_amenidad.html')
    .then(response => response.text())
    .then(html => {
      document.getElementById('modal-reserva-container').innerHTML = html;
      initializeModalLogic();
    })
    .catch(error => console.error('Error al cargar el modal:', error));

  function initializeModalLogic() {
    // Ahora los elementos existen en el DOM
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
      const input = {
        conjuntoId: form.conjuntoId.value,
        residenciaId: form.residenciaId.value,
        amenidad: form.amenidad.value,
        fecha: form.fecha.value,
        horaInicio: form.horaInicio.value,
        horaFin: form.horaFin.value,
        cantidadPersonas: parseInt(form.cantidadPersonas.value, 10),
        motivo: form.motivo.value,
        observaciones: form.observaciones.value
      };

      const inicio = new Date(`${input.fecha}T${input.horaInicio}`);
      const fin = new Date(`${input.fecha}T${input.horaFin}`);
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
            amenidad: input.amenidad,
            fecha: input.fecha,
            horaInicio: input.horaInicio,
            horaFin: input.horaFin,
            residenciaId: input.residenciaId
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
        mutation CrearReserva($input: ReservaInput!) {
          crearReserva(input: $input) {
            id
            estado
          }
        }
      `;

      const res = await fetch('http://localhost:3001/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: mutation, variables: { input } })
      });

      const result = await res.json();
      if (result.data && result.data.crearReserva) {
        mensajeDiv.textContent = 'Reserva enviada correctamente. Estado: ' + result.data.crearReserva.estado;
        form.reset();
        precioTexto.textContent = "Seleccione una amenidad";
        // Cierra el modal automáticamente
        const modal = bootstrap.Modal.getInstance(modalEl);
        if (modal) modal.hide();
      } else {
        mensajeDiv.textContent = 'Error al reservar.';
      }
    });
  }
});