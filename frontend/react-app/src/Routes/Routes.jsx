import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from '../Pages/Home/Home.jsx';
import ProductDet from '../Pages/Product/ProductDet.jsx';
import Register from '../Pages/Register/Register.jsx';
import RegisterAdmin from "../Pages/Register/Admin/RegisterAdmin.jsx";
import RegisterUser from "../Pages/Register/User/RegisterUser.jsx";
import Login from '../Pages/Login/Login.jsx';
import Layout from '../Pages/Layout/Layout.jsx';
import Reset from '../Pages/Recover/Reset.jsx';
import ProductosVista from '../Pages/Catalog/ProductosVista.jsx';
import ProductosCategoria from '../Pages/Catalog/ProductosCategoria.jsx';
import ProductosBusqueda from '../Pages/Catalog/ProductosBusqueda.jsx';
import About from '../Pages/About/About.jsx';

import Admin from '../Pages/Admin/Admin.jsx';

import VendedorProducts from '../Pages/Vendedor/ProductsPage/ProductsPage.jsx';
import PrivateRoute from '../utils/PrivateRoute.jsx';
import NotFound from "../Pages/NotFound/NotFound.jsx";
//import VistaCarrito from "../Pages/VistaCarrito/VistaCarrito.jsx";
import User from "../Pages/Perfiles/User.jsx";
import Admins from "../Pages/Perfiles/Admins.jsx";
import Shopping  from "../Pages/Shopping/Shopping.jsx";
import Sales  from "../Pages/Sales/Sales.jsx";
import Soporte  from "../Pages/Soporte/Soporte.jsx";
import Contact  from "../Pages/Contact/Contact.jsx";
import Encuesta from "../Pages/Encuesta/Encuesta.jsx";
import Preguntas from "../Pages/Preguntas/Preguntas.jsx";


import Campo from "../Pages/Home/Beneficios/Campo.jsx";
import Locales from "../Pages/Home/Beneficios/Locales.jsx";
import Saludables from "../Pages/Home/Beneficios/Saludables.jsx";
import Frescos from "../Pages/Home/Beneficios/Frescos.jsx";
import Nutritivos from "../Pages/Home/Beneficios/Nutritivos.jsx";
import Prevenir from "../Pages/Home/Beneficios/Prevenir.jsx";


import Carrito from "../Pages/Carrito/Carrito.jsx";
import Checkout from "../Pages/Carrito/Checkout/Checkout.jsx";

export default function Routing() {


  return (
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Layout />} >
            <Route path="/" element={<About />} />
            <Route path="productDet/:id" element={<ProductDet />} />
            <Route path="register" element={<Register />} />
            <Route path="register-admin" element={<RegisterAdmin />} />
            <Route path="register-user" element={<RegisterUser />} />
            <Route path="login" element={<Login />} />
            <Route path="reset" element={<Reset />} />
            <Route path="products" element={<ProductosVista />} />
            <Route path="products/category/:category" element={<ProductosCategoria />} />
            <Route path="products/search/:searchTerm" element={<ProductosBusqueda />} />
            <Route path="about" element={<About />} />
            <Route path="admin" element={<Admin />} />
            <Route path="cart" element={<Carrito />} />
            <Route path="checkout" element={<Checkout />} />

            <Route path="user" element={<User />} />
            <Route path="admins" element={<Admins />} />
            <Route path="Preguntas" element={<Preguntas/>}/>
           
            <Route path="campo" element={<Campo />} />
            <Route path="locales" element={<Locales />} />
            <Route path="saludables" element={<Saludables />} />
            <Route path="frescos" element={<Frescos />} />
            <Route path="nutritivos" element={<Nutritivos />} />
            <Route path="prevenir" element={<Prevenir />} />
           
            {/* Rutas protegidas */}
            <Route path="seller" element = {<PrivateRoute roles={["Vendedor"]} />}>
              <Route path="my-products" element={<VendedorProducts />} exact/>
            </Route>
            {/* Ruta no encontrada */}
            <Route path="*" element={<NotFound />} />
            <Route path="shopping" element={<Shopping />} />
            <Route path="Soporte" element={<Soporte />} />
            <Route path="Contact" element={<Contact />} />
            <Route path="Sales" element={<Sales />} />
            <Route path="Encuesta" element={<Encuesta />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}
