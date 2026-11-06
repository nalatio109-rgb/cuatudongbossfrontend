// Dữ liệu 8 dịch vụ tiêu chuẩn của BOSS Đà Nẵng
// Dùng làm dữ liệu khởi tạo / mẫu trong Admin và dữ liệu dự phòng khi chưa tải được API

export const DEFAULT_SERVICES = [
  {
    id: 1,
    title: "CÁCH CHỐNG BÃO CHO CỬA CUỐN HIỆU QUẢ",
    date: "18/10/2024",
    img: "/service_repair_247.png",
    desc: "Trong thời gian gần đây mưa bão thường xuyên xảy ra ở khắp nơi trên cả nước, đặc biệt là các tỉnh miền Trung gây ra nguy cơ xô kẹt, móp nan cửa cuốn. Hướng dẫn các giải pháp gia cố nan, khóa xích an toàn chống bão hiệu quả.",
    content: `Trong thời gian gần me mưa bão thường xuyên xảy ra ở các tỉnh miền Trung. Cửa cuốn là lá chắn đầu tiên bảo vệ toàn bộ tài sản ngôi nhà. Để đảm bảo an toàn tối đa khi xảy ra dông bão:
1. Đóng kín hoàn toàn hệ thống cửa, không để khe hở gió lùa.
2. Kiểm tra bộ lưu điện (UPS) đảm bảo luôn đủ dung lượng hoạt động khi cúp điện.
3. Lắp thêm bộ chống xô nan, thanh V gia cố khung ray chịu lực gió bão.
4. Ngắt cầu giao điện chính nếu nước ngập sâu để tránh chập cháy bo mạch.`,
    order: 1,
    phone: "0904.678.323"
  },
  {
    id: 2,
    title: "SỬA CHỮA CỬA CUỐN 24/24 TẠI ĐÀ NẴNG - HOTLINE 0904.678.323",
    date: "19/10/2022",
    img: "/service_technician.png",
    desc: "Dịch vụ sửa chữa, bảo trì, bảo dưỡng cửa cuốn tại Đà Nẵng NHANH CHÓNG - UY TÍN - NHIỆT TÌNH. Đội ngũ thợ trực ca 24/7 tại 7 quận huyện có mặt sau 15-30 phút.",
    content: `BOSS Đà Nẵng chuyên cung cấp dịch vụ sửa chữa cửa cuốn khẩn cấp 24/7:
- Xử lý kẹt nan cửa, đứt lá nan, bung rãnh ray.
- Thay mới mô tơ lõi đồng chính hãng bảo hành 24-36 tháng.
- Sửa bo mạch điều khiển, thay tụ điện, thay hành trình mô tơ lấy ngay.
- Cài thêm chìa điều khiển remote mã nhảy Rolling Code chống phá mã.
- Thay ắc quy lưu điện khô chính hãng giá gốc.`,
    order: 2,
    phone: "0904.678.323"
  },
  {
    id: 3,
    title: "CÔNG TRÌNH SỬA CHỮA ĐÃ THỰC HIỆN (HOTLINE 0904.678.323)",
    date: "17/10/2024",
    img: "/project_1.png",
    desc: "Sửa chữa cửa cuốn là một việc quan trọng, đặc biệt là khi cửa bị hỏng hoặc gặp sự cố khẩn cấp. Tổng hợp các dự án thực tế BOSS Đà Nẵng đã thi công phục vụ hàng ngàn khách hàng.",
    content: `Hình ảnh thực tế các công trình sửa chữa, cứu hộ cửa cuốn & cổng tự động tại Hải Châu, Sơn Trà, Thanh Khê, Liên Chiểu... Chúng tôi cam kết báo giá niêm yết trước khi làm, thay thế linh kiện CO/CQ chính hãng và dán tem bảo hành tận nhà.`,
    order: 3,
    phone: "0904.678.323"
  },
  {
    id: 4,
    title: "CỬA KÉO - CÁC LỖI THƯỜNG GẶP VÀ CÁCH KHẮC PHỤC, BÁO GIÁ SỬA CHỮA",
    date: "25/10/2024",
    img: "/hero_bg.png",
    desc: "Cửa kéo Đài Loan, cửa kéo inox thường gặp các lỗi nặng tay, trật đường ray, đứt nhíp. Hướng dẫn tự kiểm tra và bảng giá sửa chữa cửa kéo tận nơi.",
    content: `Các sự cố thường gặp trên cửa kéo Đài Loan / Đức & cách khắc phục:
- Cửa kéo bị nặng, rít khi đẩy: Do bụi bẩn bám rãnh V hoặc bánh xe đạn bạc hỏng -> Thay bánh xe bạc đạn mới.
- Nhíp cửa kéo bị đứt, cong vênh: Thay thế thanh nhíp mới chịu lực cao.
- Cửa bị lệch ray, khó khóa chìa: Khảo sát cân chỉnh khung ray và thay ổ khóa cửa kéo an toàn.`,
    order: 4,
    phone: "0904.678.323"
  },
  {
    id: 5,
    title: "PHỤ KIỆN CỬA CUỐN TỰ ĐỘNG CHÍNH HÃNG",
    date: "18/07/2019",
    img: "/factory_worker.png",
    desc: "Cung cấp đầy đủ phụ kiện cửa cuốn: Mô tơ, bình lưu điện UPS, bộ điều khiển qua điện thoại Wi-Fi/4G, cảm biến tự dừng, còi báo động chống trộm.",
    content: `BOSS Đà Nẵng phân phối sỉ lẻ phụ kiện cửa cuốn chính hãng 100%:
- Mô tơ YH, Austdoor, BossDoor, S68 lõi đồng chịu tải 300kg - 1500kg.
- Bình lưu điện UPS 800kg - 1200kg thời gian chờ 48h - 72h.
- Bộ điều khiển cửa cuốn qua Smartphone bảo mật cao.
- Cảm biến đảo chiều khi gặp vật cản bảo vệ trẻ nhỏ & ô tô.`,
    order: 5,
    phone: "0904.678.323"
  },
  {
    id: 6,
    title: "GIỚI THIỆU VỀ SẢN PHẨM CỬA CUỐN CÔNG NGHỆ ĐỨC",
    date: "18/07/2019",
    img: "/about_door_1.png",
    desc: "Cửa cuốn khe thoáng công nghệ Đức làm từ hợp kim nhôm cao cấp 6063-T5, sơn tĩnh điện ngoài trời CHLB Đức bảo hành 10 năm không phai màu.",
    content: `Ưu điểm vượt trội của dòng Cửa Cuốn Khe Thoáng Công Nghệ Đức:
- Chất liệu nhôm hợp kim định hình cao cấp chịu lực va đập lớn.
- Thiết kế lỗ khe thoáng linh hoạt giúp đón gió và ánh sáng tự nhiên.
- Kết hợp ron giảm chấn siêu êm giúp triệt tiêu 95% tiếng ồn khi đóng mở.
- Tích hợp công nghệ chống sao chép chìa khoá mã nhảy an toàn tuyệt đối.`,
    order: 6,
    phone: "0904.678.323"
  },
  {
    id: 7,
    title: "LẮP ĐẶT CỬA CUỐN TẠI ĐÀ NẴNG – HUẾ – QUẢNG NAM",
    date: "18/07/2019",
    img: "/service_technician.png",
    desc: "Dịch vụ tư vấn, thiết kế và thi công lắp đặt cửa cuốn trọn gói tại Đà Nẵng, Huế, Quảng Nam. Báo giá cạnh tranh, khảo sát tận nơi miễn phí 100%.",
    content: `BOSS Đà Nẵng tiếp nhận thi công lắp đặt cửa cuốn tại miền Trung:
- Khảo sát đo đạc mặt bằng miễn phí trong 30 phút.
- Tư vấn mẫu nan cửa cuốn khe thoáng, cửa cuốn tấm liền phù hợp kiến trúc.
- Đội ngũ kỹ thuật viên >10 năm kinh nghiệm lắp đặt chuẩn xác.
- Cam kết bảo hành nan cửa 5 năm, mô tơ 24-36 tháng tận nơi.`,
    order: 7,
    phone: "0904.678.323"
  },
  {
    id: 8,
    title: "LẮP ĐẶT CỬA KÉO TẠI ĐÀ NẴNG – HUẾ – QUẢNG NAM",
    date: "25/07/2019",
    img: "/project_1.png",
    desc: "Thi công lắp đặt cửa kéo Đài Loan có lá, cửa kéo không lá, cửa kéo inox cao cấp cho nhà phố, ki-ốt, nhà xưởng giá rẻ tận gốc.",
    content: `Dịch vụ lắp đặt cửa kéo chất lượng cao:
- Sử dụng tole mạ màu nhập khẩu Đài Loan độ bền vượt trội.
- Nhíp ép thủy lực chắc chắn, sơn tĩnh điện chống gỉ sét.
- Bánh xe đạn bạc vận hành êm ái, kéo đẩy nhẹ nhàng.`,
    order: 8,
    phone: "0904.678.323"
  }
];

