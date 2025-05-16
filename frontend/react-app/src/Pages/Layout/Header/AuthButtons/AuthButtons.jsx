import React from 'react';
import { Link } from "react-router-dom";
import { Button } from 'react-bootstrap';

import "./AuthButtons.css";

export default function AuthButtons({ loggedIn, userNames, handleLogout }) {
    return (
        <div style={{display: "flex"}}>
            {loggedIn ? (
                <>
                    <Link to="/comprador" className="btn btn-outline-primary ms-2" id='btn-login'>
                        <i class="bi bi-person-circle"></i>
                        &nbsp;
                        {userNames}
                    </Link>
                    <Button onClick={handleLogout} variant='outline-danger' className='ms-3'>
                        Cerrar Sesión
                        &nbsp;
                        <i class="bi bi-box-arrow-right"></i>
                    </Button>
                </>
            ) : (
                <>
                    <Link to="/login" className="btn btn-outline-primary ms-2 px-5" id='btn-login'>
                        Iniciar Sesión
                    </Link>
                    <Link to="/register" className="btn btn-outline-primary ms-2 px-5" id='btn-register'>
                        Registrarse
                    </Link>
                </>
            )}
        </div>
    );
}
