import React, {useEffect, useState} from 'react';
import '../Register.css'; // Asegúrate de que la ruta del archivo CSS sea correcta
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import Modal from 'react-bootstrap/Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TerminosCondiciones from '../TerminosCondiciones/TerminosCondiciones';

/**
 * @file Register.jsx
 * @desc This file contains the Register component, which is responsible for rendering and handling the registration form.
 */
export default function RegisterBuyer() {
    const api_url = process.env.REACT_APP_API_URL;

    //--- Valores de los campos del formulario de registro ---//

    // Datos Personales
    const [Nombres, setNombres] = useState(''); // Agregué el estado Nombres
    const [Apellidos, setApellidos] = useState(''); // Agregué el estado Apellidos
    const [Documento, setDocumento] = useState(null); // Agregué el estado Documento
    const [Email, setEmail] = useState(''); // Agregué el estado Email
    const [Telefono, setTelefono] = useState(null); // Agregué el estado Telefono
    const [FechaNacimiento, setFechaNacimiento] = useState(null); // Agregué el estado FechaNacimiento

    // Datos de la Dirección

    const [Departamento, setDepartamento] = useState(''); // Agregué el estado Departamento
    const [Municipio, setMunicipio] = useState(''); // Agregué el estado Municipio
    const [Direccion, setDireccion] = useState(''); // Agregué el estado Direccion
    const [Descripcion, setDescripcion] = useState(''); // Agregué el estado Descripcion

    // Estados para las contraseñas y la confirmación de contraseña
    const [Password, setPassword] = useState('');
    const [ConfirmPassword, setConfirmPassword] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState(false);
    

    // Define un estado para controlar si el modal de términos y condiciones está abierto o cerrado
    const [showTermsModal, setShowTermsModal] = useState(false);

    // Función para abrir el modal de términos y condiciones
    const handleShowTermsModal = () => setShowTermsModal(true);

    // Función para cerrar el modal de términos y condiciones
    const handleCloseTermsModal = () => setShowTermsModal(false);

    //-- Traer Departamentos y Municipios --//

    // Traer Departamentos
    const [Departamentos, setDepartamentos] = useState([]); // Agregué el estado Departamentos

    useEffect(() => {
        fetch(`${api_url}/departamentos`)
        .then(response => response.json())
        .then(data => setDepartamentos(data.body))
    }
    , []);


    // Traer Municipios, según el Departamento seleccionado, si es que se selecciona alguno, de lo contrario traer todos los Municipios
    const [Municipios, setMunicipios] = useState([]); // Agregué el estado Municipios

    
    useEffect(() => {
        if (Departamento !== '') {
            fetch(`${api_url}/municipios/filter/${Departamento}`)
            .then(response => response.json())
            .then(data => setMunicipios(data.body))
        } else {
            fetch(`${api_url}/municipios`)
            .then(response => response.json())
            .then(data => setMunicipios(data.body))
        }
    }
    , [Departamento]);


    //--- Validación de los campos del formulario de registro ---//

    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        setValidated(true);

        if (form.checkValidity() === true && !confirmPasswordError) {
            registerUser();
        }
    };

    // Estado para la validación de la contraseña
    const [passwordValidation, setPasswordValidation] = useState({
        minLength: false,
        hasLetter: false,
        hasNumber: false,
        hasUpperCase: false,
        hasSpecialChar: false
    });

    // Función para validar la contraseña
    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/;
        setPasswordValidation({
            minLength: password.length >= 6,
            hasLetter: /[a-zA-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasUpperCase: /[A-Z]/.test(password),
            hasSpecialChar: /[@$!%*#?&-_]/.test(password)
        });
    };

    // Función para manejar el cambio en el campo de contraseña
    const handlePasswordChange = (e) => {
        const newPassword = e.target.value;
        setPassword(newPassword);
        validatePassword(newPassword);
    };

    // Función para manejar el cambio en el campo de confirmación de contraseña
    const handleConfirmPasswordChange = (e) => {
        const newConfirmPassword = e.target.value;
        setConfirmPassword(newConfirmPassword);
        setConfirmPasswordError(newConfirmPassword !== Password);
    };

    // Función para determinar si la contraseña es válida
    const isPasswordValid = () => {
        return (
            passwordValidation.minLength &&
            passwordValidation.hasLetter &&
            passwordValidation.hasNumber &&
            passwordValidation.hasUpperCase &&
            passwordValidation.hasSpecialChar
        );
    };

    // Función para mostrar el mensaje de retroalimentación de la validación de la contraseña
    const renderPasswordValidationFeedback = () => {
        const { minLength, hasLetter, hasNumber, hasUpperCase, hasSpecialChar } = passwordValidation;
        if (!minLength) return 'La contraseña debe tener al menos 6 caracteres.';
        if (!hasLetter) return 'La contraseña debe contener al menos una letra.';
        if (!hasNumber) return 'La contraseña debe contener al menos un número.';
        if (!hasUpperCase) return 'La contraseña debe contener al menos una letra mayúscula.';
        if (!hasSpecialChar) return 'La contraseña debe contener al menos un carácter especial (@$!%*#?&-_).';
        return null;
    };


    //-- Conexion con la API para el registro de un usuario --//

    const registerUser = async () => {
        const data = {
            Nombres_comprador: Nombres,
            Apellidos_comprador: Apellidos,
            Documento_comprador: Documento,
            Correo_usuario: Email,
            Telefono_comprador: Telefono,
            Fecha_nacimiento_comprador: FechaNacimiento,
            MUNICIPIO_ID_Municipio: Municipio,
            Direccion: Direccion,
            Descripcion_adicional: Descripcion,
            Contraseña_encriptada: Password
        };

        const response = await fetch(`${api_url}/compradores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();
        if (responseData.error) {
            if(responseData.body.includes("Duplicate entry")) {
                toast.error("El correo electrónico ya está registrado.");
            } else {
                toast.error(responseData.body);
            }
        } else {
            toast.success("Usuario registrado exitosamente.");
        }

        console.log(responseData);
    }



    return (
        <div className='register-container'>
            <ToastContainer position='bottom-right'/>
            {/* Scripts */}
            <div id="background1">
                <div id="shape1" />
                <div id="shape1" />
            </div>
            <div id="register-container">
                <img src="Natu_Logo_.png" alt="image" />
                <Form noValidate validated={validated} onSubmit={handleSubmit} id='register-form'>
                    <h3 >Datos Personales</h3>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustom01">
                            <Form.Label>Nombres</Form.Label>
                            <Form.Control
                                maxLength={60}
                                required
                                type="text"
                                placeholder="Nombres"
                                value={Nombres}
                                onChange={(e) => setNombres(e.target.value)}
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
                            />
                            <Form.Control.Feedback type="invalid">Por favor selecciona tu fecha de nacimiento.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <h3 >Datos de la Dirección</h3>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustom06">
                            <Form.Label>Departamento</Form.Label>
                            <Form.Select
                                required
                                value={Departamento}
                                onChange={(e) => setDepartamento(e.target.value)}
                            >
                                <option value="" style={{color: ""}}>Selecciona un departamento</option>
                                {Departamentos.map((departamento) => (
                                    <option key={departamento.ID_Departamento} value={departamento.ID_Departamento}>{departamento.Nombre_departamento}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Por favor selecciona un departamento.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustom07">
                            <Form.Label>Ciudad o Municipio</Form.Label>
                            <Form.Select
                                required
                                value={Municipio}
                                onChange={(e) => setMunicipio(e.target.value)}
                            >
                                <option value="">Selecciona un municipio</option>
                                {Municipios.map((municipio) => (
                                    <option key={municipio.ID_Municipio} value={municipio.ID_Municipio}>{municipio.Nombre_municipio}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">Por favor selecciona un municipio.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCustom08">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                maxLength={45}
                                type="text"
                                placeholder="Dirección"
                                value={Direccion}
                                onChange={(e) => setDireccion(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Por favor ingresa tu dirección.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCustom09">
                            <Form.Label>Descripción adicional</Form.Label>
                            <Form.Control
                                maxLength={100}
                                as="textarea"
                                placeholder="Descripción"
                                value={Descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </Form.Group>
                    </Row>
                    <h3 >Datos de la Cuenta</h3>
                        <Row className="mb-3">
                            <Form.Group as={Col} md="6" controlId="validationCustom10">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    maxLength={100}
                                    type="password"
                                    placeholder="Contraseña"
                                    value={Password}
                                    onChange={handlePasswordChange}
                                    
                                    isInvalid={!isPasswordValid()}
                                />
                                <Form.Control.Feedback type="invalid">
                                    {renderPasswordValidationFeedback()}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group as={Col} md="6" controlId="validationCustom11">
                                <Form.Label>Confirmar Contraseña</Form.Label>
                                <Form.Control
                                    maxLength={100}
                                    type="password"
                                    placeholder="Confirmar Contraseña"
                                    value={ConfirmPassword}
                                    onChange={handleConfirmPasswordChange}
                                    required
                                    isInvalid={confirmPasswordError}
                                />
                                <Form.Control.Feedback type="invalid">
                                    La confirmación de contraseña no coincide.
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Row>
                    <div style={{display:"flex", flexDirection:"column" , alignItems:"center", justifyContent: "center", width: "100%", marginTop: "50px"}}>
                        <Form.Group className="mb-3" style={{display:"flex", flexDirection:"row", justifyContent:"center", alignCenter:"center", }}>
                            <Form.Check
                            required
                            label="Aceptar "
                            feedback="Debes aceptar los términos y condiciones."
                            feedbackType="invalid"
                            />
                            &nbsp;
                            <a href="#" onClick={handleShowTermsModal}>términos y condiciones</a>
                        </Form.Group>
                        <Button type="submit" variant="outline-success" size="lg">Registrarse</Button>
                    </div>
                </Form>
            </div>
            <Modal 
                show={showTermsModal} 
                onHide={handleCloseTermsModal}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                    <Modal.Title>Términos y Condiciones</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <TerminosCondiciones />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTermsModal}>
                    Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
