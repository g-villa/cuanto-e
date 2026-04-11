import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase/config";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [perfil, setPerfil] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const snap = await getDoc(doc(db, "usuarios", firebaseUser.uid));
        if (snap.exists()) setPerfil(snap.data());
      } else {
        setUser(null);
        setPerfil(null);
      }
    });
    return unsub;
  }, []);

  return (
    <AuthContext.Provider value={{ user, perfil }}>
      {user !== undefined && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
