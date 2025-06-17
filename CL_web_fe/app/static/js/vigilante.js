document.addEventListener('DOMContentLoaded', function() {
  const btnPeaton = document.getElementById('btnPeaton');
  const btnVehiculo = document.getElementById('btnVehiculo');
  const registroDialog = document.getElementById('registroDialog');
  const tipoRegistro = document.getElementById('tipoRegistro');

  if (registroDialog) {
    const closeBtns = registroDialog.querySelectorAll('[data-action="close"]');

    btnPeaton?.addEventListener('click', function(e) {
      e.preventDefault();
      tipoRegistro.textContent = "Tipo: Peatón";
      if (typeof registroDialog.showModal === 'function') {
        registroDialog.showModal();
      } else {
        alert('Tu navegador no soporta <dialog>. Actualiza tu navegador.');
      }
    });

    btnVehiculo?.addEventListener('click', function(e) {
      e.preventDefault();
      tipoRegistro.textContent = "Tipo: Vehículo";
      if (typeof registroDialog.showModal === 'function') {
        registroDialog.showModal();
      } else {
        alert('Tu navegador no soporta <dialog>. Actualiza tu navegador.');
      }
    });

    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => registroDialog.close());
    });
  } else {
    console.warn('No se encontró el elemento #registroDialog');
  }
});