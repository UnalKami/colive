import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Modal, Row, Col } from 'react-bootstrap';
//import { create } from '@mui/material/styles/createTransitions';


export default function Crear() {
    const [Nombres_vendedor, setNombre] = useState('');
    const [Direccion_vendedor, setDireccion] = useState('');
    const [Descripcion_adicional, setDescripcion] = useState('');
    const [Departamento_ID_Departamento, setDepartamento] = useState('');
    const [MUNICIPIO_ID_Municipio, setMunicipio] = useState('');
    const [Correo_usuario, setCorreo] = useState('');
    const [Contraseña_encriptada, setContraseña] = useState('');
    
    const[Departamentos, setDepartamentos] = useState([]);
    const[Municipios, setMunicipios] = useState([]);

    const api_url = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetch(`${api_url}/departamentos`)
        .then(response => response.json())
        .then(data => setDepartamentos(data.body))
    }
    , []);

    useEffect(() => {
        if (Departamento_ID_Departamento !== null && Departamento_ID_Departamento !== '') {
            fetch(`${api_url}/municipios/filter/${Departamento_ID_Departamento}`)
            .then(response => response.json())
            .then(data => setMunicipios(data.body))
        } else {
            fetch(`${api_url}/municipios`)
            .then(response => response.json())
            .then(data => setMunicipios(data.body))
        }
    }
    , [Departamento_ID_Departamento]);

    const createVendedor = async (e) => {
        e.preventDefault();
        alert('Creando vendedor');
        toast.info('Creando vendedor');
        const res = await fetch(`${api_url}/vendedores`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                Nombres_vendedor,
                Direccion_vendedor,
                Descripcion_adicional,
                MUNICIPIO_ID_Municipio,
                Correo_usuario,
                Contraseña_encriptada
            })
        });
        const data = await res.json();
        if (data.status === 200) {
            alert(data.body);
            toast.success(data.body);
        } else {
            alert(data.body);
            toast.error(data.body);
        }
    }



    return (
        <div>
            <ToastContainer position='bottom-right'/>
            <Form onSubmit={createVendedor}>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Nombre
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="Nombre" onChange={(e) => setNombre(e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Dirección
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="Dirección" onChange={(e) => setDireccion(e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Descripción
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="text" placeholder="Descripción" onChange={(e) => setDescripcion(e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Departamento
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Select onChange={(e) => setDepartamento(e.target.value)}>
                            <option>Seleccione un departamento</option>
                            {Departamentos.map((departamento) => (
                                <option value={departamento.ID_Departamento}>{departamento.Nombre_departamento}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Municipio
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Select onChange={(e) => setMunicipio(e.target.value)}>
                            <option>Seleccione un municipio</option>
                            {Municipios.map((municipio) => (
                                <option value={municipio.ID_Municipio}>{municipio.Nombre_municipio}</option>
                            ))}
                        </Form.Select>
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Correo
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="email" placeholder="Correo" onChange={(e) => setCorreo(e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
                    <Form.Label column sm={2}>
                        Contraseña
                    </Form.Label>
                    <Col sm={10}>
                        <Form.Control type="password" placeholder="Contraseña" onChange={(e) => setContraseña(e.target.value)} />
                    </Col>
                </Form.Group>
                <Form.Group as={Row} className="mb-3">
                    <Col sm={{ span: 10, offset: 2 }}>
                        <Button type="submit">Crear</Button>
                    </Col>
                </Form.Group>
            </Form>

        </div>
    );
}
