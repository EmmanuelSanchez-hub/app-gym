import { useState } from "react";
import { db } from "../../firebase/config";
import { ref, push, runTransaction, update, serverTimestamp } from "firebase/database";
import useAuth from "../../hooks/useAuth";
import './FormPago.css'

export default function FormPago({ idSuscripcion, onClose }) {
  const { user } = useAuth();
  const [monto, setMonto] = useState("");
  const [fechaPago, setFechaPago] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [metodo, setMetodo] = useState("Efectivo");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idSuscripcion) {
      alert("Falta el id de la suscripción.");
      return;
    }
    const m = Number(monto);
    if (!m || m <= 0) {
      alert("El monto debe ser mayor a 0.");
      return;
    }
    if (!fechaPago) {
      alert("Selecciona la fecha de pago.");
      return;
    }

    try {
      setSaving(true);

      // 1) Registrar el pago (usa 'suscripcionId' y 'fecha' para consistencia)
      await push(ref(db, "pagos"), {
        suscripcionId: String(idSuscripcion), // <-- clave correcta para tus queries equalTo
        monto: m,
        fecha: fechaPago,                     // <-- mismo nombre usado en hooks/listas
        metodo,
        creadoEn: serverTimestamp(),
        registradoPorUid: user?.uid || null,
        registradoPorEmail: user?.email || null,
      });

      // 2) Acumular en la suscripción (nuevo ciclo o existente)
      await runTransaction(
        ref(db, `suscripciones/${idSuscripcion}/montoPagado`),
        (curr) => (Number(curr) || 0) + m
      );

      // 3) Marcar último pago
      await update(ref(db, `suscripciones/${idSuscripcion}`), {
        ultimoPago: serverTimestamp(),
      });

      onClose?.();
    } catch (err) {
      console.error(err);
      alert("No se pudo guardar el pago. Intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-pago">
      <h3>Registrar Pago</h3>

      <input
        type="number"
        step="0.01"
        min="0"
        placeholder="Monto"
        value={monto}
        onChange={(e) => setMonto(e.target.value)}
        required
        className="input-text"
      />

      <input
        type="date"
        value={fechaPago}
        onChange={(e) => setFechaPago(e.target.value)}
        required
        className="input-text"
      />

      <select
        value={metodo}
        onChange={(e) => setMetodo(e.target.value)}
        className="input-select"
      >
        <option value="Efectivo">Efectivo</option>
        <option value="Yape">Yape</option>
        <option value="Transferencia">Transferencia</option>
        <option value="Tarjeta">Tarjeta</option>
        <option value="Plin">Plin</option>
      </select>

      <button type="submit" className="btn-submit" disabled={saving}>
        {saving ? "Guardando..." : "Guardar pago"}
      </button>
    </form>
  );
}
