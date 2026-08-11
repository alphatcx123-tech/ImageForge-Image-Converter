# ImageForge-Image-Converter# 🖼️ ImageForge — Image Converter

**ImageForge** là công cụ chuyển đổi hình ảnh chạy trực tiếp trên trình duyệt, được thiết kế với giao diện hiện đại, tốc độ xử lý nhanh và ưu tiên quyền riêng tư.

Ứng dụng cho phép chuyển đổi nhiều hình ảnh cùng lúc, thay đổi định dạng, điều chỉnh chất lượng và độ phân giải mà **không cần tải ảnh lên máy chủ**.

🔗 **Website:** https://imageforge-image-converter.atcx.42web.io/

🔗 **GitHub:** https://github.com/alphatcx123-tech/ImageForge-Image-Converter

---

## ✨ Tính năng

* 🖼️ Chuyển đổi hình ảnh trực tiếp trên trình duyệt
* 📦 Hỗ trợ chuyển đổi nhiều file cùng lúc
* 🖱️ Kéo & thả hình ảnh để thêm file
* 📂 Chọn nhiều hình ảnh từ máy tính
* 🎨 Hỗ trợ nhiều định dạng đầu ra
* 📐 Thay đổi chiều rộng và chiều cao
* 🔄 Tự động giữ nguyên tỷ lệ khung hình
* 🖥️ Các preset độ phân giải:

  * 144p
  * 240p
  * 360p
  * 480p
  * 720p HD
  * 1080p Full HD
  * 1440p QHD
  * 2160p 4K
  * Original
* 🎚️ Điều chỉnh chất lượng từ 1% đến 100%
* 🌙 Dark Mode / Light Mode
* 🌐 Hỗ trợ Tiếng Việt và English
* 💾 Tải từng ảnh hoặc tải tất cả ảnh
* 🗑️ Xóa file khỏi danh sách
* 🍪 Lưu lựa chọn và trạng thái bằng trình duyệt
* 🔒 Xử lý ảnh cục bộ, không upload lên server

---

## 🧩 Định dạng hỗ trợ

ImageForge cung cấp nhiều lựa chọn định dạng đầu ra:

| Định dạng | Extension       |
| --------- | --------------- |
| PNG       | `.png`          |
| JPEG      | `.jpg`, `.jpeg` |
| WebP      | `.webp`         |
| AVIF      | `.avif`         |
| BMP       | `.bmp`          |
| GIF       | `.gif`          |
| TIFF      | `.tiff`         |
| APNG      | `.apng`         |
| ICO       | `.ico`          |
| SVG       | `.svg`          |
| TGA       | `.tga`          |
| PPM       | `.ppm`          |
| PGM       | `.pgm`          |
| PBM       | `.pbm`          |
| PAM       | `.pam`          |
| QOI       | `.qoi`          |
| PCX       | `.pcx`          |
| DDS       | `.dds`          |
| HDR       | `.hdr`          |
| SGI       | `.sgi`          |
| FITS      | `.fits`         |
| MIFF      | `.miff`         |

Ứng dụng sử dụng JavaScript và một số thư viện xử lý định dạng để hỗ trợ các loại ảnh khác nhau.

---

## 🚀 Cách sử dụng

### 1. Thêm hình ảnh

Có hai cách:

* Kéo và thả hình ảnh vào khu vực **Add files**
* Nhấn **Add files** và chọn hình ảnh từ máy tính

Bạn có thể chọn nhiều file cùng lúc.

### 2. Chọn định dạng

Trong phần **Conversion settings**, chọn định dạng muốn xuất:

```text
PNG
JPEG / JPG
WebP
AVIF
BMP
GIF
TIFF
APNG
ICO
SVG
TGA
...
```

### 3. Chọn chất lượng

Sử dụng thanh **Quality** để điều chỉnh chất lượng đầu ra từ:

```text
1% → 100%
```

Giá trị mặc định là **92%**.

### 4. Chọn độ phân giải

Có thể chọn nhanh các preset:

```text
144p
240p
360p
480p
720p HD
1080p Full HD
1440p QHD
2160p 4K
Original
```

Hoặc nhập trực tiếp:

```text
Width (px)
Height (px)
```

Khi chỉ nhập một chiều, chiều còn lại sẽ được tính toán để giữ nguyên tỷ lệ ảnh.

### 5. Chuyển đổi

Nhấn:

**Convert all**

để chuyển đổi toàn bộ hình ảnh.

Bạn cũng có thể chuyển đổi từng ảnh riêng lẻ.

### 6. Tải ảnh

Sau khi chuyển đổi hoàn tất:

