import React from 'react';
import { Link } from 'react-router-dom';
import './Articulos.css';

export default function Campo() {
    return (
        <div className="articulos-container">
            <div id="articulos-contexto">
                <h2 id="articulos-titulo">Importancia de los productos orgánicos para tu bienestar y el de tu familia</h2>
                
                <div id="articulos-imagen-container">
                    <img 
                        src="https://img.freepik.com/foto-gratis/familia-sonriente-cocina-preparando-comida_23-2148610911.jpg?t=st=1724645997~exp=1724649597~hmac=5367373436d972e424e8636f895538f604ac2ff7450a5ac6c2e1bc89ac7a5886&w=740" 
                        alt="Familia cocinando juntos" 
                        id="img-centrada-articulo" 
                    />
                </div>
                
                <p className="articulos-descripcion">
                    En un mundo cada vez más consciente de la salud y el bienestar, los productos orgánicos han ganado un protagonismo considerable. Estos productos, cultivados sin el uso de pesticidas ni fertilizantes químicos sintéticos, representan una alternativa más saludable para quienes desean cuidar su cuerpo, el entorno y su economía familiar. Pero ¿qué son realmente los productos orgánicos y por qué son tan importantes para tu bienestar y el de tu familia? A continuación, analizaremos su definición y los beneficios en distintos aspectos: económico, de salud, social y emocional.
                </p>
                
                <h2 id="articulos-titulo">¿Qué es un producto orgánico?</h2>
                
                <p className="articulos-descripcion">
                    Los productos orgánicos son aquellos que se cultivan siguiendo prácticas agrícolas naturales que respetan los ciclos de la tierra y evitan el uso de productos químicos artificiales. Se rigen por normativas que prohíben el uso de pesticidas, herbicidas y organismos genéticamente modificados (OGM), así como ciertos aditivos en su procesamiento. Para que un producto sea considerado orgánico, debe cumplir con certificaciones específicas que avalen que se ha cultivado en condiciones respetuosas con el medio ambiente y con el bienestar animal, en el caso de productos derivados de animales.
                </p>
                
                <p className="articulos-descripcion">
                    Esta forma de producción se basa en técnicas sostenibles como la rotación de cultivos, el compostaje y el control biológico de plagas, que no solo protegen la salud del consumidor, sino también la biodiversidad del suelo y la calidad del agua.
                </p>
                
                <h2 id="articulos-titulo">Beneficios para la salud</h2>
                
                <p className="articulos-descripcion">
                    Uno de los principales motivos para elegir productos orgánicos es el impacto positivo en la salud. Los productos convencionales suelen estar expuestos a una gran cantidad de pesticidas, que pueden tener efectos adversos en el cuerpo a largo plazo. El consumo continuo de alimentos cargados con residuos químicos ha sido vinculado con un mayor riesgo de padecer enfermedades crónicas como cáncer, problemas hormonales y afecciones del sistema nervioso.
                </p>
                
                <p className="articulos-descripcion">
                    Los productos orgánicos, al no contener estos químicos, reducen la exposición a sustancias tóxicas. Además, se ha demostrado que tienen un mayor contenido de nutrientes. Diversos estudios indican que las frutas y verduras orgánicas contienen mayores concentraciones de antioxidantes, vitaminas y minerales que sus equivalentes convencionales. Estos nutrientes son esenciales para reforzar el sistema inmunológico, mejorar la digestión y promover el buen funcionamiento del organismo en general.
                </p>
                
                <p className="articulos-descripcion">
                    Para las familias con niños, el consumo de productos orgánicos es aún más relevante. Los cuerpos en desarrollo son más vulnerables a las toxinas, y ofrecerles alimentos libres de químicos asegura un crecimiento más saludable y un menor riesgo de problemas de salud a futuro.
                </p>
                
                <h2 id="articulos-titulo">Impacto económico</h2>
                
                <p className="articulos-descripcion">
                    A primera vista, los productos orgánicos suelen ser más caros que los convencionales. Esto se debe a que el proceso de cultivo orgánico es más laborioso y requiere más tiempo y cuidado. Sin embargo, cuando analizamos los beneficios a largo plazo, los productos orgánicos pueden resultar en un ahorro económico significativo.
                </p>
                
                <p className="articulos-descripcion">
                    Al consumir alimentos orgánicos, estás invirtiendo en tu salud y bienestar. Las enfermedades asociadas con una mala alimentación pueden acarrear altos costos médicos, y prevenirlas mediante una dieta más saludable reduce la necesidad de gastar en tratamientos. Además, los productos orgánicos, al ser más ricos en nutrientes, te permiten obtener mayores beneficios de porciones más pequeñas, lo que a largo plazo puede compensar el costo inicial.
                </p>
                
                <p className="articulos-descripcion">
                    En términos comunitarios, el consumo de productos orgánicos también contribuye a fortalecer las economías locales. Al comprar productos orgánicos de pequeños agricultores, apoyas a familias que dependen de prácticas sostenibles y que, en muchos casos, luchan por mantener métodos tradicionales de cultivo. Esto ayuda a preservar las tradiciones agrícolas locales y garantiza una mayor autonomía alimentaria en las comunidades.
                </p>
                
                <h2 id="articulos-titulo">Impacto social</h2>
                
                <p className="articulos-descripcion">
                    Los beneficios sociales de optar por productos orgánicos son múltiples. Al fomentar una mayor demanda de estos productos, se promueve una agricultura más justa y equitativa. Los agricultores que cultivan productos orgánicos suelen trabajar en condiciones laborales más saludables, ya que no están expuestos a pesticidas tóxicos ni a otras sustancias peligrosas.
                </p>
                
                <p className="articulos-descripcion">
                    Además, el consumo de productos orgánicos impulsa prácticas que respetan el medio ambiente y promueven la biodiversidad. Al reducir la contaminación de los suelos y el agua, y al fomentar la conservación de la fauna local, se crea un equilibrio más sostenible entre las necesidades humanas y las del entorno natural.
                </p>
                
                <p className="articulos-descripcion">
                    El apoyo a la agricultura orgánica también fortalece el sentido de comunidad. Los mercados locales de productos orgánicos fomentan una relación directa entre consumidores y productores, lo que genera mayor confianza y transparencia en los procesos de producción. Esta conexión fortalece el tejido social y crea una economía más solidaria y colaborativa.
                </p>
                
                <Link to="/products" className="articulos-boton">Descubre nuestros productos</Link>
            </div>
        </div>
    );
}
