import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight, Calendar, ArrowLeft } from 'lucide-react';
import RevealOnScroll from '../components/RevealOnScroll';
import { getNewsSlug, slugify } from '../utils/slug';
import './News.css';

const DEFAULT_SAMPLE_NEWS = [
  {
    _id: "6aa4d471c757671a23feeadd",
    title: "Cửa khe thoáng - Giải pháp lấy sáng và lưu thông khí",
    slug: "cua-khe-thoang-giai-phap-lay-sang",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    date: "10/05/2024",
    summary: "Khám phá dòng cửa cuốn khe thoáng BossDoor với công nghệ giảm chấn 2 chiều.",
    content: `
      <p>Cửa cuốn khe thoáng là một trong những giải pháp tối ưu hàng đầu hiện nay cho các công trình nhà phố, biệt thự và văn phòng hiện đại tại Đà Nẵng.</p>
      <h3>1. Khả năng lấy sáng và điều hòa không khí tự nhiên</h3>
      <p>Với hệ thống các lỗ thoáng được tính toán chuẩn xác, cửa cuốn khe thoáng giúp ngôi nhà luôn ngập tràn ánh sáng tự nhiên vào ban ngày mà vẫn đảm bảo tính riêng tư tuyệt đối.</p>
      <p>Không khí được lưu thông liên tục qua các nan thoáng, xua tan cảm giác bí bách thường thấy ở các dòng cửa tấm liền hoặc cửa cuốn truyền thống.</p>
      <h3>2. Vận hành êm ái nhờ công nghệ giảm chấn 2 chiều</h3>
      <p>Các dòng sản phẩm thế hệ mới của BossDoor được trang bị gioăng giảm chấn cao su nguyên sinh tại các khớp nan, triệt tiêu đến 90% tiếng ồn khi đóng mở.</p>
      <h3>3. Tính an toàn bảo mật vượt trội</h3>
      <p>Thân cửa được sản xuất từ hợp kim nhôm 6063-T5 tiêu chuẩn quốc tế, phủ sơn tĩnh điện Akzo Nobel bảo hành bề mặt lên tới 5 - 10 năm, chống bão và chống cạy phá hiệu quả.</p>
    `
  },
  {
    _id: "6aa4d471c757671a23feeadb",
    title: "Cách chọn cửa cuốn phù hợp cho ngôi nhà của bạn",
    slug: "cach-chon-cua-cuon-phu-hop",
    image: "https://images.unsplash.com/photo-1558008258-3256797b43f3?auto=format&fit=crop&w=800&q=80",
    date: "26/05/2024",
    summary: "Hướng dẫn chọn mua cửa cuốn khe thoáng, cửa cuốn tấm liền chuẩn kích thước và an toàn.",
    content: `
      <p>Lựa chọn cửa cuốn phù hợp với diện tích, vị trí và ngân sách giúp ngôi nhà của bạn an toàn, bền đẹp theo thời gian.</p>
      <h3>1. Xác định vị trí và mục đích sử dụng</h3>
      <p>Đối với nhà mặt tiền đường phố lớn, cửa khe thoáng nhôm dày là ưu tiên hàng đầu để đón gió và cản bụi. Đối với nhà kho hoặc gara, cửa cuốn tấm liền hoặc cửa cuốn kéo tay có thể là lựa chọn kinh tế hơn.</p>
      <h3>2. Lựa chọn thương hiệu và phụ kiện chính hãng</h3>
      <p>Nên chọn mô tơ đồng bộ và bình lưu điện chính hãng có rơ-le chống quá tải để đảm bảo cửa luôn hoạt động khi mất điện.</p>
    `
  },
  {
    _id: "6aa4d471c757671a23feeadc",
    title: "Ưu điểm của cửa tự động trong không gian hiện đại",
    slug: "uu-diem-cua-cua-tu-dong",
    image: "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=800&q=80",
    date: "15/05/2024",
    summary: "Tại sao các văn phòng, TTTM và biệt thự hiện đại chọn giải pháp cửa trượt tự động?",
    content: `
      <p>Cửa tự động mang lại sự tiện nghi vượt trội, tiết kiệm điện năng cho máy lạnh và nâng cao đẳng cấp công trình.</p>
      <h3>1. Trải nghiệm chạm và mở không tiếp xúc</h3>
      <p>Cảm biến radar hoặc cảm biến hồng ngoại giúp cửa nhận diện người di chuyển từ xa và tự động trượt mở nhẹ nhàng.</p>
      <h3>2. Tính thẩm mỹ cao và bền bỉ</h3>
      <p>Kính cường lực kết hợp ray trượt hợp kim nhôm định hình cao cấp chịu được tần suất đóng mở hàng nghìn lần mỗi ngày.</p>
    `
  }
];

