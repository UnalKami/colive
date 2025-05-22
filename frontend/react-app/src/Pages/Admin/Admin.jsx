import React, { useState, useEffect } from 'react';
import { TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Paper, TablePagination, Checkbox, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@mui/material';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';

import 'react-toastify/dist/ReactToastify.css';
import { toast, ToastContainer } from 'react-toastify';

import './Admin.css';

// Importar componentes de la aplicación 
import Create from './Create/Create.jsx';

import Edit from './Edit/Edit.jsx';

const headerStyles = { 
    backgroundColor: '#258630', 
    color: 'white', 
    fontWeight: 'bold',
};

export default function ConjuntosAdmin() {
    const [rows, setRows] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [selected, setSelected] = useState([]);
    const [open, setOpen] = useState(false);
    const [editRow, setEditRow] = useState({});
    const [editOpen, setEditOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');

    useEffect(() => {
            const fetchConjuntos = async () => {
                try {
                    const query = `
                    query {
                        conjuntos {
                        id
                        nombre
                        direccion
                        ciudad
                        amenidades {
                            nombre
                            horario { dias horas }
                            estado
                            costo
                            capacidad
                        }
                        divisiones {
                            tipo
                            cantidad
                        }
                        }
                    }
                    `;
                    const response = await fetch('http://localhost:3001/graphql', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ query })
                    });
                    const data = await response.json();
                    setRows(data.data.conjuntos);
                } catch (error) {
                    console.error('Error fetching conjuntos:', error);
                }
            };

            fetchConjuntos();
        }, [open === false, editOpen === false, selected]);

        // ...el resto de tu código permanece igual, solo cambia rows por conjuntos...

        // Ejemplo de renderizado de la tabla (ajusta columnas según tus datos)
        return (
            <div className='admin'>
                <div className='container-admin'>
                    <h1 className='titulo'>Conjuntos</h1>
                    <TableContainer component={Paper} sx={{ borderRadius: "0px" }} stickyHeader>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table" stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell style={headerStyles} align="center">ID</TableCell>
                                    <TableCell style={headerStyles} align="center">Nombre</TableCell>
                                    <TableCell style={headerStyles} align="center">Ciudad</TableCell>
                                    <TableCell style={headerStyles} align="center">Dirección</TableCell>
                                    <TableCell style={headerStyles} align="center">Amenidades</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center">{row.id}</TableCell>
                                        <TableCell align="center">{row.nombre}</TableCell>
                                        <TableCell align="center">{row.ciudad}</TableCell>
                                        <TableCell align="center">{row.direccion}</TableCell>
                                        <TableCell align="center">
                                            {row.amenidades && row.amenidades.map(a => a.nombre).join(', ')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 50]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={setPage}
                        onRowsPerPageChange={e => setRowsPerPage(parseInt(e.target.value, 10))}
                    />
                </div>
            </div>
        );
}

