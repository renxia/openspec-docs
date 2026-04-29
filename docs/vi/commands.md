# Các lệnh

Đây là tài liệu tham khảo về các lệnh slash của OpenSpec. Các lệnh này được gọi trong giao diện trò chuyện của trợ lý lập trình AI của bạn (ví dụ: Claude Code, Cursor, Windsurf).

Để biết về các mẫu quy trình工作 và thời điểm sử dụng từng lệnh, xem [Quy trình](workflows.md). Để biết về các lệnh CLI, xem [CLI](cli.md).

## Tham khảo nhanh

### Đường dẫn nhanh mặc định (hồ sơ `core`)

| Lệnh | Mục đích |
|---------|---------|
| `/opsx:propose` | Tạo một thay đổi và tạo các biểu đồ lập kế hoạch trong một bước |
| `/opsx:explore` | Suy nghĩ về các ý tưởng trước khi cam kết thực hiện thay đổi |
| `/opsx:apply` | Triển khai các nhiệm vụ từ thay đổi |
| `/opsx:archive` | Lưu trữ một thay đổi đã hoàn thành |

### Các lệnh quy trình mở rộng (lựa chọn quy trình tùy chỉnh)

| Lệnh | Mục đích |
|---------|---------|
| `/opsx:new` | Bắt đầu một khung thay đổi mới |
| `/opsx:continue` | Tạo biểu đồ tiếp theo dựa trên các phụ thuộc |
| `/opsx:ff` | Tăng tốc: tạo tất cả các biểu đồ lập kế hoạch cùng lúc |
| `/opsx:verify` | Xác nhận việc triển khai khớp với các biểu đồ |
| `/opsx:sync` | Hợp nhất các đặc tả delta vào đặc tả chính |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi cùng lúc |
| `/opsx:onboard` | Hướng dẫn từng bước qua toàn bộ quy trình |

Hồ sơ toàn cục mặc định là `core`. Để kích hoạt các lệnh quy trình mở rộng, chạy `openspec config profile`, chọn quy trình, sau đó chạy `openspec update` trong dự án của bạn.

## Tham chiếu Lệnh

### `/opsx:propose`

Tạo một thay đổi mới và tạo các biểu mẫu kế hoạch trong một bước. Đây là lệnh bắt đầu mặc định trong profile `core`.

**Cú pháp:**
```text
/opsx:propose [ten-thay-doi-hoac-mo-ta]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `ten-thay-doi-hoac-mo-ta` | Không | Tên theo định dạng kebab-case hoặc mô tả thay đổi bằng ngôn ngữ thông thường |

**Chức năng:**
- Tạo thư mục `openspec/changes/<ten-thay-doi>/`
- Tạo các biểu mẫu cần thiết trước khi triển khai (đối với `spec-driven`: đề xuất, thông số kỹ thuật, thiết kế, nhiệm vụ)
- Dừng lại khi thay đổi sẵn sàng cho `/opsx:apply`

**Ví dụ:**
```text
Bạn: /opsx:propose add-dark-mode

AI:  Đã tạo openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Sẵn sàng để triển khai. Chạy /opsx:apply.
```

**Mẹo:**
- Sử dụng lệnh này cho con đường nhanh nhất từ đầu đến cuối
- Nếu bạn muốn kiểm soát từng bước các biểu mẫu, hãy bật các quy trình mở rộng và sử dụng `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

Suy nghĩ về các ý tưởng, nghiên cứu vấn đề và làm rõ yêu cầu trước khi cam kết thực hiện một thay đổi.

**Cú pháp:**
```
/opsx:explore [chu-de]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `chu-de` | Không | Điều bạn muốn khám phá hoặc nghiên cứu |

**Chức năng:**
- Mở một cuộc trò chuyện khám phá không cần cấu trúc
- Nghiên cứu cơ sở mã để trả lời câu hỏi
- So sánh các tùy chọn và cách tiếp cận
- Tạo sơ đồ trực quan để làm rõ tư duy
- Có thể chuyển sang `/opsx:propose` (mặc định) hoặc `/opsx:new` (quy trình mở rộng) khi những hiểu biết đã rõ ràng

**Ví dụ:**
```text
Bạn: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

