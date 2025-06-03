document.addEventListener('DOMContentLoaded', async function() {
  // Simulación: ID de residencia (en producción, obtén esto del login/session)
  const residenciaId = "ID_RESIDENCIA_DEL_USUARIO";

  const resumenReservas = document.getElementById('resumenReservas');
  const resumenNotificaciones = document.getElementById('resumenNotificaciones');

  async function cargarPanelPropietario() {
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
    if (data.data && data.data.reservas && data.data.reservas.length > 0) {
      resumenReservas.innerHTML = '<ul>' + data.data.reservas.map(res =>
        `<li>
          <b>${res.amenidad}</b> - ${new Date(res.fecha).toLocaleDateString()} 
          ${res.horaInicio} a ${res.horaFin} 
          <span style="color:${res.estado === 'aprobada' ? 'green' : 'orange'}">[${res.estado}]</span>
        </li>`
      ).join('') + '</ul>';
    } else {
      resumenReservas.textContent = "No tienes reservas activas.";
    }

    // Mostrar notificaciones
    if (data.data && data.data.notificacionesResidencia && data.data.notificacionesResidencia.length > 0) {
      resumenNotificaciones.innerHTML = data.data.notificacionesResidencia.map(n =>
        `<li>${n.mensaje} <small>(${new Date(n.fecha).toLocaleDateString()})</small></li>`
      ).join('');
    } else {
      resumenNotificaciones.innerHTML = "<li>No tienes notificaciones recientes.</li>";
    }
  }

  await cargarPanelPropietario();
});