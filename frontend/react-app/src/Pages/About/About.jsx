import React from 'react';
import './About.css'; 


export default function About(){
  return (
    <div className="nosotros-container">
    <div id="mer-container2">
    <div id="context-container2">
    <div id="contenedor-imagenes2">
        <img src="Natu_Logo_.png" id="img-centrada2" />
    </div>
    <h2 id='titulo2'>Acerca de nosotros</h2>
      <p className='vision'> Natu surge como una alternativa para facilitar el acceso a productos orgánicos y de producción local en un solo lugar. 
        Su objetivo principal es conectar a los productores locales con los consumidores a través de una plataforma en línea que permite transacciones rápidas y eficientes. Esta plataforma no solo simplifica la adquisición de productos saludables y sostenibles, sino que también apoya el crecimiento de agricultores y campesinos colombianos. 
        Más allá de ofrecer una experiencia de compra, Natu promueve un estilo de vida saludable y consciente, respaldando a aquellos productores que se dedican a cultivar y fabricar productos nutritivos y de alta calidad. De esta manera, contribuye al bienestar tanto del consumidor final como de los productores, quienes son el primer eslabón en la cadena de consumo. Natu se basa en la adaptabilidad, la colaboración, la mejora continua y la calidad de sus servicios para cumplir su misión.

</p>
    <h2 id='titulo2'>Visión</h2>
      <p className='vision'>Para 2028, Natu se posicionará como una de las principales plataformas de intercambio de productos orgánicos en Colombia. Buscamos ser una herramienta integral que involucre alrededor del 30% de los actores del sector orgánico, proporcionando a los usuarios una experiencia de alta calidad  y adaptándonos a las cambiantes necesidades del mercado.
</p>
    <h2 id='titulo2'>Misión</h2>
      <p className='mision'>En Natu, nos comprometemos a proporcionar una plataforma web que facilite la compra directa, promoviendo así una actividad comercial ágil y efectiva entre productores locales y consumidores. Buscamos fomentar la sostenibilidad y el consumo consciente al ofrecer una amplia variedad de productos orgánicos, adaptándonos continuamente a las necesidades del usuario y del mercado.
</p> 
    </div>

    <div id="about-us-container2">
      <h2 id='titulo2'>Nuestro Equipo</h2>
      <p className='acerca'>Somos estudiantes de la Universidad Nacional formando un equipo de desarrolladores dedicados a crear soluciones innovadoras. Trabajamos juntos para enfrentar desafíos y generar impacto positivo.</p>

      <div id="team-container2">
        <div id="team-member2">
        <img src="https://media.licdn.com/dms/image/v2/D4E03AQGWNZAEWFe67A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1690652960251?e=1729123200&v=beta&t=LRkywxK-HXttGvDH2Hjv_nxtozFELhbi_JY60hYqERk" alt="Integrante 1" />
          <h3 >David Rodriguez</h3>
          <p>Desarrollador Full-Stack</p>
          <a href="https://github.com/Davidrg02" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }} >
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/david-steven-rodr%C3%ADguez-guzm%C3%A1n-b7828a264/" target="_blank" rel="noreferrer"style={{ color: '#0077B5', fontSize: '1.8em' }}>
            <i className="fab fa-linkedin"></i>
          </a>
        </div>

        <div id="team-member2">
          <img src="https://media.licdn.com/dms/image/D4E03AQFGSt6YIQSBBw/profile-displayphoto-shrink_800_800/0/1711971949970?e=1729123200&v=beta&t=PGXFg_etn8uwLOGK6iw53eU5DwRVmElQjgphvqRnBM4" alt="Integrante 2" />
          <h3 >Nicolás Hernandez</h3>
          <p>Desarrollador Backend</p>
          <a href="https://github.com/nihernandezv" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }}>
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/nihernandezv/" target="_blank" rel="noreferrer" style={{ color: '#0077B5',fontSize: '1.8em' }}>
            <i className="fab fa-linkedin" ></i>
          </a>
        </div>

        <div id="team-member2">
          <img src="https://media.licdn.com/dms/image/v2/D4E03AQE45_Vg-VZWHg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724764046475?e=1730332800&v=beta&t=GH23xjl1WwvQe94Jv9Da3FB6wfndFp38QOwf72Ilu-Q" alt="Integrante 4" />
          <h3 >Brayan Maldonado</h3>
          <p>Desarrollador Frontend</p>
          <a href="https://github.com/BryanSantiagoo" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }}>
            <i className="fab fa-github icono"></i>
          </a>
          <a href="https://www.linkedin.com/in/brayan-santiago-maldonado-aparicio-549336276/" target="_blank" rel="noreferrer" style={{ color: '#0077B5',fontSize: '1.8em' }}>
            <i className="fab fa-linkedin"></i>
          </a>
        </div>
        
        <div id="team-member2">
          <img src="https://media.licdn.com/dms/image/v2/D4E03AQEB9kkB7CQcPg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1714028763561?e=1729123200&v=beta&t=DLZS3F4OdCtd4YGn7mQ9RE2bcN5LEsqVh-HG4bUCvyY" alt="Integrante 3" />
          <h3 >Ivan Sepulveda</h3>
          <p>Desarrollador Frontend</p>
          <a href="https://github.com/ivanyspaez" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }}>
            <i className="fab fa-github"></i>
          </a>
          <a href="https://www.linkedin.com/in/ivan-sepulveda-paez/" target="_blank" rel="noreferrer"  style={{ color: '#0077B5',fontSize: '1.8em' }}>
            <i  className="fab fa-linkedin"></i>
          </a>
        </div>

        

        
      </div>
    </div>
  </div>
</div>
);
}
