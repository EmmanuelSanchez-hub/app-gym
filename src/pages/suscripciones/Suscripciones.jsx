import { useState } from "react";
import useSuscripciones from "../../hooks/useSuscripciones";
import CardSuscripcion from "../../components/suscripciones/CardSuscripcion";
import FormSuscripcion from "./FormSuscripcion";
import Sidebar from "../../components/layout/Sidebar";

export default function Suscripciones() {
  const { suscripciones, loading } = useSuscripciones();
  const [busqueda, setBusqueda] = useState("");

  const hoy = new Date();
  const fechaLimite = new Date();
  fechaLimite.setDate(hoy.getDate() + 5); // suscripciones por vencer

  const textoBusqueda = busqueda.toLowerCase().trim();

  const suscripcionesFiltradas = suscripciones.filter((s) => {
    const nombre = s.clienteNombre?.toLowerCase() || "";
    const documento = s.clienteDocumento?.toLowerCase() || "";
    const coincide = nombre.includes(textoBusqueda) //|| documento.includes(textoBusqueda);

    if (textoBusqueda) {
      return coincide; // mostrar todas las que coincidan, sin importar estado ni fecha
    } else {
      // si no hay búsqueda, mostrar solo activas por vencer
      const fechaFin = new Date(s.fechaFin);
      return s.estado === "activa" && fechaFin >= hoy && fechaFin <= fechaLimite;
    }
  });

  return (

    <div className="suscripciones-page">
      <Sidebar />
      <div className="suscripciones-content">
        <h2>Gestión de Suscripciones</h2>
        <FormSuscripcion onCreated={() => console.log("Suscripción creada")} />
        <hr />
        <input
          type="text"
          placeholder="Buscar por nombre o documento"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-text"
        />

        {loading ? (
          <p>Cargando...</p>
        ) : suscripcionesFiltradas.length === 0 ? (
          <p>No hay suscripciones que coincidan.</p>
        ) : (
          <div className="suscripciones-lista">
            {suscripcionesFiltradas.map((s) => (
              <CardSuscripcion key={s.id} suscripcion={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
