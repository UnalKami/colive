import React, { useEffect, useState } from 'react';
import './user.css';


export default function Dashboard() {
  const [property, setProperty] = useState(null);

  useEffect(() => {
    // Cambia la URL por la de tu backend real
    fetch('http://localhost:3001/api/property/1')
      .then(res => res.json())
      .then(data => setProperty(data))
      .catch(err => console.error(err));
  }, []);

  if (!property) {
    return <div className="dashboard-container">Cargando...</div>;
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="header-section">
        <div className="header-left">
          <h1 className="title">{property.nombre}</h1>
          <button className="info-button">Más Info</button>
        </div>
        <div className="header-right">
          <img src={property.fotoInmueble || "/building-photo.jpg"} alt="Building" className="building-image" />
        </div>
      </div>

      {/* Admin Info */}
      <div className="admin-info-container">
        <div className="admin-photo">
          <img
            src={property.admin?.foto || "/default-admin.png"}
            alt="Admin"
            className="photo-placeholder"
          />
          <p>Foto del administrador</p>
        </div>
        <div className="admin-details">
          <h2>Información del Administrador</h2>
          <p>Nombre: {property.admin?.nombre}</p>
          <p>Cel: {property.admin?.celular}</p>
        </div>
      </div>

      {/* Property Description */}
      <div className="description-section">
        <h3>Descripción del inmueble</h3>
        <p>{property.descripcion}</p>
      </div>

      {/* Zonas Comunes */}
      <div className="zonas-section">
        <h3>Zonas Comunes</h3>
        <div className="zonas-grid">
          {property.zonasComunes?.map((zona, index) => (
            <div className="zona-item" key={index}>
              <span className="icon">ℹ️</span>
              <span className="label">{zona}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
