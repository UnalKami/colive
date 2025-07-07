# **Prototipo 3 Arquitectura de Software 2025-1**

# **Team**
### Equipo 1B

- Daniel Felipe Villamor (Arquitecto líder)
- Byron Daniel Giraldo Castro
- Camilo Andres Roncancio Toca 
- Ivan Yesid Sepulveda Paez
- Javier Santiago Vargas Parra
- Jonathan Steven Ochoa Celis
- Julian David Huertas Dominguez

# **Software System**
### Name: **COLive**
### Logo:
 ![Logo del Sistema](./readmeAssets/COLiveLogo.png)
### Description
COLive es una plataforma digital diseñada para optimizar la administración de conjuntos residenciales. El sistema permite a los propietarios registrar su conjunto en la plataforma y gestionar de manera centralizada todos los procesos asociados a la convivencia y operación del conjunto.

Entre sus funcionalidades destacan la creación y administración de cuentas para apartamentos e inquilinos, la reserva de espacios comunes, la gestión de parqueaderos y visitantes, el envío de mensajes internos, la generación de notificaciones y la administración del personal encargado del conjunto (como administradores, personal de aseo y vigilancia).

COLive busca mejorar la comunicación, eficiencia y transparencia en la gestión residencial, brindando a administradores y residentes una herramienta moderna y confiable para el manejo diario de su comunidad.
# **Architectural Structures**
### **Component-and Connector (C&C) Structure**
### C&C View
 ![VistaCC](./readmeAssets/VistaCC-COLive-P3.png)
### **Description of architectural styles and patterns used**
### Estilos arquitectónicos: 
# TODO: poner descripciones
* Cliente servidor: En una conexión entre dos componentes, uno de ellos sirve algo (servidor) y el otro de ellos consume (cliente).
* Microservicios:
* Basada en capas:

### Patrones arquitectónicos: 
* Patrón API Gateway
* Patrón de canal seguro
* Patrón Proxy Inverso
* Patrón Balanceador de carga

### **Description of architectural elements and relations**

### Elementos arquitectónicos
#### Componentes:
* CL_desktop_fe
* CL_web_rp
* CL_desktop_rp
* CL_web_fe
* CL_ag
* CL_auth_lb
* CL_auth_ms (3) 
* CL_residence_ms
* CL_messaging_ms
* CL_statistics_ms
* CL_auth_db
* CL_residence_db
* CL_guest_db
* CL_messaging_db

#### Conectores
* HTTPS
* HTTP (REST)
* HTTP (GraphQL)
* TCP/JDBC
* TCP/Mongoose
* TCP/pg
* TCP/MongoDB

### Relaciones

| Desde | Hacia | Conector | 
|-------|------|----------|
| Cliente | CL_web_rp | HTTPS |
| CL_desktop_fe | CL_desktop_rp | HTTPS | 
| CL_web_rp  | Auth | HTTP (REST)| 
| API Gateway | Residence Creator | HTTP (GraphQL) |
| Auth | PostgreSQL | JDBC |
| Residence Creator| MongoDB | Mongoose | 

### **Layered Structure**
#### Layered View
#### Description of architectural patterns used (if applicable)
* Patrón N-tier
* Patrón por capas físicas
* Patrón capas lógicas ()
#### Description of architectural elements and relations

### **Deployment Structure**
#### Deployment View
#### Description of architectural patterns used (if applicable)
* Patrón de segmentación de red
#### Description of architectural elements and relations

### **Decomposition Structure**
#### Decomposition View
#### Description of architectural elements and relations

# **Quality Attributes**
### **Security**
### Security scenarios

* Scenario 1: Secure Channel Pattern (HTTPS)
    * Source: Atacante conectado a la misma red que un usuario de la aplicación.
    * Stimulus: Interceptación del tráfico (Man in the middle) para robar información.
    * Environment: Operaciones normales
    * Artifact: Conector HTTPS Navegador <-> Proxy inverso web
    * Response: Transmite la información cifrada.
    * Response measure: Se reciben todos los paquetes sin alteración.

* Scenario 2: Reverse Proxy Pattern
    * Source: Atacante 
    * Stimulus: Ataque de Denegación de Servicio (DoS)
    * Environment: Operaciones normales
    * Artifact: CL_web_rp, CL_desktop_rp
    * Response: Identifica y rechaza las peticiones maliciosas.
    * Response measure: Identifica el origen de las peticiones y bloquea la ip.

* Scenario 3: Network Segmentation Pattern
    * Source: Atacante
    * Stimulus: 
    * Environment:
    * Artifact: 
    * Response: 
    * Response measure: 

* Scenario 4: Authentication with Asymmetric JWT Pattern
    * Source: Atacante que quiere acceder a información que no corresponde a su usuario
    * Stimulus: Altera el payload del token
    * Environment: Operaciones normales
    * Artifact: CL_web_fe, CL_ag.
    * Response: Rechaza la petición 
    * Response measure: Detecta la alteración en el payload del token por el hash

### Applied architectural tactics
 * Encrypt Data (Resist Attack)
 * Limit Access (Resist Attack)
 * Authenticate Actor (Resist Attack)

### Applied architectural patterns
 * Secure Channel Pattern (HTTPS)
 * Reverse Proxy Pattern
 * Network Segmentation Pattern
 * Authentication with Asymmetric JWT Pattern
 
### **Performance and Scalability**
### Performance scenarios

* Scenario 1: Registro usuario administrador y conjunto
    * Source: X usuarios
    * Stimulus: X cantidad de peticion en un intervalo de Y tiempo
    * Environment: Operaciones normales
    * Artifact: CL_web_rp, CL_web_fe, CL_ag, CL_auth_ms, CL_residence_ms, CL_auth_db, CL_residence_db
    * Response: Procesa todas las solicitudes.
    * Response measure: X ms de respuesta por petición.
     
### Applied architectural tactics

* Mantain Multiple Copies of Computations (Manage Resources)
* Limit event responses (Control Resource Demand)
* Increase Efficiency (Control Resource Demand)

### Applied architectural patterns

* Load Balancer Pattern
* Reverse Proxy Pattern

### Performance testing analysis and results

## **Prototype**
### Instructions for deploying the software system locally