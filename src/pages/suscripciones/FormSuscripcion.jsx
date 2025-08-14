import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import { ref, get, push, set } from "firebase/database";
import useAuth from "../../hooks/useAuth";
import "./Suscripcion.css";

export default function FormSuscripcion({ onCreated }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clientes, setClientes] = useState([]);
  const [tipo, setTipo] = useState("Mensual");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [resultados, setResultados] = useState([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);

  useEffect(() => {
    const fetchClientes = async () => {
      const snapshot = await get(ref(db, "clientes"));
      if (snapshot.exists()) {
        const data = snapshot.val();
        const arr = Object.entries(data)
          .map(([id, c]) => ({ id, ...c }))
          .filter((c) => c.activo !== false);
        setClientes(arr);
      }
    };
    fetchClientes();
  }, []);

  const calcularFechaFin = (inicio, tipo) => {
    const fecha = new Date(inicio);
    if (tipo === "Mensual") fecha.setDate(fecha.getDate() + 30);
    else if (tipo === "Quincenal") fecha.setDate(fecha.getDate() + 15);
    else if (tipo === "Semanal") fecha.setDate(fecha.getDate() + 7);
    return fecha.toISOString().split("T")[0];
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!clienteSeleccionado?.id) {
      alert("Selecciona un cliente válido.");
      return;
    }
    if (!fechaInicio || !fechaFin) {
      alert("Completa las fechas.");
      return;
    }

    // Crear nodo y obtener ID
    const colRef = ref(db, "suscripciones");
    const sRef = push(colRef); // referencia con .key disponible
    const id = sRef.key;

    await set(sRef, {
      clienteId: clienteSeleccionado.id,
      tipo,
      fechaInicio,
      fechaFin,
      activa: true,              // consistente con el resto de tu proyecto
      montoPagado: 0,            // inicia acumulado en 0
      registradoPor: user?.uid || null,
      createdAt: new Date().toISOString(),
    });

    // limpiar
    setClienteSeleccionado(null);
    setBusqueda("");
    setTipo("Mensual");
    setFechaInicio("");
    setFechaFin("");
    setResultados([]);

    // callback opcional
    onCreated?.(id);

    // 🚀 ir al pago de inmediato
    navigate(`/admin/suscripciones/${id}/RegistrarPago`);
  };

  return (
    <form onSubmit={handleSubmit} className="form-suscripcion">
      <h3>Registrar nueva suscripción</h3>

      <input
        type="text"
        placeholder="Buscar cliente por nombre o documento"
        value={busqueda}
        onChange={(e) => {
          const texto = e.target.value.toLowerCase();
          setBusqueda(texto);
          const coincidencias = clientes.filter(
            (c) =>
              (c.nombre || "").toLowerCase().includes(texto) ||
              (c.documento || "").toLowerCase().includes(texto)
          );
          setResultados(coincidencias.slice(0, 10));
          setClienteSeleccionado(null);
        }}
        required
        className="input-text"
      />

      {busqueda && resultados.length > 0 && (
        <ul className="resultados-clientes">
          {resultados.map((c) => (
            <li
              key={c.id}
              onClick={() => {
                setClienteSeleccionado(c);
                setBusqueda(`${c.nombre} (${c.tipoDocumento}: ${c.documento})`);
                setResultados([]);
              }}
              className="resultado-item"
            >
              {c.nombre} ({c.tipoDocumento}: {c.documento})
            </li>
          ))}
        </ul>
      )}

      {clienteSeleccionado && (
        <p className="cliente-elegido">
          🧍 Cliente seleccionado: <strong>{clienteSeleccionado.nombre}</strong>
        </p>
      )}

      <select
        value={tipo}
        onChange={(e) => {
          const nuevoTipo = e.target.value;
          setTipo(nuevoTipo);
          if (fechaInicio) setFechaFin(calcularFechaFin(fechaInicio, nuevoTipo));
        }}
        className="input-select"
      >
        <option value="Mensual">Mensual</option>
        <option value="Quincenal">Quincenal</option>
        <option value="Semanal">Semanal</option>
      </select>

      <input
        type="date"
        value={fechaInicio}
        onChange={(e) => {
          const inicio = e.target.value;
          setFechaInicio(inicio);
          if (inicio) setFechaFin(calcularFechaFin(inicio, tipo));
        }}
        required
        className="input-text"
      />

      <input type="date" value={fechaFin} disabled className="input-text" />

      <button type="submit" className="btn-submit">
        Guardar suscripción
      </button>
    </form>
  );
}
