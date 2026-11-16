// Product pricing details page - Boss Door
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  Star,
  HeadphonesIcon,
  PhoneCall,
  ArrowRight,
  ArrowLeft,
  Tag,
  Check,
  Truck,
  Wrench,
  Clock,
  HelpCircle,
  AlertCircle,
  MapPin,
  ChevronDown,
  Sparkles,
  Info,
  MessageCircle,
  Filter,
  Calendar
} from "lucide-react";
import { DEFAULT_PRICE_QUOTES } from "../data/defaultPriceQuotes";
import { DEFAULT_PRODUCT_ARTICLES } from "../data/defaultProductArticles";
import { getProductSlug } from "../utils/slug.js";
import { useAuth } from "../context/AuthContext";
import "./ProductPricing.css";

// Fallback products dictionary if not yet in state/DB
const FALLBACK_PRODUCTS = [
  {
    id: 1,
    code: "BD-900",
    category: "cuacuon",
    title: "Cửa cuốn khe thoáng Đức BossDoor",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    price: "1.450.000đ/m2",
    badge: "BÁN CHẠY",
    description: "Thân cửa hợp kim nhôm 6063-T5 cao cấp, sơn tĩnh điện CHLB Đức bảo hành 10 năm.",
    details: "Dòng cửa cuốn cao cấp thế hệ mới BossDoor tích hợp công nghệ chống sao chép mã khoá, cảm biến tự dừng khi gặp vật cản và điều khiển qua Smartphone từ xa.",
    specs: ["Hợp kim nhôm 6063-T5 siêu bền", "Độ dày nan: 1.4 - 2.2 mm", "Cảm biến hồng ngoại an toàn", "Bảo hành mô-tơ 10 năm"]
  },
  {
    id: 2,
    code: "DL-75",
    category: "cuacuon",
    title: "CỬA CUỐN ĐÀI LOAN GIÁ RẺ",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    price: "420.000đ/m2",
    badge: "TIẾT KIỆM",
    description: "Thép mạ màu Đài Loan độ bền cao, giải pháp tối ưu chi phí cho nhà xưởng & cửa hàng.",
    details: "Cửa cuốn công nghệ Đài Loan chất liệu tôn mạ màu nhập khẩu, chống rỉ sét tốt, vận hành bằng lò xo trợ lực hoặc mô tơ điện kéo êm ái.",
    specs: ["Tôn mạ màu Đài Loan 0.6 - 1.2mm", "Chống ăn mòn thời tiết", "Kéo tay hoặc chạy mô tơ", "Bảo hành 2 năm"]
  },
  {
    id: 3,
    code: "BD-L70",
    category: "cuacuon",
    title: "CỬA CUỐN TẤM LIỀN ÚC SIÊU ÊM",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "980.000đ/m2",
    badge: "MỚI",
    description: "Đóng mở êm ái không tiếng ồn, hợp kim thép Colorbond Úc chống ăn mòn.",
    details: "Cửa cuốn tấm liền bằng thép hợp kim mạ nhôm kẽm Colorbond của Úc, tích hợp dây cao su polyguide giảm chấn giúp vận hành cực kỳ êm ái.",
    specs: ["Thép mạ kẽm Colorbond Úc", "Tích hợp chốt ly khai thoát hiểm", "Tốc độ đóng mở 15-20 cm/s", "Bảo hành 3 năm"]
  },
  {
    id: 4,
    code: "SN-100",
    category: "cuacuon",
    title: "CỬA CUỐN SONG NGANG - MẮC VÕNG INOX / SƠN TĨNH ĐIỆN",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    price: "1.200.000đ/m2",
    badge: "HOT",
    description: "Thông thoáng tối đa, góc quan sát rộng cho TTTM, ngân hàng, gara.",
    details: "Cửa cuốn song ngang mắc võng chất liệu Inox 304 hoặc sắt sơn tĩnh điện cao cấp, đảm bảo an toàn tuyệt đối mà vẫn giữ không gian thông thoáng.",
    specs: ["Inox 304 / Sắt sơn tĩnh điện", "Ống phi 19 - 22mm dày 1.0 - 1.2mm", "Tầm nhìn thông thoáng 90%", "Bảo hành 3 năm"]
  },
  {
    id: 5,
    code: "BD-LUX",
    category: "cuacuon",
    title: "CỬA CUỐN CAO CẤP THẾ HỆ MỚI BOSSDOOR",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    price: "2.100.000đ/m2",
    badge: "LUXURY",
    description: "Dòng cửa cuốn siêu sang tích hợp AI, sơn tĩnh điện AkzoNobel CHLB Đức.",
    details: "Phiên bản đỉnh cao của BossDoor với thiết kế nan chèn cao su giảm chấn 2 chiều, sơn bột tĩnh điện AkzoNobel Đức gia nhiệt cao cấp.",
    specs: ["Hợp kim nhôm hàng không 6063-T6", "Sơn AkzoNobel Đức bảo hành 10 năm", "Kết nối Smarthome thông minh", "Bảo hành 10 năm"]
  },
  {
    id: 6,
    code: "BEC.5810",
    category: "cuacuon",
    title: "Cửa cuốn Bossdoor ECO BEC.5810",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    price: "1.500.000đ/m2",
    badge: "HOT",
    description: "Cửa cuốn Bossdoor ECO BEC.5810 là giải pháp tối ưu cho những ai đang tìm kiếm sự cân bằng giữa chất lượng và chi phí.",
    details: "Nan cửa nhôm hợp kim 6063-T5 cao cấp sơn phủ tĩnh điện ngoài trời, vận hành êm ái chống ồn và chịu gió bão tốt.",
    specs: ["Hợp kim nhôm 6063-T5", "Bảo hành 10 năm", "Sơn tĩnh điện chống muối mặn"]
  },
  {
    id: 7,
    code: "MT-500",
    category: "phukien",
    title: "MÔ TƠ CỬA CUỐN NHẬP KHẨU ĐÀI LOAN / ĐỨC",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    price: "3.500.000đ/bộ",
    badge: "CHÍNH HÃNG",
    description: "Động cơ dây đồng 100%, sức kéo mạnh mẽ 300kg - 1000kg, chống hành trình tràn.",
    details: "Mô tơ cửa cuốn chính hãng tích hợp rơ-le nhiệt tự ngắt khi quá tải, phanh đĩa kép an toàn và bộ tự dừng khi gặp chướng ngại vật.",
    specs: ["Lõi đồng 100% nguyên chất", "Sức kéo: 300kg - 1000kg", "Tích hợp đảo chiều an toàn", "Bảo hành 10 năm 1 đổi 1"]
  },
  {
    id: 8,
    code: "UPS-800",
    category: "phukien",
    title: "BÌNH LƯU ĐIỆN CỬA CUỐN (UPS DỰ PHÒNG)",
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
    price: "2.800.000đ/bộ",
    badge: "NỔI BẬT",
    description: "Lưu điện dự phòng thông minh 48h - 72h khi xảy ra cúp điện lưới.",
    details: "Bộ lưu điện UPS chuyên dụng cho cửa cuốn sử dụng ắc quy khô tích điện công nghệ Gel, mạch sạc tự động bảo vệ bình không bị chai.",
    specs: ["Thời gian chờ: 48 - 72 giờ", "Công suất: 800W - 1500W", "Tự động chuyển nguồn khi cúp điện", "Bảo hành 2 năm"]
  },
  {
    id: 9,
    code: "CK-DL",
    category: "cuakeo",
    title: "CỬA KÉO ĐÀI LOAN CÓ LÁ / KHÔNG LÁ",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "480.000đ/m2",
    badge: "BÁN CHẠY",
    description: "Thân cửa thép mạ màu Đài Loan, nhíp keo hoa văn sang trọng, kéo nhẹ êm.",
    details: "Cửa kéo Đài Loan chất liệu tôn mạ màu nhập khẩu, nhíp ép thủy lực chắc chắn, bạc đạn bạc inox giúp đóng mở siêu nhẹ nhàng.",
    specs: ["Độ dày U: 0.6mm - 1.4mm", "Nhíp sơn tĩnh điện hoa văn", "Bạc đạn inox chống kẹt", "Bảo hành 2 năm"]
  },
  {
    id: 10,
    code: "CK-IX304",
    category: "cuakeo",
    title: "CỬA KÉO INOX 304 CAO CẤP",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    price: "1.850.000đ/m2",
    badge: "SIÊU BỀN",
    description: "100% Inox 304 sáng bóng không rỉ sét, chịu lực tối đa cho mặt phố & biệt thự.",
    details: "Dòng cửa kéo cao cấp bằng Inox 304 nguyên chất chống ăn mòn hóa chất và nước biển, cực kỳ thích hợp cho thời tiết ven biển Đà Nẵng.",
    specs: ["100% Inox 304 chuẩn", "Thanh U dày 1.0 - 1.5mm", "Không gỉ sét dưới mọi thời tiết", "Bảo hành 10 năm"]
  },
  {
    id: 11,
    code: "IT-GHOST",
    category: "cuatudong",
    title: "CỔNG TỰ ĐỘNG ÂM SÀN / TAY CO ITALIA",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    price: "32.000.000đ/bộ",
    badge: "VIP",
    description: "Mô-tơ âm sàn chống nước IP67, điều khiển Smartphone cho Biệt thự & Villa.",
    details: "Hệ thống cổng mở xoay âm sàn nhập khẩu Ý 100%, động cơ đúc nguyên khối chống ngập nước tiêu chuẩn IP67, chịu tải nặng tới 800kg/cánh.",
    specs: ["Tiêu chuẩn chống nước IP67 Ý", "Tải trọng: 800kg / cánh", "Góc mở: 110° - 180°", "Bảo hành 10 năm"]
  },
  {
    id: 12,
    code: "NAB-150",
    category: "cuatudong",
    title: "CỬA TRƯỢT TỰ ĐỘNG KABA / NABCO NHẬT BẢN",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
    price: "18.500.000đ/bộ",
    badge: "HOT",
    description: "Mắt thần cảm biến radar vi sóng siêu nhạy, vận hành êm ái cho TTTM, sảnh lớn.",
    details: "Cửa kính trượt tự động cao cấp nhập khẩu Nhật Bản / Thụy Sĩ. Động cơ DC không chổi than êm ái, hoạt động liên tục với tuổi thọ > 2.000.000 lần đóng mở.",
    specs: ["Động cơ DC Brushless 120W", "Tải trọng: 150kg x 2 cánh", "Cảm biến an toàn chống kẹp người", "Bảo hành 3 năm"]
  },
  {
    id: 13,
    code: "CK-DE",
    category: "cuakeo",
    title: "CỬA KÉO CÔNG NGHỆ ĐỨC (CN ĐỨC SƠN TĨNH ĐIỆN AKZONOBEL)",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    price: "980.000 - 1.230.000đ/m²",
    badge: "CAO CẤP",
    description: "Thanh U dày 0.9 - 1.5mm sơn tĩnh điện AKZO NOBEL CHLB Đức, máng đúc bi treo, nhíp đặc lập là.",
    details: "Dòng cửa kéo công nghệ Đức thế hệ mới với thanh U dày 0.9 - 1.5mm sơn phủ AkzoNobel cao cấp, máng đúc bi treo siêu êm, nhíp đặc lập là chắc chắn, chống rỉ sét tuyệt đối trong khí hậu miền biển Đà Nẵng.",
    specs: ["Sơn tĩnh điện AkzoNobel CHLB Đức", "Máng đúc bi treo siêu êm", "Nhíp đặc lập là chịu lực", "Bảo hành 10 năm"]
  },
  {
    id: 14,
    code: "SR3",
    category: "cuakeo",
    title: "CỬA KÉO CÔNG NGHỆ ĐỨC SR3 (U DÀY 0.9 MM)",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    price: "980.000đ/m2",
    badge: "TIẾT KIỆM",
    description: "U dày 0.9 mm sơn tĩnh điện AKZO NOBEL công nghệ Đức, máng đúc bi treo, nhíp đặc lập là.",
    details: "Dòng cửa kéo công nghệ Đức kinh tế SR3 thích hợp cho nhà phố, cửa hàng với độ bền cao và chi phí tối ưu.",
    specs: ["U dày 0.9mm chuẩn", "Sơn AkzoNobel Đức", "Máng đúc bi treo", "Bảo hành 3 năm"]
  },
  {
    id: 15,
    code: "SR2",
    category: "cuakeo",
    title: "CỬA KÉO CÔNG NGHỆ ĐỨC SR2 (U DÀY 1.1 MM)",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    price: "1.030.000đ/m2",
    badge: "BÁN CHẠY",
    description: "U dày 1.1 mm sơn tĩnh điện AKZO NOBEL công nghệ Đức, máng đúc bi treo, nhíp đặc lập là.",
    details: "Dòng cửa kéo công nghệ Đức SR2 bán chạy nhất với độ dày 1.1mm cứng cáp, vận hành êm ái.",
    specs: ["U dày 1.1mm", "Sơn AkzoNobel Đức", "Máng đúc bi treo", "Bảo hành 10 năm"]
  },
  {
    id: 16,
    code: "SR1",
    category: "cuakeo",
    title: "CỬA KÉO CÔNG NGHỆ ĐỨC SR1 (U DÀY 1.3 MM)",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    price: "1.120.000đ/m2",
    badge: "CAO CẤP",
    description: "U dày 1.3 mm sơn tĩnh điện AKZO NOBEL công nghệ Đức, máng đúc bi treo, nhíp đặc lập là.",
    details: "Phiên bản cao cấp SR1 độ dày 1.3mm chống trộm vượt trội, sơn ngoài trời bền màu 15 năm.",
    specs: ["U dày 1.3mm chịu lực", "Sơn AkzoNobel Đức", "Máng đúc bi treo", "Bảo hành 10 năm"]
  },
  {
    id: 17,
    code: "VIP",
    category: "cuakeo",
    title: "CỬA KÉO CÔNG NGHỆ ĐỨC VIP (U DÀY 1.5 MM)",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    price: "1.180.000đ/m2",
    badge: "VIP",
    description: "U dày 1.5 mm sơn tĩnh điện AKZO NOBEL công nghệ Đức, máng đúc bi treo, nhíp đặc lập là.",
    details: "Dòng cửa kéo đỉnh cao VIP dày 1.5mm siêu bền bỉ, nhíp đặc lập là đúc dày, bảo vệ an toàn tối đa.",
    specs: ["U dày 1.5mm dày nhất", "Sơn AkzoNobel Đức", "Máng đúc bi treo cao cấp", "Bảo hành 10 năm"]
  }
];

