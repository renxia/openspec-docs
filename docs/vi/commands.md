# Các lệnh

Đây là tài liệu tham khảo cho các lệnh slash của OpenSpec. Các lệnh này được gọi trong giao diện trò chuyện của trợ lý lập trình AI của bạn (ví dụ: Claude Code, Cursor, Windsurf).

Để biết các mẫu quy trình làm việc và thời điểm sử dụng từng lệnh, hãy xem [Quy trình làm việc](workflows.md). Đối với các lệnh CLI, hãy xem [CLI](cli.md).

## Tham chiếu nhanh

### Đường dẫn nhanh mặc định (hồ sơ `core`)

| Lệnh | Mục đích |
|---------|---------|
| `/opsx:propose` | Tạo một thay đổi và tạo các tài liệu quy hoạch trong một bước |
| `/opsx:explore` | Suy nghĩ kỹ về các ý tưởng trước khi cam kết thực hiện thay đổi |
| `/opsx:apply` | Triển khai các tác vụ từ thay đổi |
| `/opsx:sync` | Hợp nhất các đặc tả delta vào các đặc tả chính |
| `/opsx:archive` | Lưu trữ một thay đổi đã hoàn thành |

### Các lệnh quy trình làm việc mở rộng (lựa chọn quy trình làm việc tùy chỉnh)

| Lệnh | Mục đích |
|---------|---------|
| `/opsx:new` | Bắt đầu một khung thay đổi mới |
| `/opsx:continue` | Tạo tài liệu tiếp theo dựa trên các phụ thuộc |
| `/opsx:ff` | Chuyển tiếp nhanh: tạo tất cả các tài liệu quy hoạch cùng một lúc |
| `/opsx:verify` | Xác nhận rằng việc triển khai khớp với các tài liệu |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi cùng một lúc |
| `/opsx:onboard` | Hướng dẫn qua toàn bộ quy trình làm việc |

Hồ sơ toàn cầu mặc định là `core`. Để kích hoạt các lệnh quy trình làm việc mở rộng, hãy chạy `openspec config profile`, chọn quy trình làm việc, sau đó chạy `openspec update` trong dự án của bạn.

---

## Tham chiếu lệnh

### `/opsx:propose`

Tạo một thay đổi mới và tạo các tạo phẩm quy hoạch trong một bước. Đây là lệnh khởi động mặc định trong profile `core`.

**Cú pháp:**
```text
/opsx:propose [tên-hoặc-mô-tả-thay-đổi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-hoặc-mô-tả-thay-đổi` | Không | Tên dạng kebab-case hoặc mô tả thay đổi bằng ngôn ngữ tự nhiên |

**Chức năng:**
- Tạo `openspec/changes/<tên-thay-đổi>/`
- Tạo các tạo phẩm cần thiết trước khi triển khai (đối với `spec-driven`: đề xuất, đặc tả, thiết kế, tác vụ)
- Dừng lại khi thay đổi sẵn sàng cho `/opsx:apply`

**Ví dụ:**
```text
Bạn: /opsx:propose add-dark-mode

AI:  Đã tạo openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Sẵn sàng triển khai. Chạy /opsx:apply.
```

**Mẹo:**
- Sử dụng lệnh này để có đường dẫn nhanh nhất từ đầu đến cuối
- Nếu bạn muốn kiểm soát từng tạo phẩm một, hãy bật quy trình mở rộng và sử dụng `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Suy nghĩ về các ý tưởng, điều tra vấn đề và làm rõ yêu cầu trước khi cam kết thực hiện một thay đổi.

**Cú pháp:**
```
/opsx:explore [chủ-đề]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `chủ-đề` | Không | Chủ đề bạn muốn khám phá hoặc điều tra |

**Chức năng:**
- Mở một cuộc trò chuyện khám phá không yêu cầu cấu trúc
- Điều tra codebase để trả lời các câu hỏi
- So sánh các tùy chọn và phương pháp
- Tạo sơ đồ trực quan để làm rõ suy nghĩ
- Có thể chuyển sang `/opsx:propose` (mặc định) hoặc `/opsx:new` (quy trình mở rộng) khi các hiểu biết trở nên rõ ràng

