import React, {useEffect, useState} from 'react';
import './Register.css'; // Asegúrate de que la ruta del archivo CSS sea correcta
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import StorefrontIcon from '@mui/icons-material/Storefront';
/**
 * @file Register.jsx
 * @desc This file contains the Register component, which is responsible for rendering and handling the registration form.
 */
export default function Register() {
    



    return (
        <div className='register-container'>
            <ToastContainer position='bottom-right'/>
            {/* Scripts */}
            <div id="background1">
                <div id="shape1" />
                <div id="shape1" />
            </div>
            <div id="register-container">
                <img src="Natu_Logo_.png" alt="image" />
                <Row>
                    <Card className='mb-3'>
                        <Card.Body align="center">
                            <Card.Title>Soy Comprador</Card.Title>
                            <Card.Text>
                                <ShoppingBasketIcon sx={{fontSize: "5rem", color: "#EB6613"}}/>
                            </Card.Text>
                            <Link to="/register-buyer">
                                <Button variant='outline-success'>Registrarse</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                    <Card className='mb-3'>
                        <Card.Body align="center">
                            <Card.Title>Soy Vendedor</Card.Title>
                            <Card.Text>
                                <StorefrontIcon sx={{fontSize: "5rem", color: "#EB6613"}}/>
                            </Card.Text>
                            <Link to="/register-seller">
                                <Button variant='outline-success'>Registrarse</Button>
                            </Link>
                        </Card.Body>
                    </Card>
                </Row>
            </div>
        </div>
    );
}
