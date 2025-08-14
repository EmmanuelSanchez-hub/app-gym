import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  ref,
  get,
  update,
  serverTimestamp,
  onValue,
  query,
  orderByChild,
  equalTo,
  limitToFirst,
} from "firebase/database";
import "./CardSuscripcion.css";

function toISO(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function calcularRangoRenovacion(suscripcion) {
  const inicio = new Date();
  inicio.setHours(0, 0, 0, 0);

  const duracionDias = Number(suscripcion?.duracionDias);
  if (!Number.isNaN(duracionDias) && duracionDias > 0) {
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + duracionDias - 1);
    return { inicio: toISO(inicio), fin: toISO(fin) };
  }

  const tipo = String(suscripcion?.tipo || "").toLowerCase();
  const addDays = (n) => {
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + n - 1);
    return fin;
  };
  const addMonthsMinusOneDay = (m) => {
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + m);
    fin.setDate(fin.getDate() - 1);
    return fin;
  };

  let fin;
  switch (tipo) {
    case "semanal":
      fin = addDays(7);
      break;
    case "quincenal":
      fin = addDays(15);
      break;
    case "mensual":
      fin = addMonthsMinusOneDay(1);
      break;
    case "trimestral":
      fin = addMonthsMinusOneDay(3);
      break;
    case "semestral":
      fin = addMonthsMinusOneDay(6);
      break;
    case "anual":
    case "anualidad":
      fin = addMonthsMinusOneDay(12);
      break;
    default:
      fin = addDays(30);
      break;
  }
  return { inicio: toISO(inicio), fin: toISO(fin) };
}

export default function CardSuscripcion({ suscripcion }) {
  const [cliente, setCliente] = useState(null);
  const [diasRestantes, setDiasRestantes] = useState(null);
  const [renovando, setRenovando] = useState(false);
  const [tienePagoVinculado, setTienePagoVinculado] = useState(false);
  const navigate = useNavigate();

  // Cargar cliente + días restantes
  useEffect(() => {
    const fetchCliente = async () => {
      if (suscripcion.clienteId) {
        const clienteRef = ref(db, `clientes/${suscripcion.clienteId}`);
        const snapshot = await get(clienteRef);
        if (snapshot.exists()) setCliente(snapshot.val());
      }
    };

    const calcularDiasRest = () => {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      const fechaFin = new Date(suscripcion.fechaFin);
      fechaFin.setHours(0, 0, 0, 0);
      const diferenciaMs = fechaFin - hoy;
      if (diferenciaMs >= 0) {
        const dias = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24)) + 1;
        setDiasRestantes(dias);
      } else {
        setDiasRestantes(0);
      }
    };

    fetchCliente();
    calcularDiasRest();
  }, [suscripcion.clienteId, suscripcion.fechaFin]);

  // Escuchar si existe pago vinculado a esta suscripción
  useEffect(() => {
    if (!suscripcion?.id) {
      setTienePagoVinculado(false);
      return;
    }
    const pagosQ = query(
      ref(db, "pagos"),
      orderByChild("suscripcionId"),
      equalTo(suscripcion.id),
      limitToFirst(1)
    );
    const unsub = onValue(pagosQ, (snap) => setTienePagoVinculado(snap.exists()));
    return () => unsub();
  }, [suscripcion?.id]);

  const handleRenovar = async () => {
    try {
      setRenovando(true);
      const { inicio, fin } = calcularRangoRenovacion(suscripcion);
      const sRef = ref(db, `suscripciones/${suscripcion.id}`);
      await update(sRef, {
        activa: true,
        fechaInicio: inicio,
        fechaFin: fin,
        montoPagado: 0,
        ultimaRenovacion: inicio,
        renovadaEn: serverTimestamp(),
      });
      navigate(`/admin/suscripciones/${suscripcion.id}/RegistrarPago`);
    } catch (e) {
      console.error(e);
      alert("No se pudo renovar la suscripción. Intenta nuevamente.");
    } finally {
      setRenovando(false);
    }
  };

  const handleRegistrarPago = () => {
    navigate(`/admin/suscripciones/${suscripcion.id}/RegistrarPago`);
  };

  const mostrarRegistrarPago = !tienePagoVinculado;

  return (
    <div className="card-suscripcion">
      <h4>{cliente ? cliente.nombre : "Cliente desconocido"}</h4>
      <p>📅 Inicio: {suscripcion.fechaInicio}</p>
      <p>📅 Fin: {suscripcion.fechaFin}</p>
      <p>📌 Tipo: {suscripcion.tipo}</p>
      <p>
        ⏳ Estado:{" "}
        <strong style={{ color: suscripcion.vigente ? "lime" : "tomato" }}>
          {suscripcion.vigente ? "Vigente" : "Vencida"}
        </strong>
      </p>
      {suscripcion.vigente && diasRestantes !== null && (
        <p>
          🗓️ Faltan{" "}
          <strong>
            {diasRestantes} {diasRestantes === 1 ? "día" : "días"}
          </strong>{" "}
          para que culmine
        </p>
      )}

      <div className="acciones-suscripcion">
        {suscripcion.vigente ? (
          <>
            {mostrarRegistrarPago && (
              <button className="btn btn-estado" onClick={handleRegistrarPago}>
                💰 Registrar pago
              </button>
            )}
          </>
        ) : (
          <>
            <button
              className="btn btn-renovar"
              onClick={handleRenovar}
              disabled={renovando}
              title="Renueva con fechas desde hoy y continúa al pago"
            >
              {renovando ? "Renovando…" : "🔄 Renovar suscripción"}
            </button>
            {mostrarRegistrarPago && (
              <button className="btn btn-estado" onClick={handleRegistrarPago}>
                💰 Registrar pago
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
