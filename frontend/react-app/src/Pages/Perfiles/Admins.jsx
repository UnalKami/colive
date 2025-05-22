import React from 'react';
import './user.css'; 

export default function About() {
  return (
    <div className="nosotros-container">
      <div id="mer-container2">
        <div id="context-container2">
          <div id="contenedor-imagenes2">
            <img src="Colive_Logo_.png" id="img-centrada2" alt="Logo" />
          </div>

          <h2 id='titulo2'>Acerca de nosotros</h2>
          <p className='vision'>
            Este proyecto nace con el propósito de optimizar la gestión de copropiedades residenciales mediante una plataforma web configurable según las necesidades de cada comunidad. Nuestra solución permite a los usuarios realizar reservas, gestionar zonas comunes, registrar visitantes, reportar incidentes, comunicarse internamente y llevar el control de pagos. Ofrecemos una herramienta versátil, centrada en la eficiencia operativa, la mejora continua y el bienestar de las personas que integran cada copropiedad.
          </p>

          <h2 id='titulo2'>Visión</h2>
          <p className='vision'>
            Para 2028, seremos una plataforma líder en gestión de copropiedades residenciales en Colombia, reconocida por su adaptabilidad, seguridad y escalabilidad. Buscamos atender a más de 2000 residencias en simultáneo, garantizando una experiencia intuitiva y funcional para usuarios de todos los perfiles.
          </p>

          <h2 id='titulo2'>Misión</h2>
          <p className='mision'>
            Desarrollamos soluciones tecnológicas que contribuyen al orden, la convivencia y la transparencia en la administración de espacios residenciales. Nos comprometemos a brindar herramientas efectivas y personalizadas, orientadas al usuario y en constante evolución.
          </p>
        </div>

        <div id="about-us-container2">
          <h2 id='titulo2'>Nuestro Equipo</h2>
          <p className='acerca'>
            Somos estudiantes de la Universidad Nacional, conformando un equipo interdisciplinario de desarrolladores comprometidos con la innovación, la colaboración y la excelencia en el desarrollo de software.
          </p>

          <div id="team-container2">
            {/* Integrante 1 */}
            <div id="team-member2">
              <img src="https://media.licdn.com/dms/image/v2/D4E03AQGWNZAEWFe67A/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1690652960251?e=1729123200&v=beta&t=LRkywxK-HXttGvDH2Hjv_nxtozFELhbi_JY60hYqERk" alt="David Rodriguez" />
              <h3>Integrante 1</h3>
              <p>Desarrollador Full-Stack</p>
              <a href="https://github.com/Davidrg02" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }}>
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/david-steven-rodr%C3%ADguez-guzm%C3%A1n-b7828a264/" target="_blank" rel="noreferrer" style={{ color: '#0077B5', fontSize: '1.8em' }}>
                <i className="fab fa-linkedin"></i>
              </a>
            </div>

            {/* Integrante 2 */}
            <div id="team-member2">
              <img src="https://media.licdn.com/dms/image/D4E03AQFGSt6YIQSBBw/profile-displayphoto-shrink_800_800/0/1711971949970?e=1729123200&v=beta&t=PGXFg_etn8uwLOGK6iw53eU5DwRVmElQjgphvqRnBM4" alt="Nicolás Hernandez" />
              <h3>Integrante 1</h3>
              <p>Desarrollador Backend</p>
              <a href="https://github.com/nihernandezv" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }}>
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/nihernandezv/" target="_blank" rel="noreferrer" style={{ color: '#0077B5', fontSize: '1.8em' }}>
                <i className="fab fa-linkedin"></i>
              </a>
            </div>

            {/* Integrante 3 */}
            <div id="team-member2">
              <img src="https://media.licdn.com/dms/image/v2/D4E03AQE45_Vg-VZWHg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1724764046475?e=1730332800&v=beta&t=GH23xjl1WwvQe94Jv9Da3FB6wfndFp38QOwf72Ilu-Q" alt="Brayan Maldonado" />
              <h3>Integrante 2</h3>
              <p>Desarrollador Frontend</p>
              <a href="https://github.com/BryanSantiagoo" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }}>
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/brayan-santiago-maldonado-aparicio-549336276/" target="_blank" rel="noreferrer" style={{ color: '#0077B5', fontSize: '1.8em' }}>
                <i className="fab fa-linkedin"></i>
              </a>
            </div>

            {/* Integrante 4 */}
            <div id="team-member2">
              <img src="https://media.licdn.com/dms/image/v2/D4E03AQEB9kkB7CQcPg/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1714028763561?e=1729123200&v=beta&t=DLZS3F4OdCtd4YGn7mQ9RE2bcN5LEsqVh-HG4bUCvyY" alt="Ivan Sepulveda" />
              <h3>Integrante 3</h3>
              <p>Desarrollador Frontend</p>
              <a href="https://github.com/ivanyspaez" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }}>
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/ivan-sepulveda-paez/" target="_blank" rel="noreferrer" style={{ color: '#0077B5', fontSize: '1.8em' }}>
                <i className="fab fa-linkedin"></i>
              </a>
            </div>

            {/* Integrante 5 */}
            <div id="team-member2">
              <img src="FALTA_URL_IMAGEN" alt="Integrante 5" />
              <h3>Nombre del Integrante 5</h3>
              <p>Rol del Integrante 5</p>
              <a href="FALTA_GITHUB" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }}>
                <i className="fab fa-github"></i>
              </a>
              <a href="FALTA_LINKEDIN" target="_blank" rel="noreferrer" style={{ color: '#0077B5', fontSize: '1.8em' }}>
                <i className="fab fa-linkedin"></i>
              </a>
            </div>

            {/* Integrante 6 */}
            <div id="team-member2">
              <img src="FALTA_URL_IMAGEN" alt="Integrante 6" />
              <h3>Nombre del Integrante 6</h3>
              <p>Rol del Integrante 6</p>
              <a href="FALTA_GITHUB" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }}>
                <i className="fab fa-github"></i>
              </a>
              <a href="FALTA_LINKEDIN" target="_blank" rel="noreferrer" style={{ color: '#0077B5', fontSize: '1.8em' }}>
                <i className="fab fa-linkedin"></i>
              </a>
            </div>

            {/* Integrante 7 */}
            <div id="team-member2">
              <img src="FALTA_URL_IMAGEN" alt="Integrante 7" />
              <h3>Nombre del Integrante 7</h3>
              <p>Rol del Integrante 7</p>
              <a href="FALTA_GITHUB" target="_blank" rel="noreferrer" className='giro' style={{ fontSize: '1.8em' }}>
                <i className="fab fa-github"></i>
              </a>
              <a href="FALTA_LINKEDIN" target="_blank" rel="noreferrer" style={{ color: '#0077B5', fontSize: '1.8em' }}>
                <i className="fab fa-linkedin"></i>
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
