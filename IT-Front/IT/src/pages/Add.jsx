import React from "react";
import { useNavigate } from "react-router-dom";
import "../pages/Add.css";
import "../index.css";
const Add = () => {
  const navigate = useNavigate();

  return (
    <>
      <section className="add">
        <div className="container">
          <div className="add-inner">
            <h1 className="add-title">Bizga qo’shiling</h1>
            <h3 className="add-subtitle">
              Bizning safimizga nafaqat o’rganuvchi balki yetarkucha tajribangiz
              bo’lsa mentor sifatida ham qo’shilishingiz mumkin
            </h3>
            <div className="add-inner-login">
              <div className="left">
                <h2 className="left-title">O’quvchimisiz?</h2>
                <h3 className="left-subtitle">
                  Agarda o’quvchi bo’lsangiz bizning xalqaro darajadagi
                  tajribali mentorlarimizga shogird bo’ling
                </h3>
                <button onClick={() => navigate("/student-registration")} className="left-btn">Boshlash</button>
              </div>
              <div className="right">
                <h2 className="right-title">Mentormisiz?</h2>
                <h3 className="right-subtitle">
                  Bizning mualliflar jamoamizga qo’shilib, o’z tajribangizni
                  boshqalar bilan oosn va qulay platforma orqali ulashing
                </h3>
                <button
                  className="right-btn"
                  onClick={() => navigate("/teacher-registration")}
                >
                    Qo’shilish
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="online">
        <div className="container">
          <div className="online-inner">
             <h1 className="online-title">
              Istalgan nuqtadan onlayn o’qish imkoniyati
             </h1>
             <h3 className="online-subtitle">
              Biz sizga bu imkoniyatni taqdim qilamiz
             </h3>
            
          </div>
        </div>
      </section>
    </>
  );
};

export default Add;