**Ví dụ:**
```text
Bạn: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

Bạn: Chúng ta nên xử lý xác thực cho ứng dụng di động như thế nào?

AI:  Để tôi điều tra thiết lập xác thực hiện tại của bạn...
     [Phân tích codebase]

     Tôi thấy bạn đang sử dụng xác thực dựa trên phiên cho ứng dụng web.
     Đối với di động, chúng ta có ba lựa chọn chính:

     1. JWT token (không trạng thái, hoạt động ngoại tuyến)
     2. OAuth2 (nếu bạn cần đăng nhập bên thứ ba)
     3. Mở rộng phiên hiện tại (đơn giản hơn, nhưng yêu cầu kết nối)

     API của bạn đã được cấu hình CORS. Bạn quan tâm đến hướng nào?

Bạn: Hãy dùng JWT. Chúng ta có thể bắt đầu một thay đổi cho điều đó không?

AI:  Sẵn sàng khi bạn muốn. Chạy /opsx:propose add-jwt-auth để bắt đầu.
```

**Mẹo:**
- Sử dụng khi yêu cầu chưa rõ ràng hoặc bạn cần điều tra
- Không tạo tạo phẩm nào trong quá trình khám phá
- Phù hợp để so sánh nhiều phương pháp trước khi quyết định
- Có thể đọc tệp và tìm kiếm trong codebase

---

### `/opsx:new`

Bắt đầu một khung thay đổi mới. Tạo thư mục thay đổi và chờ bạn tạo tạo phẩm bằng `/opsx:continue` hoặc `/opsx:ff`.

Lệnh này là một phần của bộ quy trình mở rộng (không được bao gồm trong profile `core` mặc định).

**Cú pháp:**
```
/opsx:new [tên-thay-đổi] [--schema <tên-schema>]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-thay-đổi` | Không | Tên cho thư mục thay đổi (sẽ được nhắc nếu không cung cấp) |
| `--schema` | Không | Schema quy trình làm việc cần sử dụng (mặc định: từ cấu hình hoặc `spec-driven`) |

**Chức năng:**
- Tạo thư mục `openspec/changes/<tên-thay-đổi>/`
- Tạo tệp siêu dữ liệu `.openspec.yaml` trong thư mục thay đổi
- Hiển thị mẫu tạo phẩm đầu tiên sẵn sàng để tạo
- Nhắc nhập tên thay đổi và schema nếu chưa cung cấp

**Thành phần được tạo:**
```
openspec/changes/<tên-thay-đổi>/
└── .openspec.yaml    # Siêu dữ liệu thay đổi (schema, ngày tạo)
```

**Ví dụ:**
```
Bạn: /opsx:new add-dark-mode

AI:  Đã tạo openspec/changes/add-dark-mode/
     Schema: spec-driven

     Sẵn sàng tạo: proposal
     Sử dụng /opsx:continue để tạo nó, hoặc /opsx:ff để tạo tất cả tạo phẩm.
```

**Mẹo:**
- Sử dụng tên mô tả: `add-feature`, `fix-bug`, `refactor-module`
- Tránh tên chung chung như `update`, `changes`, `wip`
- Schema cũng có thể được đặt trong cấu hình dự án (`openspec/config.yaml`)

---

### `/opsx:continue`

Tạo tạo phẩm tiếp theo trong chuỗi phụ thuộc. Tạo từng tạo phẩm một để tiến triển dần.

