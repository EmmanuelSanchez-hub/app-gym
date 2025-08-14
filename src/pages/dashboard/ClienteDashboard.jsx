import Sidebar from "../../components/layout/Sidebar";

export default function ClienteDashboard() {
  return (
    <div className="dashboard">
      <Sidebar />
      <main className="dashboard-content">
        <h1 className="dashboard-title">Hola 👋 Bienvenido/a</h1>

        <section className="dashboard-section">
          <p className="dashboard-subtitle">Tu estado actual:</p>
          <ul className="dashboard-list">
            <li>🏋️ Ver tu suscripción activa o vencida</li>
            <li>📜 Historial de pagos personales</li>
            <li>🎁 Ver promociones disponibles</li>
            <li>✏️ Actualizar tus datos personales (si aplica)</li>
          </ul>
        </section>
      </main>
    </div>
  );
}