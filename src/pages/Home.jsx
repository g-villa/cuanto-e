import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="hero">
      <p className="label">Bienvenido a</p>
      <h1 className="title">
        Cuanto<span>-E</span>
      </h1>
      <p className="subtitle">
        <span className="dot"></span>
        Vamos a simplificarte la vida.....
        <span className="dot"></span>
      </p>
      <button className="btn-cta" onClick={() => navigate("/questions")}>
        <span className="btn-cta-text">Comencemos</span>
      </button>
    </main>
  );
}
