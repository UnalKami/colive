import React, { useState } from 'react';
import { Form, Button, Col, Row } from 'react-bootstrap';
import './Contact.css';

export default function Contact() {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        ciudad: '',
        amenidades: '',
        tipo: '',
        cantidad: ''
    });
    const [mensaje, setMensaje] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setValidated(true);
            return;
        }
        setValidated(true);

        // GraphQL mutation
        const mutation = `
            mutation RegistrarConjunto($input: ConjuntoInput!) {
                registrarConjunto(input: $input) {
                    id
                    nombre
                }
            }
        `;

        const variables = {
            input: {
                nombre: formData.nombre,
                direccion: formData.direccion,
                ciudad: formData.ciudad,
                amenidades: formData.amenidades.split(',').map(a => a.trim()),
                tipo: formData.tipo,
                cantidad: parseInt(formData.cantidad, 10)
            }
        };

        try {
            const response = await fetch(process.env.REACT_APP_API_URL + '/graphql', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: mutation, variables })
            });
            const result = await response.json();
            if (result.data && result.data.registrarConjunto) {
                setMensaje('¡Conjunto registrado exitosamente!');
                setFormData({
                    nombre: '',
                    direccion: '',
                    ciudad: '',
                    amenidades: '',
                    tipo: '',
                    cantidad: ''
                });
                setValidated(false);
            } else {
                setMensaje('Error al registrar el conjunto.');
            }
        } catch (error) {
            setMensaje('Error de conexión con el servidor.');
        }
    };

    return (
        <div className='register-container'>
            <div id="register-container">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <h3>Registrar Conjunto Residencial</h3>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationNombre">
                            <Form.Label>Nombre</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Nombre del conjunto"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese el nombre.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationDireccion">
                            <Form.Label>Dirección</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Dirección"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese la dirección.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationCiudad">
                            <Form.Label>Ciudad</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ciudad"
                                name="ciudad"
                                value={formData.ciudad}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese la ciudad.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationTipo">
                            <Form.Label>Tipo</Form.Label>
                            <Form.Control
                                as="select"
                                name="tipo"
                                value={formData.tipo}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccione...</option>
                                <option value="Apartamento">Apartamento</option>
                                <option value="Casa">Casa</option>
                                <option value="Mixto">Mixto</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                                Por favor seleccione el tipo.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row className="mb-3">
                        <Form.Group as={Col} md="6" controlId="validationAmenidades">
                            <Form.Label>Amenidades (separadas por coma)</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Piscina, Gimnasio, Parque, etc."
                                name="amenidades"
                                value={formData.amenidades}
                                onChange={handleChange}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese al menos una amenidad.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="6" controlId="validationCantidad">
                            <Form.Label>Cantidad de Unidades</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Cantidad"
                                name="cantidad"
                                value={formData.cantidad}
                                onChange={handleChange}
                                required
                                min={1}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese la cantidad.
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Button type="submit">Registrar</Button>
                    {mensaje && <div className="mt-3">{mensaje}</div>}
                </Form>
            </div>
        </div>
    );
}

