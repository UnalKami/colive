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

  await cargarPanelPropietario();
});