// Tiered Price Dataset for German Folding Doors (Cửa kéo công nghệ Đức 2026 tại Đà Nẵng)
const GERMAN_FOLDING_DOOR_TIERS = [
  {
    stt: 1,
    code: "SR3",
    name: "Thân cửa kéo SR3",
    specs: [
      "U dày 0.9 mm sơn tĩnh điện AKZO NOBEL công nghệ Đức",
      "Máng đúc, bi treo chịu lực siêu êm",
      "Nhíp đặc lập là gia cố chắc chắn",
      "Lá sơn tĩnh điện chống trầy xước"
    ],
    unit: "m2",
    colors: [
      { name: "Ghi sáng", hex: "#94a3b8" },
      { name: "Vàng kem", hex: "#fde047" },
      { name: "Cà phê", hex: "#78350f" },
      { name: "Xanh", hex: "#166534" }
    ],
    priceOver8: "980.000đ",
    price6to8: "1.010.000đ",
    price4to6: "1.030.000đ",
    badge: "TIẾT KIỆM"
  },
  {
    stt: 2,
    code: "SR2",
    name: "Thân cửa kéo SR2",
    specs: [
      "U dày 1.1 mm sơn tĩnh điện AKZO NOBEL công nghệ Đức",
      "Máng đúc, bi treo chịu lực siêu êm",
      "Nhíp đặc lập là gia cố chắc chắn",
      "Lá sơn tĩnh điện chống trầy xước"
    ],
    unit: "m2",
    colors: [
      { name: "Ghi sáng", hex: "#94a3b8" },
      { name: "Vàng kem", hex: "#fde047" },
      { name: "Cà phê", hex: "#78350f" },
      { name: "Xanh", hex: "#166534" }
    ],
    priceOver8: "1.030.000đ",
    price6to8: "1.060.000đ",
    price4to6: "1.080.000đ",
    badge: "BÁN CHẠY"
  },
  {
    stt: 3,
    code: "SR1",
    name: "Thân cửa kéo SR1",
    specs: [
      "U dày 1.3 mm sơn tĩnh điện AKZO NOBEL công nghệ Đức",
      "Máng đúc, bi treo chịu lực siêu êm",
      "Nhíp đặc lập là gia cố chắc chắn",
      "Lá sơn tĩnh điện chống trầy xước"
    ],
    unit: "m2",
    colors: [
      { name: "Ghi sáng", hex: "#94a3b8" },
      { name: "Vàng kem", hex: "#fde047" },
      { name: "Cà phê", hex: "#78350f" },
      { name: "Xanh", hex: "#166534" }
    ],
    priceOver8: "1.120.000đ",
    price6to8: "1.150.000đ",
    price4to6: "1.170.000đ",
    badge: "CAO CẤP"
  },
  {
    stt: 4,
    code: "VIP",
    name: "Thân cửa kéo VIP",
    specs: [
      "U dày 1.5 mm sơn tĩnh điện AKZO NOBEL công nghệ Đức",
      "Máng đúc, bi treo chịu lực siêu êm",
      "Nhíp đặc lập là gia cố chắc chắn",
      "Lá sơn tĩnh điện chống trầy xước"
    ],
    unit: "m2",
    colors: [
      { name: "Ghi sáng", hex: "#94a3b8" },
      { name: "Vàng kem", hex: "#fde047" },
      { name: "Cà phê", hex: "#78350f" },
      { name: "Xanh", hex: "#166534" }
    ],
    priceOver8: "1.180.000đ",
    price6to8: "1.210.000đ",
    price4to6: "1.230.000đ",
    badge: "VIP ĐẶC BIỆT"
  }
];

