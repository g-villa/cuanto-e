/*Footer.jsx*/
/*
import "./Footer.css";
import logo from "../assets/logo1.png";

export default function Footer() {
  return (
    <footer className="footer">
      <img src={logo} alt="Vill4s devs" className="footer-logo" />
    </footer>
  );
}
*/

import "./Footer.css";
import logo from "../assets/logo1.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-spacer" />
      <p className="footer-brand">
        Vill4s Devs <span className="footer-tm">®</span>
      </p>
      <div className="footer-right">
        <img src={logo} alt="Vill4s devs" className="footer-logo" />
      </div>
    </footer>
  );
}
