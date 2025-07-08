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

### *Recursos fisicos*
|Nombre del recursos|Modelo|Capacidad|Función|
|-------------------|------|---------|-------|
|CPU|Ryzen 7 7435HS|16 Nucleos|Procesamiento de los mucroservicios|
|RAM|DDR4/DDR5|8GB|Almacenamiento temporal de sesiones, cache de autenticación JWT, buffers de bases de datos y memoria heap de aplicaciones Java|
|Almacenamiento|SSD Adata|215GB|Persistencia de datos en bases de datos (CL_auth_db, CL_residence_db, CL_guest_db, CL_messaging_db) y logs del sistema|
|Red|Fibra Optica/WiFi|100 Mbps|Comunicación entre contenedores Docker, transferencia de datos HTTP/HTTPS y conexiones TCP a bases de datos|
|GPU|RTX 3050|4GB VRAM|Renderizado de interfaces web y desktop, aceleración de operaciones gráficas en frontends|

### *Recursos digitales*
1. **K6**: PLatafaforma para realizar *Load testing* usando Javascript para la codificación de las pruebas y parametros de evalución
2. **Amazon Q**: Agente de IA de amazon, que sirvio para el debig de las pruebas, la creación de nuevos test y el almacenamiento y analisis de los resultados.
3. **Pruebas de rendimiento**: Disponibles en la carpeta *k6_test*. En estas se establecuerion diversos escenarios con cargas de usuarios crecientes y decrecientes, los cuales envian 2 peticiones por segundos.
 
### *Testing de validación de las API*
Durante las primeras prueba que se realizaron, se creo una prueba con el objetivo de evaluar las respuestas de las APIs cuando un usuario intentaba acceder a ellas. Con ella, se queria verificar de primera mano que la plataforma k6 nos era funcional para la realizan de las pruebas de rendimiento.
Gracias a esta se obtuvo un dato interesante pues se consiguio una concurrencia maxima de 800 usuarios concurrentes, cabe recordar que estos solo hacian un llamado al endpoint referenciado sin enviar datos.

### *Pruebas de carga, estres y pico*
Las pruebas de carga se usaron para verificar el comportamiento del sistema bajo carga normal esperada, con este tipo de pruebas se logro encontrar el "knee point". Por otro lado, las pruebas de estres querian encontrar el punto de quiebre del sistema y evaluar recuperación, con estan sobre todo se valido que apesar de colapsar el sistema no requeria un reinicio total sino unos segundos de menos peticiones. Por ultimos las pruebas pico se crearon para ealuar comportamiento ante aumentos súbitos de tráfico.

### *Resultados de rendimiento*
En este tipo de pruebas se queria hallar el "knee point" de nuestro sistema, para poder indentificar la máxima recurrencia en operación normal que se tiene en el sistema, donde obtuvimos las siguientes metricas:
1. **Escenario 1**:

|Usuarios Virtuales|Tiempo Respuesta p50 (ms)|	Tiempo Respuesta p90 (ms)|Tiempo Respuesta p95 (ms)|Throughput Promedio (req/s)|Success Rate Promedio (%)|
|---|----|----|---|---|----|
|10|850|1,200|1,480|6.2|98.50%|
|20|1,340|2,100|2,850|8.4|96.80%|
|30|1,820|3,400|4,200|9.1|94.20%|
|40|2,650|5,200|6,800|8.9|91.50%|
|50|3,580|7,800|9,920|7.8|88.70%|
|60|4,320|11,200|14,500|6.4|85.30%|
|70|1,610|22,930|32,120|5.7|83.10%|
|80|8,500|25,400|35,200|4.2|8.90%|
|100|18,340|39,560|45,910|2.6|69.20%|

2. **Escenario 2**:

### *Puntos criticos*
1. **API Gateway**: Se identifico que el API Gateway en su labor de orquestación es capaz de recibir todas las peteciones, sin embargo cuando estos superan las capacidades este colapsa y hace que las peticiones sean rechazadas
2. 
### *Propuestas de mejora*

### *Grafica Knee Point*
## **Prototype**
### Instructions for deploying the software system locally