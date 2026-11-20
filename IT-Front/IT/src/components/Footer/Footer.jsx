import React from "react";
import "../Footer/Footer.css";
import Logo from "../../assets/Logo.svg";
import { CirclePlay } from "lucide-react";
const Footer = () => {
  return (
    <>
      <footer className="footer">
        <div className="container">
          <div className="footer-inner">
            <div className="footer-img">
              <img width={130} height={38} src={Logo} alt="" />
            </div>
            <div className="footer-text">
              <h1 className="footer-title">
                Biz bilan muvaffaqiyatga erishing
              </h1>
            </div>
            <div className="text">
              <h3 className="footer-subtitle">
                Eng kuchlilar biz bilan qoladi!
              </h3>
            </div>
            <div className="buttons">
              <button className="buttons-1">
                <CirclePlay /> Intro video
              </button>
              <button className="buttons-2">Bog’lanish</button>
            </div>
            <div className="footer-down">
              <p className="footer-copyright">
                © 2024. Barcha huquqlar himoyalangan
              </p>

              <div className="footer-links">
                <a href="#">Termilar</a>
                <a href="#">Xavfsizlik</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
