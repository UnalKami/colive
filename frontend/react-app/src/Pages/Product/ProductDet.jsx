import React, { useEffect, useState } from 'react';
import './ProductDet.css';
import { BsCart4 } from "react-icons/bs";
import { BsCartCheckFill } from "react-icons/bs";
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { Category } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';;


export default function ProductDet() {
  const api_url = process.env.REACT_APP_API_URL;

  // Obtenemos el ID del producto de los parámetros de la URL
  

  const { id } = useParams();

  // Buscamos el producto correspondiente al ID
  const [producto, setProducto] = useState(null);

  //Productos relacionados
  const [productosRelacionados, setProductosRelacionados] = useState([]);

  // Cantidad de productos a comprar
  const [Cantidad, setCantidad] = useState(1);


  //Funcion para hacer visible el boton de ver carrito
  const [mostrarVerCarrito, setMostrarVerCarrito] = useState(false); 

  const token = localStorage.getItem('token');

  const idUser = localStorage.getItem('id');

  // Función para añadir al carrito
  const handleAgregarAlCarrito = () => {
    const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    const data = {
      PRODUCTO_ID_Producto: id,
      CARRITO_ID_Carrito: idUser,
      Cantidad: Cantidad,  
    }

    fetch(`${api_url}/carrito/producto/`, 
    { 
      method: 'POST', 
      headers,
      body: JSON.stringify(data) 
    })

    .then(response => response.json())
    .then(data => {
        if (data.error) {
          toast.error(data.error);
          return console.error(data.error);
        }
        toast.success('Producto añadido al carrito');
        setMostrarVerCarrito(true); // Mostrar el enlace para ver el carrito después de hacer clic en el botón
    })
    .catch(error => {
        console.error('There was an error!', error);
    });    
  };



  // Conexion a la base de datos

  const fetchProduct = () => {
    fetch(`${api_url}/productos/${id}`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
          return console.error(data.error);
        }
        console.log(data.body[0]);
        setProducto(data.body[0]);
        fetchproductosRelacionados(data.body[0].CATEGORIA_ID_Categoria)
    })
    .catch(error => {
        console.error('There was an error!', error);
    });

  };

  const fetchproductosRelacionados = (cat) => {
    fetch(`${api_url}/productos/categoria/${cat}`) // Se obtienen los productos de la misma categoría
    .then(response => response.json())
    .then(data => {
        if (data.error) {
          return console.error(data.error);
        }
        setProductosRelacionados(data.body);
    })
    .catch(error => {
        console.error('There was an error!', error);
    }
    );
  }

  useEffect(() => {
    fetchProduct();
  }, []);

  // Si no se encuentra el producto, se muestra un mensaje
  if (!producto) {
      return <p>Producto no encontrado.</p>;
  }


  
  return (
    <div className="contenedor-1">
        <ToastContainer position='bottom-right'/>
        <div className="producto-detalle">
            <div className="producto-imagen-det">
                <img src={producto.Ruta_img_producto} alt={producto.Nombre_producto} />
            </div>
            <div className="producto-informacion-det">
                <h2 className="producto-nombre-det">{producto.Nombre_producto}</h2>
                <p className="producto-precio-det" style={{fontSize:"25px"}}>${producto.Precio_producto} COP</p> 
                <p className="producto-descripcion-det">{producto.Descripcion_producto}</p>

                <p className='producto-precio-det'>
                  Unidades disponibles: {producto.Cantidad_producto}
                </p>
                

                <div className="producto-compra-det">
                    <label htmlFor="cantidad-det">Cantidad:</label>
                    <div className='caja-cantidad-det'>
                        <input 
                        type="number"
                         id="cantidad-det" 
                         min="1"
                         max="20" 
                         defaultValue="1" 
                         onChange={(e) => setCantidad(parseInt(e.target.value))} />

                          <button className="btn-carrito-det" onClick={handleAgregarAlCarrito}> Añadir al carrito <BsCartCheckFill/>
                          </button>
                          {mostrarVerCarrito && ( // Mostrar el enlace solo si mostrarVerCarrito es true
                          <Link to="/cart" className="btn-carrito-det">
                            Ver carrito <BsCart4/>
                          </Link>  
                          )}          
                    </div>
                    <Link to="/products" className="btn-seguir-det">
                        Seguir comprando <BsCart4/>
                    </Link>
                </div>
            </div>
        </div>
        {/* Sección de productos relacionados */}
        <div className="productos-relacionados">
            <h3 className="productos-titulo">Productos Relacionados</h3>
            <div className="productos-grid">
                {productosRelacionados.map(producto => (
                    <a href={`/ProductDet/${producto.ID_Producto}`} className="producto-item" key={producto.ID_Producto} style={{textDecoration:'none'}}>
                        <img src={producto.Ruta_img_producto} alt={producto.Nombre_producto} className="producto-imagen" />
                        <h3 className='producto-nombre'>{producto.Nombre_producto}</h3>
                        <p className="producto-descripcion">{producto.Descripcion_breve_producto}</p>
                        <span className="producto-precio">${producto.Precio_producto}</span>
                    </a>
                ))}
            </div>
        </div>
    </div>
);
}
