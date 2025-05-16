import React from 'react';
import { Link } from 'react-router-dom';
import './Articulos.css'; 

export default function Prevenir() {
    return (
        <div className="articulos-container">
            <div id="articulos-contexto">
                <h2 id="articulos-titulo">Efectos nocivos de consumir alimentos con fertilizantes y plaguicidas</h2>
                
                <div id="articulos-imagen-container">
                    <img src="https://natureconservancy-h.assetsadobe.com/is/image/content/dam/tnc/nature/en/photos/t/n/tnc_46036120_preview_cropped.jpg?crop=0%2C9%2C1600%2C880&wid=2000&hei=1100&scl=0.8" alt="Efectos nocivos de pesticidas y fertilizantes" id="img-centrada-articulo" />
                </div>
                
                <p className="articulos-descripcion">
                    El consumo de productos tratados con químicos como pesticidas y fertilizantes artificiales puede tener efectos dañinos tanto para los seres humanos como para el medio ambiente. Con el aumento de la conciencia sobre dietas saludables y sostenibles, muchas personas optan por alimentos orgánicos como una opción más segura y ecológica. Sin embargo, los químicos en alimentos convencionales pueden ser realmente perjudiciales.
                </p>
                <p className="articulos-descripcion">
                    Uno de los mayores problemas es la presencia de residuos de pesticidas, que se utilizan para proteger cultivos, pero dejan rastros en los alimentos que consumimos. La exposición prolongada a pesticidas se ha relacionado con trastornos neurológicos, problemas hormonales y un mayor riesgo de cáncer. Por ejemplo, algunos pesticidas como el glifosato pueden alterar el equilibrio hormonal del cuerpo, afectando la fertilidad y el desarrollo en los niños.
                </p>
                <p className="articulos-descripcion">
                    Además, muchos químicos utilizados en la agricultura convencional pueden ser tóxicos para el hígado y los riñones, que son los principales órganos de desintoxicación. A largo plazo, la acumulación de toxinas puede sobrecargar estos órganos y causar graves problemas de salud. También hay evidencia creciente de que los alimentos procesados y tratados con químicos pueden contribuir a la resistencia a los antibióticos.
                </p>
                <p className="articulos-descripcion">
                    En términos ambientales, el uso excesivo de productos químicos en la agricultura convencional puede contaminar el suelo y el agua, afectando la biodiversidad y alterando los ecosistemas locales. Los productos químicos se filtran en ríos y arroyos, contaminando la vida acuática y las fuentes de agua potable.
                </p>
                <p className="articulos-descripcion">
                    Optar por productos orgánicos no solo minimiza estos riesgos, sino que también apoya prácticas agrícolas sostenibles. Los agricultores orgánicos utilizan métodos naturales para controlar plagas y mejorar la fertilidad del suelo, como la rotación de cultivos y el uso de abonos orgánicos, lo que contribuye a la conservación de la biodiversidad y el medio ambiente. Al elegir alimentos orgánicos, no sólo estamos protegiendo nuestra salud, sino también el futuro del planeta.
                </p>
                
                <Link to="/products" className="articulos-boton">
                    Descubre nuestros productos
                </Link>
            </div>
        </div>
    );
}
