import React from "react";
import RevealOnScroll from "./RevealOnScroll";

export default function Partners() {
  return (
    <>
      {/* ================= PARTNERS ================= */}
      <section className="partners-section">
        <div className="container">
          <RevealOnScroll animation="zoom-in" duration={800}>
            <h2 className="partners-title">ĐỐI TÁC - THƯƠNG HIỆU</h2>
            <div className="partners-carousel">
              <button className="partner-nav">{'<'}</button>
              <div className="partner-logos">
                <div className="partner-logo" style={{ color: '#0058b0', fontWeight: '900', fontSize: '20px' }}>AUSTDOOR</div>
                <div className="partner-logo" style={{ color: '#333', fontWeight: '900', fontSize: '20px' }}>BOSSDOOR</div>
                <div className="partner-logo" style={{ color: '#e30613', fontWeight: '900', fontSize: '20px' }}>MITADOOR</div>
                <div className="partner-logo" style={{ color: '#000', fontWeight: '900', fontSize: '20px' }}>HORMANN</div>
                <div className="partner-logo" style={{ color: '#e30613', fontWeight: '900', fontSize: '24px' }}>YH</div>
                <div className="partner-logo" style={{ color: '#000', fontWeight: '900', fontSize: '20px' }}>FAAC</div>
              </div>
              <button className="partner-nav">{'>'}</button>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </>
  );
}

