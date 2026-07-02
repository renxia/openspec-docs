# Bắt Đầu

Hướng dẫn này giải thích cách OpenSpec hoạt động sau khi bạn đã cài đặt và khởi tạo nó. Để biết hướng dẫn cài đặt, hãy xem [main README](../index.md#quick-start) hoặc [Installation guide](installation.md). Mới làm quen với bộ tài liệu này? [Trang chủ tài liệu](index.md) cung cấp cái nhìn tổng quan về mọi thứ.

> **Tôi gõ các lệnh này ở đâu?** Có hai nơi, và nhầm lẫn chúng là lỗi phổ biến nhất khi mới bắt đầu.
>
> - Các lệnh `openspec ...` (như `openspec init`) chạy trong **terminal**.
> - Các lệnh `/opsx:...` (như `/opsx:propose`) chạy trong **trò chuyện của trợ lý AI**, hộp tương tự nơi bạn yêu cầu nó viết code.
>
> Không có "chế độ tương tác" riêng để bắt đầu. Bạn chỉ cần gõ lệnh dấu gạch chéo trong cuộc trò chuyện và trợ lý của bạn sẽ tiếp tục từ đó. Giải thích đầy đủ: [How Commands Work](how-commands-work.md).

## Năm Phút Đầu Tiên Của Bạn

Toàn bộ vòng lặp, với mỗi bước được đánh dấu nơi nó diễn ra:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (tùy chọn: suy nghĩ trước)
AI CHAT      /opsx:propose add-dark-mode      (AI phác thảo kế hoạch; bạn xem xét nó)
AI CHAT      /opsx:apply                      (AI xây dựng nó)
AI CHAT      /opsx:archive                    (các đặc tả đã được cập nhật, thay đổi được lưu trữ)
```

Hai bước terminal để thiết lập, sau đó bạn làm việc trong chat. Phần còn lại của hướng dẫn này sẽ giải thích chi tiết từng bước thực hiện gì và những gì bạn sẽ thấy.

> **Chưa biết xây dựng cái gì? Hãy bắt đầu với `/opsx:explore`.** Đây là một đối tác tư duy không rủi ro, nó đọc codebase của bạn, cân nhắc các lựa chọn và biến một ý tưởng mơ hồ thành một kế hoạch cụ thể, tất cả trước khi bất kỳ sản phẩm hoặc code nào tồn tại. Khi bức tranh đã rõ ràng, nó chuyển giao cho `/opsx:propose`. Đây là thói quen tốt nhất để làm việc với AI mà nếu không có nó sẽ tự tin xây dựng sai thứ. Xem [Explore guide](explore.md).

## Cách Hoạt Động

OpenSpec giúp bạn và trợ lý lập trình AI của mình thống nhất về những gì cần xây dựng trước khi bất kỳ code nào được viết.

**Lộ trình nhanh mặc định (hồ sơ cốt lõi):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (tùy chọn)
```

Bắt đầu bằng `/opsx:explore` khi bạn đang tìm hiểu xem cần làm gì, hoặc nhảy thẳng đến `/opsx:propose` khi bạn đã biết. Explore nằm trong hồ sơ mặc định, vì vậy nó luôn có sẵn khi bạn muốn sử dụng.

**Lộ trình mở rộng (chọn quy trình tùy chỉnh):**

```text
/opsx:new ──► /opsx:ff hoặc /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Hồ sơ toàn cục mặc định là `core`, bao gồm `propose`, `explore`, `apply`, `sync` và `archive`. Bạn có thể bật các lệnh quy trình mở rộng bằng `openspec config profile` và sau đó là `openspec update`.

## OpenSpec Tạo Ra Gì

Sau khi chạy `openspec init`, dự án của bạn có cấu trúc này:

```
openspec/
├── specs/              # Nguồn sự thật (hành vi hệ thống của bạn)
│   └── <domain>/
│       └── spec.md
├── changes/            # Các cập nhật được đề xuất (một thư mục cho mỗi thay đổi)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Delta specs (những gì đang thay đổi)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Cấu hình dự án (tùy chọn)
```

**Hai thư mục chính:**

- **`specs/`** - Nguồn sự thật. Các đặc tả này mô tả cách hệ thống của bạn hoạt động hiện tại. Được tổ chức theo miền (ví dụ: `specs/auth/`, `specs/payments/`).

- **`changes/`** - Các sửa đổi được đề xuất. Mỗi thay đổi có một thư mục riêng với tất cả các tài sản liên quan. Khi một thay đổi hoàn thành, các đặc tả của nó sẽ hợp nhất vào thư mục `specs/` chính.

## Hiểu Về Tài Sản (Artifacts)

Mỗi thư mục thay đổi chứa các tài sản hướng dẫn công việc:

| Tài Sản | Mục Đích |
|----------|---------|
| `proposal.md` | "Tại sao" và "cái gì" - ghi lại ý định, phạm vi và cách tiếp cận |
| `specs/` | Delta specs hiển thị các yêu cầu ĐƯỢC THÊM/ĐƯỢC SỬA ĐỔI/BỊ XÓA |
| `design.md` | "Làm thế nào" - phương pháp kỹ thuật và quyết định kiến trúc |
| `tasks.md` | Danh sách kiểm tra triển khai với các hộp đánh dấu |

**Các tài sản xây dựng lẫn nhau:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            cập nhật khi bạn học hỏi
```

Bạn luôn có thể quay lại và tinh chỉnh các tài sản trước đó khi bạn tìm hiểu thêm trong quá trình triển khai.

## Delta Specs Hoạt Động Như Thế Nào

Delta specs là khái niệm quan trọng trong OpenSpec. Chúng cho biết những gì đang thay đổi so với các đặc tả hiện tại của bạn.

### Định Dạng

Delta specs sử dụng các phần để chỉ ra loại thay đổi:

```markdown
# Delta cho Auth

## Yêu Cầu ĐƯỢC THÊM

### Yêu cầu: Xác thực hai yếu tố
Hệ thống PHẢI yêu cầu một yếu tố thứ hai trong quá trình đăng nhập.

#### Kịch bản: OTP được yêu cầu
- CHO một người dùng đã bật 2FA
- KHI người dùng gửi thông tin xác thực hợp lệ
- THÌ sẽ hiển thị thử thách OTP

## Yêu Cầu ĐƯỢC SỬA ĐỔI

### Yêu cầu: Hết hạn phiên
Hệ thống NÊN hết hạn các phiên sau 30 phút không hoạt động.
(Trước đây: 60 phút)

#### Kịch bản: Hết thời gian chờ nhàn rỗi
- CHO một phiên đã được xác thực
- KHI 30 phút trôi qua mà không có hoạt động nào
- THÌ phiên đó sẽ bị vô hiệu hóa

## Yêu Cầu BỊ XÓA

### Yêu cầu: Ghi nhớ tôi
(Đã lỗi thời thay thế bằng 2FA)
```

### Điều Gì Xảy Ra Khi Lưu Trữ (Archive)

Khi bạn lưu trữ một thay đổi:

1. Các yêu cầu **ADDED** được thêm vào đặc tả chính
2. Các yêu cầu **MODIFIED** thay thế phiên bản hiện có
3. Các yêu cầu **REMOVED** bị xóa khỏi đặc tả chính

Thư mục thay đổi được chuyển đến `openspec/changes/archive/` để lưu trữ lịch sử kiểm toán.

## Ví Dụ: Thay Đổi Đầu Tiên Của Bạn

Hãy cùng xem qua việc thêm chế độ tối (dark mode) vào một ứng dụng.

### 1. Bắt Đầu Thay Đổi (Mặc Định)

```text
Bạn: /opsx:propose add-dark-mode

AI:  Đã tạo openspec/changes/add-dark-mode/
     ✓ proposal.md — lý do chúng ta làm điều này, những gì đang thay đổi
     ✓ specs/       — các yêu cầu và kịch bản
     ✓ design.md    — phương pháp kỹ thuật
     ✓ tasks.md     — danh sách kiểm tra triển khai
     Sẵn sàng để triển khai!
```

Nếu bạn đã bật hồ sơ quy trình mở rộng, bạn cũng có thể thực hiện điều này trong hai bước: `/opsx:new` sau đó `/opsx:ff` (hoặc `/opsx:continue` tăng dần).

### 2. Những Gì Được Tạo Ra

**proposal.md** - Ghi lại ý định:

```markdown
# Proposal: Thêm Chế Độ Tối

## Ý Định
Người dùng đã yêu cầu tùy chọn chế độ tối để giảm mỏi mắt
trong quá trình sử dụng ban đêm.

## Phạm Vi
- Thêm nút chuyển đổi chủ đề trong cài đặt
- Hỗ trợ phát hiện sở thích hệ thống
- Lưu trữ sở thích trong localStorage

## Cách Tiếp Cận
Sử dụng các thuộc tính tùy chỉnh CSS cho việc tạo chủ đề với một ngữ cảnh React
cho quản lý trạng thái.
```

**specs/ui/spec.md** - Delta hiển thị các yêu cầu mới:

```markdown
# Delta cho UI

## Yêu Cầu ĐƯỢC THÊM

### Yêu cầu: Chọn Chủ Đề
Hệ thống NÊN cho phép người dùng chọn giữa chủ đề sáng và tối.

#### Kịch bản: Chuyển đổi thủ công
- CHO một người dùng trên bất kỳ trang nào
- KHI người dùng nhấp vào nút chuyển đổi chủ đề
- THÌ chủ đề sẽ thay đổi ngay lập tức
- VÀ sở thích được duy trì qua các phiên

#### Kịch bản: Sở thích hệ thống
- CHO một người dùng không có sở thích đã lưu
- KHI ứng dụng tải
- THÌ sơ đồ màu sắc ưu tiên của hệ thống sẽ được sử dụng
```

**tasks.md** - Danh sách kiểm tra triển khai:

```markdown
# Tasks

## 1. Cơ Sở Hạ Tầng Chủ Đề
- [ ] 1.1 Tạo ThemeContext với trạng thái sáng/tối
- [ ] 1.2 Thêm các thuộc tính tùy chỉnh CSS cho màu sắc
- [ ] 1.3 Triển khai lưu trữ localStorage

## 2. Thành Phần UI
- [ ] 2.1 Tạo thành phần ThemeToggle
- [ ] 2.2 Thêm nút chuyển đổi vào trang cài đặt
- [ ] 2.3 Cập nhật Header để bao gồm nút chuyển đổi nhanh

## 3. Định Dạng
- [ ] 3.1 Xác định bảng màu chủ đề tối
- [ ] 3.2 Cập nhật các thành phần để sử dụng biến CSS
```

### 3. Triển Khai

```
Bạn: /opsx:apply

AI:  Đang xử lý các tác vụ...
     ✓ 1.1 Đã tạo ThemeContext với trạng thái sáng/tối
     ✓ 1.2 Đã thêm các thuộc tính tùy chỉnh CSS vào globals.css
     ✓ 1.3 Đã triển khai lưu trữ localStorage
     ✓ 2.1 Đã tạo thành phần ThemeToggle
     ...
     Tất cả các tác vụ đã hoàn thành!
```

Trong quá trình triển khai, nếu bạn phát hiện ra thiết kế cần điều chỉnh, chỉ cần cập nhật tài sản và tiếp tục.

### 4. Lưu Trữ (Archive)

```
Bạn: /opsx:archive

AI:  Đang lưu trữ add-dark-mode...
     ✓ Đã hợp nhất các đặc tả vào openspec/specs/ui/spec.md
     ✓ Đã di chuyển đến openspec/changes/archive/2025-01-24-add-dark-mode/
     Hoàn thành! Sẵn sàng cho tính năng tiếp theo.
```

Delta specs của bạn giờ đã là một phần của các đặc tả chính, ghi lại cách hệ thống của bạn hoạt động.

## Xác Minh và Xem Xét

Sử dụng CLI để kiểm tra các thay đổi của bạn:

```bash
# Liệt kê các thay đổi đang hoạt động
openspec list

# Xem chi tiết thay đổi
openspec show add-dark-mode

# Xác thực định dạng đặc tả
openspec validate add-dark-mode

# Bảng điều khiển tương tác
openspec view
```

## Các Bước Tiếp Theo

- [Explore First](explore.md) - Sử dụng `/opsx:explore` để suy nghĩ về một ý tưởng trước khi bạn cam kết
- [Using OpenSpec in an Existing Project](existing-projects.md) - Bắt đầu với codebase brownfield lớn
- [Editing & Iterating on a Change](editing-changes.md) - Cập nhật tài sản, quay lại, hòa giải các chỉnh sửa thủ công
- [Core Concepts at a Glance](overview.md) - Toàn bộ mô hình tư duy trên một trang
- [Examples & Recipes](examples.md) - Các thay đổi thực tế, từ đầu đến cuối
- [Workflows](workflows.md) - Các mẫu phổ biến và khi nào nên sử dụng từng lệnh
- [Commands](commands.md) - Tài liệu tham khảo đầy đủ cho tất cả các lệnh dấu gạch chéo
- [Concepts](concepts.md) - Hiểu sâu hơn về specs, changes và schemas
- [Customization](customization.md) - Làm cho OpenSpec phù hợp với bạn
- [Stores](stores-beta/user-guide.md) - Lập kế hoạch trải rộng qua các repo hoặc nhóm? Hãy giữ nó trong repo riêng (beta)
- [FAQ](faq.md) và [Troubleshooting](troubleshooting.md) - Khi bạn gặp khó khăn