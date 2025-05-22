import React, { useState } from "react";
import './Preguntas.css';

export default function Preguntas() {
    const preguntasRespuestas = [
        {
            pregunta: "¿Qué es Natu y cuál es su propósito?",
            respuesta: "Natu es una tienda web que facilita el acceso a alimentos orgánicos y productos locales saludables. Conecta a productores locales con consumidores conscientes, promoviendo un estilo de vida saludable y sostenible."
        },
        {
            pregunta: "¿Cómo puedo crear una cuenta en Natu?",
            respuesta: "Para registrarte, dirígete a la página principal de Natu, haz clic en 'Registrarse', completa el formulario con tus datos y selecciona si deseas ser comprador o vendedor. Una vez completado, recibirás una notificación de confirmación."
        },
        {
            pregunta: "¿Qué información necesito para registrarme como comprador o vendedor en Natu?",
            respuesta: "Debes proporcionar tu nombre, dirección de correo electrónico y una contraseña segura. También deberás indicar si te registras como comprador o vendedor."
        },
        {
            pregunta: "¿Cómo sé que mi registro en Natu fue exitoso?",
            respuesta: "Recibirás una notificación al completar el proceso de registro exitosamente, y podrás acceder a tu cuenta."
        },
        {
            pregunta: "¿Cómo inicio sesión en Natu como comprador o vendedor?",
            respuesta: "Haz clic en 'Iniciar sesión' en la página principal, introduce tu correo electrónico y contraseña, y luego selecciona 'Iniciar Sesión'. Serás redirigido a la página de inicio."
        },
        {
            pregunta: "¿Qué puedo ver en la página de inicio de Natu como comprador?",
            respuesta: "La página de inicio te muestra información relevante de la tienda, junto con una variedad de productos que puedes explorar desplazándote verticalmente."
        },
        {
            pregunta: "¿Cómo encuentro productos específicos en Natu?",
            respuesta: "Usa la barra de búsqueda en la parte superior de la página, introduce una palabra clave o el nombre del producto, y selecciona el resultado que te interese."
        },
        {
            pregunta: "¿Cómo navego por las categorías de productos en Natu?",
            respuesta: "Pasa el cursor sobre el menú de categorías en la parte superior izquierda de la página, selecciona una categoría (como alimentos o cuidado personal) y revisa los productos disponibles."
        },
        {
            pregunta: "¿Cómo utilizo la barra de búsqueda para encontrar un producto en Natu?",
            respuesta: "Introduce el nombre del producto o una palabra clave en la barra de búsqueda ubicada en la parte superior de la página y selecciona el producto deseado de los resultados."
        },
        {
            pregunta: "¿Qué información sobre un producto puedo ver antes de comprarlo?",
            respuesta: "Puedes ver la descripción, precio, disponibilidad, ingredientes, certificaciones orgánicas, y cualquier otra información relevante proporcionada por el vendedor."
        },
        {
            pregunta: "¿Cómo añado un producto al carrito de compras?",
            respuesta: "Haz clic en el botón 'Añadir al carrito' después de seleccionar el producto. Si no has iniciado sesión, deberás hacerlo primero."
        },
        {
            pregunta: "¿Necesito estar registrado para añadir productos al carrito de compras?",
            respuesta: "Sí, debes iniciar sesión en tu cuenta antes de poder añadir productos al carrito."
        },
        {
            pregunta: "¿Cómo reviso el contenido de mi carrito de compras en Natu?",
            respuesta: "Haz clic en el ícono del carrito de compras en la esquina superior o inferior de la página, o en el botón 'Ver carrito' después de añadir un producto."
        },
        {
            pregunta: "¿Puedo modificar las cantidades de los productos en el carrito de compras?",
            respuesta: "Sí, puedes ajustar las cantidades ingresando el valor deseado en la casilla de cantidad dentro del carrito."
        },
        {
            pregunta: "¿Cómo elimino un producto de mi carrito de compras en Natu?",
            respuesta: "Haz clic en el ícono de la papelera junto al producto que deseas eliminar del carrito."
        },
        {
            pregunta: "¿Cómo confirmo mi pedido en Natu?",
            respuesta: "Revisa todos los detalles de tu pedido, como productos, cantidades y precios, y luego haz clic en el botón 'Pagar'."
        },
        {
            pregunta: "¿Qué detalles debo revisar antes de confirmar mi compra en Natu?",
            respuesta: "Debes verificar tu nombre, dirección, número de teléfono, y la información del pedido (productos y precios) antes de continuar con el pago."
        },
        {
            pregunta: "¿Qué métodos de pago están disponibles en Natu?",
            respuesta: "Puedes pagar con tarjeta de crédito, tarjeta de débito o a través de PSE mediante el sistema de pago de Mercado Pago."
        },
        {
            pregunta: "¿Cómo introduzco los datos de pago al finalizar la compra?",
            respuesta: "Selecciona el método de pago que prefieras, escribe los detalles requeridos, como el número de tarjeta, y completa tu compra."
        },
        {
            pregunta: "¿Cómo puedo ver y modificar mi perfil de usuario en Natu?",
            respuesta: "Haz clic en tu nombre de usuario en la esquina superior derecha, selecciona 'Perfil' y actualiza la información personal que desees cambiar."
        },
        {
            pregunta: "¿Qué debo hacer si quiero vender productos en Natu?",
            respuesta: "Primero debes registrarte como vendedor. Luego, desde el apartado 'Mis productos', podrás publicar nuevos productos llenando un formulario con los detalles del artículo."
        },
        {
            pregunta: "¿Cómo publico un producto como vendedor en Natu?",
            respuesta: "Ingresa en el apartado 'Mis productos' y completa el formulario de publicación, agregando nombre, descripción, precio y cantidad de producto. Finalmente, selecciona 'Publicar producto'."
        },
        {
            pregunta: "¿Puedo modificar la descripción o la cantidad de un producto publicado?",
            respuesta: "Sí, puedes hacer clic en el botón 'Modificar' junto a tu producto para cambiar la información, como nombre, descripción o cantidad disponible."
        },
        {
            pregunta: "¿Qué opciones tengo si quiero pausar la venta de un producto?",
            respuesta: "Puedes desactivar temporalmente la visualización del producto si se ha agotado, y reactivarla cuando tengas más existencias disponibles."
        },
        {
            pregunta: "¿Cómo elimino un producto de la lista de ventas en Natu?",
            respuesta: "Haz clic en el botón de 'Borrar' junto al producto que ya no deseas vender."
        },
        {
            pregunta: "¿Cómo accedo a los términos y condiciones de Natu?",
            respuesta: "Puedes acceder a los términos y condiciones desde el pie de página (footer) o durante el proceso de registro en la plataforma."
        },
        {
            pregunta: "¿Es obligatorio aceptar los términos y condiciones al registrarse en Natu?",
            respuesta: "Sí, debes aceptar los términos y condiciones para completar el registro exitosamente."
        },
        {
            pregunta: "¿Dónde puedo encontrar los términos y condiciones una vez registrado en Natu?",
            respuesta: "Los términos y condiciones están disponibles en el footer de la página, y puedes acceder a ellos en cualquier momento."
        },
        {
            pregunta: "¿Cómo puedo acceder al carrito de compras desde cualquier vista en la tienda?",
            respuesta: "El ícono del carrito de compras está visible en todas las vistas de la tienda. Al hacer clic en él, serás redirigido automáticamente a tu carrito."
        },
        {
            pregunta: "¿Cómo actualizo mi información personal en Natu después de haberme registrado?",
            respuesta: "Ingresa en tu perfil desde la esquina superior derecha de la página, selecciona 'Editar perfil' y haz los cambios necesarios."
        }
    ];

    const [preguntaActiva, setPreguntaActiva] = useState(null);

    const togglePregunta = (index) => {
        setPreguntaActiva(preguntaActiva === index ? null : index);
    };

    return (
        <div className="preguntas-container">
            <h1 className="h1"> ➤ Preguntas Frecuentes:</h1>
            <h2></h2>
            {preguntasRespuestas.map((item, index) => (
                <div key={index} className="pregunta" onClick={() => togglePregunta(index)}>
                    <div className={`pregunta-titulo ${preguntaActiva === index ? 'activa' : ''}`}>
                        {item.pregunta}
                    </div>
                    {preguntaActiva === index && (
                        <div className="pregunta-respuesta">
                            {item.respuesta}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
