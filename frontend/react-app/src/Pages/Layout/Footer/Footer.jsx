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
    <footer className="footer py-3 shadow-lg bg-white border-top">  
      <div className="container fontFooter">
        <nav className="row justify-content-between">
          <Link to="/" className="col-12 col-md-3 d-flex align-items-center justify-content-center">
            <img src="/Colive_Logo_.png" alt="Logo" className="img-fluid" width="150" height="50" />
          </Link>

          <ul className="col-12 col-md-2 list-unstyled px-3 text-secondary">  
            <li className="footer-section fw-bold fs-7 mb-2 text-dark">NATU Tienda Orgánica</li>  
            <li>Encuentra productos orgánicos de calidad en esta, tu tienda web de confianza</li>
          </ul>

          <ul className="col-12 col-md-3 list-unstyled px-4 text-secondary">  
            <li className="footer-section fw-bold fs-7 mb-2 text-dark">Enlaces</li>  
            <li><Link to="/" className="text-secondary text-decoration-none">Inicio</Link></li>
            <li><Link to="/Products" className="text-secondary text-decoration-none">Productos</Link></li>
            <li><Link to="/about" className="text-secondary text-decoration-none">Nosotros</Link></li>
            <li><Link to="/contact" className="text-secondary text-decoration-none">Contáctanos</Link></li>
            <li><Link to="/encuesta" className="text-secondary text-decoration-none">Califícanos</Link></li>
            <li>
              <button className="btn btn-link p-0 m-0 text-secondary text-decoration-none" onClick={handleShowTermsModal}>
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
              <a href='https://heyzine.com/flip-book/c951be1b87.html' className="text-secondary text-decoration-none">Manual de usuario</a>
            </li>
            <li>
              <Link to="/Preguntas" className="text-secondary text-decoration-none">Preguntas Frecuentes</Link>
            </li>
          </ul>

          <ul className="col-12 col-md-3 list-unstyled px-4 text-center text-secondary"> 
            <li className="footer-section fw-bold fs-7 mb-2 text-dark">Síguenos</li>  
            <li className="d-flex justify-content-between">
              <a
                href="https://www.facebook.com/profile.php?id=61557990925535"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-facebook" style={{ fontSize: '2rem', color: '#6c757d' }}></i> 
              </a>
              <a
                href="https://www.instagram.com/_natu_tienda/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram" style={{ fontSize: '2rem', color: '#6c757d' }}></i> 
              </a>
              <a
                href="https://www.gmail.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-envelope" style={{ fontSize: '2rem', color: '#6c757d' }}></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container text-secondary">
        <p className="text-center mb-0 mt-2 fw-bold fs-7">Colive@gmail.com</p>
        <p className="text-center mb-0 mt-2 fw-bold fs-7">Realizado por el equipo Colive</p>
      </div>
    </footer>
  )
}
