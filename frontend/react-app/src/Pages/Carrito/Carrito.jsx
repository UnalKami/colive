import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BsTrashFill } from 'react-icons/bs';
import { useEffect } from 'react';
import "../VistaCarrito/VistaCarrito.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
initMercadoPago('TEST-c20b6352-d9af-4493-9fbf-769df6cc21c8');


export default function Carrito() {

    const api_url = process.env.REACT_APP_API_URL;

    const [productos, setProductos] = useState([]);
    
    const[ cantidades, setCantidades ] = useState({});

    const idUser = localStorage.getItem('id');
    
    const token = localStorage.getItem('token');

    const handleChangeCantidad = (idProducto, cantidad) => {
        setProductos(prevProductos => 
        prevProductos.map(producto =>
            producto.ID_Producto === idProducto ? { ...producto, Cantidad: cantidad } : producto
        )
        );

        const data = {
        PRODUCTO_ID_Producto: idProducto,
        CARRITO_ID_Carrito: idUser,
        Cantidad: cantidad
        }

        const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
        };

        fetch(`${api_url}/carrito/producto`, {
        method: 'PUT',
        headers,
        body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
        if (data.error) {
            return console.error(data.body);
        }
        console.log(data.body);
        })
        .catch(error => {
        console.error('There was an error!', error);
        });

    };

    const calcularSubtotal = (producto) => {
        const cantidad = producto.Cantidad || 1; // Obtener la cantidad del producto o asumir 1 si no está definida
        const subtotal = producto.Precio_producto * cantidad;
        return `${subtotal.toLocaleString()} `; // Aplicar formato con separador de miles y concatenar
    };
    
    const calcularTotalCarrito = () => {
        const total = productos.reduce((total, producto) => {
        const cantidad = producto.Cantidad || 1; // Obtener la cantidad del producto o asumir 1 si no está definida
        return total + producto.Precio_producto * cantidad;
        }, 0);
        return `${total.toLocaleString()} `; // Aplicar formato con separador de miles y concatenar
    };
    
    const EliminarProducto = async(idProducto) => {
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
        fetch(`${api_url}/carrito/producto/${idUser}/${idProducto}`, { method: 'DELETE', headers })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
              toast.error(data.body);
              return console.error(data.body);
            }
            toast.success('Producto eliminado del carrito')
            fetchProduct();
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    }


    const fetchProduct = () => {
        const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }; 
        fetch(`${api_url}/carrito/productos/${idUser}`, { headers })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
            return console.error(data.body); 
            }
            setProductos(data.body);
            console.log(data.body);
        })
        .catch(error => {
            console.error('There was an error!', error);
        });

    };

    useEffect(() => {
        fetchProduct();
    }, []);

    const navigate = useNavigate();

    const handlePagar = (producto) => {

        let preferenceId = null;

        const dataBody = {
            title : producto.Nombre_producto,
            unit_price : producto.Precio_producto,
            quantity : producto.Cantidad,
            idComprador : idUser,
            idProducto : producto.ID_Producto,
            subtotal :  producto.Precio_producto * producto.Cantidad
        };

        console.log(dataBody);

        fetch(`${api_url}/checkout/create-order`, {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',

            },
            body : JSON.stringify(dataBody)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            preferenceId = data.id;
            navigate("/checkout", { state: { producto, preferenceId } });
        })
        .catch(error => {
            console.error('There was an error!', error);
        });
    };

    return (
        <div className="contenedor-1">
            <ToastContainer position='bottom-right'/>
            <div className="producto-detalle-carrito">
                <div className="producto-informacion-carrito">
                    <div className="info-productos">
                        <p className='descripcion-carrito'>Este es tu carrito, por favor verifica tu pedido</p>
                        <div className="table-container">
                            <table cellSpacing={0}>
                                <thead className='table-head'>
                                    <tr>
                                        <th></th>
                                        <th>Producto</th>
                                        <th>Precio</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productos.map((producto) => (
                                        <React.Fragment key={producto.ID_Producto}>
                                        <tr>
                                            <td><img src={producto.Ruta_img_producto} alt={producto.Nombre_producto} /></td>
                                            <td className='nombre-producto'>{producto.Nombre_producto}</td>
                                            <td className='precio-producto'>${producto.Precio_producto} COP</td>
                                            <td>
                                                <input
                                                    id='cantidad-det'
                                                    type="number"
                                                    min="1"
                                                    max="20"
                                                    value={producto.Cantidad}
                                                    onChange={(e) => handleChangeCantidad(producto.ID_Producto, parseInt(e.target.value))}
                                                />
                                            </td>
                                            <td className='subtotal-producto'>$ {calcularSubtotal(producto)} COP</td>
                                            <td>
                                                <button className='btn btn-outline-danger' onClick={() => EliminarProducto(producto.ID_Producto)}>
                                                    <BsTrashFill/>
                                                </button>
                                            </td>
                                            <td>
                                                <button
                                                    className='btn btn-outline-success'
                                                    onClick={() => handlePagar(producto)}
                                                >
                                                    Pagar
                                                </button>
                                            </td>
                                        </tr>
                                    </React.Fragment>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="contenedor-btn">
                            <Link to="/products" className="btns-compra-carrito">
                                Seguir comprando
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}