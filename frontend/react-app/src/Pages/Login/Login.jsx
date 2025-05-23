import React, {useEffect, useState} from "react";
import "./Login.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * Represents the Login component.
 * @component
 */
export default function Login() {
    const api_url = process.env.REACT_APP_API_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    /**
     * Checks if the email and password inputs are filled.
     * If both inputs are filled, calls the loginUser function.
     * If any input is empty, displays an alert message.
     */
    const checkInputs = () => {
        if (email === "" || password === "") {
            toast.error("Por favor llena todos los campos");
        } else {
            loginUser();
        }
    };

    /**
     * Sends a login request to the API with the provided email and password.
     * If the login is successful, stores the token, role, and user information in the local storage.
     * Redirects the user to the home page.
     * If the login fails, displays an alert message.
     * If there is an error during the login request, logs the error to the console.
     */
    const loginUser = () => {
        fetch(`${api_url}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                Correo_usuario: email,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.error) {
                    return toast.error("Inicio de sesión fallido");
                } else {
                    localStorage.setItem("token", data.body.token);
                    localStorage.setItem("rol", data.body.rol);
                    localStorage.setItem("id", data.body.user[0].USUARIO_ID_Usuario);
                    if (data.body.rol === "Vendedor") {
                        localStorage.setItem("user", data.body.user[0].Nombre_vendedor);
                    } else if (data.body.rol === "Comprador") {
                        localStorage.setItem("user", data.body.user[0].Nombres_comprador);
                    }

                    
                    window.location.href = "/";
                }
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });
    }


    return (
            <div className='register-container' id="login">
                <ToastContainer position='bottom-right'/>
                <div id="background">
                    
                </div>
                <title>Login | Colive</title>
                            <form id="login-form">
                                <div id="logo">   
                                </div>
                                <img src="Colive_logo_.png" id="img-centrada" />
                                <label htmlFor="username">Correo de usuario</label>
                                <input 
                                    type="text" 
                                    id="username" 
                                    className="form-control" 
                                    placeholder="Email" 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <label htmlFor="password">Contraseña</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="form-control"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                
                                <a id="link2" href="reset">
                                    Olvide mi contraseña
                                    </a>
                                <button
                                    type="button"
                                    id="btnLogin"
                                    onClick={checkInputs}
                                >
                                    Iniciar sesión
                                </button>
                                
                            </form>
            </div>
    );
}

