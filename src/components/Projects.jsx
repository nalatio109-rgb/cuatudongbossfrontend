import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  MapPin,
  Calendar,
  X,
  CheckCircle2,
  PhoneCall,
  MessageCircle,
  Eye,
  Star,
  Sliders,
  ShieldCheck,
  Sparkles,
  Camera
} from "lucide-react";
import RevealOnScroll from "./RevealOnScroll";
import "./Projects.css";

// Danh sách công trình thực tế có đầy đủ bài viết và chùm ảnh
export const HOMEPAGE_PROJECTS = [
  {
    id: 1,
    title: "Biệt thự cao cấp Euro Village",
    category: "Cửa trượt tự động & Cửa cuốn",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
      "/project_1.png",
      "/about_technician_install.jpg",
      "/about_meeting.jpg"
    ],
    location: "Khu Biệt Thự Làng Châu Âu (Euro Village 1), Q. Sơn Trà, TP. Đà Nẵng",
    date: "Tháng 02/2024",
    scale: "2 bộ cửa cuốn khe thoáng BossDoor AI & Cổng trượt tự động Italia",
    specs: [
      { label: "Loại cửa", val: "Cửa cuốn khe thoáng BossDoor hợp kim nhôm 6063-T6 phủ sơn AkzoNobel CHLB Đức" },
      { label: "Động cơ", val: "Mô tơ YH Đài Loan 600kg lõi đồng 100%, tích hợp xích kéo cơ khi mất điện" },
      { label: "Bộ lưu điện", val: "Boss Smart UPS tự sạc xả thông minh, lưu điện dự phòng liên tục 72 giờ" },
      { label: "Hệ thống an toàn", val: "Cảm biến AI tự đảo chiều khi chạm vật cản, còi báo động chống cạy phá" },
      { label: "Điều khiển", val: "Hộp nhận mã nhảy Rolling Code chống dò sóng + Đóng mở qua App Smartphone" }
    ],
    summary: "Hệ thống cửa cuốn thông minh BossDoor công nghệ AI kết hợp cổng trượt tự động Châu Âu mang đến sự an tâm tuyệt đối và vẻ đẹp sang trọng cho biệt thự Euro Village.",
    articleContent: [
      "Biệt thự tại khu đô thị đẳng cấp Euro Village (Làng Châu Âu) Đà Nẵng đòi hỏi giải pháp cửa phải đạt chuẩn mực cao nhất về tính thẩm mỹ kiến trúc, độ êm ái khi vận hành và an ninh tuyệt đối.",
      "Gia chủ mong muốn cửa garage có khả năng chống ồn triệt để vì phòng ngủ nằm ngay phía trên tầng lửng, đồng thời màu sắc sơn phải hài hòa với màu đá ốp mặt tiền tân cổ điển của ngôi biệt thự.",
      "Đội ngũ kỹ sư BOSS Đà Nẵng đã trực tiếp đo đạc laser tại hiện trường, tư vấn lắp đặt dòng cửa cuốn khe thoáng BossDoor cao cấp nan nhôm 2 lớp giảm chấn kép. Cửa tích hợp gioăng lông triệt tiêu rung chấn, giảm tới 95% tiếng ồn khi đóng mở.",
      "Sau 2 ngày gia công chuẩn xác tại xưởng và 1 ngày lắp ráp hoàn thiện, hệ thống đã vượt qua các bài kiểm tra cảm biến an toàn chống xô, chạy thử ngắt điện lưới với bộ lưu điện UPS và bàn giao thẻ bảo hành chính hãng 5 năm tận tay gia chủ."
    ],
    clientReview: {
      name: "Anh Minh Tuấn",
      role: "Chủ sở hữu Biệt thự Euro Village",
      comment: "Cửa đóng mở cực kỳ êm ái, đứng cách 2 mét gần như không nghe tiếng mô tơ. Tôi rất thích tính năng đóng mở qua điện thoại, đi công tác xa vẫn kiểm tra được trạng thái cửa nhà."
    }
  },
  {
    id: 2,
    title: "Căn hộ Penthouse Landmark",
    category: "Cửa nhôm kính cao cấp",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "/about_door_1.png"
    ],
    location: "Tòa tháp Landmark, Đường Bạch Đằng, Q. Hải Châu, TP. Đà Nẵng",
    date: "Tháng 01/2024",
    scale: "Hệ vách kính Panorama & Cửa lùa nhôm kính khổ lớn view sông Hàn",
    specs: [
      { label: "Hệ nhôm", val: "Nhôm định hình cao cấp phủ sơn mạ Anode kháng muối biển chống oxy hóa" },
      { label: "Kính", val: "Kính hộp Low-E 2 lớp 24mm cản nhiệt 90%, cách âm 45dB chuẩn khách sạn" },
      { label: "Ray trượt", val: "Ray trượt âm sàn chống vấp, giảm chấn thủy lực 2 đầu siêu êm" },
      { label: "Phụ kiện", val: "Khóa vân tay thông minh và phụ kiện đồng bộ nhập khẩu Châu Âu" }
    ],
    summary: "Hệ cửa kính lùa khổ lớn Panorama mở rộng tầm view 360 độ ngắm trọn sông Hàn và cầu Rồng, chống chịu gió bão cực đại trên tầng cao.",
    articleContent: [
      "Tọa lạc tại tầng cao nhất của tòa tháp bên bờ sông Hàn thơ mộng, căn hộ Penthouse Landmark đối mặt với áp lực gió cực lớn vào mùa mưa bão miền Trung.",
      "Yêu cầu đặt ra là hệ cửa phải mở rộng tối đa tầm nhìn toàn cảnh thành phố nhưng vẫn phải đảm bảo độ kín khít tuyệt đối, không rò rỉ nước mưa và cách âm triệt để tiếng còi xe bên dưới đường Bạch Đằng.",
      "BOSS Đà Nẵng đã thi công hệ nhôm kính Panorama Slim-line chịu lực gió cấp 13, kết hợp kính hộp Low-E cản nhiệt giúp căn hộ luôn thoáng mát, tiết kiệm 40% điện năng điều hòa nhiệt độ.",
      "Hệ ray âm sàn phẳng hoàn toàn với sàn gỗ tạo nên sự sang trọng và liền mạch tuyệt đối cho không gian phòng khách."
    ],
    clientReview: {
      name: "Chị Mai Phương",
      role: "Chủ căn hộ Penthouse Landmark",
      comment: "Cửa lùa đẩy rất nhẹ tay, kính cách âm siêu tốt. Đêm giao thừa mở cửa ra ban công ngắm pháo hoa sông Hàn đẹp không góc chết!"
    }
  },
  {
    id: 3,
    title: "Thi công Cửa Villa Sơn Trà",
    category: "Cửa mở cánh hiện đại",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "/about_technician_install.jpg",
      "/about_construction.jpg"
    ],
    location: "Đường Hoàng Sa, Bán đảo Sơn Trà, TP. Đà Nẵng",
    date: "Tháng 03/2024",
    scale: "4 bộ cửa mở cánh tự động Häfele Đức và cửa lùa nhôm kính khổ lớn",
    specs: [
      { label: "Quy mô", val: "Hệ cửa mở cánh tự động sảnh lớn + Cửa trượt ban công view biển Mỹ Khê" },
      { label: "Chất liệu kính", val: "Kính cường lực Temper 12mm chịu lực, phủ màng cản tia UV" },
      { label: "Động cơ", val: "Motor mở cánh tự động Häfele Đức chuẩn kháng nước và bụi bẩn IP65" },
      { label: "Chống muối biển", val: "Toàn bộ bản lề, tay nắm, ốc vít bằng Inox SUS 316 kháng muối biển" }
    ],
    summary: "Dự án Biệt thự nghỉ dưỡng cao cấp ven biển Sơn Trà, ứng dụng hệ thống cửa kính mở cánh tự động hiện đại chịu gió bão biển miền Trung.",
    articleContent: [
      "Tọa lạc trên sườn đồi hướng biển tại bán đảo Sơn Trà, căn biệt thự có không gian mở giao hòa trọn vẹn với thiên nhiên xanh ngát. Vì nằm sát bờ biển, hơi muối mặn là tác nhân gây ăn mòn nhanh chóng các loại kim loại thông thường.",
      "BOSS Đà Nẵng đã lựa chọn giải pháp phụ kiện đặc chủng Inox 316 tiêu chuẩn hàng hải, kết hợp thanh nhôm sơn tĩnh điện AkzoNobel bảo hành chống ăn mòn lên tới 10 năm trước gió biển.",
      "Động cơ mở cánh tự động vận hành êm ru nhờ cơ chế giảm tốc khi sắp chạm điểm dừng. Cảm biến mắt thần hồng ngoại đa điểm phát hiện người từ khoảng cách 2.5m, tự động mở cửa đón gia chủ và khách quý mà không cần chạm tay.",
      "Quá trình thi công được thực hiện bởi đội ngũ kỹ thuật trưởng của BOSS, hoàn thành bàn giao vượt tiến độ 2 ngày so với hợp đồng ban đầu."
    ],
    clientReview: {
      name: "Anh Quốc Bảo",
      role: "Chủ đầu tư Villa Sơn Trà",
      comment: "Đội ngũ BOSS làm việc rất chỉn chu, sạch sẽ và chuyên nghiệp. Cửa tự động mở cánh cực kỳ sang trọng, khách đến chơi ai cũng khen ngợi."
    }
  },
  {
    id: 4,
    title: "Showroom BOSS Đà Nẵng",
    category: "Hệ thống Cửa tự động",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "/about_meeting.jpg",
      "/about_team.jpg",
      "/about_door_1.png"
    ],
    location: "267 Tô Hiệu, P. Hòa Khánh / Ngô Quyền, Sơn Trà, TP. Đà Nẵng",
    date: "Đang mở cửa đón tiếp khách hàng",
    scale: "Khu trưng bày mẫu thực tế hơn 30 dòng cửa cuốn, cửa kéo, cổng tự động",
    specs: [
      { label: "Cửa cuốn", val: "Cửa cuốn khe thoáng BossDoor, Tấm liền Úc, Siêu trường, Song ngang Inox" },
      { label: "Cổng tự động", val: "Motor âm sàn Italia Ditec, Motor tay đòn Beninca, Motor cổng lùa" },
      { label: "Cửa kéo", val: "Cửa kéo công nghệ Đức không lá, Cửa kéo Inox 304, Cửa kéo Đài Loan" },
      { label: "Công nghệ", val: "Khu trải nghiệm cảm biến vật cản AI, kết nối App điều khiển WiFi" }
    ],
    summary: "Trung tâm trưng bày và trải nghiệm thực tế các dòng sản phẩm cửa tự động chính hãng hàng đầu tại Đà Nẵng và khu vực miền Trung.",
    articleContent: [
      "Showroom BOSS Đà Nẵng là nơi quý khách hàng, các chủ nhà và nhà thầu xây dựng có thể trực tiếp đến vận hành thử các mẫu cửa thực tế trước khi quyết định lắp đặt cho ngôi nhà của mình.",
      "Tại đây, chúng tôi lắp đặt đầy đủ các mô hình hoạt động thật: khách hàng có thể thử cảm giác đóng mở cửa cuốn qua điện thoại, thử tính năng cảm biến an toàn khi gặp vật cản cửa tự động dừng lại như thế nào, và nghe thử độ êm của từng loại mô tơ.",
      "Đội ngũ kỹ sư BOSS luôn túc trực để tư vấn giải pháp tối ưu theo diện tích thực tế và ngân sách của từng gia đình."
    ],
    clientReview: {
      name: "KTS. Lê Đức Huy",
      role: "Văn phòng Kiến trúc Đất Việt",
      comment: "Showroom rất chuyên nghiệp, có đầy đủ mẫu thực tế giúp tôi dẫn các khách hàng đến xem mẫu và chốt phương án rất nhanh chóng."
    }
  },
  {
    id: 5,
    title: "Resort & Spa ven biển",
    category: "Cửa kính thuỷ lực",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1200&q=80",
      "/about_construction.jpg"
    ],
    location: "Đường Trường Sa, P. Hòa Hải, Q. Ngũ Hành Sơn, TP. Đà Nẵng",
    date: "Tháng 11/2023",
    scale: "Cửa trượt tự động mắt thần Nabco Nhật Bản sảnh lớn & Cửa kính thủy lực",
    specs: [
      { label: "Động cơ", val: "Hệ thống cửa tự động Nabco Made in Japan, độ bền 2 triệu chu kỳ đóng mở" },
      { label: "Kính", val: "Kính cường lực Temper 12mm chịu lực, viền khung inox 304 bóng sang trọng" },
      { label: "Cảm biến", val: "Mắt thần hồng ngoại kết hợp cảm biến photocell chống kẹt hai bên" },
      { label: "Độ ồn", val: "Độ ồn khi trượt dưới 45dB, vận hành siêu êm ái đạt chuẩn resort 5 sao" }
    ],
    summary: "Lắp đặt hệ thống cửa tự động mắt thần cao cấp cho sảnh đón khách Resort ven biển Non Nước, đáp ứng tần suất lưu thông cao liên tục 24/7.",
    articleContent: [
      "Khu nghỉ dưỡng ven biển Non Nước đón hàng ngàn lượt khách quốc tế mỗi ngày. Hệ thống cửa tự động tại sảnh chính đòi hỏi độ bền tuyệt đối, không được xảy ra sự cố hỏng hóc làm gián đoạn việc đón tiếp khách hàng.",
      "BOSS Đà Nẵng đã tư vấn và thi công dòng cửa trượt tự động Nabco (Nhật Bản) với độ bền vận hành lên tới 2.000.000 chu kỳ đóng mở. Ray trượt hợp kim nhôm nguyên khối giảm ma sát tối đa.",
      "Hệ thống cảm biến mắt thần cực kỳ nhạy bén, nhận diện người tiến đến từ cự ly 2 mét và tự động giữ cửa mở khi có khách đứng giữa cửa, đảm bảo an toàn tuyệt đối cho trẻ em và người lớn tuổi."
    ],
    clientReview: {
      name: "Ông David Miller",
      role: "Giám đốc Vận hành Resort",
      comment: "Hệ thống cửa hoạt động rất ổn định suốt mùa du lịch cao điểm. Dịch vụ bảo dưỡng định kỳ của BOSS rất nhanh chóng và chu đáo."
    }
  },
  {
    id: 6,
    title: "Biệt thự phố Ngũ Hành Sơn",
    category: "Cửa cổng tự động",
    image: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1200&q=80",
      "/hero_building.png",
      "/project_1.png",
      "/about_technician_install.jpg"
    ],
    location: "Khu Đô Thị Công Nghệ FPT City, Q. Ngũ Hành Sơn, TP. Đà Nẵng",
    date: "Tháng 03/2024",
    scale: "Cổng mở xoay 2 cánh tự động motor âm sàn Ditec Italia & Cửa cuốn khe thoáng",
    specs: [
      { label: "Động cơ cổng", val: "Motor âm sàn Ditec nhập khẩu Italia chuẩn chống nước ngập IP67" },
      { label: "Tải trọng", val: "Tải trọng 800kg/cánh, góc mở linh hoạt từ 110 đến 180 độ" },
      { label: "Cửa cuốn", val: "Cửa cuốn khe thoáng nhôm 2 lớp giảm chấn siêu êm chống ồn" },
      { label: "Tiện ích", val: "Tích hợp mở cổng qua Remote mã nhảy và Camera nhận diện xe ô tô" }
    ],
    summary: "Giải pháp an ninh tổng thể cho biệt thự phố FPT City gồm cổng tự động âm sàn kháng nước ngập và cửa cuốn khe thoáng giảm chấn.",
    articleContent: [
      "Ngôi biệt thự phố tại khu đô thị FPT City có khuôn viên sân vườn rộng rãi và garage ô tô trong nhà. Chủ nhà thường xuyên di chuyển bằng ô tô nên có nhu cầu mở cổng từ xa ngay từ khi xe còn cách nhà 50m để không phải xuống xe dưới trời mưa nắng.",
      "Kỹ thuật viên BOSS đã khảo sát hệ móng cổng, bố trí hệ thống thoát nước ngầm chuẩn xác cho hộp motor âm sàn Ditec Italia chuẩn kháng nước ngập IP67.",
      "Đồng thời, cửa cuốn garage được trang bị bộ điều khiển đồng bộ, cho phép gia chủ dùng chung 1 tay remote hoặc dùng điện thoại thông minh để điều khiển cả cổng rào lẫn cửa cuốn một cách tiện lợi và an toàn."
    ],
    clientReview: {
      name: "Anh Thanh Tùng",
      role: "Kỹ sư Công nghệ - Cư dân FPT City",
      comment: "Rất tiện lợi! Giờ đi làm về trời mưa chỉ cần bấm remote hoặc điện thoại là cổng tự mở, xe chạy thẳng vào garage rất an toàn và thoải mái."
    }
  },
  {
    id: 7,
    title: "Cửa Cuốn Song Ngang TTTM Lacoste / Aeon Mall",
    category: "Cửa cuốn song ngang Inox",
    image: "/about_construction.jpg",
    gallery: [
      "/about_construction.jpg",
      "/about_technician_install.jpg",
      "/factory_worker.png",
      "/about_meeting.jpg"
    ],
    location: "Trung tâm thương mại Aeon Mall, Q. Hải Châu, TP. Đà Nẵng",
    date: "Tháng 04/2024",
    scale: "2 bộ cửa cuốn song ngang inox 304 khổ lớn 7.5m x 4.2m",
    specs: [
      { label: "Chất liệu nan", val: "Inox SUS 304 dạng ống tròn phi 22 dày 1.2mm sáng bóng" },
      { label: "Động cơ", val: "Mô tơ xích kéo ngoài tải trọng 1000kg chuyên dụng TTTM" },
      { label: "Độ thông thoáng", val: "Thông thoáng 85%, trưng bày sản phẩm sang trọng ngoài giờ" },
      { label: "Tiêu chuẩn PCCC", val: "Đạt chuẩn an toàn phòng cháy chữa cháy TTTM quốc tế" }
    ],
    summary: "Thi công hoàn thiện 2 bộ cửa cuốn lưới song ngang inox 304 cao cấp cho gian hàng thời trang Lacoste tại trung tâm thương mại Đà Nẵng.",
    articleContent: [
      "Gian hàng thương hiệu thời trang Lacoste tại TTTM yêu cầu mặt tiền phải hoàn toàn thông thoáng để khách hàng vẫn có thể ngắm nhìn các bộ sưu tập trưng bày bên trong kể cả khi trung tâm thương mại đóng cửa.",
      "BOSS Đà Nẵng đã trực tiếp gia công tại xưởng 2 bộ cửa cuốn song ngang inox SUS 304 với kỹ thuật uốn và hàn liên kết tinh xảo, không để lộ vết hàn.",
      "Đội ngũ kỹ thuật thi công ca đêm theo đúng nội quy nghiêm ngặt của TTTM, đảm bảo an toàn tuyệt đối cho hệ thống trần thạch cao và ánh sáng của gian hàng."
    ],
    clientReview: {
      name: "Anh Hưng",
      role: "Quản lý thi công chuỗi Retail",
      comment: "Cửa hoàn thiện rất đẹp, sáng bóng và sắc nét. Đội thi công BOSS làm đêm rất đúng giờ, tuân thủ nghiêm ngặt bảo hộ lao động."
    }
  },
  {
    id: 8,
    title: "Cửa Kéo Công Nghệ Đức Sơn AkzoNobel Hòa Xuân",
    category: "Cửa kéo cao cấp",
    image: "/about_door_1.png",
    gallery: [
      "/about_door_1.png",
      "/about_technician_install.jpg",
      "/hero_building.png"
    ],
    location: "Khu Đô Thị Sinh Thái Hòa Xuân, Q. Cẩm Lệ, TP. Đà Nẵng",
    date: "Tháng 03/2024",
    scale: "Cửa kéo nhôm cao cấp không lá lấy sáng 95%, bề rộng 4.8m",
    specs: [
      { label: "Thanh U", val: "Nhôm hợp kim 6063 đúc dày 1.4mm phủ sơn AkzoNobel Đức" },
      { label: "Bạc đạn", val: "Bạc đạn đôi bọc cao su chịu tải, trượt êm ái không tiếng rít" },
      { label: "Nhíp cửa", val: "Nhíp đặc mạ kẽm dày 2.5mm kiểu dáng chữ S sang trọng" },
      { label: "Độ bền", val: "Bảo hành màu sơn 10 năm không hoen gỉ trước thời tiết Đà Nẵng" }
    ],
    summary: "Lắp đặt cửa kéo công nghệ Đức không lá lấy sáng cho nhà phố Hòa Xuân, bạc đạn đôi đẩy nhẹ tay, đón gió mát và an toàn tối đa.",
    articleContent: [
      "Gia đình bác Hùng tại Hòa Xuân cần lắp một bộ cửa bảo vệ cho ngôi nhà ống vừa hoàn thiện. Gia đình có người lớn tuổi nên yêu cầu cửa phải thật nhẹ nhàng, phụ nữ hoặc người già đẩy tay không bị nặng hay kẹt rít như các loại cửa sắt cũ trước đây.",
      "BOSS Đà Nẵng đã tư vấn dòng cửa kéo công nghệ Đức cao cấp thanh nhôm định hình. Hệ bạc đạn đôi thông minh giúp giảm tới 80% lực đẩy, vận hành êm ái.",
      "Thiết kế không lá giúp đón gió tự nhiên vào nhà từ bờ sông Cẩm Lệ nhưng vẫn ngăn chặn sự xâm nhập từ bên ngoài một cách kiên cố."
    ],
    clientReview: {
      name: "Bác Nguyễn Hùng",
      role: "Gia chủ nhà phố Hòa Xuân",
      comment: "Cửa này đẩy nhẹ như không, êm ru không một tiếng động rít. Sơn rất bóng và đẹp, gia đình tôi ưng ý lắm!"
    }
  }
];

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  // Duplicate array for continuous infinite marquee loop
  const marqueeItems = [...HOMEPAGE_PROJECTS, ...HOMEPAGE_PROJECTS];

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    setActivePhotoIdx(0);
    document.body.style.overflow = "hidden";
  };

  const handleCloseProject = () => {
    setSelectedProject(null);
    document.body.style.overflow = "auto";
  };

  // Keyboard navigation: press Escape to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && selectedProject) {
        handleCloseProject();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedProject]);

  return (
    <>
      {/* ================= PROJECTS MARQUEE ================= */}
      <section className="projects-section" id="projects">
        <div className="container">
          <RevealOnScroll animation="fade-up">
            <div className="section-header-flex">
              <div className="section-title-left">
                <div className="section-subtitle">
                  <span>DỰ ÁN TIÊU BIỂU</span>
                  <div className="subtitle-line"></div>
                </div>
                <h2>NHỮNG CÔNG TRÌNH ĐÃ THỰC HIỆN</h2>
              </div>
            </div>
          </RevealOnScroll>
        </div>

        <RevealOnScroll animation="zoom-in" delay={200} className="projects-marquee-wrapper">
          <div className="projects-marquee-track">
            {marqueeItems.map((project, index) => (
              <div
                className="project-card"
                key={`${project.id}-${index}`}
                onClick={() => handleOpenProject(project)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleOpenProject(project);
                  }
                }}
                title={`Nhấn để xem bài viết & hình ảnh thực tế: ${project.title}`}
              >
                <img src={project.image} alt={project.title} loading="lazy" />
                <div className="project-card-overlay">
                  <span className="project-card-category">{project.category}</span>
                  <h4 className="project-card-title">{project.title}</h4>
                  <span className="project-card-click-hint">
                    <Eye size={12} /> Xem thực tế & bài viết
                  </span>
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Nút Xem tất cả công trình chuyển xuống phía dưới màn hình chạy */}
        <div className="container">
          <div className="projects-bottom-action">
            <Link to="/cong-trinh" className="btn-view-all-projects-link">
              <span>Xem tất cả công trình</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ================= MODAL XEM BÀI VIẾT & HÌNH ẢNH CÔNG TRÌNH THỰC TẾ ================= */}
      {selectedProject &&
        createPortal(
          <div className="home-project-modal-backdrop" onClick={handleCloseProject}>
            <div
              className="home-project-modal-card"
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-modal="true"
              aria-label={selectedProject.title}
            >
              {/* Nút đóng X */}
              <button
                type="button"
                className="home-project-modal-close-btn"
                onClick={handleCloseProject}
                aria-label="Đóng bài viết công trình"
              >
                <X size={22} />
              </button>

              <div className="home-project-modal-scroll">
                {/* 1. KHU VỰC ẢNH & CHÙM ẢNH THỰC TẾ */}
                <div className="home-project-gallery-top">
                  <div className="home-project-main-image-wrap">
                    <img
                      src={
                        selectedProject.gallery && selectedProject.gallery.length > 0
                          ? selectedProject.gallery[activePhotoIdx]
                          : selectedProject.image
                      }
                      alt={selectedProject.title}
                    />
                    <div className="home-project-category-badge">
                      {selectedProject.category}
                    </div>

                    {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                      <div className="home-project-photo-counter">
                        <Camera size={13} />
                        <span>
                          {activePhotoIdx + 1} / {selectedProject.gallery.length} ảnh
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Thanh chọn ảnh thumbnail nếu có nhiều ảnh */}
                  {selectedProject.gallery && selectedProject.gallery.length > 1 && (
                    <div className="home-project-thumbs-row">
                      {selectedProject.gallery.map((photoUrl, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          className={`home-project-thumb-btn ${activePhotoIdx === pIdx ? "is-active" : ""}`}
                          onClick={() => setActivePhotoIdx(pIdx)}
                          title={`Xem ảnh ${pIdx + 1}`}
                        >
                          <img src={photoUrl} alt={`Góc chụp ${pIdx + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. NỘI DUNG BÀI VIẾT VÀ CHI TIẾT */}
                <div className="home-project-body-content">
                  {/* Meta thông tin */}
                  <div className="home-project-meta-pills">
                    <span className="home-project-meta-item location">
                      <MapPin size={15} />
                      <strong>{selectedProject.location}</strong>
                    </span>
                    {selectedProject.date && (
                      <span className="home-project-meta-item">
                        <Calendar size={15} />
                        <span>Nghiệm thu: {selectedProject.date}</span>
                      </span>
                    )}
                  </div>

                  {/* Tiêu đề công trình */}
                  <h3 className="home-project-title">{selectedProject.title}</h3>

                  {/* Tóm tắt ngắn */}
                  {selectedProject.summary && (
                    <div className="home-project-summary-box">
                      <strong>Tổng quan:</strong> {selectedProject.summary}
                    </div>
                  )}

                  {/* BẢNG CẤU HÌNH KỸ THUẬT */}
                  {selectedProject.specs && selectedProject.specs.length > 0 && (
                    <div className="home-project-specs-section">
                      <div className="home-project-section-heading">
                        <Sliders size={18} />
                        <span>Thông Số Kỹ Thuật & Cấu Hình Thi Công Thực Tế</span>
                      </div>
                      <div className="home-project-specs-grid">
                        {selectedProject.scale && (
                          <div className="home-project-spec-row">
                            <span className="spec-row-label">
                              <CheckCircle2 size={14} /> Quy mô công trình:
                            </span>
                            <span className="spec-row-val">{selectedProject.scale}</span>
                          </div>
                        )}
                        {selectedProject.specs.map((item, sIdx) => (
                          <div key={sIdx} className="home-project-spec-row">
                            <span className="spec-row-label">
                              <CheckCircle2 size={14} /> {item.label}:
                            </span>
                            <span className="spec-row-val">{item.val}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* BÀI VIẾT CHI TIẾT THI CÔNG */}
                  {selectedProject.articleContent && (
                    <div className="home-project-article-section">
                      <div className="home-project-section-heading">
                        <ShieldCheck size={18} />
                        <span>Bài Viết Chi Tiết Quá Trình Thi Công & Nghiệm Thu</span>
                      </div>
                      <div className="home-project-article-text">
                        {selectedProject.articleContent.map((paragraph, pgIdx) => (
                          <p key={pgIdx}>{paragraph}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ĐÁNH GIÁ CỦA CHỦ ĐẦU TƯ / GIA CHỦ */}
                  {selectedProject.clientReview && (
                    <div className="home-project-review-card">
                      <div className="review-stars-row">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={15} fill="#f5bd20" />
                        ))}
                      </div>
                      <div className="review-quote-text">
                        "{selectedProject.clientReview.comment}"
                      </div>
                      <div className="review-author-info">
                        <span className="review-author-name">
                          {selectedProject.clientReview.name}
                        </span>
                        <span className="review-author-role">
                          — {selectedProject.clientReview.role}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* CTA GỌI ĐIỆN & TƯ VẤN CÔNG TRÌNH TƯƠNG TỰ */}
                  <div className="home-project-cta-banner">
                    <div className="home-project-cta-text">
                      <h4>Bạn Cần Thi Công Công Trình Tương Tự?</h4>
                      <p>Kỹ sư BOSS khảo sát & đo đạc thực tế miễn phí tại Đà Nẵng chỉ sau 30 phút</p>
                    </div>

                    <div className="home-project-cta-btns">
                      <a href="tel:0904678323" className="btn-modal-action-call">
                        <PhoneCall size={16} /> 0904.678.323
                      </a>

                      <a
                        href="https://zalo.me/0904678323"
                        target="_blank"
                        rel="noreferrer"
                        className="btn-modal-action-zalo"
                      >
                        <MessageCircle size={16} /> Chat Zalo Nhận Mẫu
                      </a>

                      <Link
                        to="/cong-trinh"
                        onClick={handleCloseProject}
                        className="btn-modal-action-all"
                      >
                        <span>Xem trang Công Trình</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