// Add-ons / Lựa chọn thêm
const GERMAN_DOOR_ADDONS = [
  {
    category: "1. Ray Inox đặc chìm (Âm sàn)",
    items: [
      { name: "Ray Inox đặc 201 chìm", price: "+ 280.000 đ/md", unit: "mét dài (md)" },
      { name: "Ray Inox đặc 304 chìm", price: "+ 350.000 đ/md", unit: "mét dài (md)" }
    ]
  },
  {
    category: "2. Ray Inox đặc nổi",
    items: [
      { name: "Ray Inox đặc 201 nổi", price: "+ 330.000 đ/md", unit: "mét dài (md)" },
      { name: "Ray Inox đặc 304 nổi", price: "+ 400.000 đ/md", unit: "mét dài (md)" }
    ]
  },
  {
    category: "3. Trụ khóa an toàn",
    items: [
      { name: "Trụ khóa cửa 1 cánh chuyên dụng", price: "+ 50.000 đ/m dài", unit: "m dài" }
    ]
  }
];

const sanitizeSpec = (text) => {
  if (typeof text !== "string") return text;
  let s = text.replace(/110\s*năm/gi, "15 năm");
  s = s.replace(/(?<!\d)5\s*năm/gi, "10 năm");
  return s;
};

const PRODUCT_PRICE_RANGES = {
  "CK-DE": "980.000 - 1.230.000đ/m²",
  "BEC.5810": "1.500.000 - 1.750.000đ/m²",
  "DL-75": "420.000 - 550.000đ/m²",
  "BD-LUX": "2.100.000 - 2.250.000đ/m²",
  "BD-900": "1.450.000 - 1.850.000đ/m²",
  "BD-L70": "980.000 - 1.350.000đ/m²",
  "SN-100": "1.200.000 - 1.800.000đ/m²",
  "CK-DL": "480.000 - 850.000đ/m²",
  "CK-IX304": "1.850.000 - 2.600.000đ/m²",
  "MT-500": "3.500.000 - 7.500.000đ/bộ",
  "UPS-800": "2.800.000 - 4.500.000đ/bộ",
  "WF-APP": "1.200.000 - 1.800.000đ/bộ",
  "IT-GHOST": "32.000.000 - 45.000.000đ/bộ",
  "NAB-150": "18.500.000 - 28.000.000đ/bộ"
};

const PRICING_BREADCRUMB_TITLES = {
  "CK-DE": "Bảng giá cập nhật cửa kéo công nghệ Đức 2026 tại Đà Nẵng",
  "BEC.5810": "Bảng giá Cửa cuốn BossDoor ECO BEC.5810",
  "DL-75": "Bảng giá Cửa cuốn Đài Loan",
  "BD-LUX": "Bảng giá Cửa cuốn BossDoor Luxury",
  "BD-900": "Bảng giá Cửa cuốn Đức BossDoor BD-900",
  "BD-L70": "Bảng giá Cửa cuốn tấm liền Úc",
  "SN-100": "Bảng giá Cửa cuốn song ngang - mắc võng",
  "CK-DL": "Bảng giá Cửa kéo Đài Loan",
  "CK-IX304": "Bảng giá Cửa kéo Inox 304",
  "MT-500": "Bảng giá Mô tơ cửa cuốn nhập khẩu",
  "UPS-800": "Bảng giá Bình lưu điện cửa cuốn",
  "WF-APP": "Bảng giá Bộ điều khiển cửa cuốn qua điện thoại",
  "IT-GHOST": "Bảng giá Mô tơ cổng tự động âm sàn Italia",
  "NAB-150": "Bảng giá Cửa kính trượt tự động",
  "SR1": "Bảng giá Cửa kéo công nghệ Đức SR1",
  "SR2": "Bảng giá Cửa kéo công nghệ Đức SR2",
  "SR3": "Bảng giá Cửa kéo công nghệ Đức SR3",
  "VIP": "Bảng giá Cửa kéo công nghệ Đức VIP"
};

const getPricingBreadcrumbTitle = (prod, article) => {
  if (article?.seo?.title) {
    const raw = article.seo.title.split("|")[0].trim();
    if (raw) return raw;
  }
  if (!prod) return "Bảng giá chi tiết";
  const codeKey = (prod.code || "").toUpperCase();
  if (codeKey && PRICING_BREADCRUMB_TITLES[codeKey]) {
    return PRICING_BREADCRUMB_TITLES[codeKey];
  }
  const rawTitle = prod.title || prod.name || prod.code || "";
  const cleanTitle = rawTitle.split("(")[0].trim();
  if (cleanTitle.toLowerCase().startsWith("bảng giá")) {
    return cleanTitle;
  }
  return `Bảng giá ${cleanTitle}`;
};

const getPublishDate = (article) => {
  if (article?.publishDate) return article.publishDate;
  if (article?.createdAt) {
    try {
      const d = new Date(article.createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("vi-VN");
      }
    } catch (e) {}
  }
  return "24/04/2026";
};

// Helper format giá sang chuẩn rút gọn 'k' giống ảnh 2 (Ví dụ: 4,110k, 980k, 1,030k)
const formatK = (val) => {
  if (!val) return "Liên hệ";
  const str = String(val).trim();
  if (str.toLowerCase() === "liên hệ") return "Liên hệ";
  if (/k$/i.test(str)) return str;

  const digitsOnly = str.replace(/[^\d]/g, "");
  if (!digitsOnly) return str;

  const num = parseInt(digitsOnly, 10);
  if (isNaN(num)) return str;

  if (num >= 1000) {
    const inK = Math.round(num / 1000);
    return `${inK.toLocaleString("en-US")}k`;
  }
  return `${num}đ`;
};

// Helper chuẩn hóa các gạch đầu dòng chi tiết kỹ thuật cho mobile
const formatMobileSpecs = (description, colors) => {
  if (!description && !colors) return [];

  const rawLines = typeof description === "string" 
    ? description.split(/\r?\n/).map((l) => l.trim()).filter(Boolean)
    : Array.isArray(description) 
      ? description 
      : [];
  const specLines = [];

  for (const line of rawLines) {
    if (typeof line !== "string") continue;
    // Bỏ qua dòng chỉ là tên sản phẩm lặp lại
    if (/^thân cửa\s+[a-z0-9]+/i.test(line) && !line.includes(":") && !line.includes("–") && !line.includes("-")) {
      continue;
    }
    const cleanLine = line.replace(/^[-–•*]\s*/, "");
    if (cleanLine) {
      specLines.push(`– ${cleanLine}`);
    }
  }

  if (colors && !specLines.some((l) => l.toLowerCase().includes("màu"))) {
    const colorText = typeof colors === "string" 
      ? colors 
      : Array.isArray(colors) 
        ? colors.map(c => c.name || c).join(", ") 
        : "";
    if (colorText) specLines.push(`– Màu sắc: ${colorText}`);
  }

  return specLines;
};

// Helper lấy giá cho bảng mobile theo filter diện tích
const getMobileTablePrice = (row, activeAreaFilter) => {
  let rawPrice = row.priceOver8;
  if (activeAreaFilter === "from6to8") {
    rawPrice = row.price6to8 || row.priceOver8;
  } else if (activeAreaFilter === "from4to6") {
    rawPrice = row.price4to6 || row.priceOver8;
  } else if (activeAreaFilter === "over8") {
    rawPrice = row.priceOver8;
  } else {
    rawPrice = row.priceOver8 || row.price;
  }
  return formatK(rawPrice);
};

const filterArticleHtml = (html) => {
  if (!html) return "";
  return html
    .replace(/<div class="editor-callout-box">[\s\S]*?(?:CÔNG TY TNHH|BOSSDOOR ĐÀ NẴNG|647 Ngô Quyền)[\s\S]*?<\/div>/gi, "")
    .replace(/<h2>5\.\s*Địa chỉ liên hệ[\s\S]*?<\/h2>/gi, "")
    .replace(/<p>[^<]*?liên hệ với chúng tôi:?<\/p>/gi, "");
};

