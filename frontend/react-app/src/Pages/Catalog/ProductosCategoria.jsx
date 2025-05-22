import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './Catalog.css';

const categorias = [
  {
    ID_Categoria: 1,
    Nombre_categoria: "food",
  },
  {
    ID_Categoria: 2,
    Nombre_categoria: "personal-care",
  },
  {
    ID_Categoria: 3,
    Nombre_categoria: "home",
  },
  {
    ID_Categoria: 4,
    Nombre_categoria: "supplements",
  },
  {
    ID_Categoria: 5,
    Nombre_categoria: "garden",
  },
];

export default function ProductosCategoria() {
  const api_url = process.env.REACT_APP_API_URL;

  // ruta se recibe /:route
  const {category} = useParams();

  let ID_Categoria;

  const [productos, setProducts] = useState([]);

  const fetchProductsByCategory = () => {
    const cat = categorias.find((cat) => cat.Nombre_categoria === category);
    ID_Categoria = cat.ID_Categoria;
    fetch(`${api_url}/productos/categoria/${ID_Categoria}`)
    .then(response => response.json())
    .then(data => {
        if (data.error) {
          return console.error(data.error);
        }
        setProducts(data.body);
    })
    .catch(error => {
        console.error('There was an error!', error);
    }
    );
  };
  useEffect(() => {
    fetchProductsByCategory();
  }, [category]);


  return (
    <section className="productos-vista">
      <div className="titulo-ProductosVista">
        <h1 className="productos-titulo">Productos</h1>
      </div>  
      <div className="productos-grid">
        {productos.map((producto) => (
          <Link to={`/ProductDet/${producto.ID_Producto}`} className="producto-item" key={producto.ID_Producto} style={{textDecoration:'none'}}>
              <img src={producto.Ruta_img_producto} alt={producto.Nombre_producto} className="producto-imagen" />
              <h3 className='producto-nombre'>{producto.Nombre_producto}</h3>
              <p className="producto-descripcion">{producto.Descripcion_breve_producto}</p>
              <span className="producto-precio">${producto.Precio_producto}</span>
          </Link>
        ))}
      </div>
    </section>
  );
};
