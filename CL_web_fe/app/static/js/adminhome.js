// Este script asume endpoints como /api/dashboard/general y /api/dashboard/incidencias

// Add this to your existing script or create a new one
document.addEventListener('DOMContentLoaded', function() {
  const cachedComplexName = localStorage.getItem('complexName');

  if (cachedComplexName) {
    document.getElementById('complexName').textContent = cachedComplexName;
  } else {
    // Fetch complex name
    fetch('/fe-api/complex-info')
      .then(response => response.json())
      .then(data => {
        document.getElementById('complexName').textContent = data.name;
      })
      .catch(error => {
        console.error('Error fetching complex name:', error);
        document.getElementById('complexName').textContent = '';
      });
  }
});

// Cargar datos reales de la API de stadistics
async function cargarGraficos() {
  // Gráfico 1: Distribución de usuarios (ejemplo con reservas/residentes)
  try {
    const res = await fetch('/api/estadisticas/reservas/');
    const data = await res.json();
    // Suponiendo que reservas_por_amenidad tiene [{_id: "Piscina", total: 10}, ...]
    const labels1 = data.reservas_por_amenidad.map(x => x._id);
    const values1 = data.reservas_por_amenidad.map(x => x.total);

    if (document.getElementById('grafico1')) {
      new Chart(document.getElementById('grafico1').getContext('2d'), {
        type: 'pie',
        data: {
          labels: labels1,
          datasets: [{
            data: values1,
            backgroundColor: ['#3d464e', '#4A90E2', '#F5A623', '#8BC34A', '#FF9800', '#E91E63']
          }]
        }
      });
    }
  } catch (e) {
    console.error('Error cargando gráfico 1:', e);
  }

  // Gráfico 2: Incidencias por mes o apartamentos por conjunto
  try {
    const res = await fetch('/api/estadisticas/apartamentos/');
    const data = await res.json();
    // Suponiendo que apartamentos_por_conjunto tiene [{conjunto: "Conjunto A", cantidad: 12}, ...]
    const labels2 = data.apartamentos_por_conjunto.map(x => x.conjunto);
    const values2 = data.apartamentos_por_conjunto.map(x => x.cantidad);

    if (document.getElementById('grafico2')) {
      new Chart(document.getElementById('grafico2').getContext('2d'), {
        type: 'bar',
        data: {
          labels: labels2,
          datasets: [{
            label: 'Apartamentos por Conjunto',
            data: values2,
            backgroundColor: '#4A90E2'
          }]
        }
      });
    }
  } catch (e) {
    console.error('Error cargando gráfico 2:', e);
  }
}

window.onload = cargarGraficos;