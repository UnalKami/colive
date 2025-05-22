import React, { useState, useEffect } from 'react';
import { Form, Button, Modal, Row, Col, InputGroup, Image } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Modals.css';

// Initial product object
const Product = {
    Nombre_producto: "",
    Ruta_img_producto: "",
    Descripcion_breve_producto: "",
    Descripcion_producto: "",
    Precio_producto: null,
    Cantidad_producto: null,
    Activo: true,
    CATEGORIA_ID_Categoria: null,
    VENDEDOR_ID_Vendedor: localStorage.getItem("id")
};

/**
 * Component for creating a new product.
 * @param {Object} props - The component props.
 * @returns {JSX.Element} - The JSX element representing the CreateProduct component.
 */
export default function CreateProduct(props) {
    const api_url = process.env.REACT_APP_API_URL;

    // State variables
    const [categories, setCategories] = useState([]); // Categories array
    const [product, setProduct] = useState(Product); // Product object
    const [selectedFile, setSelectedFile] = useState(null); // Selected file for image upload
    const [imagePreviewUrl, setImagePreviewUrl] = useState(''); // Image preview URL
    const [validated, setValidated] = useState(false); // Form validation flag

    // Fetch categories from API on component mount
    useEffect(() => {
        fetch(`${api_url}/categorias`)
            .then(response => response.json())
            .then(data => setCategories(data.body));
    }, [api_url]);

    // Handle file change for image upload
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const allowedExtensions = /(\.jpg|\.jpeg|\.png)$/i; // Regular expression for allowed extensions

        // Check if the file has a valid extension
        if (!allowedExtensions.test(file.name)) {
            toast.error("Por favor seleccione una imagen con una extensión válida (jpg, jpeg, png)");
            return;
        }

        setSelectedFile(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (!selectedFile) {
            toast.error("Por favor suba una imagen");
            return;
        }

        if (form.checkValidity() === false) {
            event.stopPropagation();
        } else {
            let uploadedImageUrl = '';
            if (selectedFile) {
                const formData = new FormData();
                formData.append('image', selectedFile);

                try {
                    const response = await fetch(`https://api.imgbb.com/1/upload?key=232d375012e53c9d277542e8f7cea814`, {
                        method: 'POST',
                        body: formData,
                    });

                    const data = await response.json();
                    uploadedImageUrl = data.data.url;
                } catch (error) {
                    console.error('Error uploading the image:', error);
                    toast.error("Error al subir la imagen");
                    return;
                }
            }

            const updatedProduct = { ...product, Ruta_img_producto: uploadedImageUrl };

            fetch(`${api_url}/productos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(updatedProduct)
            })
                .then(response => response.json())
                .then(data => {
                    if (data.error === false) {
                        toast.success("Producto creado exitosamente");
                        setProduct(Product);
                        setSelectedFile(null);
                        setImagePreviewUrl('');
                    } else {
                        toast.error("Error al crear el producto");
                    }
                });
        }
        setValidated(true);
    };

    return (
        <Modal
            {...props}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Crear y publicar Producto
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row>
                        <Form.Group as={Col} md="8" controlId="validationCustom01" className="mb-3">
                            <Form.Label>Nombre del producto</Form.Label>
                            <Form.Control 
                                type="text"
                                maxLength={50}
                                placeholder="Nombre del producto"
                                value={product.Nombre_producto}
                                required
                                onChange={(e) => setProduct({...product, Nombre_producto: e.target.value})}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese un nombre valido
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="4" controlId="validationCustom02" className="mb-3">
                            <Form.Label>Precio</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type="number"
                                    placeholder="Precio"
                                    value={product.Precio_producto}
                                    required
                                    onChange={(e) => setProduct({ ...product, Precio_producto: e.target.value })}
                                />
                                <InputGroup.Text>$</InputGroup.Text>
                            </InputGroup>
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese un precio valido
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} md="4" controlId="validationCustom03" className="mb-3">
                            <Form.Label>Cantidad</Form.Label>
                            <Form.Control 
                                type="number"
                                placeholder="Cantidad"
                                value={product.Cantidad_producto}
                                required
                                onChange={(e) => setProduct({...product, Cantidad_producto: e.target.value})}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese una cantidad valida
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group as={Col} md="8" controlId="validationCustom04" className="mb-3">
                            <Form.Label>Categoría</Form.Label>
                            <Form.Select 
                                required
                                value={product.CATEGORIA_ID_Categoria}
                                onChange={(e) => setProduct({...product, CATEGORIA_ID_Categoria: e.target.value})}
                            >
                                <option value={null}>Seleccione una categoría</option>
                                {categories.map(category => (
                                    <option key={category.ID_Categoria} value={category.ID_Categoria}>{category.Nombre_Categoria}</option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Por favor seleccione una categoria
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Form.Group as={Col} controlId="validationCustom05" className="mb-3">
                            <Form.Label>Descripcion breve (Max 50 char)</Form.Label>
                            <Form.Control 
                                type="text"
                                maxLength={50}
                                placeholder="Descripcion breve"
                                value={product.Descripcion_breve_producto}
                                required
                                onChange={(e) => setProduct({...product, Descripcion_breve_producto: e.target.value})}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese una descripcion breve valida
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <Row>
                        <Col>
                            <Form.Group controlId="formFile" className="mb-3">
                                <Form.Label>Imagen</Form.Label>
                                <Form.Control 
                                    type="file" 
                                    onChange={handleFileChange} 
                                    accept=".jpg, .jpeg, .png" // Limitar a extensiones de imágenes
                                />
                                {imagePreviewUrl && (
                                    <div className="image-preview-container">
                                        <Image src={imagePreviewUrl} alt="Uploaded" fluid className="image-preview" />
                                    </div>
                                )}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Form.Group as={Col} controlId="validationCustom07" className="mb-3">
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control 
                                as="textarea"
                                rows={3}
                                placeholder="Descripcion"
                                value={product.Descripcion_producto}
                                required
                                onChange={(e) => setProduct({...product, Descripcion_producto: e.target.value})}
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor ingrese una descripcion valida
                            </Form.Control.Feedback>
                        </Form.Group>
                    </Row>
                    <div className="text-center">
                        <Form.Group className="mb-3" controlId="validationCustom08">
                            <Form.Check 
                                type="switch"
                                id="custom-switch"
                                label="Activo"
                                checked={product.Activo}
                                onChange={(e) => setProduct({...product, Activo: e.target.checked})}
                            />
                        </Form.Group>
                        <Button type="submit" className="mt-2" variant='success' size='lg'>
                            Publicar
                        </Button>
                    </div>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onHide} variant='outline-danger'>Cerrar</Button>
            </Modal.Footer>

            <ToastContainer />
        </Modal>
    );
}
