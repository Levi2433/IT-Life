import React from "react";
import "../pages/Landing.css";
import "../index.css";
import Learn from "../assets/learn.svg"

const Landing = () => {
  return (
    <>
      <section className="main">
        <div className="container">
          <div className="main-inner">
            <div className="main-inner-left">
              <h1 className="main-title">
                <span className="main-gradient">Kelajak kasblarini</span> biz
                 bilan o’rganing!
              </h1>
              <p className="main-subtitle">
                Tekinga o‘qib, pul ishlashga nima deysiz? Ishonmayapsizmi? Biz
                buni isbotlaymiz. Hammasi o‘zingizga bog‘liq.
              </p>

              <a className="main-button" href="#kurslar">
                Kurslar bilan tanishish
              </a>
            </div>
            <div className="main-inner-right">
                <img className="img" width={590} src={Learn} alt="" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Landing;