export default function ProductPricing() {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const path = location.pathname.toLowerCase();
  const isDirectGermanDoorUrl =
    path.includes("bang-gia-cap-nhat-cua-keo-cong-nghe-duc") ||
    path.includes("cua-keo-cong-nghe-duc");
  const effectiveId = id || (isDirectGermanDoorUrl ? "CK-DE" : "CK-DE");

  const [product, setProduct] = useState(() => {
    if (location.state?.product) return location.state.product;
    const searchKey = String(effectiveId || "").toLowerCase().trim();
    const fallback = FALLBACK_PRODUCTS.find(
      (p) =>
        String(p.id) === searchKey ||
        p.code.toLowerCase() === searchKey ||
        (searchKey.includes("cua-keo") && p.code === "CK-DE") ||
        (searchKey.includes("bang-gia-cap-nhat") && p.code === "CK-DE")
    ) || (isDirectGermanDoorUrl || !id ? FALLBACK_PRODUCTS.find((p) => p.code === "CK-DE") : null);
    return fallback || null;
  });

  const [loading, setLoading] = useState(false);

  const [priceQuote, setPriceQuote] = useState(() => {
    return DEFAULT_PRICE_QUOTES.find(
      (q) => q.productCode?.toLowerCase() === (effectiveId || "CK-DE").toLowerCase()
    ) || DEFAULT_PRICE_QUOTES.find((q) => q.productCode === "CK-DE") || null;
  });

  const [productArticle, setProductArticle] = useState(() => {
    return DEFAULT_PRODUCT_ARTICLES.find(
      (a) => a.productCode?.toLowerCase() === (effectiveId || "CK-DE").toLowerCase()
    ) || DEFAULT_PRODUCT_ARTICLES.find((a) => a.productCode === "CK-DE") || null;
  });

  const [activeAreaFilter, setActiveAreaFilter] = useState("all"); // 'all' | 'over8' | 'from6to8' | 'from4to6'

  // Load price quote matching this product
  useEffect(() => {
    const code = product?.code || effectiveId;
    if (!code) return;

    let isMounted = true;

    const fetchQuote = async () => {
      let foundQuote = null;

      // 1. Fetch from backend API
      if (import.meta.env.VITE_API_URL) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/price-quotes/${code}`);
          const json = await res.json();
          if (json.success && json.data) {
            foundQuote = json.data;
          }
        } catch (e) {
          console.log("Could not load price quote from API:", e.message);
        }
      }

      // 2. Fallback to localStorage
      if (!foundQuote) {
        const local = localStorage.getItem("boss_admin_price_quotes");
        if (local) {
          try {
            const list = JSON.parse(local);
            foundQuote = list.find(
              (q) =>
                q.productCode.toLowerCase() === code.toLowerCase() ||
                (q.items && q.items.some((it) => it.code.toLowerCase() === code.toLowerCase()))
            );
          } catch (e) {
            console.error(e);
          }
        }
      }

      // 3. Fallback to DEFAULT_PRICE_QUOTES
      if (!foundQuote) {
        foundQuote = DEFAULT_PRICE_QUOTES.find(
          (q) =>
            q.productCode.toLowerCase() === code.toLowerCase() ||
            (q.items && q.items.some((it) => it.code.toLowerCase() === code.toLowerCase()))
        );
      }

      // 4. Fallback based on category
      if (!foundQuote) {
        const upperCode = code.toUpperCase();
        if (product?.category === "cuakeo" || upperCode.startsWith("CK") || upperCode.startsWith("SR") || upperCode === "VIP" || isDirectGermanDoorUrl) {
          foundQuote = DEFAULT_PRICE_QUOTES.find((q) => q.productCode === "CK-DE");
        } else {
          foundQuote = DEFAULT_PRICE_QUOTES.find((q) => q.productCode === "BEC.5810") || DEFAULT_PRICE_QUOTES[0];
        }
      }

      if (isMounted && foundQuote) {
        setPriceQuote(foundQuote);
      }
    };

    fetchQuote();

    return () => {
      isMounted = false;
    };
  }, [product, effectiveId, isDirectGermanDoorUrl]);

  // Load product article (rich content & guide)
  useEffect(() => {
    const code = product?.code || effectiveId;
    if (!code) return;

    let isMounted = true;

    const fetchArticle = async () => {
      let foundArticle = null;

      // 1. Fetch from backend API
      if (import.meta.env.VITE_API_URL) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/product-articles/${code}`);
          const json = await res.json();
          if (json.success && json.data) {
            foundArticle = json.data;
          }
        } catch (e) {
          console.log("Could not load product article from API:", e.message);
        }
      }

      // 2. Fallback to localStorage
      if (!foundArticle) {
        const local = localStorage.getItem("boss_admin_product_articles");
        if (local) {
          try {
            const list = JSON.parse(local);
            foundArticle = list.find(
              (a) =>
                a.productCode?.toUpperCase() === code.toUpperCase() ||
                (a.seo?.slug && code.toLowerCase().includes(a.seo.slug.toLowerCase()))
            );
          } catch (e) {
            console.error(e);
          }
        }
      }

      // 3. Fallback to DEFAULT_PRODUCT_ARTICLES
      if (!foundArticle) {
        foundArticle = DEFAULT_PRODUCT_ARTICLES.find(
          (a) =>
            a.productCode?.toUpperCase() === code.toUpperCase() ||
            (code.toUpperCase().startsWith("CK") && a.productCode === "CK-DE") ||
            (isDirectGermanDoorUrl && a.productCode === "CK-DE") ||
            (a.seo?.slug && code.toLowerCase().includes(a.seo.slug.toLowerCase()))
        );
      }

      // 4. Default fallback for German door
      if (!foundArticle && (code.toUpperCase().includes("CK") || code.toUpperCase().includes("SR") || code.toUpperCase() === "VIP" || isDirectGermanDoorUrl)) {
        foundArticle = DEFAULT_PRODUCT_ARTICLES.find((a) => a.productCode === "CK-DE");
      }

      if (isMounted && foundArticle) {
        setProductArticle(foundArticle);
      }
    };

    fetchArticle();

    return () => {
      isMounted = false;
    };
  }, [product, effectiveId, isDirectGermanDoorUrl]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Lookup product by ID or Code if not passed via location state
  useEffect(() => {
    if (product) return;

    let isMounted = true;
    setLoading(true);

    const lookupProduct = async () => {
      // 1. Check fallback list first
      const searchKey = String(effectiveId || "").toLowerCase().trim();
      let foundInFallback = FALLBACK_PRODUCTS.find(
        (p) =>
          String(p.id) === searchKey ||
          p.code.toLowerCase() === searchKey ||
          (searchKey.includes("cua-keo") && p.code === "CK-DE") ||
          (searchKey.includes("bang-gia-cap-nhat") && p.code === "CK-DE")
      );

      if (!foundInFallback && (isDirectGermanDoorUrl || !id)) {
        foundInFallback = FALLBACK_PRODUCTS.find((p) => p.code === "CK-DE");
      }

      // 2. Try fetching from backend API
      if (import.meta.env.VITE_API_URL && effectiveId) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${effectiveId}`);
          const resJson = await res.json();
          if (resJson.success && resJson.data && isMounted) {
            const fetchedProduct = { ...resJson.data };
            if (Array.isArray(fetchedProduct.specs)) {
              fetchedProduct.specs = fetchedProduct.specs.map(sanitizeSpec);
            }
            if (fetchedProduct.code && PRODUCT_PRICE_RANGES[fetchedProduct.code]) {
              fetchedProduct.price = PRODUCT_PRICE_RANGES[fetchedProduct.code];
            }
            setProduct(fetchedProduct);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.log("Could not fetch product detail from API, using local match:", err.message);
        }
      }

      if (foundInFallback && isMounted) {
        const fallbackObj = { ...foundInFallback };
        if (fallbackObj.code && PRODUCT_PRICE_RANGES[fallbackObj.code]) {
          fallbackObj.price = PRODUCT_PRICE_RANGES[fallbackObj.code];
        }
        setProduct(fallbackObj);
      }
      if (isMounted) setLoading(false);
    };

    lookupProduct();

    return () => {
      isMounted = false;
    };
  }, [id, effectiveId, product, isDirectGermanDoorUrl]);

  // Dynamic SEO meta updates
  useEffect(() => {
    if (product) {
      const pageTitle = productArticle?.seo?.title || `Bảng Giá ${product.title} - Báo Giá Trọn Gói 2026 | Boss Đà Nẵng`;
      document.title = pageTitle;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = productArticle?.seo?.description || `Bảng giá chi tiết ${product.title} (Mã: ${product.code}). Giá niêm yết: ${product.price || "Liên hệ"}. Khảo sát tận nơi miễn phí, bảo hành chính hãng tại Đà Nẵng.`;
    }
  }, [product, productArticle]);

  if (loading) {
    return (
      <div className="pricing-loading-screen">
        <div className="pricing-spinner"></div>
        <p>Đang tải bảng giá sản phẩm...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found-view">
        <div className="container text-center py-20">
          <h2>Không Tìm Thấy Bảng Giá Sản Phẩm</h2>
          <p>Mã sản phẩm hoặc đường dẫn báo giá này không tồn tại trong hệ thống.</p>
          <div className="not-found-actions">
            <Link to="/san-pham" className="btn-return-catalog">
              <ArrowLeft size={16} /> VỀ DANH MỤC SẢN PHẨM
            </Link>
            <Link to="/bang-gia" className="btn-return-catalog outline">
              XEM TẤT CẢ BẢNG GIÁ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if product has an official price string
  const hasOfficialPrice = product.price && product.price !== "Liên hệ" && product.price.trim() !== "";

  // Dynamic pricing breakdown tiers based on product specs or default tier
  const pricingTiers = [
    {
      name: "Quy cách tiêu chuẩn",
      spec: product.specs?.[0] || "Theo thông số nhà sản xuất",
      unit: product.price?.includes("/bộ") ? "Bộ" : "m2",
      price: hasOfficialPrice ? product.price : "Liên hệ nhận giá",
      status: "Sẵn hàng"
    },
    {
      name: "Quy cách tăng cường chống bão",
      spec: product.specs?.[1] || "Độ dày tối ưu gia cường gân chịu lực",
      unit: product.price?.includes("/bộ") ? "Bộ" : "m2",
      price: hasOfficialPrice ? "Tùy kích thước đo đạc" : "Liên hệ nhận giá",
      status: "Gia công theo yêu cầu"
    }
  ];

  // Dynamic accessories based on category
  const accessoriesList = product.category === "cuacuon"
    ? [
        {
          name: "Mô tơ xích kéo lõi đồng 100% (300kg - 800kg)",
          price: "Từ 3.500.000đ/bộ",
          warranty: "10 năm 1 đổi 1",
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Bình lưu điện dự phòng UPS (48h - 72h)",
          price: "Từ 2.800.000đ/bộ",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Bộ điều khiển qua điện thoại Smart WiFi/4G",
          price: "1.200.000đ/bộ",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Tay điều khiển remote mã nhảy Rolling Code",
          price: "650.000đ/bộ",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80"
        }
      ]
    : product.category === "cuakeo"
    ? [
        {
          name: "Bạc đạn inox bi kín chống rỉ sét",
          price: "Đồng bộ theo cửa",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Khóa âm sàn chống cắt chuyên dụng",
          price: "350.000đ/bộ",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Sơn AkzoNobel CHLB Đức ngoài trời",
          price: "Đã bao gồm",
          warranty: "10 năm",
          image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=600&q=80"
        }
      ]
    : product.category === "cuatudong"
    ? [
        {
          name: "Mô tơ âm sàn Italia chuẩn chống nước IP67",
          price: "Đồng bộ theo hệ",
          warranty: "10 năm",
          image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Cảm biến hồng ngoại Photocell chống kẹp",
          price: "Kèm theo bộ",
          warranty: "3 năm",
          image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=600&q=80"
        },
        {
          name: "Bộ điều khiển Smartphone thông minh",
          price: "Tích hợp sẵn",
          warranty: "2 năm",
          image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80"
        }
      ]
    : [
        {
          name: "Phụ kiện đồng bộ chính hãng",
          price: "Theo quy cách",
          warranty: "Chính hãng 100%",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80"
        }
      ];

  // Danh sách dòng sản phẩm cho bảng giá (dùng chung cho cả Desktop và Mobile)
  const defaultGermanItems = DEFAULT_PRICE_QUOTES.find((q) => q.productCode === "CK-DE")?.items || [];
  const quoteTableItems =
    priceQuote?.items && priceQuote.items.length > 0
      ? priceQuote.items
      : (product?.category === "cuakeo" || (product?.code && product.code.toUpperCase().includes("CK")) || isDirectGermanDoorUrl)
      ? defaultGermanItems
      : pricingTiers.map((t, idx) => ({
          stt: idx + 1,
          code: product?.code || "CK-DE",
          name: t.name,
          description: t.spec,
          unit: t.unit,
          colors: "Theo tiêu chuẩn",
          priceOver8: t.price,
          price6to8: t.price,
          price4to6: t.price
        }));

  // Danh sách các bài viết bảng giá liên quan của các dòng cửa khác (chuẩn định dạng Horizontal Card như Pricing.jsx)
  const relatedPriceQuotes = useMemo(() => {
    const currentCode = (product?.code || "CK-DE").toUpperCase();
    const currentCategory = product?.category || "cuakeo";

    const allQuotes = [
      {
        code: "CK-DE",
        title: "CỬA KÉO CÔNG NGHỆ ĐỨC (CN ĐỨC SƠN TĨNH ĐIỆN)",
        category: "cuakeo",
        categoryName: "CỬA KÉO",
        price: "980.000 - 1.230.000đ/m²",
        badge: "CAO CẤP",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        description: "Thanh U hợp kim nhôm sơn tĩnh điện CHLB Đức, kiểu dáng hiện đại bền đẹp 15 năm.",
        specs: [
          "Hợp kim nhôm Đức siêu nhẹ",
          "Sơn AkzoNobel bền màu 15 năm",
          "Nhíp lá nhôm đúc định hình",
          "Bảo hành 10 năm"
        ],
        path: "/bang-gia-cap-nhat-cua-keo-cong-nghe-duc-2026-tai-da-nang"
      },
      {
        code: "CK-SR1",
        title: "CỬA KÉO CÔNG NGHỆ ĐỨC SR1 (U DÀY 1.3 MM)",
        category: "cuakeo",
        categoryName: "CỬA KÉO",
        price: "1.120.000 - 1.170.000đ/m²",
        badge: "BÁN CHẠY",
        image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
        description: "Thanh U dập dày 1.3mm sơn tĩnh điện AkzoNobel CHLB Đức, máng đúc bi treo siêu êm, nhíp đặc lập là kiên cố.",
        specs: [
          "Thanh U dập dày 1.3mm",
          "Sơn AkzoNobel bền màu 15 năm",
          "Máng đúc bi treo Inox siêu êm",
          "Bảo hành chính hãng 10 năm"
        ],
        path: "/bang-gia/cua-keo-cong-nghe-duc-sr1"
      },
      {
        code: "CK-SR2",
        title: "CỬA KÉO CÔNG NGHỆ ĐỨC SR2 (U DÀY 1.1 MM)",
        category: "cuakeo",
        categoryName: "CỬA KÉO",
        price: "1.030.000 - 1.080.000đ/m²",
        badge: "PHỔ BIẾN",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
        description: "Thân cửa dày 1.1mm cứng vững, vận hành êm nhẹ, là lựa chọn số 1 cho nhà phố và cửa hàng mặt tiền tại Đà Nẵng.",
        specs: [
          "U dày 1.1mm chịu gió bão",
          "Sơn AkzoNobel kháng muối mặn",
          "Nhíp đặc lập là chống cạy",
          "Bảo hành chính hãng 10 năm"
        ],
        path: "/bang-gia/cua-keo-cong-nghe-duc-sr2"
      },
      {
        code: "VIP",
        title: "CỬA KÉO CÔNG NGHỆ ĐỨC VIP (U DÀY 1.5 MM)",
        category: "cuakeo",
        categoryName: "CỬA KÉO",
        price: "1.180.000 - 1.230.000đ/m²",
        badge: "CAO CẤP",
        image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
        description: "Phiên bản đỉnh cao bảo vệ an ninh tuyệt đối với thanh U siêu dày 1.5mm, bát khóa đúc chống cắt chống xà beng.",
        specs: [
          "U dày 1.5mm chống cắt phá",
          "Sơn bột tĩnh điện Đức 15 năm",
          "Máng đúc bi bạc đạn chịu tải",
          "Bảo hành chính hãng 10 năm"
        ],
        path: "/bang-gia/cua-keo-cong-nghe-duc-vip"
      },
      {
        code: "BEC.5810",
        title: "CỬA CUỐN KHE THOÁNG BOSSDOOR ECO BEC.5810",
        category: "cuacuon",
        categoryName: "CỬA CUỐN",
        price: "1.500.000 - 1.750.000đ/m²",
        badge: "HOT",
        image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
        description: "Nan cửa nhôm hợp kim 6063-T5 cao cấp sơn phủ tĩnh điện ngoài trời, vận hành êm ái chống ồn và chịu gió bão tốt.",
        specs: [
          "Hợp kim nhôm 6063-T5 cao cấp",
          "Sơn tĩnh điện chống muối mặn",
          "Cảm biến tự dừng an toàn",
          "Bảo hành thân cửa 10 năm"
        ],
        path: "/bang-gia/cua-cuon-bossdoor-eco-bec-5810"
      },
      {
        code: "BD-900",
        title: "CỬA CUỐN KHE THOÁNG ĐỨC BOSSDOOR BD-900",
        category: "cuacuon",
        categoryName: "CỬA CUỐN",
        price: "1.450.000 - 1.850.000đ/m²",
        badge: "BÁN CHẠY",
        image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
        description: "Thân cửa hợp kim nhôm 6063-T5 cao cấp, thiết kế nan kép chống bão, sơn tĩnh điện CHLB Đức bảo hành 10 năm không phai màu.",
        specs: [
          "Hợp kim nhôm 6063-T5 siêu bền",
          "Độ dày nan: 1.4 - 2.2 mm",
          "Mã khóa chống sao chép ARC",
          "Bảo hành mô-tơ 10 năm"
        ],
        path: "/bang-gia/BD-900"
      },
      {
        code: "DL-75",
        title: "CỬA CUỐN ĐÀI LOAN BẢN 7.5CM GIÁ RẺ",
        category: "cuacuon",
        categoryName: "CỬA CUỐN",
        price: "420.000 - 550.000đ/m²",
        badge: "TIẾT KIỆM",
        image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80",
        description: "Thép mạ màu Đài Loan độ bền cao, giải pháp tối ưu chi phí cho nhà xưởng, ki-ốt, cửa hàng kinh doanh và gara gia đình.",
        specs: [
          "Tôn mạ màu Đài Loan 0.6 - 1.2mm",
          "Chống ăn mòn thời tiết miền Trung",
          "Kéo tay hoặc mô tơ tự động",
          "Bảo hành chính hãng 2 năm"
        ],
        path: "/bang-gia/cua-cuon-dai-loan-gia-re-dl-75"
      },
      {
        code: "BD-LUX",
        title: "CỬA CUỐN SIÊU SANG THẾ HỆ MỚI BOSSDOOR LUXURY",
        category: "cuacuon",
        categoryName: "CỬA CUỐN",
        price: "2.100.000 - 2.250.000đ/m²",
        badge: "LUXURY",
        image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
        description: "Phiên bản đỉnh cao của BossDoor với thiết kế nan chèn cao su giảm chấn 2 chiều, sơn bột tĩnh điện AkzoNobel Đức gia nhiệt cao cấp.",
        specs: [
          "Hợp kim nhôm hàng không 6063-T6",
          "Sơn AkzoNobel Đức 10 năm",
          "Giảm chấn 2 chiều siêu êm",
          "Tích hợp điều khiển Smartphone"
        ],
        path: "/bang-gia/BD-LUX"
      }
    ];

    const currentKey = String(effectiveId || product?.code || "").toUpperCase();
    const isCurrentGermanQuote = currentCode === "CK-DE" || isDirectGermanDoorUrl || currentKey.includes("CK-DE") || currentKey.includes("BANG-GIA-CAP-NHAT");

    const filtered = allQuotes.filter((q) => {
      if (isCurrentGermanQuote) {
        return q.code !== "CK-DE";
      }
      return q.code !== currentCode && !currentKey.includes(q.code);
    });

    // Prioritize same category first
    filtered.sort((a, b) => {
      if (a.category === currentCategory && b.category !== currentCategory) return -1;
      if (a.category !== currentCategory && b.category === currentCategory) return 1;
      return 0;
    });

    return filtered.slice(0, 4);
  }, [product, effectiveId, isDirectGermanDoorUrl]);

  return (
    <div className="product-pricing-page">
      {/* 1. BREADCRUMB */}
      <nav className="pricing-breadcrumb" aria-label="Breadcrumb">
        <div className="container">
          <Link to="/" className="crumb-link">Trang chủ</Link>
          <span className="crumb-sep">/</span>
          <Link to="/san-pham" className="crumb-link">Sản phẩm</Link>
          <span className="crumb-sep">/</span>
          <Link to="/bang-gia" className="crumb-link">Bảng giá</Link>
          <span className="crumb-sep">/</span>
          <span className="crumb-current">{getPricingBreadcrumbTitle(product, productArticle)}</span>
        </div>
      </nav>

      <main className="container pricing-main-container">
        {productArticle?.introContent ? (
          <article className="pricing-article-wrapper">
            {/* ARTICLE CONTINUOUS HEADER */}
            <header className="article-continuous-header">
              <h1 className="article-main-title">
                {productArticle.seo?.title?.split("|")[0]?.trim() || `Bảng Giá Cập Nhật ${product.title} 2026 Tại Đà Nẵng`}
              </h1>
              <div className="article-meta-bar">
                <span><Calendar size={14} /> Ngày đăng: {getPublishDate(productArticle)}</span>
              </div>
            </header>

            {/* 2. PRODUCT FEATURED IMAGE */}
            <section className="pricing-product-hero image-only">
              <div className="hero-image-column">
                <div className="pricing-img-wrapper">
                  <img src={product.image} alt={product.title} />
                  <span className="pricing-code-pill">MÃ: {product.code}</span>
                </div>
              </div>
            </section>

            {/* 3. BẢNG BÁO GIÁ KỸ THUẬT CHUYÊN NGHIỆP (ĐƯỢC ĐẶT LÊN TRÊN BÀI VIẾT) */}
            <section className="pricing-table-section">
              <div className="section-head-bar">
                <p className="technical-sub-note">
                  Bảng giá niêm yết theo quy chuẩn kỹ thuật nhà sản xuất, phân cấp chi tiết theo từng khoảng diện tích m² thi công:
                </p>
              </div>

              {/* Bộ lọc chọn nhanh diện tích cho Mobile & Desktop */}
              <div className="area-filter-row">
                <span className="area-filter-title">
                  <Filter size={14} /> Lọc theo diện tích:
                </span>
                <div className="area-filter-buttons">
                  <button
                    className={`area-btn ${activeAreaFilter === "all" ? "active" : ""}`}
                    onClick={() => setActiveAreaFilter("all")}
                  >
                    Tất cả
                  </button>
                  <button
                    className={`area-btn ${activeAreaFilter === "over8" ? "active" : ""}`}
                    onClick={() => setActiveAreaFilter("over8")}
                  >
                    &gt; 8m² (Giá tốt nhất)
                  </button>
                  <button
                    className={`area-btn ${activeAreaFilter === "from6to8" ? "active" : ""}`}
                    onClick={() => setActiveAreaFilter("from6to8")}
                  >
                    6 - 8m²
                  </button>
                  <button
                    className={`area-btn ${activeAreaFilter === "from4to6" ? "active" : ""}`}
                    onClick={() => setActiveAreaFilter("from4to6")}
                  >
                    4 - 6m²
                  </button>
                </div>
              </div>

              {/* 1. HIỂN THỊ BẢNG GIÁ 3 CỘT (TÊN SẢN PHẨM - CHI TIẾT - GIÁ BÁN) DÀNH RIÊNG CHO ĐIỆN THOẠI GIỐNG ẢNH 2 */}
              <div className="mobile-pricing-table-container">
                <table className="mobile-spec-table">
                  <thead>
                    <tr>
                      <th className="th-name">Tên sản phẩm</th>
                      <th className="th-specs">Chi tiết</th>
                      <th className="th-price">Giá bán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteTableItems.map((row, rIdx) => {
                      const isCurrentProduct = 
                        product.code && 
                        (product.code.toUpperCase() === row.code?.toUpperCase() || 
                         row.code?.toUpperCase().includes(product.code.toUpperCase()));

                      const specLines = formatMobileSpecs(row.description, row.colors);
                      const displayPrice = getMobileTablePrice(row, activeAreaFilter);

                      return (
                        <tr 
                          key={`mob-row-${rIdx}`} 
                          className={isCurrentProduct ? "highlight-active-row" : ""}
                        >
                          <td className="cell-product-name">
                            <div className="mobile-pname-text">
                              {row.name || `Cửa ${row.code}`}
                            </div>
                            <button
                              type="button"
                              className="mobile-view-photo-btn"
                              onClick={() => {
                                const heroImg = document.querySelector(".pricing-img-wrapper");
                                if (heroImg) {
                                  heroImg.scrollIntoView({ behavior: "smooth", block: "center" });
                                }
                              }}
                            >
                              (xem ảnh)
                            </button>
                          </td>
                          <td className="cell-product-specs">
                            {specLines.map((line, lIdx) => (
                              <div key={lIdx} className="spec-item-line">
                                {line}
                              </div>
                            ))}
                          </td>
                          <td className="cell-product-price">
                            <span className="price-bold">{displayPrice}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 2. BẢNG GIÁ KỸ THUẬT GỐC (GIỮ NGUYÊN 100% TRÊN MÁY TÍNH) */}
              <div className="technical-table-container-card">
                <div className="table-section-title-bar">
                  <div className="table-title-group">
                    <Tag size={18} className="table-title-tag-icon" />
                    <h3 className="table-title-heading">BẢNG GIÁ SẢN PHẨM KỸ THUẬT (PHÂN TẦNG THEO DIỆN TÍCH)</h3>
                  </div>
                  <div className="table-scroll-hint-pill">
                    ↔ Vuốt ngang để xem đầy đủ các cột giá
                  </div>
                </div>

                <div className="admin-table-scroll-wrapper">
                  <table className="admin-quote-data-table customer-quote-table">
                    <thead>
                      <tr>
                        <th style={{ width: "45px", textAlign: "center" }}>STT</th>
                        <th style={{ width: "95px", textAlign: "center" }}>Mã SP</th>
                        <th style={{ minWidth: "280px" }}>Diễn giải (Cấu tạo, độ dày, sơn phủ)</th>
                        <th style={{ width: "65px", textAlign: "center" }}>ĐVT</th>
                        <th style={{ minWidth: "160px" }}>Màu sắc</th>
                        <th className={`price-head ${activeAreaFilter === "over8" ? "highlight-head" : ""}`} style={{ width: "135px", textAlign: "center" }}>
                          Đơn giá (&gt; 8m²)
                        </th>
                        <th className={`price-head ${activeAreaFilter === "from6to8" ? "highlight-head" : ""}`} style={{ width: "135px", textAlign: "center" }}>
                          Đơn giá (6 - &lt; 8m²)
                        </th>
                        <th className={`price-head ${activeAreaFilter === "from4to6" ? "highlight-head" : ""}`} style={{ width: "135px", textAlign: "center" }}>
                          Đơn giá (4 - &lt; 6m²)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteTableItems.map((row, rIdx) => {
                        const isCurrentProduct = 
                          product.code && 
                          (product.code.toUpperCase() === row.code?.toUpperCase() || 
                           row.code?.toUpperCase().includes(product.code.toUpperCase()));

                        return (
                          <tr 
                            key={rIdx} 
                            className={isCurrentProduct ? "highlight-current-row" : ""}
                          >
                            <td className="text-center cell-stt font-bold">
                              {row.stt || rIdx + 1}
                            </td>
                            <td>
                              <div className="table-box-view code-box">
                                <span className="code-text">{row.code}</span>
                                {isCurrentProduct && (
                                  <span className="viewing-badge">Đang xem</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="table-box-view desc-box">
                                {row.name && !row.description?.includes(row.name) && (
                                  <div className="desc-box-name">{row.name}</div>
                                )}
                                <div className="desc-box-content">{row.description}</div>
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="table-box-view unit-box">
                                {row.unit || "m2"}
                              </div>
                            </td>
                            <td>
                              <div className="table-box-view color-box">
                                {row.colors || "Theo tiêu chuẩn"}
                              </div>
                            </td>
                            <td>
                              <div className={`table-box-view price-box ${activeAreaFilter === "over8" ? "highlight-price-box" : ""}`}>
                                {row.priceOver8 || "Liên hệ"}
                              </div>
                            </td>
                            <td>
                              <div className={`table-box-view price-box ${activeAreaFilter === "from6to8" ? "highlight-price-box" : ""}`}>
                                {row.price6to8 || "Liên hệ"}
                              </div>
                            </td>
                            <td>
                              <div className={`table-box-view price-box ${activeAreaFilter === "from4to6" ? "highlight-price-box" : ""}`}>
                                {row.price4to6 || "Liên hệ"}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. KHU VỰC "LỰA CHỌN THÊM" (PHỤ KIỆN & NÂNG CẤP) */}
              <div className="technical-addons-section">
                <div className="addons-section-title-bar">
                  <Sparkles size={18} className="gold-icon" />
                  <h3>LỰA CHỌN THÊM</h3>
                </div>
                <div className="addons-technical-content">
                  {(priceQuote?.addons && priceQuote.addons.length > 0 ? priceQuote.addons : [
                    { category: "Ray Inox đặc chìm", name: "Ray Inox đặc 201 chìm", price: "+ 280.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc chìm", name: "Ray Inox đặc 304 chìm", price: "+ 350.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc nổi", name: "Ray Inox đặc 201 nổi", price: "+ 330.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc nổi", name: "Ray Inox đặc 304 nổi", price: "+ 400.000 đồng/md", unit: "md" },
                    { category: "Trụ khóa an toàn", name: "Trụ khóa cửa 1 cánh", price: "+ 50.000 đồng/m dài", unit: "m dài" }
                  ]).map((addon, aIdx) => (
                    <div key={aIdx} className="addon-line-item">
                      <div className="addon-title-wrap">
                        <span className="addon-stt">{aIdx + 1}.</span>
                        <strong className="addon-name">{addon.name}</strong>
                        {addon.category && <span className="addon-cat-tag">({addon.category})</span>}
                      </div>
                      <div className="addon-price-wrap">
                        <span className="addon-price-tag">{addon.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. KHU VỰC LIÊN HỆ BÁO GIÁ (CTA NỔI BẬT) */}
              <div className="pricing-cta-highlight-banner">
                <div className="cta-banner-content">
                  <div className="cta-badge">TƯ VẤN &amp; KHẢO SÁT TẬN CÔNG TRÌNH</div>
                  <h2>Bạn cần báo giá chính xác cho công trình của mình?</h2>
                  <p>
                    Kỹ sư Boss Đà Nẵng sẵn sàng đến trực tiếp công trình đo đạc thực tế và lên bảng dự toán trọn gói hoàn toàn <strong>MIỄN PHÍ</strong>.
                  </p>
                  <div className="cta-buttons-group">
                    <a 
                      href="https://zalo.me/0904678323" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-cta-quote"
                    >
                      <MessageCircle size={18} /> YÊU CẦU BÁO GIÁ ZALO
                    </a>
                    <a href="tel:0904678323" className="btn-cta-hotline-call">
                      <PhoneCall size={18} /> GỌI TƯ VẤN: 0904.678.323
                    </a>
                    <a 
                      href="https://zalo.me/0904678323" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-cta-zalo"
                    >
                      <MessageCircle size={18} /> LIÊN HỆ ZALO
                    </a>
                  </div>
                </div>
              </div>
            </section>

            {/* 4. BÀI VIẾT TƯ VẤN & BÁN HÀNG CHI TIẾT (BÀI SALE BẢNG GIÁ) ĐẶT BÊN DƯỚI BẢNG GIÁ */}
            <div 
              className="product-article-rendered-stream" 
              dangerouslySetInnerHTML={{ __html: filterArticleHtml(`${productArticle.introContent || ""}\n${productArticle.outroContent || ""}`) }} 
            />
          </article>
        ) : (
          <>
            {/* 2. PRODUCT SUMMARY CARD (FALLBACK) */}
            <section className="pricing-product-hero">
              <div className="hero-image-column">
                <div className="pricing-img-wrapper">
                  <img src={product.image} alt={product.title} />
                  <span className="pricing-code-pill">MÃ: {product.code}</span>
                </div>
              </div>

              <div className="hero-info-column">
                <div className="pricing-cat-tag">
                  BẢNG BÁO GIÁ CHÍNH HÃNG 2026
                </div>
                <h1 className="pricing-product-title">{product.title}</h1>

                <p className="pricing-desc-text">
                  {product.details || product.description}
                </p>

                {product.specs && product.specs.length > 0 && (
                  <div className="pricing-specs-tags">
                    {product.specs.map((sp, idx) => {
                      const displaySp = sanitizeSpec(sp);
                      return (
                        <span key={idx} className="spec-tag-item">
                          <Check size={12} className="check-icon" /> {displaySp}
                        </span>
                      );
                    })}
                  </div>
                )}

                <div className="pricing-cta-actions">
                  <a 
                    href="https://zalo.me/0904678323" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="btn-request-quote-now"
                  >
                    <MessageCircle size={18} /> YÊU CẦU BÁO GIÁ ZALO
                  </a>
                  <a href="tel:0904678323" className="btn-call-hotline-now">
                    <PhoneCall size={18} /> GỌI: 0904.678.323
                  </a>
                  <Link 
                    to={`/san-pham/${getProductSlug(product)}`} 
                    state={{ product }}
                    className="btn-view-tech-specs"
                  >
                    Chi tiết kỹ thuật <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </section>

            {/* 3. BẢNG BÁO GIÁ KỸ THUẬT CHUYÊN NGHIỆP */}
            <section className="pricing-table-section">
              <div className="section-head-bar">
                <div className="head-badge">BẢNG BÁO GIÁ KỸ THUẬT CHÍNH THỨC</div>
                <h2 className="technical-main-title">
                  {priceQuote?.title || `Bảng Giá Cập Nhật ${product.title} 2026 Tại Đà Nẵng`}
                </h2>
                <p className="technical-sub-note">
                  Bảng giá niêm yết theo quy chuẩn kỹ thuật nhà sản xuất, phân cấp chi tiết theo từng khoảng diện tích m² thi công:
                </p>
              </div>

              {/* Bộ lọc chọn nhanh diện tích cho Mobile & Desktop */}
              <div className="area-filter-row">
                <span className="area-filter-title">
                  <Filter size={14} /> Lọc theo diện tích:
                </span>
                <div className="area-filter-buttons">
                  <button
                    className={`area-btn ${activeAreaFilter === "all" ? "active" : ""}`}
                    onClick={() => setActiveAreaFilter("all")}
                  >
                    Tất cả
                  </button>
                  <button
                    className={`area-btn ${activeAreaFilter === "over8" ? "active" : ""}`}
                    onClick={() => setActiveAreaFilter("over8")}
                  >
                    &gt; 8m² (Giá tốt nhất)
                  </button>
                  <button
                    className={`area-btn ${activeAreaFilter === "from6to8" ? "active" : ""}`}
                    onClick={() => setActiveAreaFilter("from6to8")}
                  >
                    6 - 8m²
                  </button>
                  <button
                    className={`area-btn ${activeAreaFilter === "from4to6" ? "active" : ""}`}
                    onClick={() => setActiveAreaFilter("from4to6")}
                  >
                    4 - 6m²
                  </button>
                </div>
              </div>

              {/* 1. HIỂN THỊ BẢNG GIÁ 3 CỘT (TÊN SẢN PHẨM - CHI TIẾT - GIÁ BÁN) DÀNH RIÊNG CHO ĐIỆN THOẠI GIỐNG ẢNH 2 */}
              <div className="mobile-pricing-table-container">
                <table className="mobile-spec-table">
                  <thead>
                    <tr>
                      <th className="th-name">Tên sản phẩm</th>
                      <th className="th-specs">Chi tiết</th>
                      <th className="th-price">Giá bán</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quoteTableItems.map((row, rIdx) => {
                      const isCurrentProduct = 
                        product.code && 
                        (product.code.toUpperCase() === row.code?.toUpperCase() || 
                         row.code?.toUpperCase().includes(product.code.toUpperCase()));

                      const specLines = formatMobileSpecs(row.description, row.colors);
                      const displayPrice = getMobileTablePrice(row, activeAreaFilter);

                      return (
                        <tr 
                          key={`mob-row-${rIdx}`} 
                          className={isCurrentProduct ? "highlight-active-row" : ""}
                        >
                          <td className="cell-product-name">
                            <div className="mobile-pname-text">
                              {row.name || `Cửa ${row.code}`}
                            </div>
                            <button
                              type="button"
                              className="mobile-view-photo-btn"
                              onClick={() => {
                                const heroImg = document.querySelector(".pricing-img-wrapper");
                                if (heroImg) {
                                  heroImg.scrollIntoView({ behavior: "smooth", block: "center" });
                                }
                              }}
                            >
                              (xem ảnh)
                            </button>
                          </td>
                          <td className="cell-product-specs">
                            {specLines.map((line, lIdx) => (
                              <div key={lIdx} className="spec-item-line">
                                {line}
                              </div>
                            ))}
                          </td>
                          <td className="cell-product-price">
                            <span className="price-bold">{displayPrice}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 2. BẢNG GIÁ KỸ THUẬT GỐC (GIỮ NGUYÊN 100% TRÊN MÁY TÍNH) */}
              <div className="technical-table-container-card">
                <div className="table-section-title-bar">
                  <div className="table-title-group">
                    <Tag size={18} className="table-title-tag-icon" />
                    <h3 className="table-title-heading">BẢNG GIÁ SẢN PHẨM KỸ THUẬT (PHÂN TẦNG THEO DIỆN TÍCH)</h3>
                  </div>
                  <div className="table-scroll-hint-pill">
                    ↔ Vuốt ngang để xem đầy đủ các cột giá
                  </div>
                </div>

                <div className="admin-table-scroll-wrapper">
                  <table className="admin-quote-data-table customer-quote-table">
                    <thead>
                      <tr>
                        <th style={{ width: "45px", textAlign: "center" }}>STT</th>
                        <th style={{ width: "95px", textAlign: "center" }}>Mã SP</th>
                        <th style={{ minWidth: "280px" }}>Diễn giải (Cấu tạo, độ dày, sơn phủ)</th>
                        <th style={{ width: "65px", textAlign: "center" }}>ĐVT</th>
                        <th style={{ minWidth: "160px" }}>Màu sắc</th>
                        <th className={`price-head ${activeAreaFilter === "over8" ? "highlight-head" : ""}`} style={{ width: "135px", textAlign: "center" }}>
                          Đơn giá (&gt; 8m²)
                        </th>
                        <th className={`price-head ${activeAreaFilter === "from6to8" ? "highlight-head" : ""}`} style={{ width: "135px", textAlign: "center" }}>
                          Đơn giá (6 - &lt; 8m²)
                        </th>
                        <th className={`price-head ${activeAreaFilter === "from4to6" ? "highlight-head" : ""}`} style={{ width: "135px", textAlign: "center" }}>
                          Đơn giá (4 - &lt; 6m²)
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {quoteTableItems.map((row, rIdx) => {
                        const isCurrentProduct = 
                          product.code && 
                          (product.code.toUpperCase() === row.code?.toUpperCase() || 
                           row.code?.toUpperCase().includes(product.code.toUpperCase()));

                        return (
                          <tr 
                            key={rIdx} 
                            className={isCurrentProduct ? "highlight-current-row" : ""}
                          >
                            <td className="text-center cell-stt font-bold">
                              {row.stt || rIdx + 1}
                            </td>
                            <td>
                              <div className="table-box-view code-box">
                                <span className="code-text">{row.code}</span>
                                {isCurrentProduct && (
                                  <span className="viewing-badge">Đang xem</span>
                                )}
                              </div>
                            </td>
                            <td>
                              <div className="table-box-view desc-box">
                                {row.name && !row.description?.includes(row.name) && (
                                  <div className="desc-box-name">{row.name}</div>
                                )}
                                <div className="desc-box-content">{row.description}</div>
                              </div>
                            </td>
                            <td className="text-center">
                              <div className="table-box-view unit-box">
                                {row.unit || "m2"}
                              </div>
                            </td>
                            <td>
                              <div className="table-box-view color-box">
                                {row.colors || "Theo tiêu chuẩn"}
                              </div>
                            </td>
                            <td>
                              <div className={`table-box-view price-box ${activeAreaFilter === "over8" ? "highlight-price-box" : ""}`}>
                                {row.priceOver8 || "Liên hệ"}
                              </div>
                            </td>
                            <td>
                              <div className={`table-box-view price-box ${activeAreaFilter === "from6to8" ? "highlight-price-box" : ""}`}>
                                {row.price6to8 || "Liên hệ"}
                              </div>
                            </td>
                            <td>
                              <div className={`table-box-view price-box ${activeAreaFilter === "from4to6" ? "highlight-price-box" : ""}`}>
                                {row.price4to6 || "Liên hệ"}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 4. KHU VỰC "LỰA CHỌN THÊM" (PHỤ KIỆN & NÂNG CẤP) */}
              <div className="technical-addons-section">
                <div className="addons-section-title-bar">
                  <Sparkles size={18} className="gold-icon" />
                  <h3>LỰA CHỌN THÊM</h3>
                </div>
                <div className="addons-technical-content">
                  {(priceQuote?.addons && priceQuote.addons.length > 0 ? priceQuote.addons : [
                    { category: "Ray Inox đặc chìm", name: "Ray Inox đặc 201 chìm", price: "+ 280.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc chìm", name: "Ray Inox đặc 304 chìm", price: "+ 350.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc nổi", name: "Ray Inox đặc 201 nổi", price: "+ 330.000 đồng/md", unit: "md" },
                    { category: "Ray Inox đặc nổi", name: "Ray Inox đặc 304 nổi", price: "+ 400.000 đồng/md", unit: "md" },
                    { category: "Trụ khóa an toàn", name: "Trụ khóa cửa 1 cánh", price: "+ 50.000 đồng/m dài", unit: "m dài" }
                  ]).map((addon, aIdx) => (
                    <div key={aIdx} className="addon-line-item">
                      <div className="addon-title-wrap">
                        <span className="addon-stt">{aIdx + 1}.</span>
                        <strong className="addon-name">{addon.name}</strong>
                        {addon.category && <span className="addon-cat-tag">({addon.category})</span>}
                      </div>
                      <div className="addon-price-wrap">
                        <span className="addon-price-tag">{addon.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. KHU VỰC LIÊN HỆ BÁO GIÁ (CTA NỔI BẬT) */}
              <div className="pricing-cta-highlight-banner">
                <div className="cta-banner-content">
                  <div className="cta-badge">TƯ VẤN &amp; KHẢO SÁT TẬN CÔNG TRÌNH</div>
                  <h2>Bạn cần báo giá chính xác cho công trình của mình?</h2>
                  <p>
                    Kỹ sư Boss Đà Nẵng sẵn sàng đến trực tiếp công trình đo đạc thực tế và lên bảng dự toán trọn gói hoàn toàn <strong>MIỄN PHÍ</strong>.
                  </p>
                  <div className="cta-buttons-group">
                    <a 
                      href="https://zalo.me/0904678323" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-cta-quote"
                    >
                      <MessageCircle size={18} /> YÊU CẦU BÁO GIÁ ZALO
                    </a>
                    <a href="tel:0904678323" className="btn-cta-hotline-call">
                      <PhoneCall size={18} /> GỌI TƯ VẤN: 0904.678.323
                    </a>
                    <a 
                      href="https://zalo.me/0904678323" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="btn-cta-zalo"
                    >
                      <MessageCircle size={18} /> LIÊN HỆ ZALO
                    </a>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}

        {/* 5. POLICIES & COMMITMENTS */}
        <section className="pricing-policies-section">
          <div className="policies-grid">
            <div className="policy-box">
              <div className="policy-icon"><ShieldCheck size={28} /></div>
              <h3>Chính Sách Bảo Hành</h3>
              <p>Thân cửa bảo hành từ 5 đến 10 năm; động cơ mô tơ bảo hành 2 - 5 năm 1 đổi 1. Bảo trì kỹ thuật định kỳ miễn phí.</p>
            </div>
            <div className="policy-box">
              <div className="policy-icon"><Truck size={28} /></div>
              <h3>Vận Chuyển Miễn Phí</h3>
              <p>Miễn phí 100% cước vận chuyển đến tận chân công trình tại Hải Châu, Thanh Khê, Sơn Trà, Ngũ Hành Sơn, Liên Chiểu, Cẩm Lệ.</p>
            </div>
            <div className="policy-box">
              <div className="policy-icon"><Wrench size={28} /></div>
              <h3>Lắp Đặt Chuẩn Kỹ Thuật 24H</h3>
              <p>Đội ngũ kỹ sư tay nghề trên 8 năm kinh nghiệm, thi công nhanh gọn, kiểm tra laser cân bằng và bàn giao nghiệm thu chu đáo.</p>
            </div>
          </div>
        </section>

        {/* 6. RELATED PRICING ARTICLES / BẢNG GIÁ LIÊN QUAN */}
        {relatedPriceQuotes.length > 0 && (
          <section className="related-pricing-section">
            <div className="related-compact-grid">
              {relatedPriceQuotes.map((item, idx) => (
                <article
                  key={idx}
                  className="related-compact-card"
                  onClick={() => navigate(item.path)}
                >
                  {/* Hình ảnh nhỏ ở phía bên góc trái */}
                  <div className="related-thumb-box">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>

                  {/* Chữ bên cột phải */}
                  <div className="related-content-col">
                    <div className="related-meta-tags">
                      <span className="related-cat-pill">{item.categoryName}</span>
                      <span className="related-code-pill">MÃ: {item.code}</span>
                    </div>

                    <h3 className="related-title-text">
                      <Link
                        to={item.path}
                        className="related-title-link"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {item.title}
                      </Link>
                    </h3>

                    <div className="related-action-row">
                      <Link
                        to={item.path}
                        className="related-link-action"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Tag size={13} className="related-tag-icon" />
                        <span>Bảng giá</span>
                        <ArrowRight size={13} className="related-arrow-icon" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* 7. GUARANTEE BAR */}
        <section className="pricing-guarantee-bar">
          <div className="guarantee-item">
            <div className="g-icon-box">
              <ShieldCheck size={18} className="g-icon" />
            </div>
            <div className="g-text">
              <h4>CHÍNH HÃNG 100%</h4>
              <p>Đầy đủ C/O, C/Q</p>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="g-icon-box gold">
              <CheckCircle2 size={18} className="g-icon gold" />
            </div>
            <div className="g-text">
              <h4>BẢO HÀNH 10 NĂM</h4>
              <p>Tận nơi, hỗ trợ 24/7</p>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="g-icon-box red">
              <Star size={18} className="g-icon red" />
            </div>
            <div className="g-text">
              <h4>LẮP ĐẶT 24H</h4>
              <p>Nhanh gọn, chuẩn kỹ thuật</p>
            </div>
          </div>
          <div className="guarantee-item">
            <div className="g-icon-box teal">
              <HeadphonesIcon size={18} className="g-icon teal" />
            </div>
            <div className="g-text">
              <h4>TƯ VẤN MIỄN PHÍ</h4>
              <p>Khảo sát tận nơi 0đ</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

