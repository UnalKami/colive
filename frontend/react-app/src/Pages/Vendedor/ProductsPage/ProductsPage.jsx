import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import './ProductsPage.css';
// Import components
import SearchBar from './SearchBar/SearchBar';
import GridProducts from './GridProducts/GridProducts';
import CreateProduct from './Modals/CreateProduct';




/**
 * Represents the ProductsPage component.
 * @component
 */
export default function ProductsPage() {
    const api_url = process.env.REACT_APP_API_URL;

    const [reload, setReload] = useState(false);

    /**
     * Reloads the page by toggling the 'reload' state.
     */
    const reloadPage = () => {
        setReload(!reload);
    }

    const [modalShow, setModalShow] = useState(false);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Fetch products from API
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }

        fetch(`${api_url}/productos/vendedor/${localStorage.getItem('id')}`, {
            method: 'GET',
            headers: headers
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.error === false) {
                setProducts(data.body);
            }
            else {
                console.error('Error:', data.error);
                if (data.body === 'jwt expired') {
                    localStorage.clear();
                    window.location.href = '/login';
                }
                return;
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
    , [reload]);

    return (
        <div className='seller-product-page'>
            <div className='seller-product-container'>
                <h1>Mis productos</h1>
                <SearchBar/>
                <Button 
                    variant="success" 
                    className="mb-4" 
                    size="lg" 
                    onClick={() => setModalShow(true)}
                >
                    Publicar producto
                    &nbsp;
                    <i class="bi bi-plus-square"></i>
                </Button>
                <GridProducts products={products} reloadPage={reloadPage}/>
            </div>
            <CreateProduct show={modalShow} onHide={() => setModalShow(false)} className="modals"/>
        </div>
    );
}
