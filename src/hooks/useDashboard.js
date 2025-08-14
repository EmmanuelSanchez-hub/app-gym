// src/hooks/useDashboard.js
import { useEffect, useMemo, useState } from "react";
import { db } from "../firebase/config";
import { ref, onValue } from "firebase/database";

// Helpers de fecha (date-only seguro)
const d0 = (s) => (s ? new Date(`${s}T00:00:00`) : null);
const hoy0 = () => { const d = new Date(); d.setHours(0,0,0,0); return d; };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const safeNum = (v) => (typeof v === "number" ? v : Number(v || 0));

export default function useDashboard({ limiteListas = 5, diasProximos = 7 } = {}) {
  // ofuscación leve en nombres:
  const [c, sc] = useState({});  // clientes
  const [s, ss] = useState({});  // suscripciones
  const [p, sp] = useState({});  // pagos
  const [l, sl] = useState(true); // loading

  useEffect(() => {
    const rc = ref(db, "clientes");
    const rs = ref(db, "suscripciones");
    const rp = ref(db, "pagos");

    const offC = onValue(rc, (snap) => sc(snap.val() || {}));
    const offS = onValue(rs, (snap) => ss(snap.val() || {}));
    const offP = onValue(rp, (snap) => sp(snap.val() || {}));

    // marcamos loading como falso cuando llegue al menos 1ra vez todo
    let gotC = false, gotS = false, gotP = false;
    const stopWhenAll = () => { if (gotC && gotS && gotP) sl(false); };

    const _offC = onValue(rc, (snap) => { sc(snap.val() || {}); gotC = true; stopWhenAll(); }, { onlyOnce: true });
    const _offS = onValue(rs, (snap) => { ss(snap.val() || {}); gotS = true; stopWhenAll(); }, { onlyOnce: true });
    const _offP = onValue(rp, (snap) => { sp(snap.val() || {}); gotP = true; stopWhenAll(); }, { onlyOnce: true });

    return () => { offC(); offS(); offP(); };
  }, []);

  const data = useMemo(() => {
    const hoy = hoy0();

    // Map clientes
    const arrC = Object.entries(c).map(([id, v]) => ({ id, ...v }));
    const clientesActivos = arrC.filter((x) => x.activo !== false).length;

    // Suscripciones con join cliente + flags
    const arrS = Object.entries(s).map(([id, v]) => {
      const cli = c[v.clienteId] ? { id: v.clienteId, ...c[v.clienteId] } : null;
      const fin = d0(v.fechaFin);
      const ini = d0(v.fechaInicio);
      const vigente = fin ? fin >= hoy : false;
      // Para ordenar por creación (si no hay createdAt, usamos inicio)
      const createdAt = v.createdAt ? new Date(v.createdAt) : ini || hoy;
      return { id, ...v, cliente: cli, vigente, _fin: fin, _ini: ini, _createdAt: createdAt };
    });

    const vigentes = arrS.filter((x) => x.vigente).length;
    const vencidas = arrS.filter((x) => !x.vigente).length;

    // Últimas suscripciones (por createdAt desc)
    const ultimasSuscripciones = [...arrS]
      .sort((a, b) => (b._createdAt?.getTime() || 0) - (a._createdAt?.getTime() || 0))
      .slice(0, limiteListas);

    // Vencidas (orden por fechaFin más reciente primero)
    const suscripcionesVencidas = arrS
      .filter((x) => x._fin && x._fin < hoy)
      .sort((a, b) => b._fin - a._fin)
      .slice(0, limiteListas);

    // Próximos vencimientos (entre hoy y hoy + diasProximos)
    const tope = addDays(hoy, diasProximos);
    const proximos = arrS
      .filter((x) => x._fin && x._fin >= hoy && x._fin <= tope)
      .sort((a, b) => a._fin - b._fin)
      .slice(0, limiteListas);

    // Clientes recientes (por createdAt desc)
    const clientesRecientes = [...arrC]
      .sort((a, b) => {
        const A = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const B = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return B - A;
      })
      .slice(0, limiteListas);

    // Ingresos del mes (pagos con fechaPago en el mes actual)
    const now = new Date();
    const y = now.getFullYear();
    const m = now.getMonth(); // 0-11
    const inicioMes = new Date(y, m, 1, 0, 0, 0, 0);
    const proxMes = new Date(y, m + 1, 1, 0, 0, 0, 0);

    const arrP = Object.entries(p).map(([id, v]) => ({ id, ...v }));
    const ingresosMes = arrP.reduce((acc, pago) => {
      const f = d0(pago.fechaPago);
      if (f && f >= inicioMes && f < proxMes) {
        acc += safeNum(pago.monto);
      }
      return acc;
    }, 0);

    return {
      loading: l,
      metrics: {
        clientesActivos,
        suscripcionesVigentes: vigentes,
        suscripcionesVencidas: vencidas,
        ingresosMes,
      },
      listas: {
        ultimasSuscripciones,
        suscripcionesVencidas,
        proximosVencimientos: proximos,
        clientesRecientes,
      },
    };
  }, [c, s, p, l]);

  return data;
}
