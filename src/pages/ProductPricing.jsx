// Product pricing details page - Boss Door
import React, { useState, useEffect, useRef } from "react";
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
  FileText,
  Send,
  MapPin,
  ChevronDown,
  Sparkles,
  Info,
  MessageCircle,
  Filter
} from "lucide-react";
import { DEFAULT_PRICE_QUOTES } from "../data/defaultPriceQuotes";
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
    specs: ["Hợp kim nhôm 6063-T5 siêu bền", "Độ dày nan: 1.4 - 2.2 mm", "Cảm biến hồng ngoại an toàn", "Bảo hành mô-tơ 5 năm"]
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
    specs: ["Hợp kim nhôm 6063-T5", "Bảo hành 5 năm", "Sơn tĩnh điện chống muối mặn"]
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
    specs: ["Lõi đồng 100% nguyên chất", "Sức kéo: 300kg - 1000kg", "Tích hợp đảo chiều an toàn", "Bảo hành 5 năm 1 đổi 1"]
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
    specs: ["Tiêu chuẩn chống nước IP67 Ý", "Tải trọng: 800kg / cánh", "Góc mở: 110° - 180°", "Bảo hành 5 năm"]
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
    price: "Từ 980.000đ/m2",
    badge: "CAO CẤP",
    description: "Thanh U dày 0.9 - 1.5mm sơn tĩnh điện AKZO NOBEL CHLB Đức, máng đúc bi treo, nhíp đặc lập là.",
    details: "Dòng cửa kéo công nghệ Đức thế hệ mới với thanh U dày 0.9 - 1.5mm sơn phủ AkzoNobel cao cấp, máng đúc bi treo siêu êm, nhíp đặc lập là chắc chắn, chống rỉ sét tuyệt đối trong khí hậu miền biển Đà Nẵng.",
    specs: ["Sơn tĩnh điện AkzoNobel CHLB Đức", "Máng đúc bi treo siêu êm", "Nhíp đặc lập là chịu lực", "Bảo hành 5 năm"]
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
    specs: ["U dày 1.1mm", "Sơn AkzoNobel Đức", "Máng đúc bi treo", "Bảo hành 5 năm"]
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
    specs: ["U dày 1.3mm chịu lực", "Sơn AkzoNobel Đức", "Máng đúc bi treo", "Bảo hành 5 năm"]
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