Bạn: Chúng ta nên xử lý xác thực cho ứng dụng di động như thế nào?

AI:  Để tôi nghiên cứu thiết lập xác thực hiện tại của bạn...
     [Phân tích cơ sở mã]

     Tôi thấy bạn đang sử dụng xác thực dựa trên session cho ứng dụng web.
     Đối với di động, chúng ta có ba lựa chọn chính:

     1. JWT tokens (không trạng thái, hoạt động ngoại tuyến)
     2. OAuth2 (nếu bạn cần đăng nhập bên thứ ba)
     3. Mở rộng session hiện tại (đơn giản hơn, nhưng yêu cầu kết nối)

     API của bạn đã có CORS được cấu hình. Hướng nào bạn quan tâm?

Bạn: Hãy chọn JWT. Chúng ta có thể bắt đầu một thay đổi cho việc đó không?

AI:  Sẵn sàng khi bạn muốn. Chạy /opsx:propose add-jwt-auth để bắt đầu.
```

**Mẹo:**
- Sử dụng khi yêu cầu chưa rõ ràng hoặc bạn cần nghiên cứu
- Không tạo biểu mẫu nào trong quá trình khám phá
- Tốt để so sánh nhiều cách tiếp cận trước khi quyết định
- Có thể đọc tệp và tìm kiếm trong cơ sở mã

---

### `/opsx:new`

Bắt đầu một khung thay đổi mới. Tạo thư mục thay đổi và chờ bạn tạo các biểu mẫu bằng `/opsx:continue` hoặc `/opsx:ff`.

Lệnh này là một phần của bộ quy trình mở rộng (không được bao gồm trong profile `core` mặc định).

**Cú pháp:**
```
/opsx:new [ten-thay-doi] [--schema <ten-schema>]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `ten-thay-doi` | Không | Tên cho thư mục thay đổi (sẽ được nhắc nếu không cung cấp) |
| `--schema` | Không | Schema quy trình sẽ sử dụng (mặc định: từ cấu hình hoặc `spec-driven`) |

**Chức năng:**
- Tạo thư mục `openspec/changes/<ten-thay-doi>/`
- Tạo tệp metadata `.openspec.yaml` trong thư mục thay đổi
- Hiển thị mẫu biểu mẫu đầu tiên sẵn sàng để tạo
- Nhắc nhập tên thay đổi và schema nếu chưa được cung cấp

**Những gì nó tạo ra:**
```
openspec/changes/<ten-thay-doi>/
└── .openspec.yaml    # Metadata thay đổi (schema, ngày tạo)
```

**Ví dụ:**
```
Bạn: /opsx:new add-dark-mode

AI:  Đã tạo openspec/changes/add-dark-mode/
     Schema: spec-driven

     Sẵn sàng tạo: proposal
     Sử dụng /opsx:continue để tạo nó, hoặc /opsx:ff để tạo tất cả biểu mẫu.
```

**Mẹo:**
- Sử dụng tên mô tả: `add-feature`, `fix-bug`, `refactor-module`
- Tránh tên chung chung như `update`, `changes`, `wip`
- Schema cũng có thể được đặt trong cấu hình dự án (`openspec/config.yaml`)

---

### `/opsx:continue`

Tạo biểu mẫu tiếp theo trong chuỗi phụ thuộc. Tạo một biểu mẫu tại một thời điểm để tiến triển dần dần.

**Cú pháp:**
```
/opsx:continue [ten-thay-doi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `ten-thay-doi` | Không | Thay đổi nào cần tiếp tục (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Truy vấn đồ thị phụ thuộc biểu mẫu
- Hiển thị biểu mẫu nào đang sẵn sàng so với bị chặn
- Tạo biểu mẫu sẵn sàng đầu tiên
- Đọc các tệp phụ thuộc để lấy ngữ cảnh
- Hiển thị những gì trở nên khả dụng sau khi tạo

**Ví dụ:**
```
Bạn: /opsx:continue