**Cú pháp:**
```
/opsx:continue [tên-thay-đổi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-thay-đổi` | Không | Thay đổi nào cần tiếp tục (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Truy vấn đồ thị phụ thuộc của tạo phẩm
- Hiển thị những tạo phẩm nào sẵn sàng so với bị chặn
- Tạo tạo phẩm sẵn sàng đầu tiên
- Đọc các tệp phụ thuộc để lấy ngữ cảnh
- Hiển thị những gì sẽ khả dụng sau khi tạo

**Ví dụ:**
```
Bạn: /opsx:continue

AI:  Thay đổi: add-dark-mode

     Trạng thái tạo phẩm:
     ✓ proposal    (hoàn thành)
     ◆ specs       (sẵn sàng)
     ◆ design      (sẵn sàng)
     ○ tasks       (bị chặn - cần: specs)

     Đang tạo specs...

     [Đọc proposal.md, tạo specs dựa trên yêu cầu]

     ✓ Đã tạo openspec/changes/add-dark-mode/specs/ui/spec.md

     Bây giờ khả dụng: tasks
     Chạy /opsx:continue để tạo tạo phẩm tiếp theo.
```

**Mẹo:**
- Sử dụng khi bạn muốn xem xét từng tạo phẩm trước khi tiến hành
- Phù hợp cho các thay đổi phức tạp khi bạn muốn kiểm soát
- Nhiều tạo phẩm có thể sẵn sàng đồng thời
- Bạn có thể chỉnh sửa các tạo phẩm đã tạo trước khi tiếp tục

---

### `/opsx:ff`

Tua nhanh quá trình tạo tạo phẩm. Tạo tất cả tạo phẩm quy hoạch cùng một lúc.

**Cú pháp:**
```
/opsx:ff [tên-thay-đổi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-thay-đổi` | Không | Thay đổi nào cần tua nhanh (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Tạo tất cả tạo phẩm theo thứ tự phụ thuộc
- Theo dõi tiến trình qua danh sách việc cần làm
- Dừng lại khi tất cả tạo phẩm yêu cầu `apply-required` hoàn thành
- Đọc từng phụ thuộc trước khi tạo tạo phẩm tiếp theo

**Ví dụ:**
```
Bạn: /opsx:ff add-dark-mode

AI:  Đang tua nhanh add-dark-mode...

     ✓ Đang tạo proposal.md
     ✓ Đang tạo specs/ui/spec.md
     ✓ Đang tạo design.md
     ✓ Đang tạo tasks.md

     Tất cả tạo phẩm quy hoạch đã hoàn thành!
     Sẵn sàng triển khai. Chạy /opsx:apply để bắt đầu.
```

**Mẹo:**
- Sử dụng khi bạn có cái nhìn rõ ràng về những gì bạn đang xây dựng
- Nhanh hơn `/opsx:continue` cho các thay đổi đơn giản
- Bạn vẫn có thể chỉnh sửa tạo phẩm sau đó
- Phù hợp cho các tính năng nhỏ đến trung bình

---

### `/opsx:apply`

Triển khai các tác vụ từ thay đổi. Làm việc qua danh sách tác vụ, viết code và đánh dấu hoàn thành.

**Cú pháp:**
```
/opsx:apply [tên-thay-đổi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-thay-đổi` | Không | Thay đổi nào cần triển khai (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Đọc `tasks.md` và xác định các tác vụ chưa hoàn thành
- Làm việc qua từng tác vụ một
- Viết code, tạo tệp, chạy kiểm thử khi cần
- Đánh dấu tác vụ hoàn thành bằng hộp kiểm `[x]`

**Ví dụ:**
```
Bạn: /opsx:apply

AI:  Đang triển khai add-dark-mode...

     Đang đọc tasks.md:
     - [ ] 1.1 Tạo ThemeContext
     - [ ] 1.2 Thêm thuộc tính CSS tùy chỉnh
     - [ ] 1.3 Triển khai lưu trữ localStorage

     Đang làm 1.1: Tạo ThemeContext...
     [Tạo src/context/ThemeContext.tsx]

     ✓ 1.1 Hoàn thành

     Đang làm 1.2: Thêm thuộc tính CSS tùy chỉnh...
     [Cập nhật src/styles/globals.css]

     ✓ 1.2 Hoàn thành
     ...
```

**Mẹo:**
- Có thể tiếp tục từ nơi bạn đã dừng nếu bị gián đoạn
- Sử dụng cho các thay đổi song song bằng cách chỉ định tên thay đổi
- Trạng thái hoàn thành được theo dõi trong các hộp kiểm của `tasks.md`

---

### `/opsx:verify`

Xác nhận rằng triển khai khớp với các tạo phẩm thay đổi của bạn. Kiểm tra tính đầy đủ, chính xác và nhất quán.

**Cú pháp:**
```
/opsx:verify [tên-thay-đổi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-thay-đổi` | Không | Thay đổi nào cần xác minh (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Kiểm tra ba chiều của chất lượng triển khai
- Tìm kiếm codebase để tìm bằng chứng triển khai
- Báo cáo các vấn đề được phân loại là QUAN TRỌNG, CẢNH BÁO hoặc ĐỀ XUẤT
- Không chặn lưu trữ, nhưng nêu ra các vấn đề

**Các chiều xác minh:**

| Chiều | Nội dung xác nhận |
|-----------|-------------------|
| **Tính đầy đủ** | Tất cả tác vụ đã hoàn thành, tất cả yêu cầu đã triển khai, các kịch bản được đề cập |
| **Tính chính xác** | Triển khai khớp với ý định của đặc tả, xử lý các trường hợp biên |
| **Tính nhất quán** | Các quyết định thiết kế được phản ánh trong code, mẫu nhất quán |

**Ví dụ:**
```
Bạn: /opsx:verify

AI:  Đang xác minh add-dark-mode...

     TÍNH ĐẦY ĐỦ
     ✓ Tất cả 8 tác vụ trong tasks.md đã được đánh dấu
     ✓ Tất cả yêu cầu trong specs có code tương ứng
     ⚠ Kịch bản "Phát hiện tùy chọn hệ thống" không có bảo mật kiểm thử

     TÍNH CHÍNH XÁC
     ✓ Triển khai khớp với ý định của đặc tả
     ✓ Các trường hợp biên từ kịch bản được xử lý
     ✓ Trạng thái lỗi khớp với định nghĩa đặc tả

     TÍNH NHẤT QUÁN
     ✓ Các quyết định thiết kế được phản ánh trong cấu trúc code
     ✓ Quy ước đặt tên nhất quán với design.md
     ⚠ Thiết kế đề cập "CSS variables" nhưng triển khai sử dụng lớp Tailwind

     TÓM TẮT
     ─────────────────────────────
     Vấn đề nghiêm trọng: 0
     Cảnh báo: 2
     Sẵn sàng lưu trữ: Có (có cảnh báo)

     Đề xuất:
     1. Thêm kiểm thử cho phát hiện tùy chọn hệ thống
     2. Cập nhật design.md để phản ánh việc sử dụng Tailwind, hoặc tái cấu trúc để sử dụng CSS variables
```

**Mẹo:**
- Chạy trước khi lưu trữ để phát hiện sớm sự không khớp
- Cảnh báo không chặn lưu trữ nhưng chỉ ra các vấn đề tiềm ẩn
- Phù hợp để xem xét công việc của AI trước khi cam kết
- Có thể phát hiện sự trôi dạt giữa tạo phẩm và triển khai

---

### `/opsx:sync`

**Lệnh tùy chọn.** Hợp nhất các đặc tả delta từ một thay đổi vào đặc tả chính. Lưu trữ sẽ nhắc đồng bộ nếu cần, vì vậy bạn thường không cần chạy lệnh này thủ công.

**Cú pháp:**
```
/opsx:sync [tên-thay-đổi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-thay-đổi` | Không | Thay đổi nào cần đồng bộ (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Đọc các đặc tả delta từ thư mục thay đổi
- Phân tích các phần ADDED/MODIFIED/REMOVED/RENAMED
- Hợp nhất các thay đổi vào thư mục `openspec/specs/` chính
- Bảo toàn nội dung hiện có không được đề cập trong delta
- Không lưu trữ thay đổi (vẫn hoạt động)

**Ví dụ:**
```text
Bạn: /opsx:sync

AI:  Đang đồng bộ đặc tả delta add-dark-mode...

     Đang đọc: openspec/changes/add-dark-mode/specs/ui/spec.md
     Mục tiêu:  openspec/specs/ui/spec.md

     Các thay đổi cần áp dụng:
     ✓ ADDED: Yêu cầu Chọn giao diện (2 kịch bản)
     ✓ ADDED: Yêu cầu Khả năng truy cập (1 kịch bản)

     Đang hợp nhất...
     ✓ openspec/specs/ui/spec.md đã được cập nhật

     Thay đổi vẫn hoạt động. Chạy /opsx:archive khi sẵn sàng hoàn thành.
```

**Khi nào sử dụng thủ công:**

| Kịch bản | Sử dụng sync? |
|----------|-----------|
| Thay đổi chạy dài, muốn đặc tả ở bản chính trước khi lưu trữ | Có |
| Nhiều thay đổi song song cần đặc tả cơ sở được cập nhật | Có |
| Muốn xem trước/xem xét việc hợp nhất riêng biệt | Có |
| Thay đổi nhanh, đi thẳng đến lưu trữ | Không (lưu trữ xử lý) |

**Mẹo:**
- Đồng bộ thông minh, không phải sao chép-dán
- Có thể thêm kịch bản vào các yêu cầu hiện có mà không trùng lặp
- Thay đổi vẫn hoạt động sau khi đồng bộ (không được lưu trữ)
- Hầu hết người dùng sẽ không bao giờ cần gọi trực tiếp lệnh này—lưu trữ sẽ nhắc nếu cần

---

### `/opsx:archive`

Lưu trữ một thay đổi đã hoàn thành. Hoàn tất thay đổi và di chuyển nó vào thư mục lưu trữ.

**Cú pháp:**
```
/opsx:archive [tên-thay-đổi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-thay-đổi` | Không | Thay đổi nào cần lưu trữ (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Kiểm tra trạng thái hoàn thành của tạo phẩm
- Kiểm tra hoàn thành tác vụ (cảnh báo nếu chưa hoàn thành)
- Đề xuất đồng bộ đặc tả delta nếu chưa được đồng bộ
- Di chuyển thư mục thay đổi sang `openspec/changes/archive/YYYY-MM-DD-<tên>/`
- Bảo toàn tất cả tạo phẩm để kiểm tra

**Ví dụ:**
```text
Bạn: /opsx:archive

AI:  Đang lưu trữ add-dark-mode...

     Trạng thái tạo phẩm:
     ✓ proposal.md tồn tại
     ✓ specs/ tồn tại
     ✓ design.md tồn tại
     ✓ tasks.md tồn tại (8/8 tác vụ hoàn thành)

     Đặc tả delta: Chưa được đồng bộ
     → Đồng bộ ngay? (khuyến nghị)

Bạn: Có

AI:  ✓ Đã đồng bộ specs vào openspec/specs/ui/spec.md
     ✓ Đã di chuyển đến openspec/changes/archive/2025-01-24-add-dark-mode/

     Thay đổi đã được lưu trữ thành công.
```

**Mẹo:**
- Lưu trữ sẽ không chặn các tác vụ chưa hoàn thành, nhưng sẽ cảnh báo
- Đặc tả delta có thể được đồng bộ trong quá trình lưu trữ hoặc trước đó
- Các thay đổi đã lưu trữ được bảo toàn để lịch sử
- Sử dụng `/opsx:verify` trước để phát hiện vấn đề

---

### `/opsx:bulk-archive`

Lưu trữ nhiều thay đổi đã hoàn thành cùng một lúc. Xử lý xung đột đặc tả giữa các thay đổi.

**Cú pháp:**
```
/opsx:bulk-archive [tên-thay-đổi...]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `tên-thay-đổi` | Không | Các thay đổi cụ thể cần lưu trữ (sẽ nhắc chọn nếu không cung cấp) |

**Chức năng:**
- Liệt kê tất cả các thay đổi đã hoàn thành
- Xác nhận từng thay đổi trước khi lưu trữ
- Phát hiện xung đột đặc tả giữa các thay đổi
- Giải quyết xung đột bằng cách kiểm tra những gì thực sự đã triển khai
- Lưu trữ theo thứ tự thời gian

**Ví dụ:**
```
Bạn: /opsx:bulk-archive

AI:  Tìm thấy 3 thay đổi đã hoàn thành:
     - add-dark-mode (8/8 tác vụ hoàn thành)
     - fix-login-bug (3/3 tác vụ hoàn thành)
     - update-footer (2/2 tác vụ hoàn thành)

     Đang kiểm tra xung đột đặc tả...
     ⚠ add-dark-mode và update-footer đều chạm vào specs/ui/

     Đang kiểm tra codebase để giải quyết...
     Cả hai thay đổi đều đã được triển khai. Sẽ hợp nhất theo thứ tự thời gian:
     1. add-dark-mode (tạo ngày 20 tháng 1)
     2. update-footer (tạo ngày 22 tháng 1)

     Lưu trữ tất cả 3 thay đổi?

Bạn: Có

AI:  ✓ Đã lưu trữ add-dark-mode
     ✓ Đã lưu trữ fix-login-bug
     ✓ Đã lưu trữ update-footer
     Đặc tả đã hợp nhất: add-dark-mode → update-footer
```

**Mẹo:**
- Phù hợp cho các luồng công việc song công
- Giải quyết xung đột là tác vụ tự động (kiểm tra codebase)
- Các thay đổi được lưu trữ theo thứ tự tạo
- Nhắc trước khi ghi đè nội dung đặc tả

---

### `/opsx:onboard`

Hướng dẫn làm quen qua toàn bộ quy trình làm việc OpenSpec. Một hướng dẫn tương tác sử dụng codebase thực tế của bạn.

**Cú pháp:**
```
/opsx:onboard
```

**Chức năng:**
- Hướng dẫn qua một chu kỳ quy trình làm việc hoàn chỉnh với lời giải thích
- Quét codebase của bạn để tìm cơ hội cải tiến thực tế
- Tạo một thay đổi thực tế với các tạo phẩm thực tế
- Triển khai công việc thực tế (các thay đổi nhỏ, an toàn)
- Lưu trữ thay đổi đã hoàn thành
- Giải thích từng bước khi nó xảy ra

**Các giai đoạn:**
1. Chào mừng và phân tích codebase
2. Tìm cơ hội cải tiến
3. Tạo thay đổi (`/opsx:new`)
4. Viết đề xuất
5. Tạo đặc tả
6. Viết thiết kế
7. Tạo tác vụ
8. Triển khai tác vụ (`/opsx:apply`)
9. Xác minh triển khai
10. Lưu trữ thay đổi
11. Tóm tắt và các bước tiếp theo

**Ví dụ:**
```
Bạn: /opsx:onboard

AI:  Chào mừng đến với OpenSpec!

     Tôi sẽ hướng dẫn bạn qua toàn bộ quy trình làm việc sử dụng codebase thực tế của bạn.
     Chúng ta sẽ tìm thứ gì đó nhỏ để cải thiện, tạo một thay đổi đúng đắn cho nó,
     triển khai nó và lưu trữ nó.

     Để tôi quét codebase của bạn để tìm cơ hội...

     [Phân tích codebase]

     Tôi tìm thấy một vài thứ chúng ta có thể làm việc:
     1. Thêm xác thực đầu vào cho biểu mẫu liên hệ
     2. Cải thiện thông báo lỗi trong luồng xác thực
     3. Thêm trạng thái tải cho các nút bất đồng bộ

     Bạn quan tâm đến điều nào? (hoặc đề xuất điều gì khác)
```

**Mẹo:**
- Phù hợp nhất cho người dùng mới học quy trình làm việc
- Sử dụng code thực, không phải ví dụ mẫu
- Tạo một thay đổi thực tế bạn có thể giữ hoặc loại bỏ
- Mất 15-30 phút để hoàn thành

---

## Cú pháp lệnh theo công cụ AI

Các công cụ AI khác nhau sử dụng cú pháp lệnh hơi khác nhau. Hãy sử dụng định dạng phù hợp với công cụ của bạn:

| Công cụ | Ví dụ cú pháp |
|---------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Các lệnh gọi dựa trên kỹ năng như `/skill:openspec-propose`, `/skill:openspec-apply-change` (không tạo các tệp lệnh `opsx-*`) |
| Trae | Các lệnh gọi dựa trên kỹ năng như `/openspec-propose`, `/openspec-apply-change` (không tạo các tệp lệnh `opsx-*`) |

Mục đích là như nhau trên tất cả các công cụ, nhưng cách lệnh được hiển thị có thể khác nhau tùy theo tích hợp.

> **Lưu ý:** Các lệnh của GitHub Copilot (`.github/prompts/*.prompt.md`) chỉ có sẵn trong các phần mở rộng IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI hiện không hỗ trợ các tệp lệnh tùy chỉnh — xem [Các công cụ được hỗ trợ](supported-tools.md) để biết chi tiết và cách giải quyết.

---

## Các lệnh cũ

Các lệnh này sử dụng quy trình làm việc cũ "tất cả cùng một lúc". Chúng vẫn hoạt động nhưng các lệnh OPSX được khuyến nghị sử dụng.

| Lệnh | Chức năng |
|---------|--------------|
| `/openspec:proposal` | Tạo tất cả các thành phần cùng một lúc (đề xuất, thông số kỹ thuật, thiết kế, nhiệm vụ) |
| `/openspec:apply` | Triển khai thay đổi |
| `/openspec:archive` | Lưu trữ thay đổi |

**Khi nào nên sử dụng các lệnh cũ:**
- Các dự án hiện có đang sử dụng quy trình làm việc cũ
- Các thay đổi đơn giản mà bạn không cần tạo thành phần tăng dần
- Ưu tiên cách tiếp cận "được ăn cả, ngã về không"

**Chuyển sang OPSX:**
Các thay đổi cũ có thể được tiếp tục bằng các lệnh OPSX. Cấu trúc thành phần là tương thích.

---

## Khắc phục sự cố

### "Không tìm thấy thay đổi"

Lệnh không thể xác định thay đổi nào cần làm việc.

**Giải pháp:**
- Chỉ rõ tên thay đổi một cách tường minh: `/opsx:apply add-dark-mode`
- Kiểm tra xem thư mục thay đổi có tồn tại không: `openspec list`
- Xác minh bạn đang ở đúng thư mục dự án

### "Không có thành phần sẵn sàng"

Tất cả các thành phần đã hoàn thành hoặc bị chặn do thiếu phụ thuộc.

**Giải pháp:**
- Chạy `openspec status --change <name>` để xem điều gì đang chặn
- Kiểm tra xem các thành phần bắt buộc có tồn tại không
- Tạo trước các thành phần phụ thuộc bị thiếu

### "Không tìm thấy lược đồ"

Lược đồ được chỉ định không tồn tại.

**Giải pháp:**
- Liệt kê các lược đồ có sẵn: `openspec schemas`
- Kiểm tra chính tả của tên lược đồ
- Tạo lược đồ nếu nó là tùy chỉnh: `openspec schema init <name>`

### Lệnh không được nhận dạng

Công cụ AI không nhận dạng các lệnh OpenSpec.

**Giải pháp:**
- Đảm bảo OpenSpec đã được khởi tạo: `openspec init`
- Tạo lại các kỹ năng: `openspec update`
- Kiểm tra xem thư mục `.claude/skills/` có tồn tại không (đối với Claude Code)
- Khởi động lại công cụ AI của bạn để nhận các kỹ năng mới

### Thành phần không được tạo đúng cách

AI tạo ra các thành phần không đầy đủ hoặc không chính xác.

**Giải pháp:**
- Thêm ngữ cảnh dự án trong `openspec/config.yaml`
- Thêm các quy tắc cho từng thành phần cụ thể để được hướng dẫn chi tiết
- Cung cấp thêm chi tiết trong mô tả thay đổi của bạn
- Sử dụng `/opsx:continue` thay vì `/opsx:ff` để có nhiều quyền kiểm soát hơn

---

## Các bước tiếp theo

- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và khi nào nên sử dụng mỗi lệnh
- [CLI](cli.md) - Các lệnh dòng lệnh để quản lý và xác thực
- [Tùy chỉnh](customization.md) - Tạo lược đồ và quy trình làm việc tùy chỉnh