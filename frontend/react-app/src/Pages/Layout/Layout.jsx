import React from 'react';
import { Outlet} from "react-router-dom";
import "./Layout.css";
import '../../index.css';
import { Link } from 'react-router-dom';

// import { BiSearch } from 'react-icons/bi'; // Importa el ícono de búsqueda
import Footer from './Footer/Footer.jsx';
import Header from './Header/Header.jsx';


export default function Layout(){

  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  return (
    <div >
      {/* Navbar */}
      <Header />

      {/* Main content */}
      <Outlet />
      {/* Página de Inicio 
      <Inicio />*/}

      {/* Footer */}
      <Footer />

      {/* Carrito */}
      {token && rol === "Comprador" &&
        <Link to="/cart" className="btn btn-success" style={{ position: "fixed", right: "20px", bottom: "20px", width: "100px", borderRadius:"360PX", boxShadow: "0px 0px 4px 0px #000000"}}>
          <i className="bi bi-cart-fill" style={{ fontSize: "2rem" }}></i>
        </Link>
      }
    </div>
  )
};