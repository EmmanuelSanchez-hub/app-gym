import { useState } from "react";
import useClientes from "../../hooks/useClientes";
import CardCliente from "../../components/clientes/CardCliente";
import FormCliente from "./FormCliente";
import { db } from "../../firebase/config";
import { ref, push, update } from "firebase/database";
import Sidebar from "../../components/layout/Sidebar";
import './Clientes.css'

export default function Clientes() {
  const { clientes, loading } = useClientes();
  const { filtro, setFiltro } = useState("");

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);

  // Guardar o actualizar cliente
  const guardarCliente = async (data) => {
    try {
      if (clienteEditar) {
        const refEdit = ref(db, `clientes/${clienteEditar.id}`);
        await update(refEdit, data);
      } else {
        const refNuevo = ref(db, "clientes");
        await push(refNuevo, {
          ...data,
          createdAt: new Date().toISOString()
        });
      }
      setMostrarFormulario(false);
      setClienteEditar(null);
    } catch (err) {
      alert("❌ Error al guardar: " + err.message);
    }
  };

  


  const cancelarFormulario = () => {
    setMostrarFormulario(false);
    setClienteEditar(null);
  };

  const handleEditar = (cliente) => {
    setClienteEditar(cliente);
    setMostrarFormulario(true);
  };

  return (
    <div className="clientes-page">
      <Sidebar />
      <div className="clientes-content">
        <h2 className="clientes-title">Gestión de Clientes</h2>
        <button
          onClick={() => {
            setClienteEditar(null);
            setMostrarFormulario(true);
          }}
          className="btn-nuevo"
        >
          ➕ Nuevo Cliente
        </button>

        {mostrarFormulario && (
          <FormCliente
            cliente={clienteEditar}
            onSubmit={guardarCliente}
            onCancel={cancelarFormulario}
          />
        )}

        <input
          type="text"
          placeholder="Buscar por nombre o documento"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-filtro"
        />


        {loading ? (
          <p className="clientes-loading">Cargando...</p>
        ) : clientes.length === 0 ? (
          <p className="clientes-vacio">No hay clientes registrados.</p>
        ) : (
          <div className="clientes-lista">
            {clientes.map((c) => (
              <CardCliente key={c.id} cliente={c} onEditar={() => handleEditar(c)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

