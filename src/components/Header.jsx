/*
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { user, perfil } = useAuth();

  // Fix iOS Safari: fuerza repaint del header al cambiar el estado de auth
  useEffect(() => {
    const header = document.querySelector(".header");
    if (!header) return;
    header.style.display = "none";
    requestAnimationFrame(() => {
      header.style.display = "";
    });
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="header-logo" onClick={() => navigate("/")}>
        Cuanto<span>-E</span>
      </div>
      <nav className="header-nav">
        {user ? (
          <>
            <span className="header-username">
              Hola, {perfil?.nombreUsuario}
            </span>
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/historial")}
            >
              Mi historial
            </button>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
*/

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header() {
  const navigate = useNavigate();
  const { user, perfil } = useAuth();

  // Fix iOS Safari: fuerza repaint del header al cambiar el estado de auth
  useEffect(() => {
    const header = document.querySelector(".header");
    if (!header) return;
    header.style.display = "none";
    requestAnimationFrame(() => {
      header.style.display = "";
    });
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  return (
    <header className="header">
      <div
        className="header-logo"
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Cuanto<span>-E</span>
      </div>
      <nav className="header-nav">
        {user ? (
          <>
            <span className="header-username">
              Hola, {perfil?.nombreUsuario}
            </span>
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/historial")}
            >
              Mi historial
            </button>
            <button className="btn btn-ghost" onClick={handleLogout}>
              Cerrar sesión
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-ghost"
              onClick={() => navigate("/register")}
            >
              Registrarse
            </button>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/login")}
            >
              Iniciar sesión
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
