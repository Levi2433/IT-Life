import React from "react";
import "../index.css";
import "../pages/Comments.css";
import Icon from "../assets/icon.png";
const Comments = () => {
  return (
    <>
      <section className="comments">
        <div className="container">
          <h1 className="title">Izohlar</h1>
          <h3 className="subtitle">
            O’quvchilarimiz tomonidan qoldirilgan izohlar
          </h3>
          <div className="comments-inner">
            <div className="comments-card">
              <img src={Icon} alt="rasim" width={46} />
              <p className="comments-text">
                Lorem ipsum dolor sit amet consectetur. Sit in eget posuere
                facilisis elementum. Est semper aenean erat est etiam sit.
                Auctor risus semper ultrices eleifend vel at. Pharetra turpis
                fames cursus sit in faucibus.
              </p>
              <h3 className="comments-subtitle">Xurshid Istamov</h3>
              <p className="comments-texts">Frontend kursi o’quvchisi</p>
            </div>
            <div className="comments-card">
              <img src={Icon} alt="rasim" width={46} />
              <p className="comments-text">
                Lorem ipsum dolor sit amet consectetur. Sit in eget posuere
                facilisis elementum. Est semper aenean erat est etiam sit.
                Auctor risus semper ultrices eleifend vel at. Pharetra turpis
                fames cursus sit in faucibus.
              </p>
              <h3 className="comments-subtitle">Xurshid Istamov</h3>
              <p className="comments-texts">Frontend kursi o’quvchisi</p>
            </div>
            <div className="comments-card">
              <img src={Icon} alt="rasim" width={46} />
              <p className="comments-text">
                Lorem ipsum dolor sit amet consectetur. Sit in eget posuere
                facilisis elementum. Est semper aenean erat est etiam sit.
                Auctor risus semper ultrices eleifend vel at. Pharetra turpis
                fames cursus sit in faucibus.
              </p>
              <h3 className="comments-subtitle">Xurshid Istamov</h3>
              <p className="comments-texts">Frontend kursi o’quvchisi</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Comments;
