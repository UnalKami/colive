import React, { useState } from 'react';
import { BiSearch } from 'react-icons/bi';
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './SearchBar.css';

export default function SearchBar({ handleSubmit, handleSearch, searchTerm }) {
    
    return (
        <Form className="d-flex" onSubmit={handleSubmit} style={{flexGrow:"1"}}>
            <Form.Control
                type="search"
                placeholder="Buscar ..."
                className="me-3"
                aria-label="Search"
                value={searchTerm}
                onChange={handleSearch}
            />
            <Link to={`/products/search/${searchTerm}`}>
                <Button variant="outline-success">
                    <BiSearch />
                </Button>
            </Link>
        </Form>
    );
}
