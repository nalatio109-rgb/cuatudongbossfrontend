import React, { useEffect, useRef, useState, useMemo } from "react";
import { 
  ArrowRight, Home, AlignJustify, ArrowRightLeft, Columns, ShieldCheck, 
  CheckCircle2, Star, HeadphonesIcon, X, Check, Eye, Play, Volume2, VolumeX, 
  Sparkles, Sliders, Cpu, Zap
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { getProductSlug } from "../utils/slug.js";

// =========================================================================
// 1. KHI BẤM "TẤT CẢ": CHỈ HIỂN THỊ ĐÚNG 6 SẢN PHẨM / GIẢI PHÁP ĐẠI DIỆN ("6 CÁI NỚ")
// =========================================================================
const OVERVIEW_6_PRODUCTS = [
  {
    id: 1,
    category: "cuacuon",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    title: "CỬA CUỐN",
    description: "Vận hành bền bỉ, an toàn tuyệt đối",
    details: "Hệ thống cửa cuốn công nghệ Đức, thân cửa hợp kim nhôm cao cấp 6063-T5, tích hợp công biến đảo chiều thông minh khi gặp vật cản.",
    specs: ["Hợp kim nhôm cao cấp", "Độ dày: 1.2 - 2.4 mm", "Tích hợp cảm biến an toàn", "Bảo hành 5 năm"],
    icon: <Home size={24} />,
    badge: "MỚI",
    isNew: true
  },
  {
    id: 2,
    category: "cuacuon",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    title: "CỬA KHE\nTHOÁNG",
    description: "Thoáng khí tối ưu, bảo vệ toàn diện",
    details: "Thiết kế lỗ thoáng nghệ thuật điều chỉnh đón ánh sáng & gió tự nhiên, sơn tĩnh điện ngoài trời cao cấp bảo vệ bề mặt lên tới 10 năm.",
    specs: ["Kết cấu khe thoáng kép", "Giảm âm siêu êm", "Màu sắc: Ghi xám, Vàng kem", "Điều khiển từ xa qua Wi-Fi"],
    icon: <AlignJustify size={24} />,
    badge: "BÁN CHẠY",
    isNew: true
  },
  {
    id: 3,
    category: "cuatudong",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
    title: "CỬA TRƯỢT\nTỰ ĐỘNG",
    description: "Đóng mở êm ái, hiện đại và tiện nghi",
    details: "Động cơ DC không chổi than mạnh mẽ, mắt thần radar vi sóng phát hiện chuyển động siêu nhạy, phù hợp cho trung tâm thương mại và văn phòng.",
    specs: ["Động cơ DC Brushless", "Tải trọng: 150kg x 2 cánh", "Tốc độ mở: 15-50 cm/s", "Tuổi thọ > 2.000.000 lần"],
    icon: <ArrowRightLeft size={24} />,
    badge: "TIÊU CHUẨN",
    isNew: false
  },
  {
    id: 4,
    category: "cuatudong",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    title: "CỔNG\nTỰ ĐỘNG",
    description: "An ninh vượt trội, khẳng định đẳng cấp",
    details: "Mô tơ âm sàn / tay co thủy lực nhập khẩu Ý, chịu lực tốt, chống nước IP67 tiêu chuẩn Châu Âu, tích hợp nhận diện biển số xe.",
    specs: ["Tiêu chuẩn chống nước IP67", "Tích hợp thẻ từ & Remote", "Góc mở rộng 110°-180°", "Công nghệ Ý chính hãng"],
    icon: <Columns size={24} />,
    badge: "VIP ITALIA",
    isNew: true
  },
  {
    id: 5,
    category: "cuatudong",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    title: "BARRIER\nTỰ ĐỘNG",
    description: "Kiểm soát an ninh, quản lý ra vào",
    details: "Thanh chắn Barrier tốc độ cao 1.5s - 6s, lý tưởng cho khu đô thị, bãi xe thông minh, tòa nhà và cơ quan hành chính.",
    specs: ["Chiều dài cần: 2m - 6m", "Tốc độ đóng mở: 1.5s - 6s", "Đèn LED cảnh báo ban đêm", "Chống va đập thông minh"],
    icon: <AlignJustify size={24} />,
    badge: "AN TOÀN",
    isNew: false
  },
  {
    id: 6,
    category: "cuakeo",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    title: "CỬA NHÔM\nKÍNH",
    description: "Cách âm, cách nhiệt, sang trọng",
    details: "Hệ nhôm Xingfa nhập khẩu kết hợp kính cường lực 2 lớp hút chân không cách âm cách nhiệt hoàn hảo, kiến tạo vẻ đẹp kiến trúc đẳng cấp.",
    specs: ["Nhôm Xingfa Quảng Đông", "Kính hộp 2-3 lớp an toàn", "Phụ kiện Cmech / Kinlong", "Cách âm lên đến 95%"],
    icon: <Home size={24} />,
    badge: "CAO CẤP",
    isNew: true
  },
];

// =========================================================================
// 2. KHI BẤM VÀO TỪNG DANH MỤC: HIỆN HẾT TẤT CẢ CÁC LOẠI SẢN PHẨM TRONG ĐÓ RA!
// =========================================================================
const CATALOG_PRODUCTS = [
  // -------------------------------------------------------------
  // A. CỬA CUỐN (Cửa cuốn khe thoáng Đức, BossDoor, Tấm liền Úc, Đài Loan...)
  // -------------------------------------------------------------
  {
    id: 101,
    category: "cuacuon",
    code: "BD-900",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    title: "CỬA CUỐN KHE THOÁNG\nĐỨC BOSSDOOR BD-900",
    description: "Hợp kim nhôm 6063-T5 cao cấp, sơn AkzoNobel CHLB Đức bảo hành 10 năm.",
    details: "Dòng cửa cuốn cao cấp thế hệ mới BossDoor tích hợp công nghệ chống sao chép mã khoá, cảm biến tự dừng khi gặp vật cản và điều khiển qua Smartphone từ xa.",
    specs: ["Hợp kim nhôm 6063-T5 siêu bền", "Độ dày nan: 1.4 - 2.2 mm", "Cảm biến hồng ngoại an toàn", "Bảo hành mô-tơ 5 năm"],
    icon: <Home size={24} />,
    badge: "BÁN CHẠY",
    isNew: true
  },
  {
    id: 102,
    category: "cuacuon",
    code: "BEC.5810",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    title: "CỬA CUỐN KHE THOÁNG\nECO BEC.5810",
    description: "Cửa cuốn Bossdoor ECO nan nhôm sơn tĩnh điện Đức, giảm chấn 2 chiều siêu êm.",
    details: "Cửa cuốn Bossdoor ECO BEC.5810 nan nhôm 6063-T5 cao cấp sơn tĩnh điện AkzoNobel CHLB Đức, tích hợp gioăng giảm chấn 2 chiều triệt tiêu rung chấn.",
    specs: ["Hợp kim nhôm 6063-T5 siêu bền", "Sơn AkzoNobel Đức bảo hành 10 năm", "Giảm chấn 2 chiều siêu êm", "Bảo hành 5 năm"],
    icon: <AlignJustify size={24} />,
    badge: "MỚI",
    isNew: true
  },
  {
    id: 103,
    category: "cuacuon",
    code: "BD-LUX",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    title: "CỬA CUỐN CAO CẤP\nBOSSDOOR LUXURY",
    description: "Dòng cửa cuốn siêu sang tích hợp công nghệ AI, kết nối Smarthome điện thoại.",
    details: "Phiên bản đỉnh cao của BossDoor với thiết kế nan chèn cao su giảm chấn 2 chiều, sơn bột tĩnh điện AkzoNobel Đức gia nhiệt cao cấp, chống trộm tuyệt đối.",
    specs: ["Hợp kim nhôm hàng không 6063-T6", "Sơn AkzoNobel Đức bền màu 15 năm", "Kết nối Smarthome thông minh", "Bảo hành 10 năm"],
    icon: <Star size={24} />,
    badge: "LUXURY",
    isNew: true
  },
  {
    id: 104,
    category: "cuacuon",
    code: "BD-L70",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    title: "CỬA CUỐN TẤM LIỀN\nÚC SIÊU ÊM",
    description: "Đóng mở êm ái không tiếng ồn, thép Colorbond Úc chống ăn mòn.",
    details: "Cửa cuốn tấm liền bằng thép hợp kim mạ nhôm kẽm Colorbond của Úc, tích hợp dây cao su polyguide giảm chấn giúp vận hành cực kỳ êm ái và tốc độ mở nhanh gấp 3 lần.",
    specs: ["Thép mạ kẽm Colorbond Úc", "Tích hợp chốt ly khai thoát hiểm", "Tốc độ đóng mở 15-20 cm/s", "Bảo hành 3 năm"],
    icon: <Home size={24} />,
    badge: "SIÊU BỀN",
    isNew: false
  },
  {
    id: 105,
    category: "cuacuon",
    code: "DL-75",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    title: "CỬA CUỐN CÔNG NGHỆ\nĐÀI LOAN GIÁ RẺ",
    description: "Thép mạ màu Đài Loan độ bền cao, giải pháp tối ưu chi phí cho nhà xưởng & cửa hàng.",
    details: "Cửa cuốn công nghệ Đài Loan chất liệu tôn mạ màu nhập khẩu, chống rỉ sét tốt, vận hành bằng lò xo trợ lực kéo tay nhẹ nhàng hoặc mô tơ điện.",
    specs: ["Tôn mạ màu Đài Loan 0.6 - 1.2mm", "Chống ăn mòn thời tiết", "Kéo tay hoặc chạy mô tơ", "Bảo hành 2 năm"],
    icon: <Columns size={24} />,
    badge: "TIẾT KIỆM",
    isNew: false
  },
  {
    id: 106,
    category: "cuacuon",
    code: "SN-100",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    title: "CỬA CUỐN SONG NGANG\nMẮC VÕNG INOX",
    description: "Thông thoáng tối đa 90%, góc quan sát rộng cho TTTM, ngân hàng, Showroom.",
    details: "Cửa cuốn song ngang mắc võng chất liệu Inox 304 hoặc sắt sơn tĩnh điện cao cấp, đảm bảo an toàn chống đột nhập mà vẫn giữ không gian trưng bày sản phẩm sang trọng.",
    specs: ["Inox 304 / Sắt sơn tĩnh điện", "Ống phi 19 - 22mm dày 1.0 - 1.2mm", "Tầm nhìn thông thoáng 90%", "Bảo hành 3 năm"],
    icon: <AlignJustify size={24} />,
    badge: "HOT TTTM",
    isNew: true
  },

  // -------------------------------------------------------------
  // B. PHỤ KIỆN CỬA CUỐN (Mô tơ, UPS lưu điện, Smart Wifi, Remote...)
  // -------------------------------------------------------------
  {
    id: 201,
    category: "phukien",
    code: "MT-500",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    title: "MÔ TƠ CỬA CUỐN\nLÕI ĐỒNG 100% NHẬP KHẨU",
    description: "Động cơ dây đồng 100%, sức kéo mạnh mẽ 300kg - 1000kg, chống hành trình tràn.",
    details: "Mô tơ cửa cuốn chính hãng tích hợp rơ-le nhiệt tự ngắt khi quá tải, phanh đĩa kép an toàn, có xích kéo cơ thoát hiểm bằng tay khi mất điện lưới.",
    specs: ["Lõi đồng 100% nguyên chất", "Sức kéo: 300kg - 1000kg", "Tích hợp đảo chiều an toàn", "Bảo hành 5 năm 1 đổi 1"],
    icon: <Sparkles size={24} />,
    badge: "BH 5 NĂM",
    isNew: true
  },
  {
    id: 202,
    category: "phukien",
    code: "UPS-800",
    image: "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&w=800&q=80",
    title: "BÌNH LƯU ĐIỆN CỬA CUỐN\nUPS DỰ PHÒNG 72H",
    description: "Lưu điện dự phòng thông minh 48h - 72h khi xảy ra cúp điện lưới.",
    details: "Bộ lưu điện UPS chuyên dụng cho cửa cuốn sử dụng ắc quy khô tích điện công nghệ Gel, mạch vi xử lý tự sạc xả bảo dưỡng bình định kỳ không bị chai phồng.",
    specs: ["Thời gian chờ: 48 - 72 giờ", "Công suất: 800W - 1500W", "Tự động chuyển nguồn khi cúp điện", "Bảo hành 2 năm"],
    icon: <ShieldCheck size={24} />,
    badge: "KHUYÊN DÙNG",
    isNew: false
  },
  {
    id: 203,
    category: "phukien",
    code: "WF-APP",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    title: "BỘ ĐIỀU KHIỂN CỬA CUỐN\nQUA SMARTPHONE WIFI",
    description: "Đóng mở cửa từ xa mọi lúc mọi nơi qua Smartphone 4G/Wi-Fi, cảnh báo đột nhập.",
    details: "Module điều khiển thông minh kết nối ứng dụng Tuya/Smart Life, phân quyền người dùng gia đình, lưu lịch sử đóng mở và camera giám sát real-time an toàn.",
    specs: ["Kết nối Wi-Fi & 4G toàn cầu", "Cảnh báo mở cửa về điện thoại", "Chia sẻ quyền quản lý gia đình", "Bảo hành 2 năm"],
    icon: <ArrowRightLeft size={24} />,
    badge: "SMART AI",
    isNew: true
  },
  {
    id: 204,
    category: "phukien",
    code: "RF-433",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    title: "TAY ĐIỀU KHIỂN &\nHỘP MÃ NHẢY CHỐNG DÒ",
    description: "Tay remote inox chống nước, công nghệ Rolling Code mã nhảy chống sao chép.",
    details: "Bộ hộp thu phát tín hiệu sóng RF 433MHz tần số mã nhảy tự đổi hàng tỉ mã sau mỗi lần bấm, ngăn chặn hoàn toàn thiết bị sao chép hoặc dò quét sóng.",
    specs: ["Mã nhảy Rolling Code an toàn", "Khoảng cách điều khiển: 50 - 100m", "Tay remote chống nước IP65", "Bảo hành 2 năm"],
    icon: <CheckCircle2 size={24} />,
    badge: "AN TOÀN",
    isNew: false
  },

  // -------------------------------------------------------------
  // C. CỬA KÉO (Cửa kéo CN Đức SR1, SR2, VIP, Inox 304, Đài Loan...)
  // -------------------------------------------------------------
  {
    id: 301,
    category: "cuakeo",
    code: "CK-SR1",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    title: "CỬA KÉO CÔNG NGHỆ\nĐỨC SR1 AKZONOBEL",
    description: "U dày 1.3 mm sơn tĩnh điện AKZO NOBEL, máng đúc bi treo siêu êm, nhíp đặc lập là kiên cố.",
    details: "Cửa kéo công nghệ Đức SR1 là sản phẩm cao cấp với độ dày U 1.3 mm sơn AkzoNobel CHLB Đức, máng đúc hợp kim, bi treo bạc đạn chịu lực kéo nhẹ tênh.",
    specs: ["Độ dày U: 1.3 mm chuẩn kỹ thuật", "Sơn AkzoNobel CHLB Đức", "Máng đúc bi treo siêu êm", "Bảo hành 5 năm"],
    icon: <Star size={24} />,
    badge: "BÁN CHẠY NHẤT",
    isNew: true
  },
  {
    id: 302,
    category: "cuakeo",
    code: "CK-SR2",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    title: "CỬA KÉO CÔNG NGHỆ\nĐỨC SR2 TIÊU CHUẨN",
    description: "U dày 1.1 mm sơn tĩnh điện AKZO NOBEL, máng đúc bi treo, nhíp đặc lập là, giá thành kinh tế.",
    details: "Cửa kéo công nghệ Đức SR2 độ dày 1.1 mm chuẩn mực cho nhà phố, vận hành nhẹ nhàng, chống rỉ sét hoàn hảo.",
    specs: ["Độ dày U: 1.1 mm", "Sơn AkzoNobel Đức", "Máng đúc bi treo", "Bảo hành 5 năm"],
    icon: <Columns size={24} />,
    badge: "PHỔ THÔNG",
    isNew: false
  },
  {
    id: 303,
    category: "cuakeo",
    code: "CK-SR3",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    title: "CỬA KÉO CÔNG NGHỆ\nĐỨC SR3 KINH TẾ",
    description: "U dày 0.9 mm sơn tĩnh điện AKZO NOBEL, máng đúc bi treo, tối ưu chi phí cho gia đình.",
    details: "Cửa kéo công nghệ Đức SR3 độ dày 0.9 mm kinh tế, máng đúc bi treo bạc đạn kéo nhẹ tênh, bảo hành màu sơn 3 năm.",
    specs: ["Độ dày U: 0.9 mm", "Sơn AkzoNobel Đức", "Máng đúc bi treo", "Bảo hành 3 năm"],
    icon: <Columns size={24} />,
    badge: "TIẾT KIỆM",
    isNew: false
  },
  {
    id: 304,
    category: "cuakeo",
    code: "VIP",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    title: "CỬA KÉO CÔNG NGHỆ\nĐỨC VIP U DÀY 1.5MM",
    description: "U dày 1.5 mm sơn tĩnh điện AKZO NOBEL, máng đúc bi treo chịu lực lớn, bảo vệ an ninh tuyệt đối.",
    details: "Phiên bản đỉnh cao cửa kéo công nghệ Đức VIP U dày 1.5 mm chống trộm cắt phá cho biệt thự, ngân hàng.",
    specs: ["Độ dày U: 1.5 mm siêu dày", "Sơn AkzoNobel Đức", "Máng đúc bi treo siêu tải", "Bảo hành 5 năm"],
    icon: <ShieldCheck size={24} />,
    badge: "VIP SIÊU DÀY",
    isNew: true
  },
  {
    id: 305,
    category: "cuakeo",
    code: "CK-IX304",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80",
    title: "CỬA KÉO INOX 304\nCAO CẤP SÁNG BÓNG",
    description: "100% Inox 304 sáng bóng không rỉ sét, chịu lực tối đa cho mặt phố & biệt thự ven biển.",
    details: "Dòng cửa kéo cao cấp bằng Inox 304 nguyên chất chống ăn mòn hóa chất và hơi muối biển, cực kỳ thích hợp cho thời tiết ven biển Đà Nẵng.",
    specs: ["100% Inox 304 chuẩn", "Thanh U dày 1.0 - 1.5mm", "Không gỉ sét dưới mọi thời tiết", "Bảo hành 10 năm"],
    icon: <ShieldCheck size={24} />,
    badge: "SIÊU BỀN",
    isNew: true
  },
  {
    id: 306,
    category: "cuakeo",
    code: "CK-DL",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    title: "CỬA KÉO ĐÀI LOAN\nCÓ LÁ / KHÔNG LÁ",
    description: "Thân cửa thép mạ màu Đài Loan, nhíp keo hoa văn sang trọng, kéo nhẹ êm.",
    details: "Cửa kéo Đài Loan chất liệu tôn mạ màu nhập khẩu, nhíp ép thủy lực chắc chắn, bạc đạn bạc inox giúp đóng mở siêu nhẹ nhàng.",
    specs: ["Độ dày U: 0.6mm - 1.4mm", "Nhíp sơn tĩnh điện hoa văn", "Bạc đạn inox chống kẹt", "Bảo hành 2 năm"],
    icon: <AlignJustify size={24} />,
    badge: "BÁN CHẠY",
    isNew: false
  },
  {
    id: 307,
    category: "cuakeo",
    code: "CK-KL",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    title: "CỬA KÉO KHÔNG LÁ\nTHÔNG THOÁNG 95%",
    description: "Thiết kế tối ưu lấy ánh sáng & gió tự nhiên cho cổng nhà, nhà xe, chung cư.",
    details: "Cửa kéo không lá giúp tối ưu hóa không gian gió và ánh sáng xuyên qua, tạo cảm giác thông thoáng rộng rãi đồng thời bảo vệ an ninh vững chắc.",
    specs: ["Khung U mạ màu / sơn tĩnh điện", "Thiết kế không lá lấy sáng 95%", "Khóa âm sàn / chốt ngang an toàn", "Bảo hành 3 năm"],
    icon: <Home size={24} />,
    badge: "THÔNG THOÁNG",
    isNew: false
  },

  // -------------------------------------------------------------
  // D. CỔNG & CỬA TỰ ĐỘNG (Cổng âm sàn Italia, Tay đòn, Cửa trượt Nabco...)
  // -------------------------------------------------------------
  {
    id: 401,
    category: "cuatudong",
    code: "IT-GHOST",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    title: "CỔNG TỰ ĐỘNG ÂM SÀN\nITALIA IP67 KHÁNG NƯỚC",
    description: "Mô-tơ âm sàn chống nước ngập IP67, điều khiển Smartphone cho Biệt thự & Villa.",
    details: "Hệ thống cổng mở xoay âm sàn nhập khẩu Ý 100%, động cơ đúc nguyên khối chống ngập nước tiêu chuẩn IP67, chịu tải nặng tới 800kg/cánh.",
    specs: ["Tiêu chuẩn chống nước IP67 Ý", "Tải trọng: 800kg / cánh", "Góc mở: 110° - 180°", "Bảo hành 5 năm"],
    icon: <Columns size={24} />,
    badge: "VIP ITALIA",
    isNew: true
  },
  {
    id: 402,
    category: "cuatudong",
    code: "IT-ARM",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    title: "CỔNG MỞ CÁNH TAY ĐÒN\nĐIỆN TỬ 24V ITALIA",
    description: "Motor tay đòn gắn trực tiếp lên trụ cổng, lắp đặt nhanh gọn, tự khóa an toàn.",
    details: "Cổng mở tự động cánh tay đòn Beninca/FAAC Italia dùng điện áp 24V DC an toàn tuyệt đối, cơ chế tự hãm khi đóng không cần gắn thêm ổ khóa cơ.",
    specs: ["Điện áp động cơ 24V DC an toàn", "Góc mở cổng lên tới 120°", "Tích hợp mở 1 cánh hoặc 2 cánh", "Bảo hành 3 năm"],
    icon: <ArrowRightLeft size={24} />,
    badge: "CAO CẤP",
    isNew: true
  },
  {
    id: 403,
    category: "cuatudong",
    code: "NABCO-JP",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
    title: "CỬA TRƯỢT TỰ ĐỘNG\nMẮT THẦN NABCO NHẬT",
    description: "Đóng mở êm ái, mắt thần hồng ngoại nhạy bén cho TTTM, văn phòng, khách sạn.",
    details: "Động cơ DC Brushless Nabco (Nhật Bản) độ bền 2.000.000 lần đóng mở, cảm biến vi sóng nhận diện người từ xa nhạy bén, chống kẹt an toàn tuyệt đối.",
    specs: ["Động cơ DC Brushless Nabco Nhật", "Tải trọng: 150kg x 2 cánh", "Tốc độ mở: 15-50 cm/s", "Tuổi thọ > 2.000.000 lần"],
    icon: <ArrowRightLeft size={24} />,
    badge: "SMART",
    isNew: true
  },
  {
    id: 404,
    category: "cuatudong",
    code: "HF-GLASS",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
    title: "CỬA KÍNH THỦY LỰC\nLỀ SÀN HÄFELE ĐỨC",
    description: "Bản lề sàn chịu lực cao cấp, kẹp kính inox 304 cho văn phòng & showroom.",
    details: "Hệ cửa kính thủy lực sử dụng kính cường lực 10 - 12mm kết hợp bản lề sàn Häfele Đức chính hãng, đóng mở êm nhẹ 2 chiều, định vị góc 90 độ.",
    specs: ["Bản lề sàn Häfele CHLB Đức", "Kính cường lực 10 - 12mm Temper", "Phụ kiện Inox 304 sáng bóng", "Bảo hành 3 năm"],
    icon: <Home size={24} />,
    badge: "SANG TRỌNG",
    isNew: false
  },
  {
    id: 405,
    category: "cuatudong",
    code: "BR-600",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80",
    title: "BARRIER TỰ ĐỘNG\nKIỂM SOÁT BÃI XE",
    description: "Thanh chắn Barrier tốc độ cao 1.5s - 6s kiểm soát an ninh ra vào chuyên nghiệp.",
    details: "Thanh chắn Barrier tự động thông minh cho khu đô thị, bãi xe thông minh, tòa nhà và cơ quan hành chính. Tích hợp cảm biến chống va đập thông minh.",
    specs: ["Chiều dài cần: 2m - 6m", "Tốc độ đóng mở: 1.5s - 6s", "Đèn LED cảnh báo ban đêm", "Chống va đập thông minh"],
    icon: <AlignJustify size={24} />,
    badge: "AN NINH",
    isNew: false
  }
];

export default function Products() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("all");
  const [isMuted, setIsMuted] = useState(true);
  const [dbProducts, setDbProducts] = useState([]);
  const mobileVideoRef = useRef(null);
  const sectionRef = useRef(null);

  const toggleSound = (e) => {
    e.stopPropagation();
    if (mobileVideoRef.current) {
      mobileVideoRef.current.muted = !mobileVideoRef.current.muted;
      setIsMuted(mobileVideoRef.current.muted);
    }
  };

  // Tải thêm sản phẩm từ backend API nếu admin đã thêm vào hệ thống
  useEffect(() => {
    const apiUrl = import.meta.env.VITE_API_URL || "";
    if (apiUrl) {
      fetch(`${apiUrl}/api/products`)
        .then((res) => res.json())
        .then((resData) => {
          if (resData.success && Array.isArray(resData.data) && resData.data.length > 0) {
            setDbProducts(resData.data);
          }
        })
        .catch(() => null);
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    });

    const cards = document.querySelectorAll(".new-product-card, .features-bottom-bar, .section-header-flex, .product-category-tabs");
    cards.forEach((card) => observer.observe(card));

    return () => observer.disconnect();
  }, [activeTab]);

  const categories = [
    { id: "all", label: "TẤT CẢ" },
    { id: "cuacuon", label: "CỬA CUỐN" },
    { id: "phukien", label: "PHỤ KIỆN CỬA" },
    { id: "cuakeo", label: "CỬA KÉO" },
    { id: "cuatudong", label: "CỔNG & CỬA" },
  ];

  // Logic hiển thị đúng theo yêu cầu:
  // - Khi activeTab === "all": Chỉ hiện đúng 6 sản phẩm/giải pháp tổng quan đại diện ("6 cái nớ")
  // - Khi activeTab !== "all" (ví dụ bấm vào Cửa cuốn): Hiện HẾT tất cả các loại sản phẩm thuộc danh mục đó ra!
  const filteredProducts = useMemo(() => {
    if (activeTab === "all") {
      return OVERVIEW_6_PRODUCTS;
    }

    const catalogFiltered = CATALOG_PRODUCTS.filter((p) => p.category === activeTab);
    const dbFiltered = dbProducts
      .filter((p) => p.category === activeTab)
      .map((item, idx) => ({
        id: item._id || `db-${idx}`,
        category: item.category,
        image: item.image || "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
        title: item.title,
        description: item.description || "Sản phẩm chính hãng chất lượng cao",
        details: item.details || item.description,
        specs: item.specs || ["Chính hãng 100%", "Bảo hành dài hạn"],
        icon: <Home size={24} />,
        badge: item.badge || "MỚI",
        isNew: true
      }));

    return [...catalogFiltered, ...dbFiltered];
  }, [activeTab, dbProducts]);

  // 3D Parallax Tilt Handler
  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px) scale(1)`;
  };

  const handleCardClick = (product) => {
    const { icon, ...serializableProduct } = product;
    const targetSlug = getProductSlug(product);
    navigate(`/san-pham/${targetSlug}`, { state: { product: serializableProduct } });
  };

  return (
    <>
      {/* ================= PRODUCTS ================= */}
      <section ref={sectionRef} className="products-section" id="products">
        {/* Leaf photo decorations */}
        <img src="/leaf_left.png" alt="" className="leaf-deco leaf-deco-1" aria-hidden="true" />
        <img src="/leaf_right.png" alt="" className="leaf-deco leaf-deco-2" aria-hidden="true" />
        
        {/* Video thực tế trên mobile - Tách biệt hoàn toàn khỏi Hero, nằm ngay trên phần Danh Sách Sản Phẩm */}
        <div className="mobile-products-video-block">
          <div className="container">
            <div className="mobile-video-card">
              <div className="mobile-video-header">
                <span className="mobile-video-badge">
                  <Play size={12} fill="#d4af37" color="#d4af37" />
                  VIDEO THỰC TẾ CÔNG TRÌNH
                </span>
                <h3 className="mobile-video-title">
                  Hệ Thống Cửa Cuốn &amp; Cửa Kéo BOSS
                </h3>
                <p className="mobile-video-desc">
                  Hình ảnh thực tế thi công &amp; vận hành êm ái tại Đà Nẵng
                </p>
              </div>

              <div className="mobile-video-wrapper">
                <video
                  ref={mobileVideoRef}
                  src="/0910.mp4"
                  controls
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  className="mobile-inline-video"
                />

                <button
                  type="button"
                  className={`mobile-video-sound-pill ${!isMuted ? "is-unmuted" : ""}`}
                  onClick={toggleSound}
                  aria-label={isMuted ? "Bật âm thanh" : "Tắt âm thanh"}
                >
                  {isMuted ? <VolumeX size={14} /> : <Volume2 size={14} />}
                  <span>{isMuted ? "Bật âm thanh" : "Đã bật tiếng"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="section-header-flex">
            <div className="section-title-left">
              <div className="section-subtitle">
                <span>SẢN PHẨM NỔI BẬT</span>
                <div className="subtitle-line"></div>
              </div>
              <h2>DANH MỤC SẢN PHẨM</h2>
            </div>
          </div>

          {/* Interactive Category Filter Tabs */}
          <div className="product-category-tabs">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`category-tab-btn ${activeTab === cat.id ? "active" : ""}`}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="new-product-grid" key={activeTab}>
            {filteredProducts.map((product, index) => (
              <div
                className="new-product-card"
                key={product.id || index}
                style={{ "--card-index": index }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleCardClick(product)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleCardClick(product);
                  }
                }}
              >
                <div className="new-product-content">
                  <div className="product-icon-badge">{product.icon}</div>
                  {product.badge ? (
                    <span className="badge-new">{product.badge}</span>
                  ) : product.isNew ? (
                    <span className="badge-new">MỚI</span>
                  ) : null}
                  <h3 dangerouslySetInnerHTML={{ __html: product.title.replace(/\n/g, '<br/>') }}></h3>
                  <div className="title-underline"></div>
                  <p className="product-desc">{product.description}</p>
                  <button
                    type="button"
                    className="btn-explore"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(product);
                    }}
                  >
                    KHÁM PHÁ NGAY <ArrowRight size={14} />
                  </button>
                </div>
                <div className="new-product-img">
                  <img src={product.image} alt={product.title.replace(/\n/g, ' ')} loading="lazy" />
                  <div className="img-shimmer"></div>
                  <div className="img-hover-overlay">
                    <Eye size={20} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="view-all-wrapper">
            <Link
              to={activeTab === "all" ? "/san-pham" : `/san-pham?cat=${activeTab}`}
              className="btn-outline"
            >
              <span>
                {activeTab === "all"
                  ? "XEM TẤT CẢ SẢN PHẨM"
                  : `XEM THÊM CÁC DÒNG ${categories.find((c) => c.id === activeTab)?.label || ""}`}
              </span>
              <ArrowRight size={14} />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}
