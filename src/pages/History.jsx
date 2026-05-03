/* History.jsx en rama mobile-app - sin boton volver al inicio*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import "./History.css";

export default function History() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [historial, setHistorial] = useState([]);
  const [loading, setLoading] = useState(true);
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    const fetchHistorial = async () => {
      const q = query(
        collection(db, "usuarios", user.uid, "historial"),
        orderBy("fecha", "desc"),
      );
      const snap = await getDocs(q);
      setHistorial(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      setLoading(false);
    };
    fetchHistorial();
  }, [user]);

  const filtrado = historial.filter((item) => {
    if (!item.fecha) return true;
    const fecha = item.fecha.toDate();
    if (desde) {
      const desdeDate = new Date(desde);
      desdeDate.setHours(0, 0, 0, 0);
      if (fecha < desdeDate) return false;
    }
    if (hasta) {
      const hastaDate = new Date(hasta);
      hastaDate.setHours(23, 59, 59, 999);
      if (fecha > hastaDate) return false;
    }
    return true;
  });

  const limpiarFiltros = () => {
    setDesde("");
    setHasta("");
  };

  const fmt = (timestamp) => {
    if (!timestamp) return "-";
    const d = timestamp.toDate();
    return (
      d.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }) +
      " " +
      d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const fmtNum = (n) =>
    Number(n).toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const hayFiltros = desde || hasta;

  return (
    <main className="history-page">
      <div className="history-wrapper">
        <div className="history-header animate-in">
          <p className="history-tag">Mi cuenta</p>
          <h2 className="history-title">Historial de conversiones</h2>
        </div>

        {/* ── Filtros ── */}
        <div className="history-filters animate-in">
          <div className="history-filter-field">
            <label className="history-filter-label">Desde</label>
            <input
              className="history-filter-input"
              type="date"
              value={desde}
              onChange={(e) => setDesde(e.target.value)}
            />
          </div>
          <div className="history-filter-sep">→</div>
          <div className="history-filter-field">
            <label className="history-filter-label">Hasta</label>
            <input
              className="history-filter-input"
              type="date"
              value={hasta}
              onChange={(e) => setHasta(e.target.value)}
            />
          </div>
          {hayFiltros && (
            <button className="history-filter-clear" onClick={limpiarFiltros}>
              Limpiar
            </button>
          )}
        </div>

        {/* ── Contador ── */}
        {!loading && hayFiltros && (
          <p className="history-count animate-in">
            {filtrado.length === 0
              ? "Sin resultados para ese rango"
              : `${filtrado.length} conversión${
                  filtrado.length !== 1 ? "es" : ""
                } encontrada${filtrado.length !== 1 ? "s" : ""}`}
          </p>
        )}

        {loading && <p className="history-empty animate-in">Cargando...</p>}

        {!loading && historial.length === 0 && (
          <p className="history-empty animate-in">
            Todavía no realizaste ninguna conversión.
          </p>
        )}

        {!loading &&
          historial.length > 0 &&
          filtrado.length === 0 &&
          hayFiltros && (
            <p className="history-empty animate-in">
              No hay conversiones en ese rango de fechas.
            </p>
          )}

        {!loading && filtrado.length > 0 && (
          <div className="history-list animate-in">
            {filtrado.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-item-header">
                  <span className="history-date">{fmt(item.fecha)}</span>
                  <span className="history-rama">Rama {item.rama}</span>
                </div>
                <div className="history-monedas">
                  <div className="history-moneda-row">
                    <span className="history-moneda-label">
                      Moneda de gasto
                    </span>
                    <span className="history-moneda-val">{item.moneda1}</span>
                  </div>
                  <div className="history-moneda-row">
                    <span className="history-moneda-label">Moneda de pago</span>
                    <span className="history-moneda-val">
                      {item.monedaPago}
                    </span>
                  </div>
                  <div className="history-moneda-row">
                    <span className="history-moneda-label">Moneda local</span>
                    <span className="history-moneda-val">
                      {item.monedaLocal}
                    </span>
                  </div>
                </div>
                <div className="history-resultados">
                  {item.resultado.map((r, i) => (
                    <div
                      key={i}
                      className={`history-resultado-row ${
                        i > 0 ? "history-resultado-row--accent" : ""
                      }`}
                    >
                      <span className="history-resultado-label">{r.label}</span>
                      <span className="history-resultado-val">
                        {fmtNum(r.raw)} <em>{r.moneda}</em>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
