import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Navbar, Container, Nav, Button, Form, NavDropdown } from 'react-bootstrap'; // Importa los componentes de react-bootstrap
import { BiSearch } from 'react-icons/bi'; // Importa el ícono de búsqueda
import "./Header.css";
import '../../../index.css';
import SearchBar from './SearchBar/SearchBar';
import AuthButtons from './AuthButtons/AuthButtons';

export default function Header() {
    const [searchTerm, setSearchTerm] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState('');
    const [userNames, setUserNames] = useState('');

    useEffect(() => {
        // Verificar si hay un token almacenado en el localStorage
        const token = localStorage.getItem("token");
        if (token) {
            setLoggedIn(true);
            const role = localStorage.getItem("rol");
            setUserRole(role);
            const user = localStorage.getItem("user");
            setUserNames(user);
        }
    }, []);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('Buscar:', searchTerm);
        // Aquí puedes implementar la lógica para manejar la búsqueda
    };

    const handleLogout = () => {
        // Limpiar el localStorage y redirigir al usuario a la página de inicio
        localStorage.clear();
        setLoggedIn(false);
        setUserRole('');
        // Redireccionar a la página de inicio
        window.location.href = "/";
    };

    return (
        <Navbar expand="lg" className="bg-body-tertiary shadow fontHeader">
            <Container fluid>
                <Navbar.Brand>
                    <Link to="/">
                        <img
                            src="/natu_logo.png"
                            width="200"
                        />
                    </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                    >
                        {/* Header links por rol */}
                        {userRole === 'Comprador' ? (
                            <>
                                <Nav.Item>
                                    <Link className="nav-link" to="/products">Productos</Link>
                                </Nav.Item>
                                <NavDropdown title="Categorías" id="navbarScrollingDropdown">
                                    <NavDropdown.Item>
                                        <Link className="dropdown-item" to="/products/category/food">Alimentos</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        <Link className="dropdown-item" to="/products/category/personal-care">Cuidado personal</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item >
                                        <Link className="dropdown-item" to="/products/category/home">Productos para el hogar</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item >
                                        <Link className="dropdown-item" to="/products/category/supplements">Suplementos dietéticos</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item >
                                        <Link className="dropdown-item" to="/products/category/garden">Cuidado del jardín</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Item>
                                    <Link className='nav-link' to="/shopping" >Mis compras</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link className='nav-link' to="/about" >Nosotros</Link>
                                </Nav.Item>
                                &nbsp;
                                &nbsp;
                                <Nav.Item>
                                    <SearchBar 
                                        handleSubmit={handleSubmit}
                                        handleSearch={handleSearch}
                                        searchTerm={searchTerm}
                                    />
                                </Nav.Item>
                            </>
                        ) : userRole === 'Vendedor' ? (
                            <>
                                <Nav.Item>
                                    <Link className="nav-link" to="/seller/my-products">Mis productos</Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Link className='nav-link' to="/about" >Nosotros</Link>
                                </Nav.Item>
                            </>
                        ) : userRole === 'Administrador' ? (
                            <>
                                <Nav.Link href="/vendedores">Vendedores</Nav.Link>
                            </>
                        ) : (
                            <>
                                <Nav.Item>
                                    <Link className="nav-link" to="/products">Productos</Link>
                                </Nav.Item>
                                <NavDropdown title="Categorías" id="navbarScrollingDropdown">
                                    <NavDropdown.Item>
                                        <Link className="dropdown-item" to="/products/category/food">Alimentos</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item>
                                        <Link className="dropdown-item" to="/products/category/personal-care">Cuidado personal</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item >
                                        <Link className="dropdown-item" to="/products/category/home">Productos para el hogar</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item >
                                        <Link className="dropdown-item" to="/products/category/supplements">Suplementos dietéticos</Link>
                                    </NavDropdown.Item>
                                    <NavDropdown.Item >
                                        <Link className="dropdown-item" to="/products/category/garden">Cuidado del jardín</Link>
                                    </NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Item>
                                    <Link className='nav-link' to="/about" >Nosotros</Link>
                                </Nav.Item>
                                &nbsp;
                                &nbsp;
                                <Nav.Item>
                                    <SearchBar 
                                        handleSubmit={handleSubmit}
                                        handleSearch={handleSearch}
                                        searchTerm={searchTerm}
                                    />
                                </Nav.Item>
                            </>
                        )}
                    </Nav>
                    <Nav>
                        <AuthButtons 
                            loggedIn={loggedIn}
                            userNames={userNames}
                            handleLogout={handleLogout}
                        />
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}
