document.addEventListener('DOMContentLoaded', function() {
  const conjuntoSel = document.getElementById('conjuntoId');
  const residenciaSel = document.getElementById('residenciaId');
  const buscarBtn = document.querySelector('.btn.btn-primary.w-100');
  const reservasTbody = document.querySelector('tbody');

  let conjuntos = [];
  let residencias = [];

//Por el momento se hace selecion de conjunto y residencia para buscar reservas, pero se usara simplemente verificando el usuario
  // Cargar conjuntos y residencias al iniciar
  async function cargarDatos() {
    const query = `
      query {
        conjuntos {
          id
          nombre
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
      residenciaSel.innerHTML = '<option value="">Seleccione una residencia</option>';
    }
  }

  cargarDatos();

  // Filtrar residencias por conjunto seleccionado
  conjuntoSel.addEventListener('change', function() {
    const resFiltradas = residencias.filter(r => String(r.conjuntoId) === conjuntoSel.value);
    residenciaSel.innerHTML = '<option value="">Seleccione una residencia</option>' +
      resFiltradas.map(r => `<option value="${r.id}">${r.code}</option>`).join('');
  });

  // Buscar reservas al hacer click en el botón
  buscarBtn.addEventListener('click', async function() {
    const residenciaId = residenciaSel.value;
    if (!residenciaId) {
      reservasTbody.innerHTML = `<tr><td colspan="5" class="text-center text-warning">Seleccione una residencia.</td></tr>`;
      return;
    }
    reservasTbody.innerHTML = `<tr><td colspan="5" class="text-center">Cargando reservas...</td></tr>`;

    const query = `
      query {
        reservas(residenciaId: "${residenciaId}") {
          id
          conjuntoId
          residenciaId
          amenidad
          fecha
          horaInicio
          horaFin
          estado
          motivo
          cantidadPersonas
          observaciones
        }
      }
    `;
    const res = await fetch('http://localhost:3001/graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query })
    });
    const data = await res.json();
    //console.log("Datos de reservas:", data);
    //console.log("Reservas encontradas:", data.data && data.data.reservas ? data.data.reservas.length : 0);
    console.log("fechas de reservas:", data.data && data.data.reservas ? data.data.reservas.map(r => r.fecha) : []);
    
    if (data.data && data.data.reservas && data.data.reservas.length > 0) {
        reservasCache = data.data.reservas;
        reservasTbody.innerHTML = data.data.reservas.map(r => `
        <tr data-reserva-id="${r.id}">
            <td>${r.amenidad}</td>
            <td>${formatTimestamp(r.fecha)}</td>
            <td>${r.horaInicio}</td>
            <td>${r.horaFin}</td>
            <td>
                <button class="btn btn-warning btn-sm me-2">Editar</button>
                <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
            </td>
        </tr>
        `).join('');
    } else {
        reservasCache = [];
        reservasTbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay reservas para esta residencia.</td></tr>`;
    }
  });

//eliminar reserva
reservasTbody.addEventListener('click', async function(e) {
    const row = e.target.closest('tr');
    if (!row) return;
    const reservaId = row.dataset.reservaId;
    const reserva = reservasCache.find(r => r.id === reservaId);

    if (e.target.classList.contains('btn-warning')) {
        if (reserva) {
            abrirModalEditarReserva(reserva);
        }
    }

    if (e.target.classList.contains('btn-eliminar')) {
        if (reserva) {
            if (confirm('¿Está seguro de que desea eliminar esta reserva?')) {
              const res = await fetch('/fe-api/eliminarReserva', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ id: reservaId })
              });
              const data = await res.json();
              if (data.success) {
                  buscarBtn.click();
              } else {
                  alert(data.motivo || 'Error al eliminar la reserva.');
              }
            }
        }
    }
});

// Guarda las reservas cargadas para fácil acceso
let reservasCache = [];

function formatTimestamp(fecha) {
  if (!isNaN(Number(fecha)) && fecha !== null && fecha !== undefined) {
    const date = new Date(Number(fecha));

    // Ajustar la fecha sumando horas de diferencia si es necesario
    const correctedDate = new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

    return correctedDate.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  return 'Fecha inválida';
}

// Función para abrir y llenar el modal de edición
function abrirModalEditarReserva(reserva) {
  document.getElementById('editarReservaId').value = reserva.id;
  if (reserva.fecha) {
    const d = new Date(Number(reserva.fecha));
    document.getElementById('editarFecha').value = d.toISOString().split('T')[0];
  } else {
    document.getElementById('editarFecha').value = '';
  }
  document.getElementById('editarHoraInicio').value = reserva.horaInicio;
  document.getElementById('editarHoraFin').value = reserva.horaFin;
  document.getElementById('editarCantidadPersonas').value = reserva.cantidadPersonas;
  document.getElementById('editarMotivo').value = reserva.motivo || '';
  document.getElementById('editarObservaciones').value = reserva.observaciones || '';
  document.getElementById('editarMensaje').textContent = '';
  const modal = new bootstrap.Modal(document.getElementById('modalEditarReserva'));
  modal.show();
}

// Manejar el submit del modal de edición
document.getElementById('formEditarReserva').addEventListener('submit', async function(e) {
  e.preventDefault();
  const id = document.getElementById('editarReservaId').value;
  const fecha = document.getElementById('editarFecha').value; // "YYYY-MM-DD"
  const horaInicio = document.getElementById('editarHoraInicio').value;
  const horaFin = document.getElementById('editarHoraFin').value;
  const cantidadPersonas = parseInt(document.getElementById('editarCantidadPersonas').value, 10);
  const motivo = document.getElementById('editarMotivo').value;
  const observaciones = document.getElementById('editarObservaciones').value;
  const mensajeDiv = document.getElementById('editarMensaje');


  // Validaciones de fecha y hora
  const inicio = new Date(`${fecha}T${horaInicio}`);
  const fin = new Date(`${fecha}T${horaFin}`);
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


  // Busca la reserva original para obtener los campos que no se editan
  const reservaOriginal = reservasCache.find(r => r.id === id);
  //console.log("reservasCache:", reservasCache);
  //console.log("Reserva original encontrada:", reservaOriginal);

  // Si no la encuentra, muestra error
  if (!reservaOriginal) {
    mensajeDiv.textContent = "Error interno: reserva no encontrada.";
    return;
  }

    const res = await fetch('/fe-api/editarReserva', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id,
            reserva: {
                conjuntoId: reservaOriginal.conjuntoId,
                residenciaId: reservaOriginal.residenciaId,
                amenidad: reservaOriginal.amenidad,
                fecha,
                horaInicio,
                horaFin,
                cantidadPersonas,
                motivo,
                estado: reservaOriginal.estado,
                observaciones
            }
        })
    });

    const data = await res.json();
    if (data.disponible === false) {
        mensajeDiv.textContent = data.motivo;
        return;
    }
    if (data.success || (data.disponible && data.reserva)) {
        buscarBtn.click();
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarReserva'));
        modal.hide();
    } else {
        mensajeDiv.textContent = "Error al editar la reserva. Intente de nuevo.";
    }

});
    
});