import React from 'react';
import { Link } from 'react-router-dom';
import './Articulos.css'; 

export default function Saludables() {
    return (
        <div className="articulos-container">
            <div id="articulos-contexto">
                <h2 id="articulos-titulo">Productos Saludables</h2>

                <div id="articulos-imagen-container">
                    <img src="https://cdn.pixabay.com/photo/2022/07/14/06/35/smoothie-7320560_1280.jpg" alt="Productos Saludables" id="img-centrada-articulo" />
                </div>

                <p className="articulos-descripcion">
                    En Natu, nos preocupamos por tu bienestar y el de tu familia. Por eso, ofrecemos una amplia variedad de productos orgánicos cultivados y elaborados con cuidado y atención. Nuestros productos son ricos en nutrientes y libres de químicos dañinos, lo que los convierte en la opción ideal para llevar una vida saludable y equilibrada. Descubre nuestra selección de frutas, verduras, cereales, lácteos y mucho más, y disfruta de una alimentación sana y deliciosa.
                </p>

                <Link to="/products" className="articulos-boton">
                    Descubre nuestros productos
                </Link>
            </div>
        </div>
    );
}
