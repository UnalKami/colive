import React from 'react';
import './About.css'; 


export default function Dashboard() {
  return (
    <div className="dashboard-container">
      

      {/* Header Section */}
      <div className="header-section">
        <div className="header-left">
          <h1 className="title">Apartamentos Test</h1>
          <button className="info-button">Más Info</button>
        </div>
        <div className="header-right">
          <img src="Banner.jpg" alt="Building" className="building-image" />
        </div>
      </div>

      {/* Admin Info */}
      <div className="admin-info-container">
        <div className="admin-photo">
          <div className="photo-placeholder" />
          <p>Foto del administrador</p>
        </div>
        <div className="admin-details">
          <h2>Administrator Info</h2>
          <p>name: xxxxx xxxxx</p>
          <p>cel: xxxxxxxxxx</p>
        </div>
      </div>

      {/* Property Description */}
      <div className="description-section">
        <h3>Descripción del inmueble</h3>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
          nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </p>
      </div>

      {/* Zonas Comunes */}
      <div className="zonas-section">
        <h3>Zonas Comunes</h3>
        <div className="zonas-grid">
          {[1, 2, 3, 4].map((_, index) => (
            <div className="zona-item" key={index}>
              <span className="icon">ℹ️</span>
              <span className="label">Title</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}