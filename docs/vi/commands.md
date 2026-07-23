# Các lệnh

Đây là tài liệu tham khảo cho các lệnh gạch chéo của OpenSpec. Các lệnh này được gọi trong giao diện chat của trợ lý lập trình AI của bạn (ví dụ: Claude Code, Cursor, Windsurf).

Để xem các mẫu quy trình làm việc và thời điểm sử dụng từng lệnh, hãy xem [Quy trình làm việc](workflows.md). Đối với các lệnh CLI, hãy xem [CLI](cli.md).

## Tài liệu tham khảo nhanh

### Đường dẫn nhanh mặc định (hồ sơ `core`)

| Lệnh | Mục đích |
|---------|---------|
| `/opsx:propose` | Tạo một thay đổi và tạo toàn bộ tài liệu kế hoạch trong một bước |
| `/opsx:explore` | Cân nhắc các ý tưởng trước khi cam kết thực hiện một thay đổi |
| `/opsx:apply` | Thực hiện các tác vụ từ thay đổi |
| `/opsx:update` | Chỉnh sửa các tài liệu kế hoạch của thay đổi và đảm bảo tính nhất quán giữa chúng |
| `/opsx:sync` | Gộp các đặc tả delta vào các đặc tả chính |
| `/opsx:archive` | Lưu trữ một thay đổi đã hoàn thành |

### Các lệnh quy trình làm việc mở rộng (lựa chọn quy trình làm việc tùy chỉnh)

| Lệnh | Mục đích |
|---------|---------|
| `/opsx:new` | Bắt đầu khung sườn cho một thay đổi mới |
| `/opsx:continue` | Tạo tài liệu kế hoạch tiếp theo dựa trên các phụ thuộc |
| `/opsx:ff` | Fast-forward: tạo toàn bộ tài liệu kế hoạch cùng lúc |
| `/opsx:verify` | Xác thực rằng phần triển khai khớp với các tài liệu kế hoạch |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi cùng lúc |
| `/opsx:onboard` | Hướng dẫn từng bước toàn bộ quy trình làm việc |

Hồ sơ toàn cục mặc định là `core`. Để kích hoạt các lệnh quy trình làm việc mở rộng, hãy chạy lệnh `openspec config profile`, chọn các quy trình làm việc, sau đó chạy lệnh `openspec update` trong dự án của bạn.

## Tài liệu tham khảo lệnh

### `/opsx:propose`

Tạo một thay đổi mới và tạo toàn bộ tài liệu kế hoạch trong một bước. Đây là lệnh bắt đầu mặc định trong hồ sơ `core`.

**Cú pháp:**
```text
/opsx:propose [change-name-or-description]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name-or-description` | Không | Tên theo định dạng kebab-case hoặc mô tả thay đổi bằng ngôn ngữ tự nhiên |

**Chức năng:**
- Tạo thư mục `openspec/changes/<change-name>/`
- Tạo các tài liệu cần thiết trước khi triển khai (đối với quy trình `spec-driven`: proposal, specs, design, tasks)
- Dừng lại khi thay đổi đã sẵn sàng để chạy lệnh `/opsx:apply`

**Ví dụ:**
```text
Bạn: /opsx:propose add-dark-mode

AI:  Đã tạo openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Sẵn sàng để triển khai. Chạy /opsx:apply để bắt đầu.
```

**Mẹo:**
- Sử dụng lệnh này để có lộ trình từ đầu đến cuối nhanh nhất
- Nếu bạn muốn kiểm soát từng tài liệu từng bước, hãy bật quy trình làm việc mở rộng và sử dụng `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Bắt đầu ở đây nếu bạn chưa chắc chắn.** Explore là một đối tác suy nghĩ không rủi ro: lệnh này đọc mã nguồn của bạn, so sánh các lựa chọn và làm rõ ý tưởng mơ hồ thành kế hoạch cụ thể trước khi bất kỳ thay đổi nào được tạo. Lệnh này có sẵn trong hồ sơ mặc định. Để xem toàn bộ trường hợp và ví dụ khác, hãy tham khảo hướng dẫn [Khám phá trước](explore.md).

Suy nghĩ về các ý tưởng, điều tra vấn đề và làm rõ yêu cầu trước khi cam kết thực hiện một thay đổi.

**Cú pháp:**
```
/opsx:explore [topic]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `topic` | Không | Chủ đề bạn muốn khám phá hoặc điều tra |

