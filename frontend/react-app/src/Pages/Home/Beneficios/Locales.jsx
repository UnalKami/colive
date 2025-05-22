import React from 'react';
import { Link } from 'react-router-dom';
import './Articulos.css'; 

export default function Campo() {
    return (
        <div className="articulos-container">
            <div id="articulos-contexto">
                <h2 id="articulos-titulo">Productos del Campo</h2>

                <div id="articulos-imagen-container">
                    <img src="https://img.freepik.com/foto-gratis/familia-cultivadores-felices-haciendo-trabajos-jardin_342744-1367.jpg?w=900&t=st=1693231744~exp=1693232344~hmac=ed5a0fd2f5b214fb761e3ba518cbd36d689e14f72e2b920514c202a1a1220b35" alt="Productos del Campo" id="img-centrada-articulo" />
                </div>

                <p className="articulos-descripcion">
                    En Natu, respaldamos la economía local al ofrecerte productos saludables y naturales, cultivados y elaborados en el campo por familias colombianas trabajadoras. Nuestro objetivo es brindarte una experiencia auténtica y promover un estilo de vida más saludable para que puedas disfrutar plenamente de nuestros productos.
                </p>

                <Link to="/products" className="articulos-boton">
                    Descubre nuestros productos
                </Link>
            </div>
        </div>
    );
}
