import "./ComoFunciona.css";

const pasos = [
  {
    numero: "01",
    titulo: "¿En qué moneda gastaste?",
    desc: "Indicás la moneda en la que realizaste tu compra o gasto. Por ejemplo: Dólares, Euros, Reales.",
  },
  {
    numero: "02",
    titulo: "¿Cómo pagaste?",
    desc: "Seleccionás si pagaste: con tu moneda local, con tarjeta de crédito o débito en dólares.",
  },
  {
    numero: "03",
    titulo: "Ingresás la cotización",
    desc: "Si no la sabés, podés calcularla usando una operación de prueba — nosotros hacemos el cálculo.",
  },
  {
    numero: "04",
    titulo: "Calculá todas las conversiones que quieras",
    desc: "Ingresás el monto y Cuanto-E te muestra al instante cuánto equivale en dolares y/o tu moneda local.",
  },
];

export default function ComoFunciona() {
  return (
    <main className="cf-page">
      <div className="cf-wrapper">
        <p className="cf-label">Guía rápida</p>
        <h1 className="cf-title">
          ¿Cómo funciona <span>Cuanto-E</span>?
        </h1>
        <p className="cf-subtitle">
          ¿Gastaste en el exterior y no sabés cuánto pagaste realmente? Cuanto-E
          te guía paso a paso para calcularlo en segundos.
        </p>

        <div className="cf-steps">
          {pasos.map(({ numero, titulo, desc }) => (
            <div key={numero} className="cf-step">
              <span className="cf-step-numero">{numero}</span>
              <div className="cf-step-content">
                <h3 className="cf-step-titulo">{titulo}</h3>
                <p className="cf-step-desc">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="cf-extra">
          <h2 className="cf-extra-titulo">¿Para qué sirve registrarse?</h2>
          <p className="cf-extra-desc">
            Si te registrás podés guardar tu historial de conversiones y
            consultarlo cuando quieras, con filtros por fecha. La app es
            completamente gratuita y segura.
          </p>
        </div>

        <a href="/questions" className="cf-cta">
          <span>Empezar ahora →</span>
        </a>
      </div>
    </main>
  );
}