* **Download** — tải từng ảnh
* **Download all** — tải toàn bộ ảnh đã chuyển đổi

---

## 🔒 Quyền riêng tư

ImageForge được thiết kế theo hướng **local processing**.

> Hình ảnh được xử lý trực tiếp trên thiết bị của bạn bằng JavaScript.

Ảnh không cần được upload lên máy chủ để thực hiện quá trình chuyển đổi. Điều này giúp giảm rủi ro khi xử lý các hình ảnh riêng tư hoặc nhạy cảm.

---

## 🌙 Dark Mode

ImageForge hỗ trợ hai giao diện:

* 🌙 Dark Mode
* ☀️ Light Mode

Lựa chọn giao diện được lưu lại trong `localStorage`, vì vậy ứng dụng có thể ghi nhớ thiết lập của người dùng giữa các lần truy cập.

---

## 🌐 Ngôn ngữ

Hiện tại ImageForge hỗ trợ:

* 🇻🇳 Tiếng Việt
* 🇬🇧 English

Ngôn ngữ được lưu trong trình duyệt và có thể thay đổi trực tiếp từ menu ở góc trên bên phải.

---

## 🛠️ Công nghệ

Dự án được xây dựng theo kiến trúc frontend đơn giản:

* **HTML5**
* **CSS3**
* **JavaScript**
* **Browser Canvas API**
* **LocalStorage**
* **File API**
* **Drag & Drop API**

Một số thư viện bên ngoài được sử dụng để hỗ trợ xử lý định dạng hình ảnh:

* `heic2any`
* `UTIF.js`
* `TGA.js`
* `gif.js`

Các thư viện được tải trực tiếp thông qua CDN.

---

## 📁 Cấu trúc dự án

```text
ImageForge-Image-Converter/
│
├── index.html       # Giao diện chính
├── index.css        # Stylesheet
├── index.js         # Logic xử lý ứng dụng
├── cookie.html      # Thông tin Cookie
├── CNAME            # Cấu hình domain
├── README.md        # Tài liệu dự án
└── googleb52cba5076eb7f92.html
```

Repository hiện được tổ chức theo mô hình frontend độc lập với HTML, CSS và JavaScript tách riêng.

---

## 💻 Chạy dự án

ImageForge không yêu cầu framework hoặc backend phức tạp.

Clone repository:

```bash
git clone https://github.com/alphatcx123-tech/ImageForge-Image-Converter.git
```

Di chuyển vào thư mục:

```bash
cd ImageForge-Image-Converter
```

Sau đó mở:

```text
index.html
```

trên trình duyệt.

Bạn cũng có thể sử dụng Live Server hoặc một web server tĩnh bất kỳ để chạy dự án.

---

## 🌍 Browser Compatibility

ImageForge được thiết kế để chạy trên các trình duyệt hiện đại có hỗ trợ:

* JavaScript ES6+
* HTML5 File API
* Canvas API
* Drag & Drop API
* LocalStorage

Khuyến nghị sử dụng phiên bản mới của:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

---

## 📸 Giao diện

> Có thể thêm screenshot của ImageForge tại đây.

```markdown
![ImageForge Screenshot](screenshot.png)
```

---

## 📝 Lưu ý

Một số định dạng hình ảnh có thể phụ thuộc vào khả năng hỗ trợ của trình duyệt hoặc thư viện xử lý tương ứng.

Đặc biệt, việc chuyển đổi sang các định dạng ít phổ biến có thể có giới hạn về tính năng hoặc khả năng tương thích với các phần mềm khác.

---

## 👨‍💻 Tác giả

**ATCX**

© 2026 ATCX. All rights reserved.

---

## ⭐ Đóng góp

Nếu bạn phát hiện lỗi hoặc có ý tưởng cải thiện ImageForge, hãy tạo:

* Issue
* Pull Request

trên GitHub.

Mọi đóng góp nhằm cải thiện hiệu năng, giao diện, khả năng tương thích và hỗ trợ thêm định dạng đều được hoan nghênh.

---

## 📄 License

License của dự án hiện chưa được khai báo rõ ràng trong repository. Nếu muốn phát hành dự án dưới dạng open-source, nên bổ sung file `LICENSE` với giấy phép phù hợp.

---

## 🔗 Links

* **Website:** https://imageforge-image-converter.atcx.42web.io/
* **GitHub:** https://github.com/alphatcx123-tech/ImageForge-Image-Converter

---

<p align="center">

**ImageForge — Fast. Private. Simple.**

</p>

---

<p align="center">© 2026 ATCX. All rights reserved.</p>
