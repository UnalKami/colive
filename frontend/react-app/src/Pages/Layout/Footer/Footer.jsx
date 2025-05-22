import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "../Header/Header.css";
import "../../../index.css";
import TerminosCondiciones from '../../../Components/TerminosCondiciones/TerminosCondiciones';

export default function Footer() {

  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleShowTermsModal = () => setShowTermsModal(true);
  const handleCloseTermsModal = () => setShowTermsModal(false);

  return (
    <footer
      className="footer py-3 shadow-lg border-top"
      style={{ backgroundColor: '#3d464e' }}
    >  
      <div className="container fontFooter">
        <nav className="row justify-content-between">
          <Link to="/" className="col-12 col-md-3 d-flex align-items-center justify-content-center">
            <img
              src="/Colive_Logo_.png"
              alt="Logo"
              className="img-fluid"
              width="150"
              height="50"
              
            />
          </Link>

          <ul className="col-12 col-md-2 list-unstyled px-3" style={{ color: '#b0b0b0' }}>  
            <li className="footer-section fw-bold fs-7 mb-2" style={{ color: '#b0b0b0' }}>COLIVE co-ownership</li>  
            
            
          </ul>

          <ul className="col-12 col-md-3 list-unstyled px-4" style={{ color: '#b0b0b0' }}>  
            <li className="footer-section fw-bold fs-7 mb-2" style={{ color: '#b0b0b0' }}>Enlaces</li>  
            <li><Link to="/" className="text-decoration-none" style={{ color: '#b0b0b0' }}>Inicio</Link></li>
            <li><Link to="/Products" className="text-decoration-none" style={{ color: '#b0b0b0' }}>Productos</Link></li>
            <li><Link to="/about" className="text-decoration-none" style={{ color: '#b0b0b0' }}>Nosotros</Link></li>
            <li><Link to="/contact" className="text-decoration-none" style={{ color: '#b0b0b0' }}>Contáctanos</Link></li>
            <li><Link to="/encuesta" className="text-decoration-none" style={{ color: '#b0b0b0' }}>Califícanos</Link></li>
            <li>
              <button className="btn btn-link p-0 m-0 text-decoration-none" style={{ color: '#b0b0b0' }} onClick={handleShowTermsModal}>
                Términos y condiciones
              </button>
              <Modal 
                show={showTermsModal} 
                onHide={handleCloseTermsModal}
                size="lg"
                centered
              >
                <Modal.Header closeButton>
                    <Modal.Title>Términos y Condiciones</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TerminosCondiciones />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTermsModal}>
                      Cerrar
                    </Button>
                </Modal.Footer>
              </Modal>
            </li>
            <li>
              <a href='https://heyzine.com/flip-book/c951be1b87.html' className="text-decoration-none" style={{ color: '#b0b0b0' }}>Manual de usuario</a>
            </li>
            <li>
              <Link to="/Preguntas" className="text-decoration-none" style={{ color: '#b0b0b0' }}>Preguntas Frecuentes</Link>
            </li>
          </ul>

          <ul className="col-12 col-md-3 list-unstyled px-4 text-center" style={{ color: '#b0b0b0' }}> 
            <li className="footer-section fw-bold fs-7 mb-2" style={{ color: '#b0b0b0' }}>Síguenos</li>  
            <li className="d-flex justify-content-between">
              <a
                href="https://www.facebook.com/profile.php?id=61557990925535"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-facebook" style={{ fontSize: '2rem', color: '#C5B566' }}></i> 
              </a>
              <a
                href="https://www.instagram.com/_natu_tienda/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram" style={{ fontSize: '2rem', color: '#C5B566' }}></i> 
              </a>
              <a
                href="https://www.gmail.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-envelope" style={{ fontSize: '2rem', color: '#C5B566' }}></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container" style={{ color: '#b0b0b0' }}>
        <p className="text-center mb-0 mt-2 fw-bold fs-7">Colive@gmail.com</p>
        <p className="text-center mb-0 mt-2 fw-bold fs-7">Realizado por el equipo Colive</p>
      </div>
    </footer>
  )
}