export default function ProductPricing() {
  const { currentUser } = useAuth();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const quoteFormRef = useRef(null);

  const [product, setProduct] = useState(location.state?.product || null);
  const [loading, setLoading] = useState(!product);
  const [priceQuote, setPriceQuote] = useState(null);
  const [activeAreaFilter, setActiveAreaFilter] = useState("all"); // 'all' | 'over8' | 'from6to8' | 'from4to6'

  // Load price quote matching this product
  useEffect(() => {
    const code = product?.code || id;
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
        if (product?.category === "cuakeo" || upperCode.startsWith("CK") || upperCode.startsWith("SR") || upperCode === "VIP") {
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
  }, [product, id]);

  // Quote Form State - Pre-filled if user is logged in
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || "",
    phone: currentUser?.phone || "",
    dimensions: "",
    quantity: "1 bộ",
    address: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null); // { success: true/false, message: "" }

  // Auto pre-fill if currentUser becomes available
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.fullName || "",
        phone: prev.phone || currentUser.phone || ""
      }));
    }
  }, [currentUser]);

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
      const foundInFallback = FALLBACK_PRODUCTS.find(
        (p) =>
          String(p.id) === String(id) ||
          p.code.toLowerCase() === String(id).toLowerCase()
      );

      // 2. Try fetching from backend API
      if (import.meta.env.VITE_API_URL) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`);
          const resJson = await res.json();
          if (resJson.success && resJson.data && isMounted) {
            setProduct(resJson.data);
            setLoading(false);
            return;
          }
        } catch (err) {
          console.log("Could not fetch product detail from API, using local match:", err.message);
        }
      }

      if (foundInFallback && isMounted) {
        setProduct(foundInFallback);
      }
      if (isMounted) setLoading(false);
    };

    lookupProduct();

    return () => {
      isMounted = false;
    };
  }, [id, product]);

  // Dynamic SEO meta updates
  useEffect(() => {
    if (product) {
      document.title = `Bảng Giá ${product.title} - Báo Giá Trọn Gói 2026 | Boss Đà Nẵng`;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement("meta");
        metaDesc.name = "description";
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = `Bảng giá chi tiết ${product.title} (Mã: ${product.code}). Giá niêm yết: ${product.price || "Liên hệ"}. Khảo sát tận nơi miễn phí, bảo hành chính hãng tại Đà Nẵng.`;
    }
  }, [product]);

  const scrollToQuoteForm = () => {
    if (quoteFormRef.current) {
      quoteFormRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.phone.trim()) {
      setSubmitResult({
        success: false,
        message: "Vui lòng nhập đầy đủ Họ và tên cùng Số điện thoại liên hệ!"
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    const payload = {
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      productName: product?.title || "",
      productCode: product?.code || "",
      productCategory: product?.category || "",
      dimensions: formData.dimensions.trim(),
      quantity: formData.quantity.trim(),
      address: formData.address.trim(),
      message: formData.message.trim()
    };

    try {
      let success = false;
      let message = "Gửi yêu cầu báo giá thành công! Kỹ sư BOSS Đà Nẵng sẽ liên hệ tư vấn trong 15 phút.";

      if (import.meta.env.VITE_API_URL) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/contacts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const resJson = await res.json();
        if (resJson.success) {
          success = true;
          message = resJson.message || message;
        }
      } else {
        // Fallback demo storage
        success = true;
      }

      setSubmitResult({ success, message });
      if (success) {
        setFormData({
          fullName: currentUser?.fullName || "",
          phone: currentUser?.phone || "",
          dimensions: "",
          quantity: "1 bộ",
          address: "",
          message: ""
        });
      }
    } catch (err) {
      console.error("Quote submit error:", err);
      setSubmitResult({
        success: false,
        message: "Không thể kết nối máy chủ. Vui lòng gọi trực tiếp hotline 0904.678.323 để nhận báo giá nhanh!"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Scroll reveal observer: sections appear only when scrolled into view
  useEffect(() => {
    if (loading || !product) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    const sections = document.querySelectorAll(
      ".pricing-table-section, .pricing-accessories-section, .pricing-policies-section, .pricing-quote-form-section, .pricing-guarantee-bar"
    );
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, [loading, product]);

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
        { name: "Mô tơ xích kéo lõi đồng 100% (300kg - 800kg)", price: "Từ 3.500.000đ/bộ", warranty: "5 năm 1 đổi 1" },
        { name: "Bình lưu điện dự phòng UPS (48h - 72h)", price: "Từ 2.800.000đ/bộ", warranty: "2 năm" },
        { name: "Bộ điều khiển qua điện thoại Smart WiFi/4G", price: "1.200.000đ/bộ", warranty: "2 năm" },
        { name: "Tay điều khiển remote mã nhảy Rolling Code", price: "650.000đ/bộ", warranty: "2 năm" }
      ]
    : product.category === "cuakeo"
    ? [
        { name: "Bạc đạn inox bi kín chống rỉ sét", price: "Đồng bộ theo cửa", warranty: "2 năm" },
        { name: "Khóa âm sàn chống cắt chuyên dụng", price: "350.000đ/bộ", warranty: "2 năm" },
        { name: "Sơn AkzoNobel CHLB Đức ngoài trời", price: "Đã bao gồm", warranty: "5 năm" }
      ]
    : product.category === "cuatudong"
    ? [
        { name: "Mô tơ âm sàn Italia chuẩn chống nước IP67", price: "Đồng bộ theo hệ", warranty: "5 năm" },
        { name: "Cảm biến hồng ngoại Photocell chống kẹp", price: "Kèm theo bộ", warranty: "3 năm" },
        { name: "Bộ điều khiển Smartphone thông minh", price: "Tích hợp sẵn", warranty: "2 năm" }
      ]
    : [
        { name: "Phụ kiện đồng bộ chính hãng", price: "Theo quy cách", warranty: "Chính hãng 100%" }
      ];

  // Danh sách dòng sản phẩm cho bảng giá (dùng chung cho cả Desktop và Mobile)
  const quoteTableItems = priceQuote?.items && priceQuote.items.length > 0 
    ? priceQuote.items 
    : pricingTiers.map((t, idx) => ({
        stt: idx + 1,
        code: product.code,
        name: t.name,
        description: t.spec,
        unit: t.unit,
        colors: "Theo tiêu chuẩn",
        priceOver8: t.price,
        price6to8: t.price,
        price4to6: t.price
      }));

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
          <span className="crumb-current">{product.code || product.title}</span>
        </div>
      </nav>

      <main className="container pricing-main-container">

        {/* 2. PRODUCT SUMMARY CARD */}
        <section className="pricing-product-hero">
          <div className="hero-image-column">
            <div className="pricing-img-wrapper">
              <img src={product.image} alt={product.title} />
              {product.badge && <span className="pricing-badge-pill">{product.badge}</span>}
              <span className="pricing-code-pill">MÃ: {product.code}</span>
            </div>
          </div>

          <div className="hero-info-column">
            <div className="pricing-cat-tag">
              BẢNG BÁO GIÁ CHÍNH HÃNG 2026
            </div>
            <h1 className="pricing-product-title">{product.title}</h1>

            <div className="pricing-highlight-box">
              <div className="price-label">Đơn giá niêm yết:</div>
              {hasOfficialPrice ? (
                <div className="price-value-row">
                  <span className="price-big">{product.price}</span>
                  <span className="price-vat-note">(Giá tại xưởng, đã bao gồm công đo đạc)</span>
                </div>
              ) : (
                <div className="price-contact-row">
                  <span className="price-contact-text">Liên hệ để nhận báo giá</span>
                  <span className="price-vat-note">(Khảo sát công trình & báo giá tận nơi miễn phí 100%)</span>
                </div>
              )}
            </div>

            <p className="pricing-desc-text">
              {product.details || product.description}
            </p>

            {product.specs && product.specs.length > 0 && (
              <div className="pricing-specs-tags">
                {product.specs.map((sp, idx) => (
                  <span key={idx} className="spec-tag-item">
                    <Check size={14} className="check-icon" /> {sp}
                  </span>
                ))}
              </div>
            )}

            <div className="pricing-cta-actions">
              <button className="btn-request-quote-now" onClick={scrollToQuoteForm}>
                <FileText size={18} /> YÊU CẦU BÁO GIÁ NHANH
              </button>
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
            <div className="effective-date-pill">
              <Clock size={14} /> {priceQuote?.effectiveDate || "Áp dụng từ năm 2026 cho đến khi có thông báo mới"}
            </div>
            <p className="technical-sub-note">
              Bảng giá niêm yết theo quy chuẩn kỹ thuật nhà sản xuất, phân cấp chi tiết theo từng khoảng diện tích m² thi công:
            </p>
          </div>

          {/* Bộ lọc chọn nhanh diện tích cho Mobile & Desktop */}
          <div className="area-filter-row">
            <span className="area-filter-title">
              <Filter size={15} /> Xem nhanh theo diện tích cửa:
            </span>
            <div className="area-filter-buttons">
              <button
                className={`area-btn ${activeAreaFilter === "all" ? "active" : ""}`}
                onClick={() => setActiveAreaFilter("all")}
              >
                Tất cả khoảng diện tích
              </button>
              <button
                className={`area-btn ${activeAreaFilter === "over8" ? "active" : ""}`}
                onClick={() => setActiveAreaFilter("over8")}
              >
                Trên 8m² (Giá tốt nhất)
              </button>
              <button
                className={`area-btn ${activeAreaFilter === "from6to8" ? "active" : ""}`}
                onClick={() => setActiveAreaFilter("from6to8")}
              >
                Từ 6 - &lt; 8m²
              </button>
              <button
                className={`area-btn ${activeAreaFilter === "from4to6" ? "active" : ""}`}
                onClick={() => setActiveAreaFilter("from4to6")}
              >
                Từ 4 - &lt; 6m²
              </button>
            </div>
          </div>

          {/* 1. HIỂN THỊ DẠNG THẺ (CARD VIEW) DÀNH RIÊNG CHO ĐIỆN THOẠI - THẤY RÕ 100% CÁC CỘT GIÁ */}
          <div className="mobile-pricing-cards-container">
            {quoteTableItems.map((row, rIdx) => {
              const isCurrentProduct = 
                product.code && 
                (product.code.toUpperCase() === row.code?.toUpperCase() || 
                 row.code?.toUpperCase().includes(product.code.toUpperCase()));

              return (
                <article 
                  key={`mq-${rIdx}`} 
                  className={`mq-product-card ${isCurrentProduct ? "is-current-active" : ""}`}
                >
                  <div className="mq-card-top">
                    <div className="mq-code-group">
                      <span className="mq-code-badge">{row.code || `SP-${rIdx + 1}`}</span>
                      {isCurrentProduct && <span className="mq-viewing-badge">Đang xem</span>}
                      <span className="mq-stt-text">#{row.stt || rIdx + 1}</span>
                    </div>
                    <span className="mq-unit-badge">ĐVT: {row.unit || "m²"}</span>
                  </div>

                  {row.name && <h4 className="mq-card-name">{row.name}</h4>}

                  <div className="mq-specs-box">
                    <div className="mq-box-title">Đặc tính kỹ thuật &amp; Cấu tạo:</div>
                    <p className="mq-desc-content">{row.description}</p>
                    {row.colors && (
                      <div className="mq-colors-tag">
                        <strong>Màu sắc:</strong> {row.colors}
                      </div>
                    )}
                  </div>

                  <div className="mq-pricing-section">
                    <div className="mq-price-label-row">
                      <span className="mq-price-heading">Bảng đơn giá theo diện tích:</span>
                      <span className="mq-price-hint">
                        {activeAreaFilter !== "all" ? "Đã lọc theo lựa chọn" : "Nhấn lọc phía trên"}
                      </span>
                    </div>

                    <div className="mq-price-grid">
                      <div className={`mq-tier-box ${activeAreaFilter === "over8" ? "filter-highlight" : ""}`}>
                        <div className="mq-tier-head">
                          <span className="mq-area-text">&gt; 8 m²</span>
                          <span className="mq-best-tag">Giá tốt nhất</span>
                        </div>
                        <div className="mq-tier-price">
                          {row.priceOver8 || "Liên hệ"}
                        </div>
                        <span className="mq-tier-sub">Cho cửa lớn</span>
                      </div>

                      <div className={`mq-tier-box ${activeAreaFilter === "from6to8" ? "filter-highlight" : ""}`}>
                        <div className="mq-tier-head">
                          <span className="mq-area-text">6 - &lt; 8 m²</span>
                          <span className="mq-std-tag">Tiêu chuẩn</span>
                        </div>
                        <div className="mq-tier-price">
                          {row.price6to8 || "Liên hệ"}
                        </div>
                        <span className="mq-tier-sub">Cửa vừa</span>
                      </div>

                      <div className={`mq-tier-box ${activeAreaFilter === "from4to6" ? "filter-highlight" : ""}`}>
                        <div className="mq-tier-head">
                          <span className="mq-area-text">4 - &lt; 6 m²</span>
                          <span className="mq-small-tag">Cửa nhỏ</span>
                        </div>
                        <div className="mq-tier-price">
                          {row.price4to6 || "Liên hệ"}
                        </div>
                        <span className="mq-tier-sub">Cửa nhỏ</span>
                      </div>
                    </div>
                  </div>

                  <div className="mq-action-bar">
                    <button
                      type="button"
                      className="mq-btn-quote"
                      onClick={() => {
                        setFormData((prev) => ({
                          ...prev,
                          message: `Tôi muốn tư vấn và nhận báo giá chi tiết dòng: ${row.code} (${row.name || ""})`
                        }));
                        scrollToQuoteForm();
                      }}
                    >
                      <FileText size={15} /> Nhận báo giá mẫu {row.code}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>

          {/* 2. BẢNG GIÁ KỸ THUẬT GỐC (GIỮ NGUYÊN 100% TRÊN MÁY TÍNH; TRÊN MOBILE ĐƯỢC THAY BẰNG THẺ DỄ NHÌN) */}
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

          {/* 5. PHẦN GHI CHÚ VÀ CHÍNH SÁCH GIÁ */}
          <div className="technical-policies-block">
            <div className="policies-block-header">
              <HelpCircle size={18} className="policy-header-icon" />
              <h3>GHI CHÚ VÀ CHÍNH SÁCH GIÁ</h3>
            </div>
            <div className="policies-content-list">
              <div className="policy-row-item">
                <strong>1. Giá sản phẩm đã bao gồm:</strong>
                <p>
                  {priceQuote?.policies?.included || "Thân cửa hoàn chỉnh theo quy cách, sơn AkzoNobel CHLB Đức, công khảo sát đo đạc thực tế tại công trình."}
                </p>
              </div>

              <div className="policy-row-item">
                <strong>2. Chi phí chưa bao gồm:</strong>
                <p>
                  {priceQuote?.policies?.excluded || "Bên cạnh giá sản phẩm, tổng chi phí còn bao gồm các hạng mục như vận chuyển, lắp đặt,... thường dao động khoảng 10 – 20% giá trị cửa."}
                </p>
              </div>

              <div className="policy-row-item">
                <strong>3. Điều kiện thi công &amp; Kích thước:</strong>
                <p>
                  {priceQuote?.policies?.conditionNote || "Chi phí có thể thay đổi tùy kích thước và điều kiện thi công mặt bằng thực tế."}
                </p>
              </div>

              <div className="policy-row-item">
                <strong>4. Chính sách bảo hành:</strong>
                <p>
                  {priceQuote?.policies?.warrantyNote || "Thân cửa bảo hành chính hãng từ 5 đến 10 năm theo tiêu chuẩn nhà máy BossDoor."}
                </p>
              </div>

              <div className="policy-row-item commitment-highlight">
                <strong>5. Cam kết báo giá minh bạch Boss Đà Nẵng:</strong>
                <p>
                  {priceQuote?.policies?.commitmentNote || "Tuy nhiên, bạn hoàn toàn có thể yên tâm bởi BossDoor Đà Nẵng luôn mang đến mức giá cạnh tranh, minh bạch. Giúp khách hàng dễ dàng cân đối giữa chất lượng sản phẩm và ngân sách đầu tư."}
                </p>
              </div>
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
                <button className="btn-cta-quote" onClick={scrollToQuoteForm}>
                  <FileText size={18} /> YÊU CẦU BÁO GIÁ
                </button>
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

        {/* 4. ACCESSORIES & COMPATIBLE ADD-ONS */}
        <section className="pricing-accessories-section">
          <div className="section-head-bar">
            <div className="head-badge">PHỤ KIỆN TÙY CHỌN</div>
            <h2>Tùy Chọn Phụ Kiện & Thiết Bị Đi Kèm</h2>
            <p>Đồng bộ 100% linh kiện chính hãng giúp cửa vận hành êm ái, kéo dài tuổi thọ tối đa:</p>
          </div>

          <div className="accessories-grid">
            {accessoriesList.map((acc, idx) => (
              <div key={idx} className="accessory-card">
                <div className="acc-info">
                  <h4>{acc.name}</h4>
                  <div className="acc-warranty">
                    <ShieldCheck size={14} /> Bảo hành: <strong>{acc.warranty}</strong>
                  </div>
                </div>
                <div className="acc-price-box">
                  <span className="acc-price">{acc.price}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

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

        {/* 6. QUOTE REQUEST FORM */}
        <section className="pricing-quote-form-section" ref={quoteFormRef} id="form-bao-gia">
          <div className="form-wrapper-card">
            <div className="form-header-intro">
              <div className="quote-tag">NHẬN BÁO GIÁ TRỰC TIẾP</div>
              <h2>Gửi Yêu Cầu Báo Giá Sản Phẩm {product.code}</h2>
              <p>
                Để lại thông tin kích thước và địa chỉ công trình, kỹ sư Boss Đà Nẵng sẽ liên hệ gửi bảng báo giá chiết khấu tốt nhất trong vòng 15 phút.
              </p>
            </div>

            {submitResult && (
              <div className={`quote-alert-box ${submitResult.success ? "success" : "error"}`}>
                {submitResult.success ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span>{submitResult.message}</span>
              </div>
            )}

            <form onSubmit={handleQuoteSubmit} className="quote-form-grid">
              {/* Product Info Readonly */}
              <div className="form-group full-width product-prefilled">
                <label>Sản phẩm yêu cầu báo giá:</label>
                <div className="prefilled-tag">
                  <strong>{product.title}</strong> (Mã hiệu: <strong>{product.code}</strong>) - Đơn giá: <strong>{product.price || "Liên hệ"}</strong>
                </div>
              </div>

              {/* Full Name */}
              <div className="form-group">
                <label>Họ và tên của bạn <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn An"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  required
                />
              </div>

              {/* Phone */}
              <div className="form-group">
                <label>Số điện thoại liên hệ <span className="req">*</span></label>
                <input
                  type="tel"
                  placeholder="Ví dụ: 0905 123 456"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              {/* Dimensions */}
              <div className="form-group">
                <label>Kích thước ước tính (Rộng x Cao)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Rộng 3.8m x Cao 3.5m"
                  value={formData.dimensions}
                  onChange={(e) => handleInputChange("dimensions", e.target.value)}
                />
              </div>

              {/* Quantity */}
              <div className="form-group">
                <label>Số lượng bộ cửa</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 1 bộ, 2 bộ..."
                  value={formData.quantity}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                />
              </div>

              {/* Address */}
              <div className="form-group full-width">
                <label>Địa chỉ lắp đặt tại Đà Nẵng / Miền Trung</label>
                <input
                  type="text"
                  placeholder="Ví dụ: 267 Tô Hiệu, Hoà Khánh, Liên Chiểu, Đà Nẵng"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              {/* Additional message */}
              <div className="form-group full-width">
                <label>Ghi chú hoặc yêu cầu thêm</label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Cần tư vấn thêm mô tơ điều khiển qua điện thoại, muốn kỹ thuật qua khảo sát vào sáng mai..."
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                />
              </div>

              {/* Submit Button */}
              <div className="form-group full-width">
                <button type="submit" className="btn-submit-quote" disabled={isSubmitting}>
                  <Send size={18} />
                  <span>{isSubmitting ? "Đang gửi thông tin..." : "GỬI YÊU CẦU BÁO GIÁ NGAY"}</span>
                </button>
                <div className="form-privacy-note">
                  🔒 Chúng tôi cam kết bảo mật thông tin và chỉ liên hệ tư vấn phương án tối ưu nhất cho bạn.
                </div>
              </div>
            </form>
          </div>
        </section>

        {/* 7. GUARANTEE BAR */}
        <section className="pricing-guarantee-bar">
          <div className="guarantee-item">
            <ShieldCheck size={32} className="g-icon" />
            <div>
              <h4>CHÍNH HÃNG 100%</h4>
              <p>Nhập khẩu có chứng nhận C/O, C/Q đầy đủ</p>
            </div>
          </div>
          <div className="guarantee-item">
            <CheckCircle2 size={32} className="g-icon gold" />
            <div>
              <h4>BẢO HÀNH 5 NĂM</h4>
              <p>Bảo trì tận nơi, hỗ trợ kỹ thuật 24/7</p>
            </div>
          </div>
          <div className="guarantee-item">
            <Star size={32} className="g-icon red" />
            <div>
              <h4>LẮP ĐẶT 24H</h4>
              <p>Thi công nhanh gọn, chuẩn quy trình kĩ thuật</p>
            </div>
          </div>
          <div className="guarantee-item">
            <HeadphonesIcon size={32} className="g-icon" />
            <div>
              <h4>TƯ VẤN MIỄN PHÍ</h4>
              <p>Khảo sát tận công trình hoàn toàn miễn phí</p>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

