// partials/navbar.js
document.addEventListener('DOMContentLoaded', function() {
    // Función para cargar el navbar
    function loadNavbar() {
        const navbarContainer = document.getElementById('navbar-container');
        if (!navbarContainer) return;


    // Cargar navbar
    fetch('../../partials/navbar.html')
      .then(response => response.text())
      .then(html => {
        document.getElementById('navbar-container').innerHTML = html;
        const script = document.createElement('script');
        script.src = 'panel_propietario.js';
        document.body.appendChild(script);
      });
    }

    // Iniciar la carga del navbar
    loadNavbar();


});

