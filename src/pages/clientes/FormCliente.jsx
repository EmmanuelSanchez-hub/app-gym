import { useState, useEffect } from "react";
import './Clientes.css'

export default function FormCliente({ onSubmit, cliente, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("DNI");
  const [documento, setDocumento] = useState("");

  useEffect(() => {
    if (cliente) {
      setNombre(cliente.nombre || "");
      setEmail(cliente.email || "");
      setTelefono(cliente.telefono || "");
      setTipoDocumento(cliente.tipoDocumento || "DNI");
      setDocumento(cliente.documento || "");
    }
  }, [cliente]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      nombre,
      email,
      telefono,
      tipoDocumento,
      documento,
      ...(cliente ? {} : { activo: true })
    };
    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit} className="form-cliente">
      <h3 className="form-title">{cliente ? "Editar Cliente" : "Nuevo Cliente"}</h3>

      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre completo"
        required
        className="input-text"
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        required
        className="input-text"
      />

      <input
        value={telefono}
        onChange={(e) => setTelefono(e.target.value)}
        placeholder="Teléfono"
        required
        className="input-text"
      />

      <select
        value={tipoDocumento}
        onChange={(e) => setTipoDocumento(e.target.value)}
        className="input-select"
        required
      >
        <option value="DNI">DNI</option>
        <option value="CE">Carné de Extranjería</option>
        <option value="PASAPORTE">Pasaporte</option>
      </select>

      <input
        value={documento}
        onChange={(e) => setDocumento(e.target.value)}
        placeholder="Número de documento"
        required
        className="input-text"
      />

      <div className="form-buttons">
        <button type="submit" className="btn-submit">
          {cliente ? "Actualizar" : "Guardar"}
        </button>
        <button type="button" onClick={onCancel} className="btn-cancel">
          Cancelar
        </button>
      </div>
    </form>
  );
}
