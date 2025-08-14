import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { ref, onValue } from "firebase/database";

export default function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const clientesRef = ref(db, "clientes");
    const unsubscribe = onValue(clientesRef, (snapshot) => {
      const data = snapshot.val();
      const arr = data ? Object.entries(data).map(([id, cliente]) => ({ id, ...cliente })) : [];
      setClientes(arr);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { clientes, loading };
}
