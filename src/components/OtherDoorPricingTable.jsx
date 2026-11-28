import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DEFAULT_PRICE_QUOTES } from "../data/defaultPriceQuotes";
import "./OtherDoorPricingTable.css";

export default function OtherDoorPricingTable({
  quotes = null,
  currentCode = "",
  className = "",
  title = "Xem thêm bảng giá các dòng cửa:"
}) {
  const [itemsList, setItemsList] = useState(() => {
    if (Array.isArray(quotes) && quotes.length > 0) return quotes;
    try {
      const local = localStorage.getItem("boss_admin_price_quotes");
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return DEFAULT_PRICE_QUOTES;
  });

  useEffect(() => {
    if (Array.isArray(quotes) && quotes.length > 0) {
      setItemsList(quotes);
      return;
    }

    const loadQuotes = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL;
        if (apiUrl) {
          const res = await fetch(`${apiUrl}/api/price-quotes`);
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setItemsList(json.data);
            return;
          }
        }
      } catch (e) {}

      try {
        const local = localStorage.getItem("boss_admin_price_quotes");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItemsList(parsed);
            return;
          }
        }
      } catch (e) {}

      setItemsList(DEFAULT_PRICE_QUOTES);
    };

    loadQuotes();

    const handleUpdate = () => {
      try {
        const local = localStorage.getItem("boss_admin_price_quotes");
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItemsList(parsed);
          }
        }
      } catch (e) {}
    };

    window.addEventListener("priceQuotesUpdated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("priceQuotesUpdated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [quotes]);

  if (!itemsList || itemsList.length === 0) return null;

  // Ghép cặp 2 cột cho từng hàng (Rows of 2 columns) giống hệt mẫu
  const rows = [];
  for (let i = 0; i < itemsList.length; i += 2) {
    rows.push([itemsList[i], itemsList[i + 1] || null]);
  }

  const cleanCurrentCode = (currentCode || "").trim().toLowerCase();

  return (
    <section className={`other-door-pricing-wrapper ${className}`}>
      {title && <h3 className="other-door-pricing-title">{title}</h3>}
      <div className="other-door-pricing-table-container">
        <table className="other-door-pricing-table">
          <tbody>
            {rows.map((row, rowIdx) => (
              <tr key={rowIdx} className={rowIdx % 2 === 0 ? "row-stripe-bg" : "row-white-bg"}>
                {row.map((item, colIdx) => {
                  if (!item) {
                    return (
                      <td key={colIdx} className="other-door-pricing-td">
                        <span className="other-door-pricing-empty">&nbsp;</span>
                      </td>
                    );
                  }

                  const itemCode = (item.productCode || item.code || item.id || `quote-${colIdx}`).trim();
                  const rawTitle = item.productTitle || item.title || item.name || "Bảng giá";
                  const isCurrent =
                    cleanCurrentCode &&
                    (itemCode.toLowerCase() === cleanCurrentCode ||
                      (item.id && String(item.id).toLowerCase() === cleanCurrentCode) ||
                      rawTitle.toLowerCase().includes(cleanCurrentCode));

                  return (
                    <td
                      key={itemCode || colIdx}
                      className={`other-door-pricing-td ${isCurrent ? "is-current-page" : ""}`}
                    >
                      <Link to={`/bang-gia/${itemCode}`} className="other-door-pricing-link">
                        {rawTitle}
                      </Link>
                      {isCurrent && (
                        <span className="other-door-pricing-current-badge">Đang xem</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
