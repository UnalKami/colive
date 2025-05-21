import React, { useEffect, useState } from 'react';
import '../Perfiles/Perfiles.css'; // Asegúrate de que la ruta del archivo CSS sea correcta
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function User() {
  const api_url = process.env.REACT_APP_API_URL;
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');

  // --- Estados de los campos del formulario de registro --- //
  const [Nombres, setNombres] = useState('');
  const [Apellidos, setApellidos] = useState('');
  const [Documento, setDocumento] = useState('');
  const [Email, setEmail] = useState('');
  const [Telefono, setTelefono] = useState('');
  const [FechaNacimiento, setFechaNacimiento] = useState('');
  const [Departamento, setDepartamento] = useState('');
  const [Municipio, setMunicipio] = useState('');
  const [Direccion, setDireccion] = useState('');
  const [Descripcion, setDescripcion] = useState('');

  const [Departamentos, setDepartamentos] = useState([]);
  const [Municipios, setMunicipios] = useState([]);

  // Estado para habilitar o deshabilitar la edición
  const [editMode, setEditMode] = useState(false);

  // Estado para controlar la validación del formulario
  const [validated, setValidated] = useState(false);

  // --- Fetch de datos iniciales --- //
  useEffect(() => {
    fetch(`${api_url}/compradores/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      const comprador = data.body[0];  // Acceder al primer objeto del arreglo
      setNombres(comprador.Nombres_comprador || '');
      setApellidos(comprador.Apellidos_comprador || '');
      setDocumento(comprador.Documento_comprador || '');
      setEmail(comprador.Correo_usuario || '');
      setTelefono(comprador.Telefono_comprador || '');
      setFechaNacimiento(comprador.Fecha_nacimiento_comprador ? comprador.Fecha_nacimiento_comprador.split('T')[0] : '');
      setDepartamento(comprador.DEPARTAMENTO_ID_Departamento || '');
      setMunicipio(comprador.MUNICIPIO_ID_Municipio || '');
      setDireccion(comprador.Direccion || '');
      setDescripcion(comprador.Descripcion_adicional || '');
    })
  }, [token, id]);
  

  // --- Fetch de Departamentos --- //
  useEffect(() => {
    fetch(`${api_url}/departamentos`)
      .then((response) => response.json())
      .then((data) => {
        setDepartamentos(data.body || []);
      })
      .catch((error) => console.error('Error fetching departamentos:', error));
  }, [api_url]);

  // --- Fetch de Municipios basado en el Departamento seleccionado --- //
  useEffect(() => {
    const endpoint = Departamento
      ? `${api_url}/municipios/filter/${Departamento}`
      : `${api_url}/municipios`;

    fetch(endpoint)
      .then((response) => response.json())
      .then((data) => {
        setMunicipios(data.body || []);
      })
      .catch((error) => console.error('Error fetching municipios:', error));
  }, [api_url, Departamento]);

  // --- Función para manejar el envío del formulario --- //
  const handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
    } else {
      // Aquí puedes hacer el fetch para actualizar los datos del comprador
      console.log(Municipio)
      fetch(`${api_url}/compradores/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          Nombres_comprador: Nombres,
          Apellidos_comprador: Apellidos,
          Documento_comprador: Documento,
          Telefono_comprador: Telefono,
          Fecha_nacimiento_comprador: FechaNacimiento,
          MUNICIPIO_ID_Municipio: Municipio,
          Direccion: Direccion,
          Descripcion_adicional: Descripcion,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (!data.error) {
            toast.success('Datos actualizados correctamente');
            setEditMode(false);
          } else {
            toast.error('Error al actualizar los datos');
          }
        })
        .catch((error) => {
          console.error('Error updating data:', error);
          toast.error('Error al actualizar los datos');
        });
    }

    setValidated(true);
  };

  // --- Función para alternar entre modo visualización y edición --- //
  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  return (
    <div className='register-container'>
      <ToastContainer position='bottom-right' />
      <div id="background1">
        <div id="shape1" />
        <div id="shape1" />
      </div>
      <div id="register-container">
        <img src="Natu_Logo_.png" alt="image" />
        <Form noValidate validated={validated} onSubmit={handleSubmit} id='register-form'>
          <h3>Mis datos personales</h3>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom01">
              <Form.Label>Nombres</Form.Label>
              <Form.Control
                maxLength={60}
                required
                type="text"
                placeholder={Nombres}
                value={Nombres}
                onChange={(e) => setNombres(e.target.value)}
                disabled={!editMode}
              />
              <Form.Control.Feedback type="invalid">Por favor ingresa tus nombres.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom02">
              <Form.Label>Apellidos</Form.Label>
              <Form.Control
                maxLength={60}
                required
                type="text"
                placeholder="Apellidos"
                value={Apellidos}
                onChange={(e) => setApellidos(e.target.value)}
                disabled={!editMode}
              />
              <Form.Control.Feedback type="invalid">Por favor ingresa tus apellidos.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="4" controlId="validationCustomUsername">
              <Form.Label>Documento</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  maxLength={14}
                  type="number"
                  placeholder="Documento"
                  aria-describedby="inputGroupPrepend"
                  value={Documento}
                  onChange={(e) => setDocumento(e.target.value)}
                  required
                  disabled
                />
                <Form.Control.Feedback type="invalid">Por favor ingresa tu número de documento.</Form.Control.Feedback>
              </InputGroup>
            </Form.Group>
            <Form.Group as={Col} md="8" controlId="validationCustom03">
              <Form.Label>Email</Form.Label>
              <Form.Control
                maxLength={60}
                type="email"
                placeholder="Email"
                value={Email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled
              />
              <Form.Control.Feedback type="invalid">Por favor ingresa un correo electrónico válido.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom04">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="number"
                placeholder="Teléfono"
                value={Telefono}
                onChange={(e) => setTelefono(e.target.value)}
                required
                disabled={!editMode}
              />
              <Form.Control.Feedback type="invalid">Por favor ingresa tu número de teléfono.</Form.Control.Feedback>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom05">
              <Form.Label>Fecha de Nacimiento</Form.Label>
              <Form.Control
                type="date"
                placeholder="Fecha de Nacimiento"
                value={FechaNacimiento}
                onChange={(e) => setFechaNacimiento(e.target.value)}
                required
                disabled={!editMode}
              />
              <Form.Control.Feedback type="invalid">Por favor ingresa tu fecha de nacimiento.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationCustom07">
              <Form.Label>Departamento</Form.Label>
              <Form.Select
                aria-label="Selecciona un departamen"
                value={Departamento}
                onChange={(e) => setDepartamento(e.target.value)}
                disabled={!editMode}
              >
                <option>Selecciona un departamen</option>
                {Departamentos.map((dept) => (
                  <option key={dept.ID_Departamento} value={dept.ID_Departamento}>
                    {dept.Nombre_departamento}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationCustom08">
              <Form.Label>Municipio</Form.Label>
              <Form.Select
                aria-label="Selecciona un municipio"
                value={Municipio}
                onChange={(e) => setMunicipio(e.target.value)}
                disabled={!editMode}
              >
                <option>Selecciona un municipio</option>
                {Municipios.map((mun) => (
                  <option key={mun.ID_Municipio} value={mun.ID_Municipio}>
                    {mun.Nombre_municipio}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom09">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                maxLength={100}
                type="text"
                placeholder="Dirección"
                value={Direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
                disabled={!editMode}
              />
              <Form.Control.Feedback type="invalid">Por favor ingresa la dirección de tu tienda.</Form.Control.Feedback>
            </Form.Group>
          </Row>

          <Row className="mb-3">
            <Form.Group as={Col} md="12" controlId="validationCustom10">
              <Form.Label>Descripción Adicional</Form.Label>
              <Form.Control
                as="textarea"
                maxLength={200}
                placeholder="Descripción adicional"
                value={Descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                disabled={!editMode}
              />
            </Form.Group>
          </Row>

          <div className="d-flex justify-content-end">
            {editMode ? (
              <>
                <Button variant="secondary" className="me-2" onClick={toggleEditMode}>
                  Cancelar
                </Button>
                <Button type="submit">Guardar Cambios</Button>
              </>
            ) : (
              <Button variant="primary" onClick={toggleEditMode}>
                Editar Información
              </Button>
            )}
          </div>
        </Form>
      </div>
    </div>
  );
}
