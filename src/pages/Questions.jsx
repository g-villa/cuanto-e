import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import "./Questions.css";

// ── Componentes fuera del componente principal para evitar parpadeo ──

const Hint = ({ text }) => <p className="q-hint">{text}</p>;

const ChoiceCard = ({ hint, question, choices }) => (
  <div className="q-card animate-in">
    {hint && <Hint text={hint} />}
    <p className="q-question">{question}</p>
    <div className="q-choices">
      {choices.map(({ label, onClick }) => (
        <button key={label} className="q-choice-btn" onClick={onClick}>
          <span>{label}</span>
        </button>
      ))}
    </div>
  </div>
);

const InputCard = ({ hint, label, type = "text", placeholder, onContinue }) => {
  const [val, setVal] = useState("");
  const doIt = () => {
    if (val.trim()) onContinue(val.trim());
  };
  return (
    <div className="q-card animate-in">
      {hint && <Hint text={hint} />}
      <label className="q-label">{label}</label>
      <div className="q-input-row">
        <input
          className="q-input"
          type={type}
          placeholder={placeholder}
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && doIt()}
          autoFocus
        />
        <button className="q-btn-primary" onClick={doIt}>
          <span>Continuar →</span>
        </button>
      </div>
    </div>
  );
};

const FinalCard = ({ monedaInput, onReset, results, saveData }) => {
  const [importe, setImporte] = useState("");
  const [showResult, setShowResult] = useState(false);

  const fmt = (n) =>
    n.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  const imp = parseFloat(importe) || 0;

  const calc = async () => {
    if (importe && !isNaN(imp)) {
      setShowResult(true);
      if (saveData) {
        try {
          await addDoc(collection(db, "usuarios", saveData.uid, "historial"), {
            fecha: serverTimestamp(),
            moneda1: saveData.moneda1,
            monedaPago: saveData.monedaPago,
            monedaLocal: saveData.monedaLocal,
            rama: saveData.rama,
            resultado: results(imp).map((r) => ({
              label: r.label,
              raw: r.raw,
              moneda: r.moneda,
            })),
          });
        } catch (e) {
          console.error("Error guardando historial:", e);
        }
      }
    }
  };
  const handleRepeat = () => {
    setImporte("");
    setShowResult(false);
  };

  const computed = results(imp);

  return (
    <div className="q-final animate-in">
      <p className="q-done">✅ TODO LISTO</p>

      <div className="q-converter-card">
        <label className="q-label">
          Ingresá el importe en <strong>{monedaInput}</strong>
        </label>
        <div className="q-input-row">
          <input
            className="q-input"
            type="number"
            placeholder="0.00"
            value={importe}
            onChange={(e) => {
              setImporte(e.target.value);
              setShowResult(false);
            }}
            onKeyDown={(e) => e.key === "Enter" && calc()}
            autoFocus
          />
          <span className="q-tag">{monedaInput}</span>
          <button className="q-btn-primary" onClick={calc}>
            <span>Calcular</span>
          </button>
        </div>

        {showResult && (
          <div className="q-results animate-in">
            {computed.map((r, i) => (
              <div
                key={i}
                className={`q-result-row ${i > 0 ? "q-result-row--accent" : ""}`}
              >
                <span className="q-result-label">{r.label}</span>
                <span className="q-result-value">
                  {fmt(r.raw)} <em>{r.moneda}</em>
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {showResult && (
        <div className="q-repeat animate-in">
          <p className="q-question">
            ¿Querés realizar otra conversión con las mismas monedas y
            cotizaciones?
          </p>
          <div className="q-choices">
            <button className="q-choice-btn" onClick={handleRepeat}>
              <span>Sí, otra conversión</span>
            </button>
            <button
              className="q-choice-btn q-choice-btn--outline"
              onClick={onReset}
            >
              <span>No, volver al inicio</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Estado inicial ───────────────────────────────────────────────────

const INIT = {
  step: "START",
  moneda1: "",
  moneda2: "",
  moneda3: "",
  cotizacion: "",
  valorMon2EnMon3: "",
  pruebaMon1: "",
};

// ── Componente principal ─────────────────────────────────────────────

export default function Questions() {
  const { user } = useAuth();
  const [s, setS] = useState(INIT);
  const go = (step, extra = {}) => setS((p) => ({ ...p, step, ...extra }));
  const reset = () => setS(INIT);

  const cotiz = parseFloat(s.cotizacion) || 1;
  const cotiz2 = parseFloat(s.valorMon2EnMon3) || 1;

  const mkSave = (rama, monedaPago, monedaLocal) =>
    user
      ? { uid: user.uid, moneda1: s.moneda1, monedaPago, monedaLocal, rama }
      : null;

  const renderStep = () => {
    switch (s.step) {
      case "START":
        return (
          <ChoiceCard
            key="START"
            hint="Paso inicial"
            question="¿Vas a gastar en Dólares (USD)?"
            choices={[
              {
                label: "Sí, en Dólares",
                onClick: () => go("R0_MONEDA2", { moneda1: "Dólares (USD)" }),
              },
              {
                label: "No, en otra moneda",
                onClick: () => go("START_MONEDA1"),
              },
            ]}
          />
        );

      case "START_MONEDA1":
        return (
          <InputCard
            key="START_MONEDA1"
            hint="Paso inicial"
            label="¿En qué moneda vas a GASTAR?"
            placeholder="Ej: Euros, Pesos Uruguayos, Reales..."
            onContinue={(val) => go("ASK_PAGO", { moneda1: val })}
          />
        );

      case "ASK_PAGO":
        return (
          <ChoiceCard
            key="ASK_PAGO"
            hint={`Gastás en: ${s.moneda1}`}
            question="¿Con qué moneda vas a PAGAR?"
            choices={[
              { label: "Con mi moneda local", onClick: () => go("R1_MONEDA2") },
              {
                label: "Con Dólares (USD)",
                onClick: () => go("ASK_MEDIO", { moneda2: "USD" }),
              },
            ]}
          />
        );

      case "ASK_MEDIO":
        return (
          <ChoiceCard
            key="ASK_MEDIO"
            hint={`Gastás en: ${s.moneda1} · Pagás en: Dólares`}
            question="¿Con qué medio vas a pagar en Dólares?"
            choices={[
              {
                label: "Tarjeta de Crédito",
                onClick: () => go("R2A_KNOW_COTIZ"),
              },
              {
                label: "Tarjeta de Débito",
                onClick: () => go("R2B_KNOW_COTIZ"),
              },
            ]}
          />
        );

      // ── RAMA 0 ───────────────────────────────────────────────
      case "R0_MONEDA2":
        return (
          <InputCard
            key="R0_MONEDA2"
            hint="Gasto directo en Dólares"
            label="¿Cuál es tu moneda local?"
            placeholder="Ej: Pesos Argentinos"
            onContinue={(val) => go("R0_KNOW_COTIZ", { moneda2: val })}
          />
        );

      case "R0_KNOW_COTIZ":
        return (
          <ChoiceCard
            key="R0_KNOW_COTIZ"
            hint={`USD → ${s.moneda2}`}
            question={`¿Conocés la cotización del Dólar en ${s.moneda2}?`}
            choices={[
              { label: "Sí, la conozco", onClick: () => go("R0_INPUT_COTIZ") },
              { label: "No, no la conozco", onClick: () => go("R0_PRUEBA_Q") },
            ]}
          />
        );

      case "R0_INPUT_COTIZ":
        return (
          <InputCard
            key="R0_INPUT_COTIZ"
            hint={`¿Cuántos ${s.moneda2} vale 1 Dólar?`}
            label="Ingresá la cotización"
            type="number"
            placeholder="Ej: 1200"
            onContinue={(val) => go("R0_FINAL", { cotizacion: val })}
          />
        );

      case "R0_PRUEBA_Q":
        return (
          <ChoiceCard
            key="R0_PRUEBA_Q"
            hint="No conocés la cotización"
            question="¿Querés calcularla con una operación de prueba?"
            choices={[
              {
                label: "Sí, usar operación de prueba",
                onClick: () => go("R0_PRUEBA_MON1"),
              },
              {
                label: "No, ingresar cotización manualmente",
                onClick: () => go("R0_INPUT_COTIZ"),
              },
            ]}
          />
        );

      case "R0_PRUEBA_MON1":
        return (
          <InputCard
            key="R0_PRUEBA_MON1"
            hint="Operación de prueba"
            label="¿Cuántos Dólares gastaste en esa operación?"
            type="number"
            placeholder="Ej: 50"
            onContinue={(val) => go("R0_PRUEBA_MON2", { pruebaMon1: val })}
          />
        );

      case "R0_PRUEBA_MON2":
        return (
          <InputCard
            key="R0_PRUEBA_MON2"
            hint="Operación de prueba"
            label={`¿Cuántos ${s.moneda2} te cobraron por esa operación?`}
            type="number"
            placeholder="Ej: 60000"
            onContinue={(val) => {
              const c = parseFloat(val) / parseFloat(s.pruebaMon1);
              go("R0_FINAL", { cotizacion: c.toFixed(4) });
            }}
          />
        );

      case "R0_FINAL":
        return (
          <FinalCard
            key="R0_FINAL"
            monedaInput="Dólares (USD)"
            results={(imp) => [
              { label: "Tu gasto en Dólares:", raw: imp, moneda: "USD" },
              {
                label: `Equivale en ${s.moneda2}:`,
                raw: imp * cotiz,
                moneda: s.moneda2,
              },
            ]}
            onReset={reset}
            saveData={mkSave("0", "USD", s.moneda2)}
          />
        );

      // ── RAMA 1 ───────────────────────────────────────────────
      case "R1_MONEDA2":
        return (
          <InputCard
            key="R1_MONEDA2"
            hint="Pago con moneda local"
            label="¿Cuál es tu moneda local?"
            placeholder="Ej: Pesos Argentinos"
            onContinue={(val) => go("R1_KNOW_COTIZ", { moneda2: val })}
          />
        );

      case "R1_KNOW_COTIZ":
        return (
          <ChoiceCard
            key="R1_KNOW_COTIZ"
            hint={`${s.moneda1} → ${s.moneda2}`}
            question={`¿Conocés la cotización de ${s.moneda1} en ${s.moneda2}?`}
            choices={[
              { label: "Sí, la conozco", onClick: () => go("R1_INPUT_COTIZ") },
              { label: "No, no la conozco", onClick: () => go("R1_PRUEBA_Q") },
            ]}
          />
        );

      case "R1_INPUT_COTIZ":
        return (
          <InputCard
            key="R1_INPUT_COTIZ"
            hint={`¿Cuántos ${s.moneda1} vale 1 ${s.moneda2}?`}
            label="Ingresá la cotización"
            type="number"
            placeholder="Ej: 1.15"
            onContinue={(val) => go("R1_FINAL", { cotizacion: val })}
          />
        );

      case "R1_PRUEBA_Q":
        return (
          <ChoiceCard
            key="R1_PRUEBA_Q"
            hint="No conocés la cotización"
            question="¿Querés calcularla con una operación de prueba?"
            choices={[
              {
                label: "Sí, usar operación de prueba",
                onClick: () => go("R1_PRUEBA_MON1"),
              },
              {
                label: "No, ingresar cotización manualmente",
                onClick: () => go("R1_INPUT_COTIZ"),
              },
            ]}
          />
        );

      case "R1_PRUEBA_MON1":
        return (
          <InputCard
            key="R1_PRUEBA_MON1"
            hint="Operación de prueba"
            label={`¿Cuál fue el importe de la compra en ${s.moneda1}?`}
            type="number"
            placeholder="Ej: 100"
            onContinue={(val) => go("R1_PRUEBA_MON2", { pruebaMon1: val })}
          />
        );

      case "R1_PRUEBA_MON2":
        return (
          <InputCard
            key="R1_PRUEBA_MON2"
            hint="Operación de prueba"
            label={`¿Cuántos ${s.moneda2} te debitaron de la cuenta?`}
            type="number"
            placeholder="Ej: 115"
            onContinue={(val) => {
              const c = parseFloat(s.pruebaMon1) / parseFloat(val);
              go("R1_FINAL", { cotizacion: c.toFixed(4) });
            }}
          />
        );

      case "R1_FINAL":
        return (
          <FinalCard
            key="R1_FINAL"
            monedaInput={s.moneda1}
            results={(imp) => [
              {
                label: `Tu gasto en ${s.moneda1}:`,
                raw: imp,
                moneda: s.moneda1,
              },
              {
                label: `Equivale en ${s.moneda2}:`,
                raw: imp / cotiz,
                moneda: s.moneda2,
              },
            ]}
            onReset={reset}
            saveData={mkSave("1", s.moneda2, s.moneda2)}
          />
        );

      // ── RAMA 2A ──────────────────────────────────────────────
      case "R2A_KNOW_COTIZ":
        return (
          <ChoiceCard
            key="R2A_KNOW_COTIZ"
            hint={`${s.moneda1} → USD · Tarjeta de Crédito`}
            question={`¿Sabés la cotización que tomó ${s.moneda1} en Dólares?`}
            choices={[
              { label: "Sí, la conozco", onClick: () => go("R2A_INPUT_COTIZ") },
              { label: "No, no la conozco", onClick: () => go("R2A_PRUEBA_Q") },
            ]}
          />
        );

      case "R2A_INPUT_COTIZ":
        return (
          <InputCard
            key="R2A_INPUT_COTIZ"
            hint={`¿Cuántos ${s.moneda1} vale 1 Dólar?`}
            label="Ingresá la cotización"
            type="number"
            placeholder="Ej: 1200"
            onContinue={(val) => go("R2A_MID_Q", { cotizacion: val })}
          />
        );

      case "R2A_PRUEBA_Q":
        return (
          <ChoiceCard
            key="R2A_PRUEBA_Q"
            hint="No conocés la cotización"
            question="¿Querés calcularla con una operación de prueba?"
            choices={[
              {
                label: "Sí, usar operación de prueba",
                onClick: () => go("R2A_PRUEBA_MON1"),
              },
              {
                label: "No, ingresar cotización manualmente",
                onClick: () => go("R2A_INPUT_COTIZ"),
              },
            ]}
          />
        );

      case "R2A_PRUEBA_MON1":
        return (
          <InputCard
            key="R2A_PRUEBA_MON1"
            hint="Operación de prueba"
            label={`¿Cuál fue el importe de la compra en ${s.moneda1}?`}
            type="number"
            placeholder="Ej: 1000"
            onContinue={(val) => go("R2A_PRUEBA_MON2", { pruebaMon1: val })}
          />
        );

      case "R2A_PRUEBA_MON2":
        return (
          <InputCard
            key="R2A_PRUEBA_MON2"
            hint="Operación de prueba — ver en tu resumen de cuenta"
            label="¿Cuántos Dólares te cobró la tarjeta?"
            type="number"
            placeholder="Ej: 0.85"
            onContinue={(val) => {
              const c = parseFloat(s.pruebaMon1) / parseFloat(val);
              go("R2A_MID_Q", { cotizacion: c.toFixed(4) });
            }}
          />
        );

      case "R2A_MID_Q":
        return (
          <ChoiceCard
            key="R2A_MID_Q"
            hint="Conversión adicional (opcional)"
            question="¿Querés ingresar cuánto creés que te van a cobrar en tu moneda local por esos Dólares en la tarjeta?"
            choices={[
              {
                label: "Sí, agregar moneda local",
                onClick: () => go("R2A_MONEDA3"),
              },
              {
                label: "No, solo ver en Dólares",
                onClick: () => go("R2A_FINAL"),
              },
            ]}
          />
        );

      case "R2A_MONEDA3":
        return (
          <InputCard
            key="R2A_MONEDA3"
            hint="Conversión adicional"
            label="¿Cuál es tu moneda local?"
            placeholder="Ej: Pesos Argentinos"
            onContinue={(val) => go("R2A_MON3_COTIZ", { moneda3: val })}
          />
        );

      case "R2A_MON3_COTIZ":
        return (
          <InputCard
            key="R2A_MON3_COTIZ"
            hint={`¿Cuántos ${s.moneda3} vale 1 Dólar?`}
            label={`Cotización del Dólar en ${s.moneda3}`}
            type="number"
            placeholder="Ej: 1200"
            onContinue={(val) => go("R2B_FINAL", { valorMon2EnMon3: val })}
          />
        );

      case "R2A_FINAL":
        return (
          <FinalCard
            key="R2A_FINAL"
            monedaInput={s.moneda1}
            results={(imp) => [
              {
                label: `Tu gasto en ${s.moneda1}:`,
                raw: imp,
                moneda: s.moneda1,
              },
              {
                label: "Equivale en Dólares:",
                raw: imp / cotiz,
                moneda: "USD",
              },
            ]}
            onReset={reset}
            saveData={mkSave("2A", "USD", "igual que moneda de pago")}
          />
        );

      // ── RAMA 2B ──────────────────────────────────────────────
      case "R2B_KNOW_COTIZ":
        return (
          <ChoiceCard
            key="R2B_KNOW_COTIZ"
            hint={`${s.moneda1} → USD · Tarjeta de Débito`}
            question={`¿Sabés la cotización que tomó ${s.moneda1} en Dólares?`}
            choices={[
              { label: "Sí, la conozco", onClick: () => go("R2B_INPUT_COTIZ") },
              { label: "No, no la conozco", onClick: () => go("R2B_PRUEBA_Q") },
            ]}
          />
        );

      case "R2B_INPUT_COTIZ":
        return (
          <InputCard
            key="R2B_INPUT_COTIZ"
            hint={`¿Cuántos ${s.moneda1} vale 1 Dólar?`}
            label="Ingresá la cotización"
            type="number"
            placeholder="Ej: 1200"
            onContinue={(val) => go("R2B_MID_MONEDA3", { cotizacion: val })}
          />
        );

      case "R2B_PRUEBA_Q":
        return (
          <ChoiceCard
            key="R2B_PRUEBA_Q"
            hint="No conocés la cotización"
            question="¿Querés calcularla con una operación de prueba?"
            choices={[
              {
                label: "Sí, usar operación de prueba",
                onClick: () => go("R2B_PRUEBA_MON1"),
              },
              {
                label: "No, ingresar cotización manualmente",
                onClick: () => go("R2B_INPUT_COTIZ"),
              },
            ]}
          />
        );

      case "R2B_PRUEBA_MON1":
        return (
          <InputCard
            key="R2B_PRUEBA_MON1"
            hint="Operación de prueba"
            label={`¿Cuál fue el importe de la compra en ${s.moneda1}?`}
            type="number"
            placeholder="Ej: 1000"
            onContinue={(val) => go("R2B_PRUEBA_MON2", { pruebaMon1: val })}
          />
        );

      case "R2B_PRUEBA_MON2":
        return (
          <InputCard
            key="R2B_PRUEBA_MON2"
            hint="Operación de prueba"
            label="¿Cuántos Dólares te debitaron de la cuenta?"
            type="number"
            placeholder="Ej: 0.85"
            onContinue={(val) => {
              const c = parseFloat(s.pruebaMon1) / parseFloat(val);
              go("R2B_MID_MONEDA3", { cotizacion: c.toFixed(4) });
            }}
          />
        );

      case "R2B_MID_MONEDA3":
        return (
          <InputCard
            key="R2B_MID_MONEDA3"
            hint="Conversión adicional — moneda local"
            label="¿Cuál es tu moneda local?"
            placeholder="Ej: Pesos Argentinos"
            onContinue={(val) => go("R2B_MID_COTIZ", { moneda3: val })}
          />
        );

      case "R2B_MID_COTIZ":
        return (
          <InputCard
            key="R2B_MID_COTIZ"
            hint={`¿Cuántos ${s.moneda3} vale 1 Dólar?`}
            label={`Cotización del Dólar en ${s.moneda3}`}
            type="number"
            placeholder="Ej: 1200"
            onContinue={(val) => go("R2B_FINAL", { valorMon2EnMon3: val })}
          />
        );

      case "R2B_FINAL":
        return (
          <FinalCard
            key="R2B_FINAL"
            monedaInput={s.moneda1}
            results={(imp) => [
              {
                label: `Tu gasto en ${s.moneda1}:`,
                raw: imp,
                moneda: s.moneda1,
              },
              {
                label: "Equivale en Dólares:",
                raw: imp / cotiz,
                moneda: "USD",
              },
              {
                label: `Equivale en ${s.moneda3}:`,
                raw: (imp / cotiz) * cotiz2,
                moneda: s.moneda3,
              },
            ]}
            onReset={reset}
            saveData={mkSave("2B", "USD", s.moneda3)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <main className="questions-page">
      <div className="questions-wrapper">
        <button className="q-restart-btn" onClick={reset}>
          ↩ Reiniciar
        </button>
        {renderStep()}
      </div>
    </main>
  );
}
