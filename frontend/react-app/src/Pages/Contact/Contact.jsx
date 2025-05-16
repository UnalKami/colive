import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import './Contact.css';

export default function Contact() {
    const [validated, setValidated] = useState(false);

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }
        setValidated(true);
    };

    return (
        <div className='register-container'>
        <div id="register-container">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <h3>Contáctenos</h3>
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationName">
                        <Form.Label>Nombre Completo</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Nombre Completo"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor ingrese su nombre completo.
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group as={Col} md="6" controlId="validationEmail">
                        <Form.Label>Correo Electrónico</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Correo Electrónico"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor ingrese un correo electrónico válido.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationPhone">
                        <Form.Label>Número de Teléfono</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Número de Teléfono"
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6" controlId="validationSubject">
                        <Form.Label>Asunto</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Asunto"
                            required
                        />
                        <Form.Control.Feedback type="invalid">
                            Por favor ingrese el asunto.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                
                <Row className="mb-3">
                    <Form.Group as={Col} md="6" controlId="validationOrderNumber">
                        <Form.Label>Número de Pedido</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Número de Pedido"
                        />
                    </Form.Group>

                    <Form.Group as={Col} md="6" controlId="validationQueryType">
                        <Form.Label>Tipo de Consulta</Form.Label>
                        <Form.Control
                            as="select"
                            required
                        >
                            <option value="">Seleccione...</option>
                            <option>Problemas con el pago</option>
                            <option>Problemas de envío</option>
                            <option>Producto defectuoso</option>
                            <option>Consultas generales</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Por favor seleccione el tipo de consulta.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Row>
                
                <Form.Group className="mb-3" controlId="validationDescription">
                    <Form.Label>Descripción del Problema/Consulta</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        required
                    />
                    <Form.Control.Feedback type="invalid">
                        Por favor describa su problema o consulta.
                    </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="validationFile">
                    <Form.Label>Adjuntar Archivos</Form.Label>
                    <Form.Control
                        type="file"
                    />
                </Form.Group>
                
                <Form.Group className="mb-3" controlId="validationConsent">
                    <Form.Check
                        required
                        label="Acepto la política de privacidad y el almacenamiento de mis datos."
                        feedback="Debe aceptar antes de enviar."
                        feedbackType="invalid"
                    />
                </Form.Group>

                <Button type="submit">Enviar</Button>
            </Form>
        </div>
    </div>
    );
}

