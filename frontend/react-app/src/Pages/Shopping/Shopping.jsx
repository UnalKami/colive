import React from 'react';
import "./Shopping.css"; // Importa los estilos CSS

export default function Shopping() {
    const [compras, setCompras] = React.useState([]);

    const api_url = process.env.REACT_APP_API_URL;


    //traer las compras del usuario
    React.useEffect(() => {
        
        fetch(`${api_url}/ordenes/usuario/${localStorage.getItem("id")}`)
            .then((response) => response.json())
            .then((data) => {
                setCompras(data.body);
            })
            .catch((error) => console.error(error));
    }, []);

    const getColorForEstado = (estado) => {
        switch (estado) {
            case "Pendiente de envío":
                return "green";
            case "En tránsito":
                return "orange";
            case "Entregado":
                return "blue";
            default:
                return "black";
        }
    };

    // Redirigir al producto para volver a comprar

    const volverAComprar = (idProducto) => {
        window.location.href = `/ProductDet/${idProducto}`;
    }


    return (
        <div id='container-compras'>
            {compras.map((compra, index) => (
                <div key={index} id="container-producto">
                    <div className="item-content">
                        <img src={compra.Ruta_img_producto} alt="img-producto" />
                        <div className="item-text">
                            <p id='fecha'>{compra.FechaHora_orden}</p>
                            <p id='estado' style={{ color: getColorForEstado(compra.Estado) }}>{compra.Estado}</p>
                            <hr id='estilo-linea'></hr>
                            <p id='nombre-producto'>{compra.Nombre_producto}</p>
                            <p id='descripcion-producto'>{compra.Descripcion_breve_producto}</p>
                            <button type="button" id="boton-compras" value="volver-a-comprar" onClick={() => volverAComprar(compra.ID_Producto)}>Volver a comprar</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
