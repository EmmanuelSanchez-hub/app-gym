import { createContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get } from "firebase/database";

// Creamos el contexto
const AuthContext = createContext();

// Proveedor del contexto
export function AuthProvider({ children }) {
  const [u, su] = useState(null);
  const [r, sr] = useState(null);
  const [l, sl] = useState(true);

  useEffect(() => {
    const x = onAuthStateChanged(auth, async (au) => {
      if (au) {
        try {
          const p = ref(db, `users/${au.uid}`);
          const s = await get(p);
          if (s.exists()) {
            const d = s.val();
            d.uid = au.uid; // aseguramos incluir el UID del auth
            su(d);          // usuario desde BD
            sr(d.role || null);
          } else {
            su(null);
            sr(null);
          }
        } catch (e) {
          console.error("Error al recuperar usuario desde BD:", e);
          su(null);
          sr(null);
        }
      } else {
        su(null);
        sr(null);
      }
      sl(false);
    });

    return () => x();
  }, []);

  return (
    <AuthContext.Provider value={{ user: u, role: r, loading: l }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
