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
    console.log(data.data.reservas.map(r => r.fecha));
    if (data.data && data.data.reservas && data.data.reservas.length > 0) {
        reservasCache = data.data.reservas;
        reservasTbody.innerHTML = data.data.reservas.map(r => `
        <tr data-reserva-id="${r.id}">
            <td>${r.amenidad}</td>
            <td>${formatTimestamp(r.fecha)}</td>
            <td>${r.horaInicio}</td>
            <td>${r.horaFin}</td>
            <td>
            <button class="btn btn-warning btn-sm">Editar</button>
            </td>
        </tr>
        `).join('');
    } else {
        reservasCache = [];
        reservasTbody.innerHTML = `<tr><td colspan="5" class="text-center text-muted">No hay reservas para esta residencia.</td></tr>`;
    }
  });

  // Delegación de eventos para el botón Editar
    reservasTbody.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-warning')) {
        const row = e.target.closest('tr');
        const reservaId = row.dataset.reservaId;
        const reserva = reservasCache.find(r => r.id === reservaId);
        if (reserva) {
        abrirModalEditarReserva(reserva);
        }
    }
    });

// Guarda las reservas cargadas para fácil acceso
let reservasCache = [];

  function formatTimestamp(timestamp) {
        const date = new Date(Number(timestamp));
        if (!isNaN(date.getTime())) {
        // Formatea la fecha en formato local (es-ES)
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        }
    return 'Fecha inválida'; // Fallback por si el timestamp no es válido
    }

// Función para abrir y llenar el modal de edición
function abrirModalEditarReserva(reserva) {
  document.getElementById('editarReservaId').value = reserva.id;
  document.getElementById('editarFecha').value = reserva.fecha.split('T')[0] || '';
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
  const fecha = document.getElementById('editarFecha').value;
  const horaInicio = document.getElementById('editarHoraInicio').value;
  const horaFin = document.getElementById('editarHoraFin').value;
  const cantidadPersonas = parseInt(document.getElementById('editarCantidadPersonas').value, 10);
  const motivo = document.getElementById('editarMotivo').value;
  const observaciones = document.getElementById('editarObservaciones').value;
  const mensajeDiv = document.getElementById('editarMensaje');

//Mutacion para editar reserva
const mutation = `
  mutation EditarReserva($id: ID!, $input: EditarReservaInput!) {
    editarReserva(id: $id, input: $input) {
      id
      estado
    }
  }
`;


const variables = {
  id,
  input: {
    fecha,
    horaInicio,
    horaFin,
    cantidadPersonas,
    motivo,
    observaciones
  }
};

const res = await fetch('http://localhost:3001/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: mutation,
    variables
  })
});



  const data = await res.json();
  if (data.data && data.data.editarReserva) {
    // Recargar reservas y cerrar modal
    buscarBtn.click();
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditarReserva'));
    modal.hide();
  } else {
    mensajeDiv.textContent = "Error al editar la reserva. Intente de nuevo.";
  }
});
    
});