document.addEventListener('DOMContentLoaded', function() {
  const conjuntoSel = document.getElementById('conjuntoId');
  const residenciaSel = document.getElementById('residenciaId');
  const amenidadSel = document.getElementById('amenidad');
  const mensajeDiv = document.getElementById('mensaje');
  let conjuntos = [];
  let residencias = [];

  // Cargar conjuntos y residencias usando GraphQL
  async function cargarDatos() {
    // Consulta GraphQL para conjuntos y residencias
    const query = `
      query {
        conjuntos {
          id
          nombre
          amenidades {
            nombre
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

  // Cuando cambia el conjunto, actualiza amenidades y residencias
  conjuntoSel.addEventListener('change', function() {
    const conjunto = conjuntos.find(c => c.id === conjuntoSel.value);
    // Amenidades
    if (conjunto) {
      amenidadSel.innerHTML = '<option value="">Seleccione una amenidad</option>' +
        (conjunto.amenidades || []).map(a => `<option value="${a.nombre}">${a.nombre}</option>`).join('');
    } else {
      amenidadSel.innerHTML = '<option value="">Seleccione una amenidad</option>';
    }
    // Residencias
    const resFiltradas = residencias.filter(r => String(r.conjuntoId) === conjuntoSel.value);
    residenciaSel.innerHTML = '<option value="">Seleccione su residencia</option>' +
      resFiltradas.map(r => `<option value="${r.id}">${r.code}</option>`).join('');
  });

  // Enviar reserva
  document.getElementById('reservaForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    mensajeDiv.textContent = 'Enviando reserva...';

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
    } else {
      mensajeDiv.textContent = 'Error al reservar.';
    }
  });
});