import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { ref, onValue, get, update } from "firebase/database";

export default function useSuscripciones() {
  const [suscripciones, setSuscripciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helpers de fecha (comparación por día, sin horas)
  const startOfToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  };
  const parseDay = (yyyyMmDd) => (yyyyMmDd ? new Date(`${yyyyMmDd}T00:00:00`) : null);

  useEffect(() => {
    const refSubs = ref(db, "suscripciones");
    const unsubscribe = onValue(refSubs, async (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        setSuscripciones([]);
        setLoading(false);
        return;
      }

      // Obtener todos los clientes una vez
      const snapClientes = await get(ref(db, "clientes"));
      const clientesData = snapClientes.exists() ? snapClientes.val() : {};

      const hoy = startOfToday();

      const arr = Object.entries(data).map(([id, s]) => {
        const cliente = clientesData[s.clienteId] || {};
        const fin = parseDay(s.fechaFin);
        const vigente = fin ? fin >= hoy : false;

        return {
          id,
          ...s,
          vigente,
          clienteNombre: cliente.nombre || "",
          clienteDocumento: cliente.documento || "",
        };
      });

      setSuscripciones(arr);
      setLoading(false);

      // --- AUTOCORRECCIÓN DE ESTADO EN BD (opcional en cliente) ---
      // Marca 'vencida' si llegó la fechaFin y aún figura 'activa' (o sin estado).
      const vencidasParaActualizar = arr.filter((s) => {
        const fin = parseDay(s.fechaFin);
        return fin && fin < hoy && s.estado !== "vencida";
      });

      if (vencidasParaActualizar.length > 0) {
        const ahoraISO = new Date().toISOString();
        await Promise.all(
          vencidasParaActualizar.map((s) =>
            update(ref(db, `suscripciones/${s.id}`), {
              estado: "vencida",
              estadoActualizadoPor: "sistema-cliente",
              estadoActualizadoAt: ahoraISO,
            })
          )
        );
      }
      // ------------------------------------------------------------
    });

    return () => unsubscribe();
  }, []);

  return { suscripciones, loading };
}