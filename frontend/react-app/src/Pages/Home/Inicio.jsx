import React from 'react';
import 'animate.css/animate.min.css'; // Importa animate.css
import './Home.css';
import { FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import Beneficios from './Beneficios';
import ProductosVista from '../Catalog/ProductosVista';


export default function Inicio() {
  return (
    <div className='home-container'>
    <div className="home-page-container-main">
      {/* <div className="container-1">
      <div className="home-page-container">
        <div className="home-page-text-container">
          <h1 className="home-page-title animate__animated animate__fadeInUp">
            ¿Quieres nutrir tu cuerpo con productos colombianos orgánicos?
          </h1>
          <p className="home-page-description animate__animated animate__fadeIn">
            En Natu Tienda Orgánica encontrarás una gran variedad de productos de alta calidad, cultivados y fabricados por productores locales de pueblos de toda Colombia. 
          </p>
          <Link to="/products" className="home-page-button animate__animated animate__fadeIn animate__pulse">
            Productos <FiArrowRight />
          </Link>
        </div>
      </div>
      <div className="home-image-section ">
        <img src="https://acortar.link/1sQiAb" alt="Banner" className="home-banner-image" />
      </div>
      </div> */}



    
    </div>
    <Beneficios />
    <ProductosVista />
    </div>
  );
}