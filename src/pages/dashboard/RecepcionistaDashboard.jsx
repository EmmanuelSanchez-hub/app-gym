import Sidebar from "../../components/layout/Sidebar";

export default function RecepcionistaDashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-content">
        <h1 className="dashboard-title">Bienvenido/a, Recepcionista</h1>

        <section className="dashboard-section">
          <p className="dashboard-subtitle">Tareas disponibles:</p>
          <ul className="dashboard-list">
            <li>📝 Registrar nuevos clientes</li>
            <li>📅 Verificar estado de suscripciones</li>
            <li>💳 Registrar pagos realizados</li>
            <li>🔍 Consultar historial de clientes</li>
          </ul>
        </section>
      </main>
    </div>
  );
}