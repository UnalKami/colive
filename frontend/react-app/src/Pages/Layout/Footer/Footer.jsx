import React, { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import "../Header/Header.css";
import "../../../index.css";
import TerminosCondiciones from '../../../Components/TerminosCondiciones/TerminosCondiciones';

export default function Footer() {

  // Define un estado para controlar si el modal de términos y condiciones está abierto o cerrado
  const [showTermsModal, setShowTermsModal] = useState(false);

  // Función para abrir el modal de términos y condiciones
  const handleShowTermsModal = () => setShowTermsModal(true);

  // Función para cerrar el modal de términos y condiciones
  const handleCloseTermsModal = () => setShowTermsModal(false);

  return (
    <footer className="footer py-3 shadow-lg bg-light">  
      <div className="container fontFooter ">
        <nav className="row justify-content-between">
          <Link to="/" className="col-12 col-md-3 d-flex align-items-center justify-content-center">
            <img src="/Natu_Logo_.png" alt="Logo" className="img-fluid" width="150" height="50" />
          </Link>
          <ul className="col-12 col-md-2 list-unstyled px-3">  
            <li className="footer-section fw-bold fs-7 mb-2">NATU Tienda Orgánica</li>  
            <li className="text-justify">Encuentra productos orgánicos de calidad en esta, tu tienda web de confianza</li>
          </ul>
          <ul className="col-12 col-md-3 list-unstyled px4">  
            <li className="footer-section fw-bold fs-7 mb-2">Enlaces</li>  
            <li>
              <Link to="/" className="text-reset">Inicio</Link>
            </li>
            <li>
              <Link to="/Products" className="text-reset">Productos</Link>
            </li>
            <li>
              <Link to="/about" className="text-reset">Nosotros</Link>
            </li>
            <li>
              <Link to="/contact" className="text-reset">Contáctanos</Link>
            </li>
            <li>
              <Link to="/encuesta" className="text-reset">Califícanos</Link>
            </li>
            <li>
              <a href="#" onClick={handleShowTermsModal}>Términos y condiciones</a>
              <Modal 
                show={showTermsModal} 
                onHide={handleCloseTermsModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                sx={{overflowY: 'scroll', maxHeight: '90vh', height: '90vh'}}
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
              <a href='https://heyzine.com/flip-book/c951be1b87.html'>Manual de usuario</a>
            </li>
            <li>
              <Link to="/Preguntas" className="text-reset">Preguntas Frecuentes</Link>
            </li>
          </ul>
          <ul className="col-12 col-md-3 list-unstyled px-4 text-center"> 
            <li className="footer-section fw-bold fs-7 mb-2">Síguenos</li>  
            <li className="d-flex justify-content-between">
              <a
                href="https://www.facebook.com/profile.php?id=61557990925535"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-facebook" style={{ fontSize: '2rem', color: 'blue' }}></i> 
              </a>
              <a
                href="https://www.instagram.com/_natu_tienda/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-instagram" style={{ fontSize: '2rem', color: '#F78DA7' }}></i> 
              </a>
             
              <a
                href="https://www.gmail.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <i className="bi bi-envelope" style={{ fontSize: '2rem', color: 'red' }}></i>
              </a>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container">
        <p className="text-center mb-0 mt-2 fw-bold fs-7 mb-2">natutiendaorganica@gmail.com</p>
        <p className="text-center mb-0 mt-2 fw-bold fs-7 mb-2">Realizado por el equipo Natu</p>
      </div>
    </footer>
  )
}