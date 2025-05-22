import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import './Checkout.css';

initMercadoPago('APP_USR-b3cb0407-b58c-4eaa-8eae-e647a72b4b5f');

export default function Checkout() {
    const location = useLocation();
    const { state } = location;
    const producto = state?.producto;
    const preferenceId = state?.preferenceId;
    const idUser = localStorage.getItem('id');
    const [userData, setUserData] = useState({});

    useEffect(() => {
        console.log(preferenceId);  
        const token = localStorage.getItem('token');
        const api_url = process.env.REACT_APP_API_URL;
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };

        fetch(`${api_url}/compradores/${idUser}`, {
            method: 'GET',
            headers
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                return console.error(data.body);
            }
            setUserData(data.body[0]); // Suponemos que el objeto está en la primera posición del array
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }, [idUser]);

    if (!producto) {
        return <div>No hay detalles del producto disponibles.</div>;
    }

    return (
        <div className="container-checkout">
            <h2>Detalles de la orden</h2>
            <div className="product-details">
                <img src={producto.Ruta_img_producto} alt={producto.Nombre_producto} />
                <div className="product-info">
                    <h3>{producto.Nombre_producto}</h3>
                    <p>Descripción: {producto.Descripcion_breve_producto}</p>
                </div>
                <div className="price-details">
                    <p>Precio: ${producto.Precio_producto} COP</p>
                    <p>Cantidad: {producto.Cantidad}</p> 
                    <p>Subtotal: ${producto.Precio_producto * producto.Cantidad} COP</p>
                </div>
            </div>
            <div className="buyer-details">
                <h3>Datos del Comprador</h3>
                <p>Nombre: {userData.Nombres_comprador} {userData.Apellidos_comprador}</p>
                <p>Dirección: {userData.Direccion}, {userData.Descripcion_adicional}, {userData.Nombre_municipio}</p>
                <p>Teléfono: {userData.Telefono_comprador}</p>
            </div>
            <div className="payment-section">
                <Wallet initialization={{ preferenceId: preferenceId }} customization={{ texts:{ valueProp: 'smart_option'}}} />
            </div>
        </div>
    );
}
