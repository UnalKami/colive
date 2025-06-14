// Este script asume endpoints como /api/dashboard/general y /api/dashboard/incidencias

async function cargarGraficos() {
  // Gráfico 1: Distribución de usuarios
  try {
    const resGeneral = await fetch('/api/dashboard/general');
    const dataGeneral = await resGeneral.json();
    // dataGeneral: { residentes: 120, personal: 15, visitantes: 30 }
    if (document.getElementById('grafico1')) {
      new Chart(document.getElementById('grafico1').getContext('2d'), {
        type: 'pie',
        data: {
          labels: ['Residentes', 'Personal', 'Visitantes'],
          datasets: [{
            data: [
              dataGeneral.residentes,
              dataGeneral.personal,
              dataGeneral.visitantes
            ],
            backgroundColor: ['#3d464e', '#4A90E2', '#F5A623']
          }]
        }
      });
    }
  } catch (e) {
    console.error('Error cargando gráfico general:', e);
  }

  // Gráfico 2: Incidencias por mes
  try {
    const resInc = await fetch('/api/dashboard/incidencias');
    const dataInc = await resInc.json();
    // dataInc: { meses: ["Enero","Feb","Mar","Abr","May"], incidencias: [5,8,4,7,6] }
    if (document.getElementById('grafico2')) {
      new Chart(document.getElementById('grafico2').getContext('2d'), {
        type: 'bar',
        data: {
          labels: dataInc.meses,
          datasets: [{
            label: 'Incidencias',
            data: dataInc.incidencias,
            backgroundColor: '#4A90E2'
          }]
        }
      });
    }
  } catch (e) {
    console.error('Error cargando gráfico incidencias:', e);
  }
}

window.onload = cargarGraficos;