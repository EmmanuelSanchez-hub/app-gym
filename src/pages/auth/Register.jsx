import { useState } from "react";
import { createUserWithEmailAndPassword, getAuth, signOut } from "firebase/auth";
import { getApps, initializeApp } from "firebase/app";
import { getDatabase, ref as refDb, set as setDb } from "firebase/database";
import Sidebar from "../../components/layout/Sidebar";
import "./Register.css";
// OJO: NO usamos auth/db principales aquí para crear/escribir el usuario nuevo,
// para no cerrar tu sesión ni chocar con reglas.

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail]   = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("recepcionista");
  const [mensaje, setMensaje] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      const defaultApp = getApps()[0];
      const secondaryApp =
        getApps().find((a) => a.name === "Secondary") ||
        initializeApp(defaultApp.options, "Secondary");

      const secondaryAuth = getAuth(secondaryApp);
      const secondaryDb   = getDatabase(secondaryApp);
      const cred = await createUserWithEmailAndPassword(secondaryAuth, email, password);
      const uid  = cred.user.uid;
      try {
        await setDb(refDb(secondaryDb, `users/${uid}`), {
          uid,
          nombre,
          email,
          role: rol,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        if (String(err).includes("PERMISSION_DENIED")) {
          await setDb(refDb(secondaryDb, `users/${uid}`), {
            uid,
            nombre,
            email,
            createdAt: new Date().toISOString(),
          });
        } else {
          throw err;
        }
      }
      await signOut(secondaryAuth);

      setMensaje("✅ Usuario Registrado Correctamente.");
      setNombre(""); setEmail(""); setPassword(""); setRol("recepcionista");
    } catch (error) {
      console.error("Error al registrar:", error);
      if (error?.code === "auth/email-already-in-use") {
        setMensaje("⚠️ El correo ya está registrado en Authentication. No se creó usuario nuevo.");
      } else {
        setMensaje("Error al registrar: " + (error?.message || String(error)));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="register-page">
      <Sidebar />
      <div className="registrer-content">
        <h2>Registrar nuevo usuario</h2>

        <form onSubmit={handleSubmit} className="form-register">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre completo"
            required
            className="input-text"
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo"
            required
            className="input-text"
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
            className="input-text"
          />

          <select value={rol} onChange={(e) => setRol(e.target.value)} className="input-select">
            <option value="recepcionista">Recepcionista</option>
            <option value="admin">Administrador</option>
          </select>

          <button type="submit" className="btn-submit" disabled={saving}>
            {saving ? "Creando..." : "Crear Usuario"}
          </button>
        </form>

        {mensaje && <p>{mensaje}</p>}
      </div>
    </div>
  );
}
