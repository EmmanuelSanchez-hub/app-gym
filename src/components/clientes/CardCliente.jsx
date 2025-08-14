import './CardCliente.css'
export default function CardCliente({ cliente, onEditar }) {
  const cambiarEstado = async () => {
    const clienteRef = ref(db, `clientes/${cliente.id}`);
    await update(clienteRef, { activo: !cliente.activo });
  };

  return (
    <div className="card">
      <h4 className="cliente-nombre">{cliente.nombre}</h4>
      <p className="cliente-email">📧 {cliente.email}</p>
      <p className="cliente-telefono">📞 {cliente.telefono}</p>
      <p className="cliente-documento">
        🆔 {cliente.tipoDocumento}: {cliente.documento}
      </p>

      <div className="cliente-botones">
        <button onClick={onEditar} className="btn-editar">✏️ Editar</button>
        <button onClick={cambiarEstado} className="btn-estado">
          {cliente.activo ? "🚫 Desactivar" : "✅ Activar"}
        </button>
      </div>
    </div>
  );
}