import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import './Sidebar.css';

export default function Sidebar() {
  const { user , role } = useAuth();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // Menú según rol
  const navItems = {
    admin: [
      { label: "Dashboard", path: "/admin", icon: "home" },
      { label: "Usuarios", path: "/register", icon: "person_add" },
      { label: "Clientes", path: "/gestion/clientes", icon: "supervisor_account" },
      { label: "Suscripciones", path: "/suscripciones", icon: "calendar_month" },
      { label: "Promociones", path: "/admin/promociones", icon: "redeem" },
    ],
    recepcionista: [
      { label: "Dashboard", path: "/recepcionista", icon: "home" },
      { label: "Clientes", path: "/gestion/clientes", icon: "supervisor_account" },
      { label: "Suscripciones", path: "/suscripciones", icon: "calendar_month" },
      { label: "Pagos", path: "/recepcionista/pagos", icon: "payments" },
    ],
    cliente: [
      { label: "Dashboard", path: "/cliente", icon: "home" },
      { label: "Mi Suscripción", path: "/cliente/suscripcion", icon: "event_repeat" },
      { label: "Promociones", path: "/cliente/promociones", icon: "redeem" },
    ]
  };

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <img className="logo-img" src="../../src/assets/login.jpg" alt="Logo" />
      </header>

      <nav>
        {/* Render dinámico según rol */}
        {navItems[role]?.map((item) => (
          <Link key={item.path} to={item.path} className="sidebar-button">
            <span>
              <i className="material-symbols-outlined">{item.icon}</i>
              <span>{item.label}</span>
            </span>
          </Link>
        ))}

        <button onClick={handleLogout} className="logout-button">
          <span>
            <i className="material-symbols-outlined">logout</i>
            <span>Logout</span>
          </span>
        </button>

        <button className="user-button">
          <span>
            <img src="/user.png" alt="user" />
            <span>
              <span className="fullname">{user?.nombre?.trim().split(/\s+/)[0] || ""}</span>
              <span className="username">@{user?.role}</span>
            </span>
            <i className="material-symbols-outlined">more_vert</i>
          </span>
        </button>
      </nav>
    </aside>
  );
}