**Chức năng:**
- Mở một cuộc trò chuyện khám phá không yêu cầu cấu trúc cố định
- Điều tra mã nguồn để trả lời các câu hỏi
- So sánh các lựa chọn và phương pháp tiếp cận
- Tạo sơ đồ trực quan để làm rõ suy nghĩ
- Có thể chuyển sang lệnh `/opsx:propose` (mặc định) hoặc `/opsx:new` (quy trình làm việc mở rộng) khi các hiểu biết trở nên rõ ràng

**Ví dụ:**
```text
Bạn: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

Bạn: Chúng ta nên xử lý xác thực như thế nào cho ứng dụng di động?

AI:  Để tôi điều tra cấu hình xác thực hiện tại của bạn...
     [Phân tích mã nguồn]

     Tôi thấy bạn đang sử dụng xác thực dựa trên phiên cho ứng dụng web.
     Đối với ứng dụng di động, chúng ta có ba lựa chọn chính:

     1. Token JWT (không trạng thái, hoạt động ngoại tuyến)
     2. OAuth2 (nếu bạn cần đăng nhập bên thứ ba)
     3. Mở rộng phiên hiện tại (đơn giản hơn, nhưng yêu cầu kết nối mạng)

     API của bạn đã được cấu hình CORS. Bạn quan tâm đến hướng nào?

Bạn: Chúng ta chọn JWT nhé. Chúng ta có thể bắt đầu tạo thay đổi cho vấn đề này không?

AI:  Tôi đã sẵn sàng. Chạy lệnh /opsx:propose add-jwt-auth để bắt đầu.
```

**Mẹo:**
- Sử dụng khi yêu cầu chưa rõ ràng hoặc bạn cần điều tra
- Không có tài liệu nào được tạo trong quá trình khám phá
- Phù hợp để so sánh nhiều phương pháp tiếp cận trước khi đưa ra quyết định
- Có thể đọc tệp và tìm kiếm trong mã nguồn

---

### `/opsx:new`

Bắt đầu khung thay đổi mới. Tạo thư mục thay đổi và chờ bạn tạo các tài liệu bằng lệnh `/opsx:continue` hoặc `/opsx:ff`. Lệnh này thuộc bộ quy trình làm việc mở rộng (không bao gồm trong hồ sơ `core` mặc định).

**Cú pháp:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Tên cho thư mục thay đổi (sẽ được hỏi nếu bạn không cung cấp) |
| `--schema` | Không | Schema quy trình làm việc cần sử dụng (mặc định: lấy từ tệp cấu hình hoặc `spec-driven`) |

**Chức năng:**
- Tạo thư mục `openspec/changes/<change-name>/`
- Tạo tệp siêu dữ liệu `.openspec.yaml` trong thư mục thay đổi
- Hiển thị mẫu tài liệu đầu tiên sẵn sàng để tạo
- Yêu cầu nhập tên thay đổi và schema nếu bạn không cung cấp

**Những gì lệnh này tạo ra:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Siêu dữ liệu thay đổi (schema, ngày tạo)
```

**Ví dụ:**
```
Bạn: /opsx:new add-dark-mode

AI:  Đã tạo openspec/changes/add-dark-mode/
     Schema: spec-driven

     Sẵn sàng để tạo: proposal
     Sử dụng /opsx:continue để tạo tài liệu này, hoặc /opsx:ff để tạo toàn bộ tài liệu.
