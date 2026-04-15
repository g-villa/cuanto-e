/*
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import "./AuthForm.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Completá todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/invalid-credential")
        setError("Email o contraseña incorrectos.");
      else if (err.code === "auth/invalid-email")
        setError("El email no es válido.");
      else setError("Ocurrió un error. Intentá de nuevo.");
    }
    setLoading(false);
  };

  return (
    <main className="auth-page">
      <div className="auth-card animate-in">
        <p className="auth-tag">Bienvenido de vuelta</p>
        <h2 className="auth-title">Iniciar sesión</h2>

        <div className="auth-fields">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          <span>{loading ? "Ingresando..." : "Ingresar"}</span>
        </button>

        <p className="auth-switch">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="auth-link">
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}
*/

/*-----------------------------------------------------------------------------------------------------------------------------------------------------------------------
import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import "./AuthForm.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const cardRef = useRef(null);

  const handleFocus = () => {
    setTimeout(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  };

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Completá todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/invalid-credential")
        setError("Email o contraseña incorrectos.");
      else if (err.code === "auth/invalid-email")
        setError("El email no es válido.");
      else setError("Ocurrió un error. Intentá de nuevo.");
    }
    setLoading(false);
  };

  return (
    <main className="auth-page">
      <div ref={cardRef} className="auth-card animate-in">
        <p className="auth-tag">Bienvenido de vuelta</p>
        <h2 className="auth-title">Iniciar sesión</h2>

        <div className="auth-fields">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={handleFocus}
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          <span>{loading ? "Ingresando..." : "Ingresar"}</span>
        </button>

        <p className="auth-switch">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="auth-link">
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}
*/

import { useState } from "react";
import { useKeyboardFix } from "../hooks/useKeyboardFix";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import "./AuthForm.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useKeyboardFix();

  const handleSubmit = async () => {
    setError("");
    if (!email.trim() || !password.trim()) {
      setError("Completá todos los campos.");
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      if (err.code === "auth/invalid-credential")
        setError("Email o contraseña incorrectos.");
      else if (err.code === "auth/invalid-email")
        setError("El email no es válido.");
      else setError("Ocurrió un error. Intentá de nuevo.");
    }
    setLoading(false);
  };

  return (
    <main className="auth-page">
      <div className="auth-card animate-in">
        <p className="auth-tag">Bienvenido de vuelta</p>
        <h2 className="auth-title">Iniciar sesión</h2>

        <div className="auth-fields">
          <div className="auth-field">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="auth-field">
            <label className="auth-label">Contraseña</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          <span>{loading ? "Ingresando..." : "Ingresar"}</span>
        </button>

        <p className="auth-switch">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="auth-link">
            Registrate
          </Link>
        </p>
      </div>
    </main>
  );
}
