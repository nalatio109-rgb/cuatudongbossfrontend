/**
 * Nén và tối ưu hóa hình ảnh trước khi tải lên server
 * Giúp giảm dung lượng từ 5MB-10MB xuống ~60KB-120KB mà vẫn giữ độ nét cao
 */
export async function compressImage(file, maxWidth = 1200, quality = 0.82) {
  // Bỏ qua các file không phải ảnh raster (svg, gif động)
  if (!file || !file.type.startsWith("image/") || file.type.includes("svg") || file.type.includes("gif")) {
    return file;
  }

  // Nếu file đã rất nhẹ (< 150KB), không cần nén thêm
  if (file.size <= 150 * 1024) {
    return file;
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let { width, height } = img;

        // Giới hạn chiều rộng / chiều cao tối đa
        if (width > maxWidth || height > maxWidth) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxWidth) / height);
            height = maxWidth;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Chuyển sang blob JPEG hoặc WebP
        const outputType = file.type === "image/png" ? "image/png" : "image/jpeg";
        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              const compressedFile = new File([blob], file.name, {
                type: outputType,
                lastModified: Date.now()
              });
              resolve(compressedFile);
            } else {
              resolve(file); // Giữ file gốc nếu không giảm được dung lượng
            }
          },
          outputType,
          quality
        );
      };
      img.onerror = () => resolve(file);
    };
    reader.onerror = () => resolve(file);
  });
}

