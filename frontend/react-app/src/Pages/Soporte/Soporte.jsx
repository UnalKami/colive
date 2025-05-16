import React, { useState } from 'react';
import './Soporte.css'; // Asegúrate de que la ruta del archivo CSS sea correcta
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
//import ReactQuill from 'react-quill';
//import 'react-quill/dist/quill.snow.css';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Row from 'react-bootstrap/Row';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//import Quill from 'quill';
import ImageCompress from 'quill-image-compress'; // Importar quill-image-compress

//Quill.register('modules/imageCompress', ImageCompress); // Registrar quill-image-compress

export default function Soporte() {
    const api_url = null;
    // const api_url = process.env.REACT_APP_API_URL;

    //--- Valores de los campos del formulario de soporte ---//

    const [Documento, setDocumento] = useState('');
    const [Email, setEmail] = useState('');
    const [Descripcion, setDescripcion] = useState('');
    const [content, setContent] = useState('');
    const [validated, setValidated] = useState(false);

    
    //--- Función para enviar el formulario de soporte ---//

    const handleSubmit = async (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault();
            const data = {
                Documento: Documento,
                Email: Email,
                Descripcion: Descripcion,
                content: content
            };
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            };
            const response = await fetch(`${api_url}/soporte`, requestOptions);
            const res = await response.json();
            if (res.status === 'success') {
                toast.success(res.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
                setDocumento('');
                setEmail('');
                setDescripcion('');
                setContent('');
                setValidated(false);
            } else {
                toast.error(res.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            }
        }
        setValidated(true);
    }
    

    return (
        <div className='register-container-2'>
            <ToastContainer position='bottom-right' />
            <div id="register-container" className="content-container">
                <img src="Banner.png" alt="image" id='banner-image'/>
                <p style={{textAlign:"justify"}}>
                En NATU Tienda Orgánica, estamos comprometidos con ofrecerte la mejor experiencia de compra. Si tienes alguna pregunta, inquietud o necesitas asistencia con tu pedido, no dudes en contactarnos. Nuestro equipo de atención al cliente está aquí para ayudarte.
                Ya sea que necesites información sobre nuestros productos, ayuda con tu cuenta o asistencia con un pedido, puedes comunicarte con nosotros a través de nuestro formulario de contacto o llamándonos al número proporcionado en nuestra página de contacto.
                Estamos disponibles para atenderte de lunes a viernes, de 9:00 a.m. a 6:00 p.m. ¡Esperamos poder asistirte pronto!
                </p>
            </div>       
            <div id="register-container" style={{marginBlock:"0px"}}>
                <Form noValidate validated={validated} onSubmit={handleSubmit} id='register-form'>
                    <h3>Solicitud</h3>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="4" controlId="validationDocumento">
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

                        <Form.Group as={Col} md="8" controlId="validationEmail">
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
                        <Form.Group as={Col} md="12" controlId="validationDescripcion">
                            <Form.Label>Asunto</Form.Label>
                            <Form.Control
                                maxLength={45}
                                type="text"
                                placeholder="Descripcion"
                                value={Descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">Por favor ingresa tu Descripcion.</Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="12" controlId="validationContent">
                            <Form.Label>Cuéntanos sobre tu solicitud</Form.Label>
 {/* //                           <ReactQuill
                                theme="snow"
                                value={content}
                                onChange={setContent}
                                className='dp-inputComment'
                                placeholder="Cuéntanos más sobre tu solicitud..."
                                modules={{
                                    toolbar: [
                                        [{ 'header': '1' }, { 'header': '2' }],
                                        ['bold', 'italic'],
                                        ['link', 'image'],
                                        ['clean'],
                                    ],
                                    imageCompress: {
                                        quality: 0.5,
                                        maxWidth: 400,
                                        maxHeight: 400,
                                        imageType: 'image/jpeg'
                                    }
                                }}
                            /> */}
                        </Form.Group>
                    </Row>
                    <Button type="submit" variant="outline-success" size="lg" className="submit-button">Enviar</Button>
                </Form>
            </div>
        </div>
    );
}
