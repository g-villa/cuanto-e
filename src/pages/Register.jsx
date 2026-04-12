/*
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import "./AuthForm.css";

export default function Register() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError("");
    if (!nombreUsuario.trim() || !email.trim() || !password.trim()) {
      setError("Completá todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "usuarios", uid), {
        nombreUsuario: nombreUsuario.trim(),
        email: email.trim(),
        fechaRegistro: serverTimestamp(),
      });
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        setError("Ese email ya está registrado.");
      else if (err.code === "auth/invalid-email")
        setError("El email no es válido.");
      else setError("Ocurrió un error. Intentá de nuevo.");
    }
    setLoading(false);
  };

  return (
    <main className="auth-page">
      <div className="auth-card animate-in">
        <p className="auth-tag">Crear cuenta</p>
        <h2 className="auth-title">Registrarse</h2>

        <div className="auth-fields">
          <div className="auth-field">
            <label className="auth-label">Nombre de usuario</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Ej: gonzalo"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          <span>{loading ? "Creando cuenta..." : "Crear cuenta"}</span>
        </button>

        <p className="auth-switch">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="auth-link">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
*/

import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../firebase/config";
import "./AuthForm.css";

export default function Register() {
  const navigate = useNavigate();
  const [nombreUsuario, setNombreUsuario] = useState("");
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
    if (!nombreUsuario.trim() || !email.trim() || !password.trim()) {
      setError("Completá todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const uid = userCredential.user.uid;
      await setDoc(doc(db, "usuarios", uid), {
        nombreUsuario: nombreUsuario.trim(),
        email: email.trim(),
        fechaRegistro: serverTimestamp(),
      });
      navigate("/");
    } catch (err) {
      if (err.code === "auth/email-already-in-use")
        setError("Ese email ya está registrado.");
      else if (err.code === "auth/invalid-email")
        setError("El email no es válido.");
      else setError("Ocurrió un error. Intentá de nuevo.");
    }
    setLoading(false);
  };

  return (
    <main className="auth-page">
      <div ref={cardRef} className="auth-card animate-in">
        <p className="auth-tag">Crear cuenta</p>
        <h2 className="auth-title">Registrarse</h2>

        <div className="auth-fields">
          <div className="auth-field">
            <label className="auth-label">Nombre de usuario</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Ej: gonzalo"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              onFocus={handleFocus}
            />
          </div>
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
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={handleFocus}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
        </div>

        {error && <p className="auth-error">{error}</p>}

        <button className="auth-btn" onClick={handleSubmit} disabled={loading}>
          <span>{loading ? "Creando cuenta..." : "Crear cuenta"}</span>
        </button>

        <p className="auth-switch">
          ¿Ya tenés cuenta?{" "}
          <Link to="/login" className="auth-link">
            Iniciá sesión
          </Link>
        </p>
      </div>
    </main>
  );
}
