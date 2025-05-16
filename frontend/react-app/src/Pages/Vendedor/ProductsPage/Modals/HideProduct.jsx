import React, { useState, useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

/**
 * Component for hiding or unhiding a product.
 * @param {Object} props - The component props.
 * @param {Object} props.producto - The product object.
 * @param {boolean} props.show - Flag indicating whether the modal is visible.
 * @param {Function} props.reloadPage - Function to reload the page.
 * @param {Function} props.onHide - Function to hide the modal.
 * @returns {JSX.Element} The HideProduct component.
 */
export default function HideProduct({ producto, show, reloadPage, onHide }) {
    const api_url = process.env.REACT_APP_API_URL;

    const [product, setProduct] = useState({});

    useEffect(() => {
        // Update the product state when the "producto" prop changes
        setProduct(producto);
    }, [producto]);

    const mensaje = product.Activo === 1 ? 'pausar' : 'reanudar';

    /**
     * Handles hiding or unhiding the product.
     */
    const handleHideProduct = () => {
        fetch (`${api_url}/productos/ocultar/${product.ID_Producto}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            if (data.error === false) {
                onHide();
                reloadPage();
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
    }

    return (
        <Modal
            show={show}
            onHide={onHide}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>Cambiar visualización de producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que deseas {mensaje}  la visualización de este producto?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleHideProduct}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}