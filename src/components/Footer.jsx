import "./Footer.css";
import logo from "../assets/logo1.png";

const LINKEDIN = "https://www.linkedin.com/in/gonzalo-villacorta-36489b2a2";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-spacer" />
      <a
        href={LINKEDIN}
        target="_blank"
        rel="noopener noreferrer"
        className="footer-brand"
      >
        Vill4s Devs <span className="footer-tm">®</span>
      </a>
      <div className="footer-right">
        <a href={LINKEDIN} target="_blank" rel="noopener noreferrer">
          <img src={logo} alt="Vill4s devs" className="footer-logo" />
        </a>
      </div>
    </footer>
  );
}
