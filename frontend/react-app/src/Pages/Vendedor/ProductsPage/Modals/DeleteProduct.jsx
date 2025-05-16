import React from 'react';
import { Button, Modal } from 'react-bootstrap';

/**
 * Component for deleting a product.
 * @param {Object} props - The component props.
 * @param {number} props.id - The ID of the product to delete.
 * @param {boolean} props.show - Flag indicating whether the modal is shown or hidden.
 * @param {function} props.onHide - Function to handle hiding the modal.
 * @returns {JSX.Element} The delete product modal component.
 */
export default function DeleteProduct({ id, show, onHide }) {
    const api_url = process.env.REACT_APP_API_URL;

    const handleDeleteProduct = () => {
        fetch (`${api_url}/productos/${id}`, {
            method: 'DELETE',
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
                window.location.reload();
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
                <Modal.Title>Eliminar producto</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>¿Estás seguro de que deseas eliminar este producto?</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleDeleteProduct}>
                    Eliminar
                </Button>
            </Modal.Footer>
        </Modal>
    );
}