AI:  Thay đổi: add-dark-mode

     Trạng thái biểu mẫu:
     ✓ proposal    (hoàn thành)
     ◆ specs       (sẵn sàng)
     ◆ design      (sẵn sàng)
     ○ tasks       (bị chặn - cần: specs)

     Đang tạo specs...

     [Đọc proposal.md, tạo specs dựa trên yêu cầu]

     ✓ Đã tạo openspec/changes/add-dark-mode/specs/ui/spec.md

     Bây giờ khả dụng: tasks
     Chạy /opsx:continue để tạo biểu mẫu tiếp theo.
```

**Mẹo:**
- Sử dụng khi bạn muốn xem xét từng biểu mẫu trước khi tiến hành
- Tốt cho các thay đổi phức tạp khi bạn muốn kiểm soát
- Nhiều biểu mẫu có thể trở nên sẵn sàng cùng lúc
- Bạn có thể chỉnh sửa các biểu mẫu đã tạo trước khi tiếp tục

---

### `/opsx:ff`

Tua nhanh quá trình tạo biểu mẫu. Tạo tất cả các biểu mẫu kế hoạch cùng một lúc.

**Cú pháp:**
```
/opsx:ff [ten-thay-doi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `ten-thay-doi` | Không | Thay đổi nào cần tua nhanh (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Tạo tất cả các biểu mẫu theo thứ tự phụ thuộc
- Theo dõi tiến trình qua danh sách việc cần làm
- Dừng lại khi tất cả các biểu mẫu `apply-required` đã hoàn thành
- Đọc mỗi tệp phụ thuộc trước khi tạo biểu mẫu tiếp theo

**Ví dụ:**
```
Bạn: /opsx:ff add-dark-mode

AI:  Đang tua nhanh add-dark-mode...

     ✓ Đang tạo proposal.md
     ✓ Đang tạo specs/ui/spec.md
     ✓ Đang tạo design.md
     ✓ Đang tạo tasks.md

     Tất cả biểu mẫu kế hoạch đã hoàn thành!
     Sẵn sàng để triển khai. Chạy /opsx:apply để bắt đầu.
```

**Mẹo:**
- Sử dụng khi bạn có bức tranh rõ ràng về những gì cần xây dựng
- Nhanh hơn `/opsx:continue` cho các thay đổi đơn giản
- Bạn vẫn có thể chỉnh sửa biểu mẫu sau đó
- Tốt cho các tính năng nhỏ đến trung bình

---

### `/opsx:apply`

Triển khai các nhiệm vụ từ thay đổi. Thực hiện qua danh sách nhiệm vụ, viết mã và đánh dấu các mục hoàn thành.

**Cú pháp:**
```
/opsx:apply [ten-thay-doi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `ten-thay-doi` | Không | Thay đổi nào cần triển khai (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Đọc `tasks.md` và xác định các nhiệm vụ chưa hoàn thành
- Thực hiện các nhiệm vụ từng cái một
- Viết mã, tạo tệp, chạy thử nghiệm khi cần
- Đánh dấu nhiệm vụ hoàn thành bằng checkbox `[x]`

**Ví dụ:**
```
Bạn: /opsx:apply

AI:  Đang triển khai add-dark-mode...

     Đọc tasks.md:
     - [ ] 1.1 Tạo ThemeContext
     - [ ] 1.2 Thêm CSS custom properties
     - [ ] 1.3 Triển khai lưu trữ localStorage

     Đang thực hiện 1.1: Tạo ThemeContext...
     [Tạo src/context/ThemeContext.tsx]

     ✓ 1.1 Hoàn thành

     Đang thực hiện 1.2: Thêm CSS custom properties...
     [Cập nhật src/styles/globals.css]

     ✓ 1.2 Hoàn thành
     ...
```

**Mẹo:**
- Có thể tiếp tục từ nơi bạn đã dừng lại nếu bị gián đoạn
- Sử dụng cho các thay đổi song song bằng cách chỉ định tên thay đổi
- Trạng thái hoàn thành được theo dõi trong checkbox của `tasks.md`

---

### `/opsx:verify`

Xác nhận rằng việc triển khai khớp với các biểu mẫu thay đổi của bạn. Kiểm tra tính đầy đủ, chính xác và nhất quán.

**Cú pháp:**
```
/opsx:verify [ten-thay-doi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `ten-thay-doi` | Không | Thay đổi nào cần xác minh (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Kiểm tra ba chiều của chất lượng triển khai
- Tìm kiếm trong cơ sở mã bằng chứng triển khai
- Báo cáo các vấn đề được phân loại là CRITICAL, WARNING hoặc SUGGESTION
- Không chặn việc lưu trữ, nhưng hiển thị các vấn đề

**Các chiều xác minh:**

| Chiều | Nó xác nhận điều gì |
|-----------|-------------------|
| **Đầy đủ** | Tất cả nhiệm vụ đã hoàn thành, tất cả yêu cầu đã được triển khai, các kịch bản đã được bao phủ |
| **Chính xác** | Việc triển khai khớp với ý định thông số kỹ thuật, các trường hợp biên đã được xử lý |
| **Nhất quán** | Các quyết định thiết kế được phản ánh trong mã, các mẫu nhất quán |

**Ví dụ:**
```
Bạn: /opsx:verify

AI:  Đang xác minh add-dark-mode...

     ĐẦY ĐỦ
     ✓ Tất cả 8 nhiệm vụ trong tasks.md đã được đánh dấu
     ✓ Tất cả yêu cầu trong specs có mã tương ứng
     ⚠ Kịch bản "Phát hiện ưu tiên hệ thống" không có phạm vi kiểm thử

     CHÍNH XÁC
     ✓ Việc triển khai khớp với ý định thông số kỹ thuật
     ✓ Các trường hợp biên từ kịch bản đã được xử lý
     ✓ Các trạng thái lỗi khớp với định nghĩa thông số kỹ thuật

     NHẤT QUAN
     ✓ Các quyết định thiết kế được phản ánh trong cấu trúc mã
     ✓ Quy tắc đặt tên nhất quán với design.md
     ⚠ Thiết kế đề cập đến "CSS variables" nhưng việc triển khai sử dụng các lớp Tailwind

     TÓM TẮT
     ─────────────────────────────
     Vấn đề nghiêm trọng: 0
     Cảnh báo: 2
     Sẵn sàng lưu trữ: Có (với cảnh báo)

     Khuyến nghị:
     1. Thêm kiểm thử cho việc phát hiện ưu tiên hệ thống
     2. Cập nhật design.md để phản ánh việc sử dụng Tailwind, hoặc tái cấu trúc để sử dụng CSS variables
```

**Mẹo:**
- Chạy trước khi lưu trữ để phát hiện sự không khớp sớm
- Cảnh báo không chặn việc lưu trữ nhưng chỉ ra các vấn đề tiềm ẩn
- Tốt để xem xét công việc của AI trước khi cam kết
- Có thể phát hiện sự lệch lạc giữa các biểu mẫu và việc triển khai

---

### `/opsx:sync`

**Lệnh tùy chọn.** Hợp nhất các thông số kỹ thuật delta từ một thay đổi vào thông số kỹ thuật chính. Việc lưu trữ sẽ nhắc đồng bộ nếu cần, vì vậy bạn thường không cần chạy lệnh này thủ công.

**Cú pháp:**
```
/opsx:sync [ten-thay-doi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `ten-thay-doi` | Không | Thay đổi nào cần đồng bộ (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Đọc các thông số kỹ thuật delta từ thư mục thay đổi
- Phân tích các phần ADDED/MODIFIED/REMOVED/RENAMED
- Hợp nhất các thay đổi vào thư mục `openspec/specs/` chính
- Bảo tồn nội dung hiện có không được đề cập trong delta
- Không lưu trữ thay đổi (vẫn hoạt động)

**Ví dụ:**
```text
Bạn: /opsx:sync

AI:  Đang đồng bộ thông số kỹ thuật delta của add-dark-mode...

     Đọc: openspec/changes/add-dark-mode/specs/ui/spec.md
     Mục tiêu:  openspec/specs/ui/spec.md

     Các thay đổi cần áp dụng:
     ✓ ĐÃ THÊM: Yêu cầu Chọn Giao diện (2 kịch bản)
     ✓ ĐÃ THÊM: Yêu cầu Khả năng truy cập (1 kịch bản)

     Đang hợp nhất...
     ✓ openspec/specs/ui/spec.md đã được cập nhật

     Thay đổi vẫn hoạt động. Chạy /opsx:archive khi sẵn sàng hoàn thành.
```

**Khi nào sử dụng thủ công:**

| Kịch bản | Sử dụng sync? |
|----------|-----------|
| Thay đổi chạy dài, muốn thông số kỹ thuật trong bản chính trước khi lưu trữ | Có |
| Nhiều thay đổi song song cần các thông số kỹ thuật cơ sở đã cập nhật | Có |
| Muốn xem trước/xem xét việc hợp nhất riêng biệt | Có |
| Thay đổi nhanh, đi thẳng đến lưu trữ | Không (lưu trữ sẽ xử lý) |

**Mẹo:**
- Đồng bộ là thông minh, không phải sao chép-dán
- Có thể thêm kịch bản vào các yêu cầu hiện có mà không trùng lặp
- Thay đổi vẫn hoạt động sau khi đồng bộ (chưa được lưu trữ)
- Hầu hết người dùng sẽ không bao giờ cần gọi lệnh này trực tiếp—lưu trữ sẽ nhắc nếu cần

---

### `/opsx:archive`

Lưu trữ một thay đổi đã hoàn thành. Hoàn tất thay đổi và chuyển nó vào thư mục lưu trữ.

**Cú pháp:**
```
/opsx:archive [ten-thay-doi]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `ten-thay-doi` | Không | Thay đổi nào cần lưu trữ (suy ra từ ngữ cảnh nếu không cung cấp) |

**Chức năng:**
- Kiểm tra trạng thái hoàn thành biểu mẫu
- Kiểm tra việc hoàn thành nhiệm vụ (cảnh báo nếu chưa hoàn thành)
- Đề nghị đồng bộ thông số kỹ thuật delta nếu chưa được đồng bộ
- Chuyển thư mục thay đổi vào `openspec/changes/archive/YYYY-MM-DD-<ten>/`
- Bảo tồn tất cả các biểu mẫu để kiểm tra

**Ví dụ:**
```text
Bạn: /opsx:archive

AI:  Đang lưu trữ add-dark-mode...

     Trạng thái biểu mẫu:
     ✓ proposal.md tồn tại
     ✓ specs/ tồn tại
     ✓ design.md tồn tại
     ✓ tasks.md tồn tại (8/8 nhiệm vụ hoàn thành)

     Thông số kỹ thuật delta: Chưa được đồng bộ
     → Đồng bộ ngay? (khuyến nghị)

Bạn: Có

AI:  ✓ Đã đồng bộ specs vào openspec/specs/ui/spec.md
     ✓ Đã chuyển vào openspec/changes/archive/2025-01-24-add-dark-mode/

     Đã lưu trữ thay đổi thành công.
```

**Mẹo:**
- Lưu trữ sẽ không chặn do các nhiệm vụ chưa hoàn thành, nhưng sẽ cảnh báo
- Thông số kỹ thuật delta có thể được đồng bộ trong quá trình lưu trữ hoặc trước đó
- Các thay đổi đã lưu trữ được bảo tồn để lưu lại lịch sử
- Sử dụng `/opsx:verify` trước để phát hiện vấn đề

---

### `/opsx:bulk-archive`

Lưu trữ nhiều thay đổi đã hoàn thành cùng một lúc. Xử lý xung đột thông số kỹ thuật giữa các thay đổi.

**Cú pháp:**
```
/opsx:bulk-archive [ten-thay-doi...]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `ten-thay-doi` | Không | Các thay đổi cụ thể cần lưu trữ (sẽ nhắc chọn nếu không cung cấp) |

**Chức năng:**
- Liệt kê tất cả các thay đổi đã hoàn thành
- Xác nhận từng thay đổi trước khi lưu trữ
- Phát hiện xung đột thông số kỹ thuật giữa các thay đổi
- Giải quyết xung đột bằng cách kiểm tra những gì thực sự đã được triển khai
- Lưu trữ theo thứ tự thời gian

**Ví dụ:**
```
Bạn: /opsx:bulk-archive

AI:  Tìm thấy 3 thay đổi đã hoàn thành:
     - add-dark-mode (8/8 nhiệm vụ hoàn thành)
     - fix-login-bug (3/3 nhiệm vụ hoàn thành)
     - update-footer (2/2 nhiệm vụ hoàn thành)

     Đang kiểm tra xung đột thông số kỹ thuật...
     ⚠ add-dark-mode và update-footer đều thay đổi specs/ui/

     Đang kiểm tra cơ sở mã để giải quyết...
     Cả hai thay đổi đều đã được triển khai. Sẽ hợp nhất theo thứ tự thời gian:
     1. add-dark-mode (tạo ngày 20 tháng 1)
     2. update-footer (tạo ngày 22 tháng 1)

     Lưu trữ tất cả 3 thay đổi?

Bạn: Có

AI:  ✓ Đã lưu trữ add-dark-mode
     ✓ Đã lưu trữ fix-login-bug
     ✓ Đã lưu trữ update-footer
     Đã hợp nhất specs: add-dark-mode → update-footer
```

**Mẹo:**
- Tốt cho các luồng công việc song song
- Giải quyết xung đột là tự động (kiểm tra cơ sở mã)
- Các thay đổi được lưu trữ theo thứ tự tạo
- Nhắc trước khi ghi đè nội dung thông số kỹ thuật

---

### `/opsx:onboard`

Hướng dẫn làm quen từng bước qua toàn bộ quy trình OpenSpec. Một hướng dẫn tương tác sử dụng cơ sở mã thực tế của bạn.

**Cú pháp:**
```
/opsx:onboard
```

**Chức năng:**
- Dẫn bạn qua một chu kỳ quy trình hoàn chỉnh với lời thuyết minh
- Quét cơ sở mã của bạn để tìm cơ hội cải thiện thực tế
- Tạo một thay đổi thực tế với các biểu mẫu thực
- Triển khai công việc thực (các thay đổi nhỏ, an toàn)
- Lưu trữ thay đổi đã hoàn thành
- Giải thích từng bước khi nó diễn ra

**Các giai đoạn:**
1. Chào mừng và phân tích cơ sở mã
2. Tìm cơ hội cải thiện
3. Tạo thay đổi (`/opsx:new`)
4. Viết đề xuất
5. Tạo thông số kỹ thuật
6. Viết thiết kế
7. Tạo nhiệm vụ
8. Triển khai nhiệm vụ (`/opsx:apply`)
9. Xác minh việc triển khai
10. Lưu trữ thay đổi
11. Tóm tắt và các bước tiếp theo

**Ví dụ:**
```
Bạn: /opsx:onboard

AI:  Chào mừng đến với OpenSpec!

     Tôi sẽ hướng dẫn bạn qua toàn bộ quy trình sử dụng cơ sở mã thực tế của bạn.
     Chúng ta sẽ tìm một cái gì đó nhỏ để cải thiện, tạo một thay đổi đúng cách cho nó,
     triển khai nó, và lưu trữ nó.

     Để tôi quét cơ sở mã của bạn để tìm cơ hội...

     [Phân tích cơ sở mã]

     Tôi đã tìm thấy một vài điều chúng ta có thể làm:
     1. Thêm xác thực đầu vào cho biểu mẫu liên hệ
     2. Cải thiện thông báo lỗi trong quy trình xác thực
     3. Thêm trạng thái tải cho các nút bất đồng bộ

     Bạn quan tâm đến điều nào? (hoặc đề xuất cái khác)
```

**Mẹo:**
- Tốt nhất cho người dùng mới học quy trình
- Sử dụng mã thực, không phải ví dụ mẫu
- Tạo một thay đổi thực mà bạn có thể giữ lại hoặc bỏ
- Mất 15-30 phút để hoàn thành

---

## Cú pháp lệnh theo Công cụ AI

Các công cụ AI khác nhau sử dụng cú pháp lệnh hơi khác nhau. Hãy sử dụng định dạng phù hợp với công cụ của bạn:

| Công cụ | Ví dụ cú pháp |
|---------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Trae | Các lệnh gọi dựa trên kỹ năng như `/openspec-propose`, `/openspec-apply-change` (không tạo các tệp lệnh `opsx-*`) |

Mục đích là giống nhau giữa các công cụ, nhưng cách hiển thị lệnh có thể khác nhau tùy theo tích hợp.

> **Lưu ý:** Các lệnh GitHub Copilot (`.github/prompts/*.prompt.md`) chỉ khả dụng trong các tiện ích mở rộng IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI hiện không hỗ trợ các tệp prompt tùy chỉnh — xem [Các công cụ được hỗ trợ](supported-tools.md) để biết chi tiết và các giải pháp thay thế.

---

## Các lệnh kế thừa

Các lệnh này sử dụng quy trình làm việc cũ "thực hiện tất cả cùng lúc". Chúng vẫn hoạt động nhưng các lệnh OPSX được khuyến nghị.

| Lệnh | Chức năng |
|------|-----------|
| `/openspec:proposal` | Tạo tất cả các thành phần cùng lúc (đề xuất, thông số kỹ thuật, thiết kế, nhiệm vụ) |
| `/openspec:apply` | Triển khai thay đổi |
| `/openspec:archive` | Lưu trữ thay đổi |

**Khi nào sử dụng các lệnh kế thừa:**
- Các dự án hiện có đang sử dụng quy trình làm việc cũ
- Các thay đổi đơn giản khi bạn không cần tạo thành phần dần dần
- Ưu tiên cách tiếp cận "hoàn thành tất cả hoặc không gì cả"

**Di chuyển sang OPSX:**
Các thay đổi kế thừa có thể được tiếp tục với các lệnh OPSX. Cấu trúc thành phần là tương thích.

---

## Khắc phục sự cố

### "Không tìm thấy thay đổi"

Lệnh không thể xác định thay đổi nào cần làm việc.

**Giải pháp:**
- Chỉ định rõ tên thay đổi: `/opsx:apply add-dark-mode`
- Kiểm tra thư mục thay đổi có tồn tại không: `openspec list`
- Xác minh bạn đang ở đúng thư mục dự án

### "Không có thành phần sẵn sàng"

Tất cả các thành phần đều đã hoàn thành hoặc bị chặn do thiếu phụ thuộc.

**Giải pháp:**
- Chạy `openspec status --change <name>` để xem điều gì đang bị chặn
- Kiểm tra xem các thành phần bắt buộc có tồn tại không
- Tạo các thành phần phụ thuộc bị thiếu trước

### "Không tìm thấy schema"

Schema được chỉ định không tồn tại.

**Giải pháp:**
- Liệt kê các schema có sẵn: `openspec schemas`
- Kiểm tra chính tả tên schema
- Tạo schema nếu đó là schema tùy chỉnh: `openspec schema init <name>`

### Lệnh không được nhận dạng

Công cụ AI không nhận diện được các lệnh OpenSpec.

**Giải pháp:**
- Đảm bảo OpenSpec đã được khởi tạo: `openspec init`
- Tạo lại các kỹ năng: `openspec update`
- Kiểm tra thư mục `.claude/skills/` có tồn tại không (đối với Claude Code)
- Khởi động lại công cụ AI để nhận các kỹ năng mới

### Thành phần không được tạo đúng cách

AI tạo ra các thành phần không đầy đủ hoặc không chính xác.

**Giải pháp:**
- Thêm ngữ cảnh dự án trong `openspec/config.yaml`
- Thêm quy tắc cho từng thành phần để có hướng dẫn cụ thể
- Cung cấp chi tiết hơn trong mô tả thay đổi của bạn
- Sử dụng `/opsx:continue` thay vì `/opsx:ff` để có nhiều quyền kiểm soát hơn

---

## Bước tiếp theo

- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và khi nào sử dụng từng lệnh
- [CLI](cli.md) - Các lệnh terminal để quản lý và xác thực
- [Tùy chỉnh](customization.md) - Tạo schema và quy trình làm việc tùy chỉnh