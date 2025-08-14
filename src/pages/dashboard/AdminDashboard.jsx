import Sidebar from "../../components/layout/Sidebar";
import useDashboard from "../../hooks/useDashboard";
import "./AdminDashboard.css";

const fmtSoles = (n) =>
  `S/ ${new Intl.NumberFormat("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n || 0)}`;

export default function AdminDashboard() {
  const { loading, metrics, listas } = useDashboard({
    limiteListas: 5,
    diasProximos: 7,
  });

  return (
    <section className="dashboard-page">
      <Sidebar />
      <div className="dashboard" id="dashboard">
        {/* 1. Bienvenida + métricas generales */}
        <div className="dashboard-header">
          <h2>¡Bienvenido de nuevo! 💪</h2>
          <p>Resumen del gimnasio:</p>

          {loading ? (
            <p>Cargando métricas...</p>
          ) : (
            <div className="dashboard-metrics">
              <div className="metric-card">👥 Clientes activos: {metrics.clientesActivos}</div>
              <div className="metric-card">💳 Suscripciones vigentes: {metrics.suscripcionesVigentes}</div>
              <div className="metric-card">⏳ Suscripciones vencidas: {metrics.suscripcionesVencidas}</div>
              <div className="metric-card">💰 Ingresos del mes: {fmtSoles(metrics.ingresosMes)}</div>
            </div>
          )}
        </div>

        {/* 2. Últimas suscripciones */}
        <div className="dashboard-section">
          <h3>📋 Últimas suscripciones</h3>
          {loading ? (
            <p>Cargando...</p>
          ) : listas.ultimasSuscripciones.length === 0 ? (
            <p>No hay suscripciones recientes.</p>
          ) : (
            <ul>
              {listas.ultimasSuscripciones.map((s) => (
                <li key={s.id}>
                  ➡️ {s.cliente?.nombre || "Cliente"} - {s.tipo} - {s.fechaInicio || s._createdAt?.toLocaleDateString("es-PE")}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 3. Suscripciones vencidas */}
        <div className="dashboard-section">
          <h3>⛔ Suscripciones vencidas</h3>
          {loading ? (
            <p>Cargando...</p>
          ) : listas.suscripcionesVencidas.length === 0 ? (
            <p>No hay suscripciones vencidas 🎉</p>
          ) : (
            <ul>
              {listas.suscripcionesVencidas.map((s) => (
                <li key={s.id}>
                  ❌ {s.cliente?.nombre || "Cliente"} - Vencida el {s.fechaFin}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 4. Próximos vencimientos */}
        <div className="dashboard-section">
          <h3>⏳ Vencen pronto</h3>
          {loading ? (
            <p>Cargando...</p>
          ) : listas.proximosVencimientos.length === 0 ? (
            <p>No hay vencimientos próximos.</p>
          ) : (
            <ul>
              {listas.proximosVencimientos.map((s) => (
                <li key={s.id}>
                  ⚠️ {s.cliente?.nombre || "Cliente"} - Vence el {s.fechaFin}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 6. Últimos registros de clientes */}
        <div className="dashboard-section">
          <h3>📝 Clientes recientes</h3>
          {loading ? (
            <p>Cargando...</p>
          ) : listas.clientesRecientes.length === 0 ? (
            <p>No hay clientes recientes.</p>
          ) : (
            <ul>
              {listas.clientesRecientes.map((c) => (
                <li key={c.id}>
                  👤 {c.nombre || "Sin nombre"} — Registrado el{" "}
                  {c.createdAt ? new Date(c.createdAt).toLocaleDateString("es-PE") : "—"}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
