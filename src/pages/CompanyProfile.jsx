import React, { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail,
  MapPin,
  Clock, 
  CheckCircle2,
  Calendar,
  ChevronDown,
  ChevronUp,
  Share2,
  Building2,
  User,
  ShieldCheck,
  Award,
  Factory
} from "lucide-react";
import "./CompanyProfile.css";

const GOOGLE_DRIVE_DOWNLOAD_URL = "https://drive.google.com/uc?export=download&id=1IxLIKEYCc_RVlHsyq8nCDEMXVp0cLvAr";

export default function CompanyProfile() {
  const [tocOpen, setTocOpen] = useState(true);

  return (
    <div className="company-profile-page-clean">
      <div className="container profile-article-container">
        {/* BREADCRUMB */}
        <nav className="profile-clean-breadcrumb" aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link>
          <span className="sep">/</span>
          <Link to="/gioi-thieu">Giới thiệu</Link>
          <span className="sep">/</span>
          <span className="current">Hồ sơ năng lực</span>
        </nav>

        {/* MAIN ARTICLE HEADER */}
        <header className="profile-article-header">
          <h1 className="profile-article-title">
            Hồ Sơ Năng Lực Công Ty TNHH MTV TM & DV BOSS Đà Nẵng
          </h1>

          <div className="profile-meta-row">
            <span className="meta-item">
              <Calendar size={14} /> Cập nhật: 2026
            </span>
            <span className="meta-item">
              <User size={14} /> Ban Biên Tập BossDoor Đà Nẵng
            </span>
            <span className="meta-item">
              <Clock size={14} /> Thời gian đọc: 6 phút
            </span>
          </div>
        </header>

        {/* INTRO PARAGRAPH */}
        <div className="profile-intro-content">
          <p>
            <strong>Công ty TNHH MTV TM&DV BOSS ĐÀ NẴNG</strong>, mang thương hiệu <strong>BossDoor Đà Nẵng</strong>, 
            là đơn vị uy tín hàng đầu tại khu vực miền Trung chuyên phân phối, gia công và thi công trọn gói các hạng mục 
            <strong> Cửa cuốn công nghệ Đức - Úc, Cửa kéo Đài Loan, Cổng tự động nhập khẩu Châu Âu, Giếng trời thông minh và Nhôm kính cao cấp</strong>. 
            Bắt đầu hoạt động từ năm 2017, công ty đã có gần 10 năm kinh nghiệm thi công hàng trăm công trình dân dụng, biệt thự cao cấp và các đại dự án công nghiệp trọng điểm.
          </p>

          <p>
            Dưới sự điều hành của <strong>Ông Hoàng Nhật Quỳnh – CEO BossDoor Đà Nẵng</strong>, công ty luôn giữ vững phương châm 
            <em> "Uy tín hàng đầu – Chất lượng đảm bảo – An toàn tuyệt đối"</em>, không ngừng học hỏi và đổi mới công nghệ để cung cấp 
            giải pháp bảo vệ không gian sống hoàn hảo nhất theo đúng tiêu chuẩn kỹ thuật của từng chủ đầu tư và đối tác.
          </p>

          {/* FIGURE ẢNH CHÂN DUNG CEO HOÀNG NHẬT QUỲNH */}
          <figure className="profile-caption-figure">
            <img 
              src="/profile_assets/ong-hoang-nhat-quynh-ceo-bossdoordanang.jpg" 
              alt="Ông Hoàng Nhật Quỳnh – CEO BossDoor Đà Nẵng" 
              className="figure-img"
            />
            <figcaption className="figure-caption-text">
              Ông Hoàng Nhật Quỳnh – Giám đốc điều hành (CEO) Công ty TNHH MTV TM & DV BOSS Đà Nẵng
            </figcaption>
          </figure>

          {/* BẢNG THÔNG TIN DOANH NGHIỆP CHUẨN MẪU */}
          <div className="profile-table-wrapper" id="thong-tin-doanh-nghiep">
            <table className="profile-standard-table">
              <thead>
                <tr>
                  <th colSpan="2">CÔNG TY TNHH MTV TM & DV BOSS ĐÀ NẴNG</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="col-prop">Tên viết tắt</td>
                  <td className="col-val">Công ty Boss Đà Nẵng</td>
                </tr>
                <tr>
                  <td className="col-prop">Tên thương hiệu</td>
                  <td className="col-val">BossDoor Đà Nẵng</td>
                </tr>
                <tr>
                  <td className="col-prop">Tên quốc tế</td>
                  <td className="col-val">Boss Da Nang Trading & Services Co., Ltd</td>
                </tr>
                <tr>
                  <td className="col-prop">Địa chỉ</td>
                  <td className="col-val">Số 647 Ngô Quyền, Phường An Hải Bắc, Quận Sơn Trà, TP Đà Nẵng</td>
                </tr>
                <tr>
                  <td className="col-prop">Mã số thuế</td>
                  <td className="col-val"><strong>0401872174</strong></td>
                </tr>
                <tr>
                  <td className="col-prop">Người đại diện</td>
                  <td className="col-val">
                    Ông <a href="#1-thong-tin-ceo-hoang-nhat-quynh" className="text-link-blue">Hoàng Nhật Quỳnh</a>
                  </td>
                </tr>
                <tr>
                  <td className="col-prop">Điện thoại</td>
                  <td className="col-val">
                    <a href="tel:0904678323" className="text-link-blue">0904 678 323</a> – <a href="tel:02363566286" className="text-link-blue">02363 566 286</a>
                  </td>
                </tr>
                <tr>
                  <td className="col-prop">Hồ sơ năng lực</td>
                  <td className="col-val">
                    <a 
                      href={GOOGLE_DRIVE_DOWNLOAD_URL} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-link-blue font-bold"
                    >
                      Xem hồ sơ năng lực (Bản PDF gốc)
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* MỤC LỤC NỘI DUNG (TABLE OF CONTENTS) */}
          <div className="profile-toc-box">
            <div className="toc-header" onClick={() => setTocOpen(!tocOpen)}>
              <span className="toc-title">Mục lục nội dung</span>
              <button type="button" className="toc-toggle-btn" aria-label="Toggle mục lục">
                {tocOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                <span>{tocOpen ? "Ẩn" : "Hiện"}</span>
              </button>
            </div>

            {tocOpen && (
              <ul className="toc-list">
                <li><a href="#1-thong-tin-ceo-hoang-nhat-quynh">1. Thông tin về CEO Hoàng Nhật Quỳnh</a></li>
                <li><a href="#2-qua-trinh-cong-tac">2. Quá trình học tập & công tác</a></li>
                <li><a href="#3-thu-ngo-hop-tac">3. Thư ngỏ hợp tác từ Ban Giám đốc</a></li>
                <li><a href="#4-tam-nhin-su-menh">4. Tầm nhìn & Sứ mệnh phát triển</a></li>
                <li><a href="#5-gia-tri-cot-loi">5. Phương châm hoạt động & Giá trị cốt lõi</a></li>
                <li><a href="#6-linh-vuc-kinh-doanh">6. Danh mục sản phẩm & Lĩnh vực hoạt động</a></li>
                <li><a href="#7-so-do-to-chuc">7. Sơ đồ tổ chức & Năng lực nhân sự</a></li>
                <li><a href="#8-nang-luc-tai-chinh">8. Năng lực tài chính & Cơ sở vật chất kỹ thuật</a></li>
                <li><a href="#9-du-an-tieu-bieu">9. Một số công trình & dự án tiêu biểu</a></li>
                <li><a href="#10-bao-chi-noi-ve-boss">10. Báo chí nói về BossDoor Đà Nẵng</a></li>
              </ul>
            )}
          </div>

          {/* 1. THÔNG TIN VỀ CEO HOÀNG NHẬT QUỲNH */}
          <section className="profile-article-section" id="1-thong-tin-ceo-hoang-nhat-quynh">
            <h2>1. Thông tin về CEO Hoàng Nhật Quỳnh</h2>
            <ul className="clean-bullet-list">
              <li><strong>Họ và tên:</strong> Hoàng Nhật Quỳnh</li>
              <li><strong>Năm sinh:</strong> 01/11/1990</li>
              <li><strong>Nơi ở:</strong> TP. Đà Nẵng</li>
              <li><strong>Học vấn:</strong> Cử nhân Kinh tế – Trường Đại Học Kinh Tế Huế</li>
              <li><strong>Chức vụ hiện tại:</strong> Giám đốc điều hành (CEO) – Công ty TNHH MTV TM&DV BOSS ĐÀ NẴNG</li>
            </ul>
          </section>

          {/* 2. QUÁ TRÌNH HỌC TẬP & CÔNG TÁC */}
          <section className="profile-article-section" id="2-qua-trinh-cong-tac">
            <h2>2. Quá trình học tập & công tác</h2>
            <p>
              Hoàng Nhật Quỳnh – CEO của BossDoor Đà Nẵng, là một nhà lãnh đạo trẻ tràn đầy nhiệt huyết và quyết đoán. 
              Anh không ngừng nỗ lực học hỏi và tiến bước từ vai trò của một chuyên viên kinh doanh lên thành một doanh nhân sáng tạo. 
              Đóng góp của anh không chỉ giúp xây dựng và phát triển công ty mà còn góp phần vào sự an tâm, an toàn của cộng đồng và ngành cửa, cổng tự động tại miền Trung.
            </p>

            <ul className="clean-timeline-list">
              <li><strong>Năm 1996 – 2001:</strong> Học sinh tiểu học tại trường Tiểu học Kỳ Xuân.</li>
              <li><strong>Năm 2001 – 2005:</strong> Học bậc THCS tại trường THCS Kỳ Xuân.</li>
              <li><strong>Năm 2005 – 2008:</strong> Học bậc THPT tại trường THPT Nguyễn Huệ.</li>
              <li><strong>Năm 2008 – 2012:</strong> Sinh viên tại trường Đại Học Kinh Tế Huế, nơi anh chinh phục những kiến thức chuyên môn về quản trị kinh doanh và rèn luyện kỹ năng thực tiễn.</li>
              <li><strong>Năm 2012 – 2014:</strong> Nhân viên kinh doanh tại Tổng công ty Viễn thông MobiFone, tiếp tục mở rộng kiến thức thương mại và quy trình chăm sóc khách hàng chuyên nghiệp.</li>
              <li><strong>Năm 2014 – 2017:</strong> Đại diện kinh doanh cho Tập đoàn Carlsberg Việt Nam, thể hiện sự quyết đoán và tinh thần phát triển thị trường bền vững.</li>
              <li><strong>Năm 2017 – nay:</strong> Co-Founder & CEO tại Công ty TNHH MTV TM&DV BOSS ĐÀ NẴNG.</li>
            </ul>
          </section>

          {/* 3. THƯ NGỎ HỢP TÁC TỪ BAN GIÁM ĐỐC */}
          <section className="profile-article-section" id="3-thu-ngo-hop-tac">
            <h2>3. Thư ngỏ hợp tác từ Ban Giám đốc</h2>
            <div className="profile-letter-box">
              <p><strong>Kính gửi Quý Khách hàng, Quý Đối tác và Chủ đầu tư!</strong></p>
              <p>
                Lời đầu tiên, Công ty TNHH MTV TM&DV Boss Đà Nẵng xin chân thành cảm ơn Quý khách hàng, đối tác 
                đã luôn ủng hộ và tin tưởng sử dụng các sản phẩm và dịch vụ của chúng tôi trong suốt thời gian qua.
              </p>
              <p>
                Trải qua gần 10 năm hình thành và phát triển, Công ty Boss Đà Nẵng tự hào là một trong những đơn vị 
                hàng đầu về phân phối, thi công các sản phẩm <strong>CỬA CUỐN, CỬA KÉO, CỬA CỔNG TỰ ĐỘNG, KÍNH – NHÔM CAO CẤP</strong> 
                tại thị trường Đà Nẵng, Quảng Nam và khu vực miền Trung nói chung.
              </p>
              <p>
                Công ty chúng tôi đã và đang khẳng định uy tín qua việc trực tiếp tham gia thi công nhiều dự án dân dụng 
                và công trình trọng điểm như: <em>Tòa nhà VOV Miền Trung, Dự án Ấn Tượng Hội An, Chuỗi Siêu thị Điện máy MediaMart, 
                Biệt thự cao cấp Euro Villas, 15 căn Shophouse Golden Hills, Nhà máy Sữa Vinamilk Hòa Khánh, Nhà máy Thép Hòa Phát Dung Quất, 
                chuỗi cửa hàng AEON Mall Đà Nẵng...</em>
              </p>
              <p>
                Chúng tôi cam kết tiếp tục nỗ lực mang lại những giải pháp kỹ thuật tối ưu nhất, tiết kiệm tối đa thời gian và chi phí, 
                đồng thời bảo đảm an toàn và tính thẩm mỹ cao nhất cho mọi công trình.
              </p>
              <p className="letter-sign-text">
                <strong>TM. CÔNG TY TNHH MTV TM&DV BOSS ĐÀ NẴNG</strong><br />
                Giám đốc: <strong>Hoàng Nhật Quỳnh</strong>
              </p>
            </div>
          </section>

          {/* 4. TẦM NHÌN & SỨ MỆNH PHÁT TRIỂN */}
          <section className="profile-article-section" id="4-tam-nhin-su-menh">
            <h2>4. Tầm nhìn & Sứ mệnh phát triển</h2>
            <h3>TẦM NHÌN</h3>
            <p>
              Trở thành tổng thầu thi công với phương thức quản trị hiện đại theo chuẩn mực quốc tế. 
              Là sự lựa chọn hàng đầu của các chủ đầu tư, tổng thầu và khách hàng khi có nhu cầu cung cấp, lắp đặt các loại cửa cuốn, 
              cửa kéo, khung nhôm cửa kính và phụ kiện cửa thông minh tại miền Trung.
            </p>

            <h3>SỨ MỆNH</h3>
            <ul className="clean-bullet-list">
              <li><strong>Mang lại giải pháp tối ưu cho khách hàng:</strong> Cung cấp sản phẩm và dịch vụ đạt chuẩn chất lượng cao, gia tăng độ an toàn, bảo mật và sự tiện nghi cho không gian sống và nơi làm việc.</li>
              <li><strong>Kiến tạo công trình bền vững:</strong> Góp phần tạo nên những giá trị tốt đẹp cho xã hội bằng những công trình đẳng cấp, bền bỉ và hài hòa với môi trường sống.</li>
              <li><strong>Môi trường làm việc năng động:</strong> Xây dựng văn hóa doanh nghiệp công bằng, truyền cảm hứng và mang lại thu nhập xứng đáng cho toàn thể cán bộ nhân viên.</li>
            </ul>
          </section>

          {/* 5. PHƯƠNG CHÂM HOẠT ĐỘNG & GIÁ TRỊ CỐT LÕI */}
          <section className="profile-article-section" id="5-gia-tri-cot-loi">
            <h2>5. Phương châm hoạt động & Giá trị cốt lõi</h2>
            <div className="quote-callout-box">
              <strong>PHƯƠNG CHÂM CÔNG TY:</strong><br />
              <em>"Uy tín – Chất lượng cao – Giá thành hợp lý – Đảm bảo tiến độ – An toàn tuyệt đối"</em>
            </div>

            <p>3 giá trị cốt lõi là kim chỉ nam cho từng quyết định trong chiến lược phát triển của Boss Đà Nẵng:</p>
            <ol className="clean-numbered-list">
              <li>
                <strong>Sự phát triển của người lao động:</strong> Xây dựng một môi trường lao động năng động, công bằng và chuyên nghiệp để người lao động phát triển bản thân và gắn bó lâu dài.
              </li>
              <li>
                <strong>Sự hài lòng của khách hàng:</strong> Tạo ra những giá trị gia tăng thiết thực; sự hài lòng và an tâm của khách hàng chính là thước đo thành công cao nhất của chúng tôi.
              </li>
              <li>
                <strong>Sự hoàn thiện của dự án:</strong> Không ngừng nâng cao chất lượng dịch vụ ở mức cao nhất, xem chất lượng từng chi tiết kỹ thuật là yếu tố cạnh tranh sống còn của doanh nghiệp.
              </li>
            </ol>
          </section>

          {/* 6. DANH MỤC SẢN PHẨM & LĨNH VỰC HOẠT ĐỘNG */}
          <section className="profile-article-section" id="6-linh-vuc-kinh-doanh">
            <h2>6. Danh mục sản phẩm & Lĩnh vực kinh doanh</h2>
            <p>Hiện nay Boss Đà Nẵng chuyên phân phối và thi công 6 nhóm sản phẩm chủ lực:</p>

            <ul className="clean-bullet-list">
              <li>
                <strong>Cửa cuốn cao cấp BossDoor & Germandoor:</strong> Cửa cuốn khe thoáng hợp kim nhôm 6063-T5, cửa cuốn BossDoor công nghệ AI cảm biến chống xô, cửa cuốn tấm liền công nghệ Úc vận hành siêu êm, cửa cuốn Đài Loan tối ưu chi phí.
              </li>
              <li>
                <strong>Cửa kéo công nghệ Đức & Đài Loan:</strong> Cửa kéo nhôm định hình sơn AkzoNobel cao cấp kháng muối biển, cửa kéo tôn mạ màu Đài Loan có lá và không lá lấy sáng 95%, cửa kéo Inox 304 không gỉ sét.
              </li>
              <li>
                <strong>Cổng & Cửa tự động nhập khẩu 100%:</strong> Motor cổng lùa trượt, cổng mở cánh tay đòn, cổng âm sàn IP67 Beninca, Roger, BFT (Italy); cửa trượt mắt thần Kaba, Nabco (Nhật Bản); Barie điện tử và cổng xếp Inox cơ quan.
              </li>
              <li>
                <strong>Giếng trời tự động & Mái che thông minh:</strong> Giếng trời trượt lấy sáng và thông gió tự nhiên, tích hợp cảm biến mưa gió tự cuốn thông minh điều khiển qua điện thoại.
              </li>
              <li>
                <strong>Cửa kính lề sàn & Nhôm hệ cao cấp:</strong> Cửa kính bản lề sàn Häfele/VVP, vách kính cường lực an toàn 10-15mm, cửa nhôm hệ Xingfa nhập khẩu cho biệt thự, showroom và văn phòng.
              </li>
              <li>
                <strong>Mô tơ & Phụ kiện đồng bộ:</strong> Tổng đại lý phân phối mô tơ lõi đồng 100% YH, AC, BossRM tải trọng từ 300kg đến 1500kg, bình lưu điện UPS 800W - 1200W lưu trữ 72h, hộp điều khiển mã nhảy Rolling Code chống sao chép.
              </li>
            </ul>
          </section>

          {/* 7. SƠ ĐỒ TỔ CHỨC & NĂNG LỰC NHÂN SỰ */}
          <section className="profile-article-section" id="7-so-do-to-chuc">
            <h2>7. Sơ đồ tổ chức & Năng lực nhân sự</h2>
            <p>
              Công ty TNHH MTV TM&DV Boss Đà Nẵng sở hữu đội ngũ cán bộ công nhân viên được đào tạo chuyên ngành bài bản, 
              dày dặn kinh nghiệm trong tổ chức quản lý, thực hiện công tác thiết kế, dự toán và thi công xây dựng:
            </p>

            <ul className="clean-bullet-list">
              <li><strong>Ban Giám Đốc:</strong> Trực tiếp định hướng chiến lược và giám sát chất lượng toàn diện (Giám đốc Hoàng Nhật Quỳnh).</li>
              <li><strong>Phó Giám Đốc Dự Án & Kỹ Thuật:</strong> Chỉ đạo trực tiếp công tác kỹ thuật tại hiện trường, bảo đảm đúng tiến độ và tiêu chuẩn ATLĐ.</li>
              <li><strong>Phó Giám Đốc Kinh Doanh:</strong> Phụ trách phát triển thị trường, kết nối đối tác chủ đầu tư và chăm sóc khách hàng.</li>
              <li><strong>Các phòng ban chuyên môn:</strong> Phòng Dự án, Phòng Kỹ thuật & ATLĐ, Phòng Quản lý Vật tư – Thiết bị, Phòng Tài chính – Kế toán, Phòng Hành chính – Nhân sự.</li>
              <li><strong>Đội ngũ thợ thi công lành nghề:</strong> 100% thợ kỹ thuật có thẻ an toàn lao động, trang bị bảo hộ đầy đủ và có kinh nghiệm lắp đặt các công trình đòi hỏi độ phức tạp cao.</li>
            </ul>
          </section>

          {/* 8. NĂNG LỰC TÀI CHÍNH & MÁY MÓC THIẾT BỊ */}
          <section className="profile-article-section" id="8-nang-luc-tai-chinh">
            <h2>8. Năng lực tài chính & Cơ sở vật chất kỹ thuật</h2>
            <h3>NĂNG LỰC TÀI CHÍNH</h3>
            <p>
              Từ những thành quả đạt được, Boss Đà Nẵng hiện nay là doanh nghiệp có nguồn tài chính ổn định và lành mạnh, 
              đảm bảo hoàn thành tốt mọi dự án trực tiếp tham gia thi công. Bên cạnh nguồn vốn chủ sở hữu, chúng tôi có mối quan hệ 
              hợp tác chặt chẽ với các tổ chức tín dụng uy tín tại Việt Nam (Agribank, Eximbank...), sẵn sàng cung cấp bảo lãnh thực hiện 
              hợp đồng và bảo hành công trình nhanh chóng.
            </p>

            <h3>MÁY MÓC & TRANG THIẾT BỊ THI CÔNG</h3>
            <ul className="clean-bullet-list">
              <li>Máy cắt nhôm 2 đầu điều khiển kỹ thuật số chính xác tuyệt đối.</li>
              <li>Dàn máy dập thủy lực, máy uốn định hình nan cửa chuyên dụng.</li>
              <li>Thiết bị cân chỉnh trắc đạc laser và đo độ phẳng mặt bằng thi công.</li>
              <li>Hệ thống giàn giáo, tời nâng điện đạt chứng nhận kiểm định an toàn kỹ thuật.</li>
              <li>Phương tiện xe vận tải giao nhận hàng nhanh chóng, phục vụ tận chân công trình toàn miền Trung.</li>
            </ul>
          </section>

          {/* 9. MỘT SỐ CÔNG TRÌNH & DỰ ÁN TIÊU BIỂU */}
          <section className="profile-article-section" id="9-du-an-tieu-bieu">
            <h2>9. Một số công trình & dự án tiêu biểu</h2>
            <p>Công ty chúng tôi đã thực hiện nhiều dự án dân dụng và công trình lớn từ Đà Nẵng, Quảng Nam, Quảng Ngãi… tiêu biểu như:</p>

            <ul className="clean-bullet-list">
              <li><strong>Tòa nhà VOV Miền Trung:</strong> Thi công hệ thống cửa cuốn và cửa tự động tại 42 Pasteur, TP. Đà Nẵng.</li>
              <li><strong>Dự án "Ấn Tượng Hội An":</strong> Thi công cửa cuốn kiến trúc tại TP. Hội An, Quảng Nam.</li>
              <li><strong>Hệ thống Siêu thị Điện máy MediaMart Đà Nẵng:</strong> Thi công toàn bộ cửa cuốn mặt tiền và cửa kho tải trọng lớn.</li>
              <li><strong>Khu Biệt thự Cao cấp Euro Villas 1 & 2:</strong> Lắp đặt cổng tự động nhập khẩu Italy, cửa cuốn biệt thự ven sông Hàn.</li>
              <li><strong>Dãy 15 căn Shophouse Golden Hills:</strong> Cung cấp và thi công cửa cuốn đồng bộ tại KĐT Golden Hills Đà Nẵng.</li>
              <li><strong>Nhà máy Sữa Vinamilk – KCN Hòa Khánh:</strong> Thi công cửa cuốn và cửa nhôm kính đạt chuẩn an toàn công nghiệp.</li>
              <li><strong>Nhà máy Thép Hòa Phát – KCN Dung Quất Quảng Ngãi:</strong> Thi công toàn bộ hệ thống cửa cuốn phân xưởng khẩu độ lớn.</li>
              <li><strong>Chuỗi Showroom Thời trang SAVANI:</strong> Thi công cửa cuốn và cửa kéo nhận diện thương hiệu tại miền Trung.</li>
              <li><strong>Dự án Nhà máy nước Hòa Liên:</strong> Cung cấp lắp đặt cửa kỹ thuật tại huyện Hòa Vang, TP. Đà Nẵng.</li>
              <li><strong>Nhà máy Xử lý Rác sinh hoạt Bắc Quảng Nam:</strong> Thi công hệ thống cửa cuốn chống ăn mòn hóa chất.</li>
              <li><strong>TTTM AEON Mall Đà Nẵng:</strong> Thi công hệ thống cửa cuốn song ngang Inox 304 thông thoáng cao cấp.</li>
              <li><strong>Hệ thống Ngân hàng Agribank & Eximbank Đà Nẵng:</strong> Cung cấp cửa cuốn bảo mật và phụ kiện mã nhảy chống dò sóng.</li>
            </ul>
          </section>

          {/* 10. BÁO CHÍ NÓI VỀ BOSSDOOR ĐÀ NẴNG */}
          <section className="profile-article-section" id="10-bao-chi-noi-ve-boss">
            <h2>10. Báo chí nói về BossDoor Đà Nẵng</h2>
            <p>
              Trong suốt quá trình phát triển, BossDoor Đà Nẵng đã nhận được sự tin tưởng và đưa tin từ nhiều cơ quan báo chí, 
              truyền thông uy tín tại Đà Nẵng và cả nước:
            </p>

            <ul className="clean-press-list">
              <li>
                <span className="press-source">Báo Đà Nẵng:</span> 
                <span>"BossDoor Đà Nẵng – Địa chỉ cung cấp và thi công cửa cuốn, cổng tự động uy tín tại miền Trung"</span>
              </li>
              <li>
                <span className="press-source">Báo Quảng Nam:</span> 
                <span>"Giải pháp cửa cuốn khe thoáng thông minh kiến tạo không gian sống an toàn cho các đô thị hiện đại"</span>
              </li>
              <li>
                <span className="press-source">Tạp chí Doanh Nghiệp & Tiếp Thị:</span> 
                <span>"CEO Hoàng Nhật Quỳnh và hành trình đưa thương hiệu BossDoor phủ sóng các công trình trọng điểm"</span>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
