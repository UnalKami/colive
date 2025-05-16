import React from 'react';
import { Link } from 'react-router-dom';
import './Articulos.css';

export default function Frescos() {
    return (
        <div className="articulos-container">
            <div id="articulos-contexto">
                <h2 id="articulos-titulo">Importancia de consumir frutas y verduras frescas</h2>
                
                <div id="articulos-imagen-container">
                    <img src="https://img.freepik.com/foto-gratis/vista-superior-diferentes-verduras-frutas-sobre-fondo-blanco-dieta-alimentos-salud-ensalada-color-maduro_140725-98424.jpg?t=st=1724643216~exp=1724646816~hmac=69e2834ac6acd843c1beb0165ad2516ed59fd8621f0ccbfa1a5906cf912b7cc4&w=740" alt="Frutas y verduras frescas" id="img-centrada-articulo" />
                </div>
                
                <p className="articulos-descripcion">
                    El consumo de frutas y verduras frescas es esencial para llevar una vida saludable. Estos alimentos son la base de una dieta equilibrada, aportando una amplia gama de nutrientes indispensables para el buen funcionamiento del cuerpo humano. Sin embargo, en un mundo cada vez más acelerado, muchas personas tienden a optar por alimentos procesados o de fácil acceso, dejando de lado el consumo regular de productos frescos. Pero ¿por qué es tan importante incluir frutas y verduras frescas en nuestra dieta diaria?
                </p>
                
                <p className="articulos-descripcion">
                    En primer lugar, las frutas y verduras frescas son una fuente inigualable de vitaminas y minerales. Por ejemplo, las naranjas y los cítricos son ricos en vitamina C, esencial para fortalecer el sistema inmunológico y proteger al cuerpo contra infecciones y enfermedades. Por otro lado, las verduras de hoja verde, como la espinaca y la col rizada, contienen altas concentraciones de hierro y calcio, nutrientes fundamentales para la producción de energía y la salud ósea. Además, muchas frutas y verduras frescas contienen potasio, como los plátanos, que ayudan a mantener la presión arterial bajo control y apoyan la función muscular.
                </p>
                
                <p className="articulos-descripcion">
                    Otro aspecto fundamental de consumir frutas y verduras frescas es su contenido de fibra dietética. La fibra es crucial para mantener un sistema digestivo saludable. Ayuda a regular el tránsito intestinal, prevenir el estreñimiento y reducir el riesgo de enfermedades crónicas como el cáncer de colon. Además, la fibra ayuda a mantener una sensación de saciedad, lo que puede ser beneficioso para quienes buscan controlar su peso.
                </p>
                
                <p className="articulos-descripcion">
                    Por otro lado, las frutas y verduras frescas contienen una menor cantidad de azúcares añadidos y grasas trans que los alimentos procesados. Esto significa que al consumir estos productos, el cuerpo obtiene energía y nutrientes de manera más natural y equilibrada. También contribuyen a la hidratación, dado que muchas frutas y verduras, como el pepino y la sandía, tienen un alto contenido de agua.
                </p>
                
                <p className="articulos-descripcion">
                    En cuanto a los beneficios a largo plazo, los estudios han demostrado que una dieta rica en frutas y verduras frescas reduce el riesgo de enfermedades crónicas como las enfermedades cardíacas, la diabetes tipo 2 y ciertos tipos de cáncer. Esto se debe a que los antioxidantes presentes en estos alimentos frescos protegen a las células del daño causado por los radicales libres, reduciendo la inflamación y fortaleciendo el sistema inmunológico.
                </p>
                
                <p className="articulos-descripcion">
                    Finalmente, consumir frutas y verduras frescas también tiene un impacto positivo en el medio ambiente. Al elegir productos frescos y locales, se reduce la necesidad de envasado y transporte, lo que disminuye la huella de carbono. Además, al apoyar a los agricultores locales que producen alimentos orgánicos, se promueve una agricultura sostenible que protege los recursos naturales y la biodiversidad.
                </p>

                <Link to="/products" className="articulos-boton">Descubre nuestros productos</Link>
            </div>
        </div>
    );
}
