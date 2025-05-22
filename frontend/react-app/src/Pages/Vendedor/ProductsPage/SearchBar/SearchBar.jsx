import React from 'react';
import { Form, FormControl, Button, Row, InputGroup } from 'react-bootstrap';
import "../ProductsPage.css";

export default function SearchBar() {
    return (
        <Form className='search-bar'>
                <InputGroup>
                    <FormControl type="text" placeholder="Buscar productos" className="mr-sm-2" />
                    <Button variant="success">Buscar <i class="bi bi-search"></i></Button>
                </InputGroup>
        </Form>
    );
}