const NewsDetail = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      setLoading(true);
      setError(null);
      let foundArticle = null;

      // 1. Thử gọi API Backend theo slug hoặc ID
      try {
        const backendBase = import.meta.env.VITE_API_URL || "";
        const endpoint = backendBase ? `${backendBase}/api/news/${id}` : `/api/news/${id}`;
        const response = await fetch(endpoint);
        if (response.ok) {
          const json = await response.json();
          if (json.success && json.data) {
            foundArticle = json.data;
          }
        }
      } catch (err) {
        console.warn('API fetch news detail error, trying fallback:', err.message);
      }

      // 2. Fallback tìm trong danh sách mẫu nếu API không có
      if (!foundArticle) {
        const normalizedParam = id.toLowerCase().trim();
        foundArticle = DEFAULT_SAMPLE_NEWS.find(n => {
          const s = (n.slug || slugify(n.title)).toLowerCase();
          const sid = String(n._id || "").toLowerCase();
          return s === normalizedParam || sid === normalizedParam || s.includes(normalizedParam);
        });
      }

      if (foundArticle) {
        setNewsItem(foundArticle);

        // 3. Tự động đồng bộ URL trên trình duyệt sang dạng slug không dấu chuẩn SEO
        const canonicalSlug = getNewsSlug(foundArticle);
        if (canonicalSlug && id !== canonicalSlug) {
          window.history.replaceState(null, "", `/tin-tuc/${canonicalSlug}`);
        }
      } else {
        setError('Không tìm thấy bài viết tin tức.');
      }

      setLoading(false);
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) {
    return <div className="news-loading" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Đang tải chi tiết tin tức...</div>;
  }

  if (error || !newsItem) {
    return <div className="news-error" style={{ minHeight: '50vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{error || 'Không tìm thấy tin tức.'}</div>;
  }

  return (
    <div className="boss-news-page site-293-style">
      {/* 1. TOP BANNER HEADER */}
      <div className="news-top-banner">
        <div className="news-banner-overlay"></div>
        <div className="container relative-z">
          <RevealOnScroll animation="fade-down" className="news-banner-text">
            <h1>TIN TỨC & SỰ KIỆN</h1>
          </RevealOnScroll>
        </div>
      </div>

      {/* 2. BREADCRUMB */}
      <div className="news-breadcrumb">
        <div className="container">
          <Link to="/" title="Trang chủ">Trang chủ <ChevronRight size={14} /></Link>
          <Link to="/tin-tuc" title="Tin tức">Tin tức <ChevronRight size={14} /></Link>
          <span className="current-page">{newsItem.title}</span>
        </div>
      </div>

      {/* 3. MAIN CONTENT */}
      <main className="site293-main-content section-space news-detail-main">
        <div className="container news-detail-container">
          <RevealOnScroll animation="fade-up">
            <Link to="/tin-tuc" className="back-link">
              <ArrowLeft size={16} /> Quay lại tin tức
            </Link>
            
            <h1 className="news-detail-title">{newsItem.title}</h1>
            
            <div className="news-detail-meta">
              <span className="news-date">
                <Calendar size={14} /> {newsItem.date || new Date(newsItem.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </div>

            {newsItem.image && (
              <div className="news-detail-image">
                <img src={newsItem.image} alt={newsItem.title} />
              </div>
            )}

            <div className="news-detail-content">
              {/* If content is HTML, use dangerouslySetInnerHTML, otherwise just display it */}
              <div dangerouslySetInnerHTML={{ __html: newsItem.content }} />
            </div>
          </RevealOnScroll>
        </div>
      </main>
    </div>
  );
};

export default NewsDetail;