```

**Mẹo:**
- Sử dụng tên mang tính mô tả: `add-feature`, `fix-bug`, `refactor-module`
- Tránh các tên chung chung như `update`, `changes`, `wip`
- Schema cũng có thể được cấu hình trong tệp cấu hình dự án (`openspec/config.yaml`)

---

### `/opsx:continue`

Tạo tài liệu tiếp theo trong chuỗi phụ thuộc. Tạo từng tài liệu một để tiến độ từng bước.

**Cú pháp:**
```
/opsx:continue [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi cần tiếp tục (sẽ được suy luận từ ngữ cảnh nếu bạn không cung cấp) |

**Chức năng:**
- Truy vấn đồ thị phụ thuộc giữa các tài liệu
- Hiển thị các tài liệu đã sẵn sàng và các tài liệu bị chặn
- Tạo tài liệu sẵn sàng đầu tiên
- Đọc các tệp phụ thuộc để lấy ngữ cảnh
- Hiển thị những tài liệu nào sẽ sẵn sàng sau khi tạo xong

**Ví dụ:**
```
Bạn: /opsx:continue

AI:  Thay đổi: add-dark-mode

     Trạng thái tài liệu:
     ✓ proposal    (hoàn thành)
     ◆ specs       (sẵn sàng)
     ◆ design      (sẵn sàng)
     ○ tasks       (bị chặn - cần: specs)

     Đang tạo specs...

     [Đọc proposal.md, tạo specs dựa trên yêu cầu]

     ✓ Đã tạo openspec/changes/add-dark-mode/specs/ui/spec.md

     Hiện đã sẵn sàng: tasks
     Chạy /opsx:continue để tạo tài liệu tiếp theo.
```

**Mẹo:**
- Sử dụng khi bạn muốn xem xét từng tài liệu trước khi tiếp tục
- Phù hợp với các thay đổi phức tạp mà bạn muốn kiểm soát từng bước
- Nhiều tài liệu có thể trở nên sẵn sàng cùng lúc
- Bạn có thể chỉnh sửa các tài liệu đã tạo trước khi tiếp tục

---

### `/opsx:ff`

Chuyển nhanh qua quá trình tạo tài liệu. Tạo toàn bộ tài liệu kế hoạch cùng lúc.

**Cú pháp:**
```
/opsx:ff [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi cần chuyển nhanh (sẽ được suy luận từ ngữ cảnh nếu bạn không cung cấp) |

**Chức năng:**
- Tạo toàn bộ tài liệu theo thứ tự phụ thuộc
- Theo dõi tiến độ thông qua danh sách việc cần làm
- Dừng lại khi tất cả tài liệu yêu cầu `apply-required` đã hoàn thành
- Đọc từng tệp phụ thuộc trước khi tạo tài liệu tiếp theo

**Ví dụ:**
```
Bạn: /opsx:ff add-dark-mode

AI:  Đang chuyển nhanh thay đổi add-dark-mode...

     ✓ Đang tạo proposal.md
     ✓ Đang tạo specs/ui/spec.md
     ✓ Đang tạo design.md
     ✓ Đang tạo tasks.md

     Đã hoàn thành toàn bộ tài liệu kế hoạch!
     Sẵn sàng để triển khai. Chạy /opsx:apply để bắt đầu.
```

**Mẹo:**
- Sử dụng khi bạn đã có bức tranh rõ ràng về những gì mình đang xây dựng
- Nhanh hơn `/opsx:continue` đối với các thay đổi đơn giản
- Bạn vẫn có thể chỉnh sửa các tài liệu sau khi tạo xong
- Phù hợp với các tính năng nhỏ đến trung bình

---

### `/opsx:apply`

Triển khai các nhiệm vụ từ thay đổi. Thực hiện theo danh sách nhiệm vụ, viết mã và đánh dấu hoàn thành từng mục.

**Cú pháp:**
```
/opsx:apply [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi cần triển khai (sẽ được suy luận từ ngữ cảnh nếu bạn không cung cấp) |

**Chức năng:**
- Đọc tệp `tasks.md` và xác định các nhiệm vụ chưa hoàn thành
- Thực hiện từng nhiệm vụ một
- Viết mã, tạo tệp, chạy kiểm thử khi cần thiết
- Đánh dấu nhiệm vụ hoàn thành bằng hộp kiểm `[x]`

**Ví dụ:**
```
Bạn: /opsx:apply

AI:  Đang triển khai thay đổi add-dark-mode...

     Đang đọc tasks.md:
     - [ ] 1.1 Tạo ThemeContext
     - [ ] 1.2 Thêm thuộc tính CSS tùy chỉnh
     - [ ] 1.3 Triển khai lưu trữ localStorage

     Đang thực hiện 1.1: Tạo ThemeContext...
     [Tạo src/context/ThemeContext.tsx]

     ✓ 1.1 Hoàn thành

     Đang thực hiện 1.2: Thêm thuộc tính CSS tùy chỉnh...
     [Cập nhật src/styles/globals.css]

     ✓ 1.2 Hoàn thành
     ...
```

**Mẹo:**
- Có thể tiếp tục từ vị trí dừng lại nếu bị gián đoạn
- Sử dụng cho các thay đổi song song bằng cách chỉ định tên thay đổi
- Trạng thái hoàn thành được theo dõi thông qua hộp kiểm trong tệp `tasks.md`

---

### `/opsx:update`

Chỉnh sửa các tài liệu kế hoạch hiện có của một thay đổi và đảm bảo chúng nhất quán với nhau. Chỉ tác động đến tài liệu kế hoạch - lệnh này không bao giờ chỉnh sửa mã nguồn.

**Cú pháp:**
```text
/opsx:update [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi cần cập nhật (sẽ được suy luận từ ngữ cảnh nếu bạn không cung cấp) |

**Chức năng:**
- Đọc các tài liệu của thay đổi thông qua lệnh `openspec status --change <name> --json`
- Áp dụng yêu cầu chỉnh sửa của bạn, hoặc xem xét các tài liệu để tìm mâu thuẫn nếu bạn không chỉ định yêu cầu chỉnh sửa
- Điều chỉnh các tài liệu hiện có khác theo mọi hướng (việc chỉnh sửa thiết kế có thể ảnh hưởng ngược lại đến proposal)
- Xác nhận từng chỉnh sửa với bạn trước khi ghi, từng tài liệu một
- Kết thúc bằng việc đề xuất bước tiếp theo: `/opsx:continue` (thiếu tài liệu), `/opsx:apply` (triển khai kế hoạch đã chỉnh sửa vào mã nguồn), hoặc `/opsx:archive` (đã hoàn thành)

**Ví dụ:**
```text
Bạn: /opsx:update add-dark-mode - chúng ta lưu trữ chủ đề bằng cookie bây giờ, không dùng localStorage nữa

AI:  Đang đọc các tài liệu của thay đổi add-dark-mode...

     Thiết kế có tham chiếu đến localStorage ở hai vị trí; nhiệm vụ 1.3 bao gồm lưu trữ localStorage; proposal không đề cập đến lưu trữ.

     Các chỉnh sửa đề xuất:
     1. design.md - thay thế quyết định sử dụng localStorage bằng lưu trữ cookie
     2. tasks.md - đổi nội dung nhiệm vụ 1.3 thành lưu trữ cookie

     Áp dụng chỉnh sửa số 1? (design.md)
```

**Mẹo:**
- Lệnh này không tạo tài liệu bị thiếu - đó là chức năng của `/opsx:continue`
- Nếu thay đổi đã được triển khai, hãy chạy `/opsx:apply` tiếp theo để mã nguồn khớp với kế hoạch đã chỉnh sửa
- Nếu chỉnh sửa của bạn thay đổi *mục đích* của thay đổi, hãy bắt đầu lại với một thay đổi mới (xem hướng dẫn [Khi nào nên cập nhật thay vì bắt đầu lại](opsx.md#when-to-update-vs-start-fresh))

---

### `/opsx:verify`

Xác thực rằng phần triển khai khớp với các tài liệu thay đổi của bạn. Kiểm tra tính đầy đủ, tính chính xác và tính nhất quán.

**Cú pháp:**
```
/opsx:verify [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi cần xác thực (sẽ được suy luận từ ngữ cảnh nếu bạn không cung cấp) |

**Chức năng:**
- Kiểm tra ba khía cạnh chất lượng phần triển khai
- Tìm kiếm trong mã nguồn để tìm bằng chứng triển khai
- Báo cáo các vấn đề được phân loại là CRITICAL, WARNING hoặc SUGGESTION
- Không chặn quá trình lưu trữ, nhưng sẽ hiển thị các vấn đề phát sinh

**Các khía cạnh xác thực:**

| Khía cạnh | Nội dung kiểm tra |
|-----------|-------------------|
| **Completeness** | Tất cả nhiệm vụ đã hoàn thành, tất cả yêu cầu đã được triển khai, các kịch bản đã được bao phủ |
| **Correctness** | Phần triển khai khớp với mục đích của spec, các trường hợp biên đã được xử lý |
| **Coherence** | Các quyết định thiết kế được phản ánh trong mã nguồn, các mẫu thiết kế nhất quán |

**Ví dụ:**
```
Bạn: /opsx:verify

AI:  Đang xác thực thay đổi add-dark-mode...

     COMPLETENESS
     ✓ Tất cả 8 nhiệm vụ trong tasks.md đã được đánh dấu hoàn thành
     ✓ Tất cả yêu cầu trong specs đều có mã nguồn tương ứng
     ⚠ Kịch bản "Phát hiện tùy chọn hệ thống" không có bài kiểm tra bao phủ

     CORRECTNESS
     ✓ Phần triển khai khớp với mục đích của spec
     ✓ Các trường hợp biên từ kịch bản đã được xử lý
     ✓ Trạng thái lỗi khớp với định nghĩa trong spec

     COHERENCE
     ✓ Các quyết định thiết kế được phản ánh trong cấu trúc mã nguồn
     ✓ Quy ước đặt tên nhất quán với design.md
     ⚠ Thiết kế đề cập đến "CSS variables" nhưng phần triển khai sử dụng các lớp Tailwind

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Mẹo:**
- Chạy lệnh này trước khi lưu trữ để phát hiện sự không khớp sớm
- Các cảnh báo không chặn quá trình lưu trữ nhưng chỉ ra các vấn đề tiềm ẩn
- Phù hợp để xem xét công việc của AI trước khi cam kết
- Có thể phát hiện sự lệch giữa các tài liệu và phần triển khai

---

### `/opsx:sync`

**Lệnh tùy chọn.** Gộp các delta specs từ một thay đổi vào spec chính. Lệnh lưu trữ sẽ nhắc bạn đồng bộ nếu cần, vì vậy bạn thường không cần chạy lệnh này thủ công.

**Cú pháp:**
```
/opsx:sync [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi cần đồng bộ (sẽ được suy luận từ ngữ cảnh nếu bạn không cung cấp) |

**Chức năng:**
- Đọc các delta specs từ thư mục thay đổi
- Phân tích các phần ADDED/MODIFIED/REMOVED/RENAMED
- Gộp các thay đổi vào thư mục spec chính `openspec/specs/`
- Giữ nguyên nội dung hiện có không được đề cập trong delta
- Không lưu trữ thay đổi (thay đổi vẫn giữ trạng thái hoạt động)

**Ví dụ:**
```text
Bạn: /opsx:sync

AI:  Đang đồng bộ các delta specs của thay đổi add-dark-mode...

     Đang đọc: openspec/changes/add-dark-mode/specs/ui/spec.md
     Đích:  openspec/specs/ui/spec.md

     Các thay đổi cần áp dụng:
     ✓ ADDED: Yêu cầu Lựa chọn chủ đề (2 kịch bản)
     ✓ ADDED: Yêu cầu Khả năng truy cập (1 kịch bản)

     Đang gộp...
     ✓ Đã cập nhật openspec/specs/ui/spec.md

     Thay đổi vẫn giữ trạng thái hoạt động. Chạy /opsx:archive khi bạn sẵn sàng hoàn thành.
```

**Khi nào nên sử dụng thủ công:**

| Tình huống | Cần đồng bộ? |
|-----------|-----------|
| Thay đổi chạy lâu dài, muốn có spec trong thư mục chính trước khi lưu trữ | Có |
| Nhiều thay đổi song song cần các spec cơ sở đã cập nhật | Có |
| Muốn xem trước/xem xét quá trình gộp riêng biệt | Có |
| Thay đổi nhanh, đi thẳng đến lưu trữ | Không (lệnh lưu trữ sẽ xử lý) |

**Mẹo:**
- Đồng bộ hoạt động thông minh, không chỉ sao chép dán đơn thuần
- Có thể thêm kịch bản vào các yêu cầu hiện có mà không gây trùng lặp
- Thay đổi vẫn giữ trạng thái hoạt động sau khi đồng bộ (không được lưu trữ)
- Hầu hết người dùng không bao giờ cần gọi lệnh này trực tiếp - lệnh lưu trữ sẽ nhắc bạn nếu cần

---

### `/opsx:archive`

Lưu trữ một thay đổi đã hoàn thành. Hoàn tất thay đổi và di chuyển nó vào thư mục lưu trữ.

**Cú pháp:**
```
/opsx:archive [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi cần lưu trữ (sẽ được suy luận từ ngữ cảnh nếu bạn không cung cấp) |

**Chức năng:**
- Kiểm tra trạng thái hoàn thành của các tài liệu
- Kiểm tra trạng thái hoàn thành nhiệm vụ (cảnh báo nếu chưa hoàn thành)
- Đề xuất đồng bộ delta specs nếu chưa được đồng bộ trước đó
- Di chuyển thư mục thay đổi vào `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Giữ nguyên toàn bộ tài liệu để theo dõi kiểm toán

**Ví dụ:**
```text
Bạn: /opsx:archive

AI:  Đang lưu trữ thay đổi add-dark-mode...

     Trạng thái tài liệu:
     ✓ proposal.md tồn tại
     ✓ specs/ tồn tại
     ✓ design.md tồn tại
     ✓ tasks.md tồn tại (hoàn thành 8/8 nhiệm vụ)

     Delta specs: Chưa đồng bộ
     → Đồng bộ ngay bây giờ? (đề xuất)

Bạn: Có

AI:  ✓ Đã đồng bộ spec vào openspec/specs/ui/spec.md
     ✓ Đã di chuyển vào openspec/changes/archive/2025-01-24-add-dark-mode/

     Đã lưu trữ thay đổi thành công.
```

**Mẹo:**
- Lệnh lưu trữ không chặn quá trình nếu có nhiệm vụ chưa hoàn thành, nhưng sẽ đưa ra cảnh báo
- Delta specs có thể được đồng bộ trong quá trình lưu trữ hoặc trước đó
- Các thay đổi đã lưu trữ được giữ lại để theo dõi lịch sử
- Sử dụng `/opsx:verify` trước để phát hiện các vấn đề

---

### `/opsx:bulk-archive`

Lưu trữ nhiều thay đổi đã hoàn thành cùng lúc. Xử lý các xung đột spec giữa các thay đổi.

**Cú pháp:**
```
/opsx:bulk-archive [change-names...]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-names` | Không | Các thay đổi cụ thể cần lưu trữ (sẽ nhắc bạn chọn nếu không cung cấp) |

**Chức năng:**
- Liệt kê tất cả các thay đổi đã hoàn thành
- Xác thực từng thay đổi trước khi lưu trữ
- Phát hiện các xung đột spec giữa các thay đổi
- Giải quyết xung đột bằng cách kiểm tra những gì đã được triển khai thực tế
- Lưu trữ theo thứ tự thời gian

**Ví dụ:**
```
Bạn: /opsx:bulk-archive

AI:  Tìm thấy 3 thay đổi đã hoàn thành:
     - add-dark-mode (hoàn thành 8/8 nhiệm vụ)
     - fix-login-bug (hoàn thành 3/3 nhiệm vụ)
     - update-footer (hoàn thành 2/2 nhiệm vụ)

     Đang kiểm tra xung đột spec...
     ⚠ add-dark-mode và update-footer đều tác động đến specs/ui/

     Đang kiểm tra mã nguồn để giải quyết...
     Cả hai thay đổi đều đã được triển khai. Sẽ gộp theo thứ tự thời gian:
     1. add-dark-mode (tạo vào ngày 20 tháng 1)
     2. update-footer (tạo vào ngày 22 tháng 1)

     Lưu trữ cả 3 thay đổi?

Bạn: Có

AI:  ✓ Đã lưu trữ add-dark-mode
     ✓ Đã lưu trữ fix-login-bug
     ✓ Đã lưu trữ update-footer
     Spec đã gộp: add-dark-mode → update-footer
```

**Mẹo:**
- Phù hợp với các luồng công việc song song
- Giải quyết xung đột tự động (kiểm tra mã nguồn)
- Các thay đổi được lưu trữ theo thứ tự tạo
- Nhắc bạn trước khi ghi đè nội dung spec

---

### `/opsx:onboard`

Hướng dẫn làm quen quy trình OpenSpec đầy đủ. Một bài học tương tác sử dụng mã nguồn thực tế của bạn.

**Cú pháp:**
```
/opsx:onboard
```

**Chức năng:**
- Đi qua toàn bộ chu kỳ quy trình làm việc có giải thích từng bước
- Quét mã nguồn của bạn để tìm các cơ hội cải thiện thực tế
- Tạo một thay đổi thực tế với các tài liệu thực
- Triển khai công việc thực tế (các thay đổi nhỏ, an toàn)
- Lưu trữ thay đổi đã hoàn thành
- Giải thích từng bước khi thực hiện

**Các giai đoạn:**
1. Chào mừng và phân tích mã nguồn
2. Tìm kiếm cơ hội cải thiện
3. Tạo thay đổi (`/opsx:new`)
4. Viết proposal
5. Tạo specs
6. Viết design
7. Tạo tasks
8. Triển khai nhiệm vụ (`/opsx:apply`)
9. Xác thực phần triển khai
10. Lưu trữ thay đổi
11. Tóm tắt và các bước tiếp theo

**Ví dụ:**
```
Bạn: /opsx:onboard

AI:  Chào mừng bạn đến với OpenSpec!

     Tôi sẽ hướng dẫn bạn qua toàn bộ quy trình làm việc sử dụng mã nguồn thực tế của bạn.
     Chúng ta sẽ tìm một việc nhỏ để cải thiện, tạo một thay đổi phù hợp cho nó,
     triển khai và lưu trữ nó.

     Để tôi quét mã nguồn của bạn để tìm cơ hội...

     [Phân tích mã nguồn]

     Tôi tìm thấy một số việc chúng ta có thể thực hiện:
     1. Thêm xác thực đầu vào cho form liên hệ
     2. Cải thiện thông báo lỗi trong luồng xác thực
     3. Thêm trạng thái tải cho các nút bất đồng bộ

     Bạn quan tâm đến việc nào? (hoặc đề xuất việc khác)
```

**Mẹo:**
- Phù hợp nhất với người dùng mới đang học quy trình làm việc
- Sử dụng mã nguồn thực tế, không phải ví dụ mô phỏng
- Tạo một thay đổi thực tế mà bạn có thể giữ lại hoặc loại bỏ
- Mất 15-30 phút để hoàn thành

## Cú pháp lệnh theo công cụ AI

Các công cụ AI khác nhau sử dụng cú pháp lệnh hơi khác nhau một chút. Hãy sử dụng định dạng phù hợp với công cụ của bạn:

| Công cụ | Ví dụ cú pháp |
|---------|---------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | Lệnh gọi dựa trên kỹ năng, ví dụ `/openspec-propose`, `/openspec-apply-change` (không tạo file lệnh `opsx-*` được sinh ra) |
| Codex | Lệnh gọi dựa trên kỹ năng từ thư mục `.codex/skills/openspec-*` (không tạo file prompt `opsx-*` được sinh ra) |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi Code | Lệnh gọi dựa trên kỹ năng, ví dụ `/skill:openspec-propose`, `/skill:openspec-apply-change` (không tạo file lệnh `opsx-*` được sinh ra) |
| Trae | `/opsx-propose`, `/opsx-apply` |

Mục đích sử dụng là giống nhau trên tất cả các công cụ, nhưng cách các lệnh được hiển thị có thể khác nhau tùy thuộc vào tích hợp.

> **Lưu ý:** Các lệnh GitHub Copilot (`.github/prompts/*.prompt.md`) chỉ khả dụng trên các tiện ích mở rộng IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI hiện tại không hỗ trợ các file prompt tùy chỉnh — xem [Công cụ được hỗ trợ](supported-tools.md) để biết chi tiết và giải pháp thay thế.

---

## Lệnh cũ

Các lệnh này sử dụng quy trình làm việc cũ "thực hiện tất cả cùng lúc". Chúng vẫn hoạt động được nhưng các lệnh OPSX được khuyến nghị sử dụng.

| Lệnh | Chức năng |
|---------|--------------|
| `/openspec:proposal` | Tạo tất cả các tài liệu cùng lúc (đề xuất, đặc tả, thiết kế, nhiệm vụ) |
| `/openspec:apply` | Triển khai thay đổi |
| `/openspec:archive` | Lưu trữ thay đổi |

**Khi nào sử dụng lệnh cũ:**
- Các dự án hiện có đang sử dụng quy trình làm việc cũ
- Các thay đổi đơn giản mà bạn không cần tạo tài liệu từng bước
- Ưu tiên sử dụng phương pháp làm việc toàn bộ hoặc không làm gì cả

**Di chuyển sang OPSX:**
Các thay đổi cũ có thể tiếp tục thực hiện với các lệnh OPSX. Cấu trúc tài liệu tương thích với phiên bản cũ.

---

## Xử lý sự cố

### "Change not found"

Lệnh không thể xác định thay đổi nào cần thực hiện.

**Giải pháp:**
- Chỉ định rõ tên thay đổi: `/opsx:apply add-dark-mode`
- Kiểm tra xem thư mục thay đổi có tồn tại không: `openspec list`
- Xác nhận bạn đang ở trong thư mục dự án chính xác

### "No artifacts ready"

Tất cả các tài liệu đã hoàn thành hoặc bị chặn do thiếu các phụ thuộc cần thiết.

**Giải pháp:**
- Chạy lệnh `openspec status --change <name>` để xem thứ gì đang chặn
- Kiểm tra xem các tài liệu bắt buộc có tồn tại không
- Tạo các tài liệu phụ thuộc còn thiếu trước

### "Schema not found"

Schema được chỉ định không tồn tại.

**Giải pháp:**
- Liệt kê các schema có sẵn: `openspec schemas`
- Kiểm tra chính tả tên schema
- Tạo schema nếu đó là schema tùy chỉnh: `openspec schema init <name>`

### Commands not recognized

Công cụ AI không nhận ra các lệnh OpenSpec.

**Giải pháp:**
- Đảm bảo OpenSpec đã được khởi tạo: `openspec init`
- Tạo lại các kỹ năng: `openspec update`
- Kiểm tra xem thư mục `.claude/skills/` có tồn tại không (dành cho Claude Code)
- Khởi động lại công cụ AI của bạn để tải các kỹ năng mới

### Artifacts not generating properly

AI tạo ra các tài liệu không đầy đủ hoặc không chính xác.

**Giải pháp:**
- Thêm ngữ cảnh dự án vào file `openspec/config.yaml`
- Thêm quy tắc cho từng loại tài liệu để có hướng dẫn cụ thể
- Cung cấp thêm chi tiết trong mô tả thay đổi của bạn
- Sử dụng `/opsx:continue` thay vì `/opsx:ff` để có nhiều quyền kiểm soát hơn

---

## Các bước tiếp theo

- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và khi nào sử dụng từng lệnh
- [CLI](cli.md) - Các lệnh terminal để quản lý và xác thực
- [Tùy chỉnh](customization.md) - Tạo schema và quy trình làm việc tùy chỉnh