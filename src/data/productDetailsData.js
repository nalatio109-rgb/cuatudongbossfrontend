import { slugify, getProductSlug } from "../utils/slug.js";
export { slugify, getProductSlug };

// Comprehensive extended product data tailored for Boss Đà Nẵng
// Ensures every product has rich, authentic, technical, and commercial data

export const EXTENDED_PRODUCT_MAP = {
  // 1. CỬA KÉO CÔNG NGHỆ ĐỨC SR1 (Mẫu đúng trong ảnh tham khảo của khách hàng)
  "CK-SR1": {
    code: "CK-SR1",
    slug: "cua-keo-cong-nghe-duc-sr1",
    aliases: ["SR1", "CK-SR1", "3", "101", "cua-keo-cong-nghe-duc-sr1", "cua-keo-sr1"],
    title: "Cửa kéo công nghệ Đức SR1",
    category: "cuakeo",
    price: "1.120.000đ/m²",
    rating: 5.0,
    reviewCount: 38,
    businessStatus: "Sẵn hàng tại Đà Nẵng • Khảo sát 24h",
    badge: "BÁN CHẠY NHẤT",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1000&q=80"
    ],
    quickSpecs: [
      { label: "Mã sản phẩm", value: "CK-SR1" },
      { label: "Thân cửa", value: "Cửa kéo công nghệ Đức cao cấp" },
      { label: "Độ dày U", value: "1.3 mm sơn tĩnh điện AKZO NOBEL" },
      { label: "Chi tiết kỹ thuật", value: "Máng đúc, bi treo chịu lực, nhíp đặc lập là, lá sơn tĩnh điện, máng mạ kẽm" },
      { label: "Màu sắc", value: "Ghi sáng, vàng kem, cà phê, xanh" },
      { label: "Bảo hành", value: "5 năm chính hãng Boss Đà Nẵng" }
    ],
    sectionA: {
      intro: "Cửa kéo công nghệ Đức SR1 là sản phẩm cửa kéo cao cấp, được thiết kế và sản xuất dựa trên dây chuyền công nghệ hiện đại của Đức, mang đến sự bền bỉ, an toàn và tính thẩm mỹ vượt trội cho mọi công trình. Với chất liệu tuyển chọn và thiết kế tinh tế, SR1 là sự lựa chọn hoàn hảo cho khách hàng yêu cầu tiêu chuẩn cao về chất lượng và tuổi thọ sử dụng.",
      origin: "Sản xuất trên dây chuyền công nghệ CHLB Đức, sử dụng hợp kim thép cường lực tiêu chuẩn và bột sơn tĩnh điện ngoài trời chính hãng AkzoNobel.",
      purpose: "Bảo vệ an ninh tuyệt đối cho nhà phố mặt tiền, biệt thự liền kề, cửa hàng thương mại và kho bãi, đồng thời đảm bảo khả năng đóng mở êm ái, nhẹ nhàng hàng ngày.",
      highlights: [
        "Công nghệ Đức chất lượng hàng đầu: Đảm bảo độ bền cao và khả năng hoạt động ổn định trong thời gian dài.",
        "Thân cửa chắc chắn: Làm từ hợp kim cao cấp đảm bảo độ cứng vững, chống cạy phá hiệu quả.",
        "Độ dày U ấn tượng 1.3 mm phủ sơn tĩnh điện AkzoNobel chống ăn mòn và bong tróc trước khí hậu biển Đà Nẵng."
      ]
    },
    sectionB: {
      title: "Đặc điểm và cấu tạo chi tiết cửa kéo công nghệ Đức SR1",
      components: [
        {
          name: "1. Thân cửa & Thanh U dày 1.3 mm",
          desc: "Thanh U được dập từ thép hợp kim chịu lực với độ dày chuẩn 1.3 mm. Bề mặt được xử lý qua 7 bể hóa chất làm sạch trước khi phủ lớp sơn tĩnh điện AkzoNobel cao cấp gia nhiệt, giúp giữ màu sắc tươi mới, không phai mờ hay bong tróc dưới tác động của nắng gắt và hơi muối mặn ven biển.",
          image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "2. Hệ thống Máng đúc & Bi treo bạc đạn siêu êm",
          desc: "Khác biệt hoàn toàn với cửa kéo truyền thống dùng máng tôn gập dễ móp méo, SR1 sử dụng máng đúc hợp kim nguyên khối kết hợp cụm bi treo chịu lực bọc bạc đạn Inox cao cấp. Cơ cấu này triệt tiêu ma sát, giúp việc kéo cửa đóng mở nhẹ tênh, trẻ nhỏ và người lớn tuổi đều có thể đẩy mở dễ dàng.",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "3. Hệ nhíp đặc lập là & Lá gió che chắn kín đáo",
          desc: "Nhíp cửa được làm từ thép đặc lập là cán gân gia cường thay vì nhíp rỗng, mang lại liên kết hình thoi cực kỳ chắc chắn, chống hiện tượng xô lệch hoặc giật bung khi gặp gió bão lớn. Lá gió bằng thép mạ kẽm sơn tĩnh điện che chắn bụi bẩn và tăng tính riêng tư.",
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "4. Hệ thống Khóa an toàn & Bát khóa chống trộm",
          desc: "Trang bị bát khóa dày 6mm bằng thép tôi cứng kết hợp cơ cấu khóa âm sàn hoặc trụ khóa chuyên dụng, ngăn chặn hoàn toàn việc dùng xà beng cạy cửa hoặc kìm cộng lực cắt khóa. Đảm bảo an ninh tuyệt đối cho tài sản trong nhà.",
          image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    sectionC: {
      specsTable: [
        { label: "Mã sản phẩm", value: "CK-SR1" },
        { label: "Dòng sản phẩm", value: "Cửa kéo công nghệ Đức (CN Đức)" },
        { label: "Chất liệu thân U", value: "Hợp kim thép cán nguội cường lực cao" },
        { label: "Độ dày thanh U", value: "1.3 mm (Dung sai ± 0.05 mm)" },
        { label: "Công nghệ sơn phủ", value: "Sơn bột tĩnh điện AkzoNobel CHLB Đức ngoài trời" },
        { label: "Màu sắc tiêu chuẩn", value: "Ghi sáng, Vàng kem, Cà phê, Xanh rêu" },
        { label: "Hệ thống treo & trượt", value: "Máng đúc hợp kim, bi treo bạc đạn Inox chống kẹt" },
        { label: "Quy cách nhíp", value: "Nhíp đặc lập là gia cố chắc chắn" },
        { label: "Lá cửa", value: "Lá tôn mạ kẽm sơn tĩnh điện đồng màu" },
        { label: "Kích thước sản xuất", value: "Thiết kế & gia công theo kích thước thực tế công trình" },
        { label: "Đơn vị tính", value: "m² (Mét vuông)" },
        { label: "Thời gian bảo hành", value: "5 năm chính hãng tận nơi tại Đà Nẵng & Miền Trung" }
      ]
    },
    sectionD: [
      {
        title: "Vận hành siêu êm ái",
        desc: "Máng đúc kết hợp bi treo bạc đạn giúp triệt tiêu tiếng rít ồn ào khó chịu, vận hành nhẹ nhàng và mượt mà.",
        icon: "VolumeX"
      },
      {
        title: "Độ dày 1.3 mm cứng vững",
        desc: "Thanh U dày dặn chịu lực va đập lớn, chống biến dạng dưới gió bão ven biển miền Trung.",
        icon: "Shield"
      },
      {
        title: "Sơn AkzoNobel bền màu 15 năm",
        desc: "Lớp sơn tĩnh điện cao cấp của Đức chống rỉ sét, chống tia cực tím UV và hơi muối biển mặn.",
        icon: "Sun"
      },
      {
        title: "An toàn chống cạy phá",
        desc: "Nhíp đặc lập là đan dày liên kết chắc chắn cùng bát khóa âm sàn chống cắt phá vượt trội.",
        icon: "Lock"
      }
    ],
    sectionE: [
      {
        name: "Nhà phố mặt tiền & Nhà liền kề",
        desc: "Là lớp cửa bảo vệ vòng ngoài vững chắc, kết hợp cùng cửa cuốn hoặc cửa kính bên trong tạo nên hệ thống an ninh 2 lớp hoàn hảo."
      },
      {
        name: "Cửa hàng kinh doanh & Ki-ốt",
        desc: "Đóng mở nhanh chóng vào mỗi sáng và tối, tiết kiệm diện tích tối đa khi mở bung cửa sang hai bên."
      },
      {
        name: "Gara để xe & Kho hàng",
        desc: "Bền bỉ, thông thoáng, không lo hỏng hóc vặt do bụi bẩn hay độ ẩm cao."
      },
      {
        name: "Công trình ven biển Đà Nẵng",
        desc: "Khả năng chống chịu gió biển và khí hậu nhiệt đới khắc nghiệt vượt trội hơn hẳn các loại cửa sắt sơn tay."
      }
    ],
    sectionF: {
      guideTitle: "Kinh nghiệm lựa chọn và bảo dưỡng cửa kéo SR1",
      guideContent: [
        "Đo đạc chính xác kích thước lọt lòng: Chiều rộng và chiều cao lọt sáng để xưởng trừ hao chính xác độ hở ray và máng.",
        "Lựa chọn loại ray âm sàn hoặc ray nổi: Nhà có xe ô tô/xe máy ra vào nhiều nên ưu tiên Ray Inox đặc chìm âm sàn để sàn nhà phẳng đẹp.",
        "Bảo dưỡng định kỳ: Mỗi 6 tháng nên tra một ít mỡ bò chịu nhiệt vào cụm bi treo và các khớp nhíp để cửa luôn kéo nhẹ như mới."
      ]
    },
    sectionG: {
      warrantyTitle: "Chính sách bảo hành và lắp đặt tại Boss Đà Nẵng",
      policies: [
        "Khảo sát & đo đạc miễn phí: Kỹ sư Boss Đà Nẵng đến tận chân công trình đo đạc và tư vấn phương án trong vòng 24h.",
        "Sản xuất nhanh: Thời gian gia công chuẩn xác chỉ từ 1 - 2 ngày làm việc.",
        "Lắp đặt chuẩn kỹ thuật: Đội thợ tay nghề cao, căn chỉnh ray và máng thăng bằng bằng tia laser.",
        "Bảo hành 5 năm: Cam kết bảo trì, hỗ trợ kỹ thuật tận nơi 24/7 tại Đà Nẵng và các tỉnh lân cận."
      ]
    },
    faq: [
      {
        q: "Cửa kéo SR1 có thể sản xuất theo kích thước riêng của nhà tôi không?",
        a: "Có. Tất cả các bộ cửa kéo tại Boss Đà Nẵng đều được kỹ sư đến đo đạc thực tế và sản xuất chuẩn theo kích thước lọt lòng của từng công trình, đảm bảo kín khít và thẩm mỹ cao nhất."
      },
      {
        q: "Sản phẩm có những màu sắc nào?",
        a: "Cửa kéo công nghệ Đức SR1 có 4 màu sắc tiêu chuẩn sơn AkzoNobel cao cấp gồm: Ghi sáng sang trọng, Vàng kem thanh lịch, Cà phê ánh kim và Xanh rêu truyền thống."
      },
      {
        q: "Độ dày U 1.3 mm khác gì so với các dòng U 0.9 mm (SR3) hay 1.1 mm (SR2)?",
        a: "Độ dày 1.3 mm giúp thanh U có độ cứng vững và khả năng chịu lực uốn cong cao hơn nhiều, thích hợp cho các bộ cửa có diện tích lớn từ 6m² đến trên 10m² hoặc các vị trí đón gió to."
      },
      {
        q: "Giá sản phẩm được tính như thế nào?",
        a: "Đơn giá được tính theo mét vuông (m²) của thân cửa. Đơn giá sẽ phân tầng theo diện tích (trên 8m², từ 6-8m² và từ 4-6m²). Giá đã bao gồm thân cửa hoàn chỉnh, công đo đạc và phụ kiện tiêu chuẩn."
      },
      {
        q: "Chính sách bảo hành tại Đà Nẵng ra sao?",
        a: "Sản phẩm được bảo hành chính hãng 5 năm cho thân cửa và màu sơn tĩnh điện. Khi có yêu cầu hỗ trợ, kỹ thuật viên sẽ có mặt xử lý trong vòng 2 - 4 giờ làm việc."
      }
    ],
    pricingUrl: "/bang-gia/CK-DE"
  },

  // 2. CỬA KÉO CÔNG NGHỆ ĐỨC SR2
  "CK-SR2": {
    code: "CK-SR2",
    slug: "cua-keo-cong-nghe-duc-sr2",
    aliases: ["SR2", "CK-SR2", "102", "cua-keo-cong-nghe-duc-sr2", "cua-keo-sr2"],
    title: "Cửa kéo công nghệ Đức SR2",
    category: "cuakeo",
    price: "1.030.000đ/m²",
    rating: 4.9,
    reviewCount: 42,
    businessStatus: "Sẵn hàng tại Đà Nẵng • Khảo sát 24h",
    badge: "PHỔ THÔNG",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1000&q=80"
    ],
    quickSpecs: [
      { label: "Mã sản phẩm", value: "CK-SR2" },
      { label: "Thân cửa", value: "Cửa kéo công nghệ Đức" },
      { label: "Độ dày U", value: "1.1 mm sơn tĩnh điện AKZO NOBEL" },
      { label: "Chi tiết kỹ thuật", value: "Máng đúc, bi treo, nhíp đặc lập là, lá sơn tĩnh điện" },
      { label: "Màu sắc", value: "Ghi sáng, vàng kem, cà phê, xanh" },
      { label: "Bảo hành", value: "5 năm chính hãng" }
    ],
    sectionA: {
      intro: "Cửa kéo công nghệ Đức SR2 với thanh U dày 1.1 mm là sự cân bằng tuyệt vời giữa chi phí đầu tư kinh tế và độ bền vững kỹ thuật. Đây là dòng sản phẩm được các gia đình tại Đà Nẵng lựa chọn nhiều nhất cho nhà phố và nhà cấp 4 hiện đại.",
      origin: "Sản xuất trên dây chuyền công nghệ Đức, phủ sơn tĩnh điện AkzoNobel gia nhiệt.",
      purpose: "Bảo vệ an ninh cho nhà ở, văn phòng, cửa hàng vừa và nhỏ.",
      highlights: [
        "Độ dày U 1.1 mm chuẩn chỉ, vận hành nhẹ nhàng.",
        "Máng đúc bi treo siêu êm, độ bền vượt trội so với máng tôn.",
        "Màu sơn bền đẹp, chống rỉ sét hoàn hảo."
      ]
    },
    sectionB: {
      title: "Đặc điểm và cấu tạo chi tiết cửa kéo SR2",
      components: [
        {
          name: "1. Thanh U 1.1 mm sơn AkzoNobel",
          desc: "Độ dày 1.1 mm đạt chuẩn tải trọng cho cửa diện tích từ 4 - 8m², sơn tĩnh điện chống xước.",
          image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "2. Máng đúc bi treo hợp kim",
          desc: "Máng đúc dày dặn chống cong võng, bi treo bạc đạn giúp kéo đẩy êm ái.",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "3. Nhíp đặc lập là",
          desc: "Nhíp đặc tán đinh chắc chắn tạo liên kết hình quả trám đồng đều.",
          image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "4. Khóa âm và bát khóa",
          desc: "Bát khóa dày dặn chống cắt phá trộm cắp an tâm tuyệt đối.",
          image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    sectionC: {
      specsTable: [
        { label: "Mã sản phẩm", value: "CK-SR2" },
        { label: "Dòng sản phẩm", value: "Cửa kéo công nghệ Đức (CN Đức)" },
        { label: "Chất liệu", value: "Hợp kim thép cường lực cao" },
        { label: "Độ dày U", value: "1.1 mm (Chuẩn kỹ thuật)" },
        { label: "Sơn phủ", value: "Sơn tĩnh điện AkzoNobel Đức" },
        { label: "Màu sắc", value: "Ghi sáng, Vàng kem, Cà phê, Xanh" },
        { label: "Cơ cấu", value: "Máng đúc, bi treo chịu lực" },
        { label: "Bảo hành", value: "5 năm chính hãng" }
      ]
    },
    sectionD: [
      { title: "Chi phí kinh tế", desc: "Mức giá hợp lý phù hợp túi tiền của đại đa số gia đình.", icon: "Check" },
      { title: "Vận hành nhẹ êm", desc: "Bi treo bạc đạn đóng mở dễ dàng.", icon: "VolumeX" },
      { title: "Sơn bền 10 năm", desc: "Sơn AkzoNobel chống phai màu và bong tróc.", icon: "Sun" },
      { title: "An toàn vững chãi", desc: "Nhíp đặc liên kết kiên cố.", icon: "Shield" }
    ],
    sectionE: [
      { name: "Nhà phố gia đình", desc: "Cửa bảo vệ mặt tiền nhà phố vừa và nhỏ." },
      { name: "Cửa hàng, tiệm tạp hóa", desc: "Đóng mở nhanh chóng tiện lợi." }
    ],
    sectionF: {
      guideTitle: "Hướng dẫn lựa chọn",
      guideContent: [
        "Phù hợp nhất cho các bộ cửa có chiều rộng dưới 4.5m và chiều cao dưới 3.2m.",
        "Nên kết hợp ray Inox 201 hoặc 304 để tăng tuổi thọ đáy cửa."
      ]
    },
    sectionG: {
      warrantyTitle: "Chính sách bảo hành",
      policies: ["Bảo hành chính hãng 5 năm", "Khảo sát đo đạc miễn phí trong ngày."]
    },
    faq: [
      { q: "Cửa SR2 có bền không?", a: "Với độ dày 1.1 mm sơn AkzoNobel và máng đúc, cửa SR2 có tuổi thọ trên 15 năm mà không lo gỉ sét hay kẹt bi." }
    ],
    pricingUrl: "/bang-gia/CK-DE"
  },

  // 3. CỬA KÉO CÔNG NGHỆ ĐỨC SR3
  "CK-SR3": {
    code: "CK-SR3",
    slug: "cua-keo-cong-nghe-duc-sr3",
    aliases: ["SR3", "CK-SR3", "103", "cua-keo-cong-nghe-duc-sr3", "cua-keo-sr3"],
    title: "Cửa kéo công nghệ Đức SR3",
    category: "cuakeo",
    price: "980.000đ/m²",
    rating: 4.8,
    reviewCount: 29,
    businessStatus: "Sẵn hàng tại Đà Nẵng • Khảo sát 24h",
    badge: "TIẾT KIỆM",
    gallery: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
    ],
    quickSpecs: [
      { label: "Mã sản phẩm", value: "CK-SR3" },
      { label: "Thân cửa", value: "Cửa kéo công nghệ Đức" },
      { label: "Độ dày U", value: "0.9 mm sơn tĩnh điện AKZO NOBEL" },
      { label: "Chi tiết kỹ thuật", value: "Máng đúc, bi treo, nhíp đặc lập là, lá sơn tĩnh điện" },
      { label: "Màu sắc", value: "Ghi sáng, vàng kem, cà phê, xanh" },
      { label: "Bảo hành", value: "3 năm chính hãng" }
    ],
    sectionA: {
      intro: "Cửa kéo công nghệ Đức SR3 là giải pháp kinh tế nhất trong phân khúc cửa kéo công nghệ Đức, phù hợp cho ki-ốt, nhà cho thuê và các công trình cần tối ưu chi phí nhưng vẫn muốn có máng đúc bi treo siêu êm.",
      origin: "Công nghệ Đức, sơn tĩnh điện AkzoNobel.",
      purpose: "Cửa bảo vệ tiết kiệm chi phí cho mặt tiền, kho hàng nhỏ.",
      highlights: ["Giá thành tiết kiệm nhất", "Vận hành êm ái với máng đúc", "Sơn AkzoNobel chống rỉ"]
    },
    sectionB: {
      title: "Đặc điểm và cấu tạo cửa kéo SR3",
      components: [
        { name: "1. Thanh U 0.9 mm", desc: "Thép sơn tĩnh điện công nghệ Đức, trọng lượng nhẹ kéo siêu êm.", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80" },
        { name: "2. Máng đúc bi treo", desc: "Máng đúc hợp kim bi treo bạc đạn giúp kéo nhẹ nhàng.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" }
      ]
    },
    sectionC: {
      specsTable: [
        { label: "Mã sản phẩm", value: "CK-SR3" },
        { label: "Độ dày U", value: "0.9 mm" },
        { label: "Sơn", value: "AkzoNobel Đức" },
        { label: "Bảo hành", value: "3 năm" }
      ]
    },
    sectionD: [
      { title: "Giá tốt nhất", desc: "Chỉ từ 980.000đ/m².", icon: "Check" },
      { title: "Kéo êm ái", desc: "Không gây tiếng ồn lớn.", icon: "VolumeX" }
    ],
    sectionE: [
      { name: "Phòng trọ, nhà cho thuê", desc: "Tối ưu ngân sách đầu tư ban đầu." },
      { name: "Ki-ốt chợ, cửa hàng nhỏ", desc: "Độ bền cao, gọn gàng." }
    ],
    sectionF: {
      guideTitle: "Lời khuyên",
      guideContent: ["Thích hợp cho cửa diện tích dưới 6m²."]
    },
    sectionG: {
      warrantyTitle: "Chính sách",
      policies: ["Bảo hành 3 năm tận nơi."]
    },
    faq: [{ q: "SR3 bảo hành mấy năm?", a: "Bảo hành 3 năm chính hãng." }],
    pricingUrl: "/bang-gia/CK-DE"
  },

  // 4. CỬA KÉO CÔNG NGHỆ ĐỨC VIP (1.5mm)
  "CK-VIP": {
    code: "VIP",
    slug: "cua-keo-cong-nghe-duc-vip",
    aliases: ["VIP", "CK-VIP", "4", "104", "cua-keo-cong-nghe-duc-vip", "cua-keo-vip"],
    title: "Cửa kéo công nghệ Đức VIP (U dày 1.5 mm)",
    category: "cuakeo",
    price: "1.180.000đ/m²",
    rating: 5.0,
    reviewCount: 31,
    businessStatus: "Sẵn hàng tại Đà Nẵng • Khảo sát 24h",
    badge: "VIP SIÊU DÀY",
    gallery: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
    ],
    quickSpecs: [
      { label: "Mã sản phẩm", value: "VIP" },
      { label: "Thân cửa", value: "Cửa kéo công nghệ Đức VIP siêu dày" },
      { label: "Độ dày U", value: "1.5 mm sơn tĩnh điện AKZO NOBEL" },
      { label: "Chi tiết kỹ thuật", value: "Máng đúc, bi treo chịu lực lớn, nhíp đặc lập là, lá sơn tĩnh điện" },
      { label: "Màu sắc", value: "Ghi sáng, vàng kem, cà phê, xanh" },
      { label: "Bảo hành", value: "5 năm chính hãng" }
    ],
    sectionA: {
      intro: "Cửa kéo công nghệ Đức VIP là phiên bản đỉnh cao với độ dày thanh U lên tới 1.5 mm, đem lại sự kiên cố vững chắc nhất thị trường. Đây là dòng cửa đặc biệt dành cho biệt thự, tiệm vàng, ngân hàng và các công trình đòi hỏi mức độ an ninh tối đa.",
      origin: "Dây chuyền công nghệ CHLB Đức, phủ sơn tĩnh điện AkzoNobel cao cấp.",
      purpose: "Bảo vệ an ninh tuyệt đối cho các công trình trọng điểm.",
      highlights: ["Độ dày đỉnh cao 1.5 mm", "Chống cạy phá tuyệt đối", "Bảo hành 5 năm tận nơi"]
    },
    sectionB: {
      title: "Cấu tạo siêu dày của dòng VIP",
      components: [
        { name: "1. Thanh U dày 1.5 mm", desc: "Thanh U siêu dày chịu lực cực lớn, chống búa đập cạy phá.", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80" },
        { name: "2. Máng đúc và cụm bi treo siêu tải", desc: "Máng đúc hợp kim chịu lực nặng, bi treo đúc Inox.", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" }
      ]
    },
    sectionC: {
      specsTable: [
        { label: "Mã sản phẩm", value: "VIP" },
        { label: "Độ dày U", value: "1.5 mm (Dày nhất thị trường)" },
        { label: "Chất liệu", value: "Thép hợp kim chịu lực cao" },
        { label: "Sơn", value: "AkzoNobel CHLB Đức" },
        { label: "Bảo hành", value: "5 năm" }
      ]
    },
    sectionD: [
      { title: "Siêu an toàn", desc: "Thanh U 1.5 mm chống cắt phá.", icon: "Lock" },
      { title: "Bền bỉ trọn đời", desc: "Tuổi thọ trên 20 năm.", icon: "Shield" }
    ],
    sectionE: [
      { name: "Biệt thự & Villa", desc: "An ninh tối đa cho dinh thự." },
      { name: "Ngân hàng, tiệm vàng", desc: "Đạt chuẩn an ninh nghiêm ngặt." }
    ],
    sectionF: {
      guideTitle: "Lời khuyên kỹ sư",
      guideContent: ["Thích hợp lắp cho mọi kích thước cửa lớn, cửa rộng trên 5 mét."]
    },
    sectionG: {
      warrantyTitle: "Chính sách",
      policies: ["Bảo hành chính hãng 5 năm tận chân công trình."]
    },
    faq: [{ q: "Cửa VIP có nặng không?", a: "Mặc dù U dày 1.5 mm nhưng nhờ cụm máng đúc bi treo Inox cao cấp nên lực đẩy kéo vẫn rất êm ái nhẹ nhàng." }],
    pricingUrl: "/bang-gia/CK-DE"
  },

  // 5. CỬA CUỐN KHE THOÁNG ECO BEC.5810
  "BEC.5810": {
    code: "BEC.5810",
    slug: "cua-cuon-khe-thoang-eco-bec-5810",
    aliases: ["BEC.5810", "6", "1", "cua-cuon-khe-thoang-eco-bec-5810", "bec-5810", "bec5810"],
    title: "Cửa cuốn Bossdoor ECO BEC.5810",
    category: "cuacuon",
    price: "1.500.000đ/m²",
    rating: 5.0,
    reviewCount: 54,
    businessStatus: "Sẵn hàng tại kho Đà Nẵng • Thi công trong 24h",
    badge: "HOT NHẤT",
    gallery: [
      "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
    ],
    quickSpecs: [
      { label: "Mã sản phẩm", value: "BEC.5810" },
      { label: "Thân cửa", value: "Nan nhôm khe thoáng BossDoor Eco 2 lớp" },
      { label: "Chất liệu", value: "Hợp kim nhôm 6063-T5 cao cấp chuẩn quốc tế" },
      { label: "Lớp sơn", value: "Sơn tĩnh điện AkzoNobel CHLB Đức chống muối mặn" },
      { label: "Đặc tính", value: "Khe thoáng điều hòa ánh sáng, gioăng nỉ giảm chấn triệt tiêu tiếng ồn" },
      { label: "Bảo hành", value: "5 năm thân cửa & mô-tơ chính hãng" }
    ],
    sectionA: {
      intro: "Cửa cuốn Bossdoor ECO BEC.5810 là giải pháp tối ưu cho những ai đang tìm kiếm sự cân bằng hoàn hảo giữa chất lượng nhôm cao cấp, vẻ đẹp hiện đại và chi phí đầu tư hợp lý. Sản phẩm sở hữu thiết kế nan kép tinh tế, lỗ thoáng thoáng khí khoa học và khả năng vận hành êm ái bậc nhất.",
      origin: "Sản xuất từ nhà máy BossDoor theo tiêu chuẩn công nghệ CHLB Đức, chứng nhận chất lượng ISO 9001:2015.",
      purpose: "Giải pháp cửa cuốn mặt tiền thông minh cho nhà phố, biệt thự liền kề, gara ô tô và showroom thương mại.",
      highlights: [
        "Nhôm hợp kim 6063-T5 siêu bền bỉ, cứng cáp chịu bão gió miền Trung.",
        "Sơn tĩnh điện AkzoNobel bảo hành chống bay màu và muối biển 10 năm.",
        "Hệ thống gioăng nỉ giảm chấn 2 chiều triệt tiêu 95% tiếng ồn khi đóng mở."
      ]
    },
    sectionB: {
      title: "Đặc điểm và cấu tạo chi tiết cửa cuốn BEC.5810",
      components: [
        {
          name: "1. Nan cửa nhôm 6063-T5 kép có khe thoáng",
          desc: "Nan cửa 2 lớp với thanh giằng chịu lực ở giữa, đúc từ phôi nhôm nguyên chất 6063-T5. Các lỗ thoáng hình thoi hoặc oval bố trí so le giúp đón ánh sáng tự nhiên và thông gió mà vẫn ngăn được bụi bẩn.",
          image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "2. Gioăng giảm chấn 2 chiều siêu êm",
          desc: "Tích hợp dải cao su giảm chấn nằm giữa các khớp nối nan cửa, ngăn các thanh nhôm va đập trực tiếp vào nhau khi cuộn hoặc hạ xuống, vận hành cực kỳ êm ái.",
          image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "3. Ray dẫn hướng nhôm hộp tích hợp nẹp nỉ",
          desc: "Ray nhôm hộp định hình có khe cài gioăng nỉ chống mài mòn, giúp nan cửa trượt lên xuống mượt mà và chống rung lắc khi gặp gió mạnh.",
          image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "4. Hệ thống trục cuốn mạ kẽm & Buly đỡ nan",
          desc: "Trục cuốn bằng thép mạ kẽm phi 114 chịu tải nặng, kết hợp buly nhựa kỹ thuật cao chống xước nan và lò xo trợ lực cân bằng tải trọng.",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    sectionC: {
      specsTable: [
        { label: "Mã sản phẩm", value: "BEC.5810" },
        { label: "Thương hiệu", value: "BossDoor chính hãng" },
        { label: "Chất liệu thân nan", value: "Hợp kim nhôm 6063-T5 (Tiêu chuẩn hàng không)" },
        { label: "Độ dày nan", value: "1.1 mm - 1.4 mm" },
        { label: "Công nghệ sơn", value: "Sơn tĩnh điện AkzoNobel Đức gia nhiệt cao tần" },
        { label: "Màu sắc", value: "Ghi sáng, Cà phê ánh kim, Vàng kem cát" },
        { label: "Kích thước tối đa", value: "Rộng 6.5m x Cao 5.5m (Diện tích tối đa 35m²)" },
        { label: "Tốc độ đóng mở", value: "15 - 20 cm/giây" },
        { label: "Hệ thống an toàn", value: "Đảo chiều khi gặp vật cản, cảm biến hồng ngoại, còi báo động" },
        { label: "Thời gian bảo hành", value: "5 năm cho thân nan, 5 năm cho mô-tơ đồng bộ" }
      ]
    },
    sectionD: [
      { title: "Vận hành êm ái", desc: "Giảm chấn 2 chiều triệt tiêu tiếng ồn.", icon: "VolumeX" },
      { title: "Thông thoáng ánh sáng", desc: "Khe thoáng điều chỉnh linh hoạt theo ý muốn.", icon: "Sun" },
      { title: "Tự dừng an toàn", desc: "Tự động đảo chiều khi phát hiện chướng ngại vật.", icon: "Shield" },
      { title: "Điều khiển Smartphone", desc: "Mở cửa từ xa qua Wi-Fi / 4G mọi lúc mọi nơi.", icon: "Check" }
    ],
    sectionE: [
      { name: "Mặt tiền nhà phố", desc: "Thẩm mỹ sang trọng, hiện đại, tăng giá trị kiến trúc ngôi nhà." },
      { name: "Biệt thự & Villa", desc: "Đồng bộ phong cách kiến trúc châu Âu đẳng cấp." },
      { name: "Gara xe hơi gia đình", desc: "Đóng mở nhanh chóng tiện lợi khi xe ra vào." }
    ],
    sectionF: {
      guideTitle: "Kinh nghiệm chọn phụ kiện đồng bộ",
      guideContent: [
        "Nên sử dụng mô-tơ đồng bộ chính hãng BossDoor để bảo đảm tuổi thọ và chế độ bảo hành 1 đổi 1 trong 5 năm.",
        "Trang bị thêm bình lưu điện UPS để cửa vẫn mở bình thường khi xảy ra cúp điện lưới."
      ]
    },
    sectionG: {
      warrantyTitle: "Chính sách bảo hành và lắp đặt BossDoor",
      policies: [
        "Bảo hành 5 năm thân cửa nhôm và màu sơn.",
        "Khảo sát thực tế tại công trình Đà Nẵng miễn phí trong vòng 24h.",
        "Bảo trì định kỳ và hỗ trợ kỹ thuật tận nơi 24/7."
      ]
    },
    faq: [
      { q: "Cửa cuốn BEC.5810 mất điện có mở được không?", a: "Có thể mở được bằng xích kéo cơ học hoặc sử dụng bình lưu điện UPS tự động chuyển nguồn để bấm remote mở cửa như bình thường." },
      { q: "Sơn tĩnh điện của cửa có bền trước gió biển Đà Nẵng không?", a: "Sơn AkzoNobel Đức được bảo hành chống phai màu và chống ăn mòn muối biển lên đến 10 năm." }
    ],
    pricingUrl: "/bang-gia/BEC.5810"
  },

  // 5.5 CỬA CUỐN KHE THOÁNG ĐỨC BOSSDOOR BD-900 (THEO YÊU CẦU CỦA KHÁCH HÀNG)
  "BD-900": {
    code: "BD-900",
    slug: "cua-cuon-khe-thoang-duc-bossdoor-bd-900",
    aliases: [
      "BD-900",
      "bd-900",
      "2",
      "cua-cuon-khe-thoang-duc-bossdoor-bd-900",
      "cua-cuon-khe-duc",
      "cua-cuon-khe-duc-bd-900",
      "cua-cuon-bd-900",
      "cua-cuon-duc-bd-900"
    ],
    title: "Cửa cuốn khe thoáng Đức BossDoor BD-900",
    category: "cuacuon",
    price: "1.450.000đ/m²",
    rating: 5.0,
    reviewCount: 68,
    businessStatus: "Sẵn hàng thi công trong 24h",
    badge: "BÁN CHẠY",
    gallery: [
      "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
    ],
    quickSpecs: [
      { label: "Mã sản phẩm", value: "BD-900" },
      { label: "Thương hiệu", value: "BossDoor chính hãng CHLB Đức" },
      { label: "Chất liệu thân nan", value: "Hợp kim nhôm 6063-T5 cao cấp" },
      { label: "Độ dày nan", value: "1.4 mm - 2.2 mm (Gân tăng cứng kép)" },
      { label: "Công nghệ sơn", value: "Sơn tĩnh điện AkzoNobel Đức bảo hành 10 năm" },
      { label: "Màu sắc", value: "Ghi sáng, Cà phê ánh kim, Vàng kem cát" },
      { label: "Bảo hành", value: "5 năm chính hãng Boss Đà Nẵng" }
    ],
    sectionA: {
      intro: "Cửa cuốn khe thoáng Đức BossDoor BD-900 là sản phẩm cửa cuốn cao cấp thế hệ mới, được thiết kế và sản xuất theo tiêu chuẩn kỹ thuật CHLB Đức, mang lại sự vững chắc chống gió bão, vận hành êm ái và tính thẩm mỹ thanh lịch hàng đầu tại Đà Nẵng.",
      origin: "Dây chuyền công nghệ CHLB Đức, tiêu chuẩn nhôm 6063-T5 và sơn phủ AkzoNobel cao cấp.",
      purpose: "Bảo vệ an toàn tối đa cho nhà phố mặt tiền, biệt thự liền kề, showroom và gara ô tô gia đình.",
      highlights: [
        "Hợp kim nhôm 6063-T5 siêu cứng vững, chịu áp lực bão cấp 12.",
        "Sơn tĩnh điện AkzoNobel CHLB Đức bảo hành 10 năm chống phai màu muối biển.",
        "Cảm biến hồng ngoại an toàn tự động đảo chiều khi phát hiện vật cản."
      ]
    },
    sectionB: {
      title: "Đặc điểm cấu tạo chi tiết cửa cuốn Đức BossDoor BD-900",
      components: [
        {
          name: "1. Thân nan nhôm 6063-T5 siêu bền dày 1.4 - 2.2 mm",
          desc: "Đúc từ hợp kim nhôm chuẩn hàng không 6063-T5 với gân tăng cứng kép, chống búa đập và chịu lực gió lớn.",
          image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "2. Khe thoáng điều hòa không khí & ánh sáng",
          desc: "Lỗ thoáng hình oval tinh tế giúp đối lưu không khí tự nhiên và đón nắng sớm vào không gian bên trong.",
          image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "3. Gioăng nỉ giảm chấn 2 chiều siêu êm",
          desc: "Hệ thống gioăng triệt tiêu tiếng ồn va đập giữa các thanh nan khi đóng mở, đem lại không gian yên tĩnh.",
          image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    sectionC: {
      specsTable: [
        { label: "Mã sản phẩm", value: "BD-900" },
        { label: "Vật liệu", value: "Hợp kim nhôm 6063-T5 cao cấp" },
        { label: "Độ dày nan", value: "1.4 mm - 2.2 mm" },
        { label: "Công nghệ sơn", value: "Sơn tĩnh điện AkzoNobel CHLB Đức" },
        { label: "Màu sắc", value: "Ghi sáng, Cà phê ánh kim, Vàng kem cát" },
        { label: "Hệ thống an toàn", value: "Cảm biến hồng ngoại tự đảo chiều, còi báo động" },
        { label: "Bảo hành", value: "5 năm chính hãng" }
      ]
    },
    sectionD: [
      { title: "Chống bão cấp 12", desc: "Nan dày 1.4 - 2.2mm cứng cáp.", icon: "Shield" },
      { title: "Vận hành siêu êm", desc: "Gioăng giảm chấn 2 chiều.", icon: "VolumeX" },
      { title: "Bảo hành 5 năm", desc: "Hỗ trợ kỹ thuật 24/7 tận chân công trình.", icon: "Check" }
    ],
    sectionE: [
      { name: "Nhà phố & Biệt thự", desc: "Sang trọng, hiện đại, tăng tính thẩm mỹ." },
      { name: "Showroom & Cửa hàng", desc: "Thông thoáng ánh sáng và an toàn tuyệt đối." }
    ],
    sectionF: {
      guideTitle: "Tư vấn kỹ sư Boss Đà Nẵng",
      guideContent: ["Nên kết hợp cùng bình lưu điện UPS BossDoor chính hãng để mở cửa bình thường khi cúp điện."]
    },
    sectionG: {
      warrantyTitle: "Chính sách bảo hành",
      policies: ["Bảo hành nan nhôm và màu sơn 5 năm.", "Khảo sát và đo đạc miễn phí trong 24h tại Đà Nẵng."]
    },
    faq: [
      { q: "Cửa cuốn BD-900 có ồn không?", a: "Nhờ hệ giảm chấn 2 chiều, BD-900 đóng mở rất êm ái, giảm đến 90% tiếng ồn so với cửa cuốn thông thường." },
      { q: "Khi mất điện cửa có mở được không?", a: "Cửa có thể mở bằng xích kéo cơ học hoặc thông qua bộ tích điện UPS tự động." }
    ],
    pricingUrl: "/bang-gia/BD-900"
  },

  // 6. CỬA CUỐN ĐÀI LOAN GIÁ RẺ DL-75
  "DL-75": {
    code: "DL-75",
    slug: "cua-cuon-dai-loan-gia-re-dl-75",
    aliases: ["DL-75", "dl-75", "cua-cuon-dai-loan-gia-re-dl-75", "cua-cuon-dai-loan", "cua-cuon-dl-75"],
    title: "Cửa cuốn Đài Loan giá rẻ DL-75",
    category: "cuacuon",
    price: "420.000đ/m²",
    rating: 4.8,
    reviewCount: 68,
    businessStatus: "Sẵn hàng thi công trong 24h",
    badge: "TIẾT KIỆM NHẤT",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
    ],
    quickSpecs: [
      { label: "Mã sản phẩm", value: "DL-75" },
      { label: "Dòng sản phẩm", value: "Cửa cuốn công nghệ Đài Loan bản 7.5cm" },
      { label: "Chất liệu", value: "Thép mạ kẽm mạ màu nhập khẩu Đài Loan" },
      { label: "Độ dày lá", value: "0.6 mm - 1.2 mm tùy chọn" },
      { label: "Vận hành", value: "Kéo tay bằng lò xo trợ lực hoặc gắn mô tơ điện" },
      { label: "Bảo hành", value: "2 năm chính hãng" }
    ],
    sectionA: {
      intro: "Cửa cuốn Đài Loan DL-75 là dòng cửa cuốn kinh tế quốc dân, được ứng dụng rộng rãi tại các nhà xưởng, ki-ốt chợ, cửa hàng kinh doanh và gara ô tô tại Đà Nẵng nhờ chi phí đầu tư siêu rẻ và độ bền bỉ cơ học cao.",
      origin: "Tôn mạ kẽm và sơn phủ màu nhập khẩu từ Đài Loan.",
      purpose: "Tiết kiệm chi phí đầu tư ban đầu mà vẫn đảm bảo độ che chắn an ninh vững chắc.",
      highlights: ["Giá rẻ nhất thị trường chỉ từ 420.000đ/m²", "Đóng mở bằng lò xo hoặc mô tơ điện", "Gia công thi công cực nhanh trong 24h"]
    },
    sectionB: {
      title: "Cấu tạo chi tiết cửa cuốn Đài Loan DL-75",
      components: [
        { name: "1. Thân lá thép mạ màu bản 75mm", desc: "Dập sóng chịu lực, mạ kẽm chống rỉ sét.", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80" },
        { name: "2. Hệ lò xo trợ lực hoặc mô tơ", desc: "Lò xo thép xoắn đàn hồi cao giúp kéo tay nhẹ nhàng.", image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80" }
      ]
    },
    sectionC: {
      specsTable: [
        { label: "Mã sản phẩm", value: "DL-75" },
        { label: "Chất liệu", value: "Tôn mạ màu Đài Loan" },
        { label: "Độ dày", value: "0.6mm - 1.2mm" },
        { label: "Màu sắc", value: "Xanh ngọc, Vàng kem, Xám ghi" },
        { label: "Bảo hành", value: "2 năm" }
      ]
    },
    sectionD: [
      { title: "Chi phí cực rẻ", desc: "Tiết kiệm tối đa vốn đầu tư.", icon: "Check" },
      { title: "Lắp đặt nhanh", desc: "Hoàn thiện chỉ trong 24h.", icon: "Clock" }
    ],
    sectionE: [
      { name: "Nhà xưởng, kho bãi", desc: "Bền bỉ, chi phí rẻ." },
      { name: "Cửa hàng, quán ăn, ki-ốt", desc: "Bảo vệ an ninh ban đêm." }
    ],
    sectionF: {
      guideTitle: "Tư vấn",
      guideContent: ["Cửa dưới 12m² có thể dùng kéo tay lò xo, cửa trên 12m² nên gắn thêm mô tơ điện để vận hành nhàn hơn."]
    },
    sectionG: {
      warrantyTitle: "Chính sách",
      policies: ["Bảo hành 2 năm tận nơi tại Đà Nẵng."]
    },
    faq: [{ q: "Có thể nâng cấp từ kéo tay lên chạy điện được không?", a: "Có, hoàn toàn có thể gắn thêm mô tơ điện và hộp điều khiển bất kỳ lúc nào." }],
    pricingUrl: "/bang-gia/DL-75"
  },

  // 7. CỬA CUỐN SIÊU SANG BOSSDOOR LUXURY
  "BD-LUX": {
    code: "BD-LUX",
    slug: "cua-cuon-cao-cap-the-he-moi-bossdoor-lux",
    aliases: ["BD-LUX", "bd-lux", "5", "cua-cuon-cao-cap-the-he-moi-bossdoor-lux", "bossdoor-lux"],
    title: "Cửa cuốn siêu sang thế hệ mới BossDoor LUXURY",
    category: "cuacuon",
    price: "2.100.000đ/m²",
    rating: 5.0,
    reviewCount: 36,
    businessStatus: "Đang kinh doanh • Sản xuất theo kích thước",
    badge: "LUXURY",
    gallery: [
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
    ],
    quickSpecs: [
      { label: "Mã sản phẩm", value: "BD-LUX" },
      { label: "Chất liệu", value: "Hợp kim nhôm hàng không 6063-T6 cao cấp" },
      { label: "Sơn phủ", value: "Sơn tĩnh điện AkzoNobel CHLB Đức bảo hành 10 năm" },
      { label: "Tính năng", value: "Nan chèn cao su giảm chấn 2 chiều, Smarthome AI" },
      { label: "Bảo hành", value: "10 năm chính hãng" }
    ],
    sectionA: {
      intro: "Phiên bản đỉnh cao của BossDoor với thiết kế nan chèn cao su giảm chấn 2 chiều, sơn bột tĩnh điện AkzoNobel Đức gia nhiệt cao cấp, tích hợp điều khiển thông minh qua Smartphone và hệ thống bảo mật Rolling Code chống sao chép tuyệt đối.",
      origin: "Tiêu chuẩn CHLB Đức, nhôm hàng không 6063-T6.",
      purpose: "Dành riêng cho Biệt thự sang trọng, Villa nghỉ dưỡng và công trình đẳng cấp.",
      highlights: ["Nhôm hàng không 6063-T6", "Giảm chấn 2 chiều siêu êm", "Bảo hành 10 năm"]
    },
    sectionB: {
      title: "Cấu tạo dòng Luxury",
      components: [
        { name: "1. Nan nhôm 6063-T6 siêu dày", desc: "Hợp kim nhôm hàng không siêu cứng chịu bão cấp 14.", image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=800&q=80" },
        { name: "2. Hệ giảm chấn kép 2 chiều", desc: "Triệt tiêu hoàn toàn rung lắc và tiếng ồn khi vận hành.", image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80" }
      ]
    },
    sectionC: {
      specsTable: [
        { label: "Mã sản phẩm", value: "BD-LUX" },
        { label: "Chất liệu", value: "Nhôm 6063-T6 hàng không" },
        { label: "Độ dày", value: "1.4 - 2.2 mm" },
        { label: "Sơn", value: "AkzoNobel bảo hành 10 năm" },
        { label: "Bảo hành", value: "10 năm" }
      ]
    },
    sectionD: [
      { title: "Đỉnh cao sang trọng", desc: "Màu sơn ánh kim đẳng cấp.", icon: "Star" },
      { title: "Siêu êm ái", desc: "Giảm chấn 2 chiều hoàn hảo.", icon: "VolumeX" },
      { title: "Bảo hành 10 năm", desc: "Cam kết chất lượng dài hạn.", icon: "Shield" }
    ],
    sectionE: [
      { name: "Biệt thự cao cấp", desc: "Khẳng định đẳng cấp gia chủ." },
      { name: "Khu nghỉ dưỡng ven biển", desc: "Chống chịu thời tiết mặn muối biển." }
    ],
    sectionF: {
      guideTitle: "Tư vấn",
      guideContent: ["Nên kết hợp bộ lưu điện cao cấp và kết nối ứng dụng Smartphone Tuya Smart."]
    },
    sectionG: {
      warrantyTitle: "Chính sách",
      policies: ["Bảo hành 10 năm thân nan và sơn tĩnh điện."]
    },
    faq: [{ q: "Cửa có ồn không?", a: "Cửa cuốn BD-LUX là dòng cửa êm nhất hiện nay, hầu như không phát ra tiếng ồn khi đóng mở." }],
    pricingUrl: "/bang-gia/BD-LUX"
  }
};

// Generic generator for any product not explicitly mapped above
export function getProductExtendedDetails(product) {
  if (!product) return null;

  const rawCode = (product.code || "").toUpperCase().trim();
  const idStr = String(product.id || "").trim();
  const inputSlug = (product.slug || slugify(product.title || product.code || "")).toLowerCase().trim();

  // 1. Direct key match
  let matched = EXTENDED_PRODUCT_MAP[rawCode] || null;

  // 2. Search all items by code, aliases, slug, or slugified title
  if (!matched) {
    for (const key of Object.keys(EXTENDED_PRODUCT_MAP)) {
      const item = EXTENDED_PRODUCT_MAP[key];
      const itemSlug = (item.slug || slugify(item.title)).toLowerCase();
      const codeUpper = (item.code || key).toUpperCase();

      if (
        codeUpper === rawCode ||
        itemSlug === inputSlug ||
        itemSlug === idStr.toLowerCase() ||
        (item.aliases && (
          item.aliases.includes(rawCode) ||
          item.aliases.includes(idStr) ||
          item.aliases.includes(inputSlug) ||
          item.aliases.some((a) => a.toLowerCase() === inputSlug || a.toLowerCase() === idStr.toLowerCase())
        ))
      ) {
        matched = item;
        break;
      }
    }
  }

  // 3. Fallback based on category if still not matched
  if (!matched) {
    const cat = product.category || "cuacuon";
    let fallbackKey = "CK-SR1";
    if (cat === "cuacuon") fallbackKey = "BEC.5810";
    else if (cat === "cuakeo") fallbackKey = "CK-SR1";
    else if (cat === "phukien") fallbackKey = "BEC.5810";

    const template = EXTENDED_PRODUCT_MAP[fallbackKey] || EXTENDED_PRODUCT_MAP["CK-SR1"];
    const resolvedSlug = product.slug || slugify(product.title || product.code || template.title);

    return {
      ...template,
      ...product,
      slug: resolvedSlug,
      code: product.code || template.code,
      title: product.title || template.title,
      price: product.price || template.price,
      gallery: [
        product.image,
        template.gallery[1] || product.image,
        template.gallery[2] || product.image,
        template.gallery[3] || product.image
      ],
      quickSpecs: [
        { label: "Mã sản phẩm", value: product.code || "TIÊU CHUẨN" },
        { label: "Tên dòng sản phẩm", value: product.title },
        { label: "Đặc điểm nổi bật", value: product.description || "Chính hãng Boss Đà Nẵng" },
        { label: "Bảo hành", value: "2 - 5 năm chính hãng" }
      ],
      sectionA: {
        intro: product.details || product.description || template.sectionA.intro,
        origin: "Chính hãng Boss Đà Nẵng phân phối và bảo hành tận nơi.",
        purpose: "Giải pháp an ninh tối ưu cho công trình của bạn.",
        highlights: product.specs && product.specs.length > 0 ? product.specs : template.sectionA.highlights
      },
      pricingUrl: `/bang-gia/${product.code || product.id}`
    };
  }

  return {
    ...matched,
    ...product,
    slug: matched.slug || inputSlug,
    code: matched.code || product.code,
    title: product.title || matched.title,
    price: product.price || matched.price
  };
}
