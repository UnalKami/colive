import React from 'react';
import { Link } from 'react-router-dom';
import './Articulos.css';

export default function Nutritivos() {
    return (
        <div className="articulos-container">
            <div id="articulos-contexto">
                <h2 id="articulos-titulo">Beneficios de consumir alimentos ricos en vitaminas, minerales y antioxidantes</h2>
                <div id="articulos-imagen-container">
                    <img src="https://img.freepik.com/foto-gratis/vista-superior-frutas-verduras-frescas-diferentes-medicamentos-cuchara-madera_181624-47137.jpg?t=st=1724643056~exp=1724646656~hmac=ab049b5c5d1d08c42f0abe55f3a960dd1e27d43c8a6c84672cc72b27b0fa1e17&w=740" alt="Alimentos ricos en vitaminas y minerales" id="img-centrada-articulo" />
                </div>
                <p className="articulos-descripcion">
                    Los alimentos ricos en vitaminas, minerales y antioxidantes son fundamentales para mantener una salud óptima y prevenir enfermedades. En un mundo en el que la comida rápida y los productos procesados dominan las estanterías, es crucial recordar que el cuerpo humano necesita una variedad de nutrientes para funcionar correctamente. A continuación, explicaremos los principales beneficios de consumir alimentos que están llenos de estos valiosos compuestos.
                </p>
                <p className="articulos-descripcion">
                    Las vitaminas son esenciales para diversas funciones del organismo. Por ejemplo, la vitamina A, que se encuentra en alimentos como las zanahorias y los camotes, es crucial para la salud ocular, ya que ayuda a mantener una visión adecuada y reduce el riesgo de desarrollar enfermedades relacionadas con la vista, como la degeneración macular. La vitamina C, presente en frutas cítricas y pimientos, es un potente antioxidante que fortalece el sistema inmunológico y promueve la producción de colágeno, necesario para mantener una piel, cabello y uñas saludables.
                </p>
                <p className="articulos-descripcion">
                    Otro nutriente vital es la vitamina D, que juega un papel crucial en la salud ósea al ayudar al cuerpo a absorber el calcio. Aunque el cuerpo puede producir vitamina D a través de la exposición al sol, también es importante obtenerla de fuentes alimenticias como pescados grasos y huevos. De hecho, una deficiencia de vitamina D puede aumentar el riesgo de osteoporosis y fracturas óseas.
                </p>
                <p className="articulos-descripcion">
                    Los minerales son igualmente importantes para el bienestar general. El calcio, por ejemplo, no solo fortalece los huesos y dientes, sino que también es esencial para la función muscular y nerviosa. El hierro, presente en alimentos como las espinacas y la carne magra, es esencial para la producción de hemoglobina, una proteína en los glóbulos rojos que transporta oxígeno por todo el cuerpo. La deficiencia de hierro puede provocar anemia, una condición que causa fatiga y debilidad.
                </p>
                <p className="articulos-descripcion">
                    El potasio, por su parte, desempeña un papel crucial en la regulación de la presión arterial y el equilibrio de líquidos en el cuerpo. Los plátanos, las patatas y el aguacate son excelentes fuentes de potasio. Una ingesta adecuada de este mineral puede reducir el riesgo de hipertensión y enfermedades cardiovasculares.
                </p>
                <p className="articulos-descripcion">
                    Además de las vitaminas y minerales, los antioxidantes presentes en los alimentos juegan un papel fundamental en la protección de las células del cuerpo contra el daño oxidativo. Los antioxidantes, como el betacaroteno, los flavonoides y las vitaminas C y E, neutralizan los radicales libres, que son moléculas inestables que pueden causar daño celular y contribuir al envejecimiento prematuro y a enfermedades crónicas.
                </p>
                <p className="articulos-descripcion">
                    El consumo regular de alimentos ricos en antioxidantes, como las bayas, el té verde, las nueces y las verduras de hoja verde, puede reducir el riesgo de enfermedades crónicas como las enfermedades cardíacas, el cáncer y la diabetes. Además, estos compuestos ayudan a reducir la inflamación en el cuerpo, lo que es beneficioso para las personas que sufren de enfermedades inflamatorias como la artritis.
                </p>
                <p className="articulos-descripcion">
                    En resumen, una dieta rica en vitaminas, minerales y antioxidantes no solo proporciona los nutrientes necesarios para el funcionamiento diario, sino que también protege al cuerpo contra enfermedades crónicas, promueve una piel y cabello saludables, y mejora la calidad de vida en general.
                </p>
                
                <Link to="/products" className="articulos-boton">Descubre nuestros productos</Link>
            </div>
        </div>
    );
}
