import React from 'react';
import "./Reset.css"; // Importa los estilos CSS

export default function Reset() {
    return (
        <div className='register-container' id='login'>
            <div id="background">
                    <div id="shape"></div>
                    <div id="shape"></div>
            </div>
            <title>Reset | Natu</title>
            <form id="login-form">
                <div id="logo">
                    {/* Puedes agregar contenido aquí si es necesario */}
                </div>
                <img src="logo.png" id="img-centrada" alt="Logo" />
                <label htmlFor="username">Correo de usuario</label>
                <input type="text" id="username" placeholder="Email" />




                <button
                    type="button"
                    id="btnLogin"
                    className="btn-primary"
                    defaultValue="Reset password"
                >Reset Password</button>



                <button
                    type="button"
                    id="btnLogin"
                    className="btn-primary"
                    defaultValue="Regresar"
                    onClick={() => { window.location.href='login'; }}
                >Regresar</button>
            
            <a id="link2" href="register">
                ¿Aun no estoy registrado?
            </a>
            </form>
        </div>
    );
}

