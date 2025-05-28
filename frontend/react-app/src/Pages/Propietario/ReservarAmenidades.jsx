import React, { useEffect, useState } from "react";

function ReservarAmenidades() {
  const [conjuntos, setConjuntos] = useState([]);
  const [residencias, setResidencias] = useState([]);
  const [amenidades, setAmenidades] = useState([]);
  const [form, setForm] = useState({
    conjuntoId: "",
    residenciaId: "",
    amenidad: "",
    fecha: "",
    horaInicio: "",
    horaFin: "",
    cantidadPersonas: 1,
    motivo: "",
    observaciones: ""
  });
  const [mensaje, setMensaje] = useState("");

  // Cargar conjuntos y residencias
  useEffect(() => {
    fetch("/api/conjuntos")
      .then(res => res.json())
      .then(data => {
        if (data.success) setConjuntos(data.data);
      });
    fetch("/api/residences")
      .then(res => res.json())
      .then(data => {
        if (data.success) setResidencias(data.data);
      });
  }, []);

  // Cargar amenidades cuando se selecciona conjunto
  useEffect(() => {
    const conjunto = conjuntos.find(c => c._id === form.conjuntoId);
    setAmenidades(conjunto ? conjunto.amenidades : []);
  }, [form.conjuntoId, conjuntos]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMensaje("Enviando reserva...");
    // GraphQL mutation
    const query = `
      mutation CrearReserva($input: ReservaInput!) {
        crearReserva(input: $input) {
          id
          estado
        }
      }
    `;
    const res = await fetch("/api/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables: { input: form } })
    });
    const result = await res.json();
    if (result.data && result.data.crearReserva) {
      setMensaje("Reserva enviada correctamente. Estado: " + result.data.crearReserva.estado);
    } else {
      setMensaje("Error al reservar.");
    }
  };

  return (
    <div>
      <h2>Reservar Amenidad</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Conjunto:
          <select name="conjuntoId" value={form.conjuntoId} onChange={handleChange} required>
            <option value="">Seleccione un conjunto</option>
            {conjuntos.map(c => (
              <option key={c._id} value={c._id}>{c.nombre}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Residencia:
          <select name="residenciaId" value={form.residenciaId} onChange={handleChange} required>
            <option value="">Seleccione su residencia</option>
            {residencias
              .filter(r => r.conjuntoId === form.conjuntoId)
              .map(r => (
                <option key={r._id} value={r._id}>{r.code}</option>
              ))}
          </select>
        </label>
        <br />
        <label>
          Amenidad:
          <select name="amenidad" value={form.amenidad} onChange={handleChange} required>
            <option value="">Seleccione una amenidad</option>
            {amenidades.map((a, idx) => (
              <option key={idx} value={a.nombre}>{a.nombre}</option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Fecha:
          <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Hora inicio:
          <input type="time" name="horaInicio" value={form.horaInicio} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Hora fin:
          <input type="time" name="horaFin" value={form.horaFin} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Cantidad de personas:
          <input type="number" name="cantidadPersonas" value={form.cantidadPersonas} min="1" onChange={handleChange} required />
        </label>
        <br />
        <label>
          Motivo de la reserva:
          <input type="text" name="motivo" value={form.motivo} onChange={handleChange} />
        </label>
        <br />
        <label>
          Observaciones:
          <input type="text" name="observaciones" value={form.observaciones} onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Reservar</button>
      </form>
      <div>{mensaje}</div>
    </div>
  );
}

export default ReservarAmenidades;