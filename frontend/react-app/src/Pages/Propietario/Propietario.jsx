export default function Propietario() {
    return (
        <div style={{ backgroundColor: '#f5f6fa', padding: '20px' }}>
            <div style={{ width: '200px', background: '#27ae60', color: 'white', padding: '20px', position: 'fixed', height: '100%' }}>
                <h2>Panel Propietario</h2>
                <ul>
                    <li>Inicio</li>
                    <li>Reservar Zonas</li>
                    <li>Solicitar Servicios</li>
                    <li>Gestión de Residentes</li>
                    <li>Pagos y Administración</li>
                    <li>Notificaciones</li>
                    <li>Asambleas y Votaciones</li>
                </ul>
            </div>
            <div style={{ marginLeft: '220px', padding: '20px' }}>
                <h1>Bienvenido Propietario</h1>
                <div>
                    <h3>Reservas Activas</h3>
                    <button>Nueva Reserva</button>
                </div>
                <div>
                    <h3>Estado de Cuenta</h3>
                    <p>Administración: Al día</p>
                </div>
            </div>
        </div>
    );
}