import React, { useState } from 'react';
import { Card, Button, Row, Col } from 'react-bootstrap';
import "../ProductsPage.css";

import EditProduct from '../Modals/EditProduct';
import DeleteProduct from '../Modals/DeleteProduct';
import HideProduct from '../Modals/HideProduct';


/**
 * Renders a grid of products.
 * 
 * @param {Object[]} products - The array of products to display.
 * @param {Function} reloadPage - The function to reload the page.
 * @returns {JSX.Element} The grid of products.
 */
export default function GridProducts({products, reloadPage}) {
    const [modalShow, setModalShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [hideShow, setHideShow] = useState(false);

    const [selectedProduct, setSelectedProduct] = useState({});

    return (
        <Row style={{width:"100%"}}>
            {products.map(product => (
                <Col key={product.ID_Producto} xs={12} sm={6} md={4} lg={3}>
                    <Card className="mb-4" id='item-product'>
                        <div className="card-img-container">
                            <Card.Img variant="top" src={product.Ruta_img_producto} className="card-img" />
                        </div>
                        <Card.Body align="center">
                            <Card.Title>{product.Nombre_producto}</Card.Title>
                            <Card.Text>{product.Descripcion_breve_producto}</Card.Text>
                            <Card.Text>Precio: ${product.Precio_producto}</Card.Text>
                            <Card.Text>Cantidad: {product.Cantidad_producto}</Card.Text>
                            <Button className='mb-1' variant="outline-success" size="sm" 
                                onClick={() => {
                                    setModalShow(true)
                                    setSelectedProduct(product)
                                }}
                            >
                                Editar
                                <i class="bi bi-pencil-fill"></i>
                            </Button>
                            &nbsp;
                            <Button className='mb-1' variant="outline-danger" size="sm" 
                                onClick={() => {
                                    setDeleteShow(true);
                                    setSelectedProduct(product);
                                }}
                            >
                                Eliminar
                                <i class="bi bi-trash3-fill"></i>
                            </Button>
                            &nbsp;
                            <Button className='mb-1' variant="outline-primary" size="sm"
                                onClick={() => {
                                    setHideShow(true);
                                    setSelectedProduct(product);
                                }}
                            >
                                {
                                    product.Activo === 1 ? (
                                        <>
                                            <span>Pausar</span>
                                            <i class="bi bi-eye-slash-fill"></i>
                                        </>
                                    ) : (
                                        <>
                                            <span>Mostrar</span>
                                            <i class="bi bi-eye-fill"></i>
                                        </>
                                    )
                                }
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
            <EditProduct producto={selectedProduct} show={modalShow} onHide={() => setModalShow(false)} reloadPage={reloadPage} className="modals"/>
            <DeleteProduct id={selectedProduct.ID_Producto} show={deleteShow} onHide={() => setDeleteShow(false)} className="modals"/>
            <HideProduct producto={selectedProduct} show={hideShow} onHide={() => setHideShow(false)} reloadPage={reloadPage} className="modals"/>
        </Row>
    );
}