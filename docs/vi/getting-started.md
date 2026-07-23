# Bắt đầu sử dụng

Hướng dẫn này giải thích cách hoạt động của OpenSpec sau khi bạn đã cài đặt và khởi tạo nó. Để xem hướng dẫn cài đặt, hãy tham khảo [README chính](../index.md#quick-start) hoặc [Hướng dẫn cài đặt](installation.md). Bạn mới làm quen với toàn bộ bộ tài liệu? [Trang chủ tài liệu](index.md) sẽ giúp bạn định vị tất cả nội dung.

> **Bạn nhập các lệnh này ở đâu?** Có hai nơi, và nhầm lẫn giữa hai nơi này là lỗi phổ biến nhất khi mới bắt đầu.
>
> - Các lệnh `openspec ...` (như `openspec init`) chạy trên **terminal** của bạn.
> - Các lệnh `/opsx:...` (như `/opsx:propose`) chạy trên **khung chat của trợ lý AI**, chính là nơi bạn thường yêu cầu AI viết mã.
>
> Không có chế độ "tương tác riêng" nào cần khởi động. Bạn chỉ cần nhập lệnh slash vào chat, trợ lý AI của bạn sẽ xử lý phần còn lại. Giải thích đầy đủ: [Cách hoạt động của lệnh](how-commands-work.md).

## Năm phút đầu tiên của bạn

Toàn bộ quy trình, với mỗi bước được ghi rõ nơi thực hiện:

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project && openspec init
AI CHAT      /opsx:explore                    (tùy chọn: suy nghĩ kỹ trước khi thực hiện)
AI CHAT      /opsx:propose add-dark-mode      (AI soạn thảo kế hoạch; bạn xem xét lại)
AI CHAT      /opsx:apply                      (AI xây dựng tính năng)
AI CHAT      /opsx:archive                    (cập nhật specs, lưu trữ thay đổi)
```

Hai bước trên terminal để thiết lập, sau đó bạn sẽ làm việc chủ yếu trên chat. Phần còn lại của hướng dẫn này sẽ giải thích chi tiết chức năng của từng bước và những gì bạn sẽ thấy.

> **Chưa chắc chắn nên xây dựng gì? Hãy bắt đầu với `/opsx:explore`.** Đây là một đối tác suy nghĩ không rủi ro, đọc mã nguồn của bạn, cân nhắc các lựa chọn và biến ý tưởng mơ hồ thành kế hoạch cụ thể, tất cả trước khi bất kỳ tài liệu hay mã nào được tạo ra. Khi bức tranh đã rõ ràng, nó sẽ chuyển sang `/opsx:propose`. Đây là thói quen tốt nhất khi làm việc với AI, nếu không AI sẽ tự tin xây dựng ra thứ không đúng yêu cầu. Xem thêm [Hướng dẫn khám phá](explore.md).

## Cách hoạt động

OpenSpec giúp bạn và trợ lý lập trình AI của bạn thống nhất những gì cần xây dựng trước khi viết bất kỳ dòng mã nào.

**Đường dẫn nhanh mặc định (hồ sơ cốt lõi):**

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
   (tùy chọn)
```

Bắt đầu với `/opsx:explore` khi bạn đang tìm ra việc cần làm, hoặc nhảy thẳng đến `/opsx:propose` khi bạn đã biết rõ yêu cầu. Explore có trong hồ sơ mặc định, nên luôn sẵn sàng khi bạn cần.

**Đường dẫn mở rộng (lựa chọn quy trình làm việc tùy chỉnh):**

```text
/opsx:new ──► /opsx:ff hoặc /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Hồ sơ toàn cục mặc định là `core`, bao gồm các lệnh `propose`, `explore`, `apply`, `sync` và `archive`. Bạn có thể kích hoạt các lệnh quy trình làm việc mở rộng bằng lệnh `openspec config profile` sau đó chạy `openspec update`.

## Những gì OpenSpec tạo ra

Sau khi chạy lệnh `openspec init`, dự án của bạn sẽ có cấu trúc như sau:

```
openspec/
├── specs/              # Nguồn dữ liệu chính xác (hành vi của hệ thống bạn)
│   └── <domain>/
│       └── spec.md
├── changes/            # Các bản cập nhật đề xuất (mỗi thay đổi có một thư mục riêng)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Specs delta (những gì đang thay đổi)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Cấu hình dự án (tùy chọn)
```

**Hai thư mục chính:**

- **`specs/`** - Nguồn dữ liệu chính xác. Các specs này mô tả cách hệ thống của bạn hoạt động hiện tại. Được tổ chức theo lĩnh vực (ví dụ: `specs/auth/`, `specs/payments/`).
- **`changes/`** - Các sửa đổi đề xuất. Mỗi thay đổi sẽ có thư mục riêng chứa tất cả tài liệu liên quan. Khi một thay đổi hoàn thành, các specs của nó sẽ được hợp nhất vào thư mục `specs/` chính.

## Hiểu về các tài liệu liên quan

Mỗi thư mục thay đổi chứa các tài liệu liên quan hướng dẫn quá trình thực hiện:

| Tài liệu liên quan | Mục đích |
|----------|---------|
| `proposal.md` | "Tại sao" và "làm gì" - ghi lại mục tiêu, phạm vi và phương pháp tiếp cận |
| `specs/` | Specs delta hiển thị các yêu cầu ĐƯỢC THÊM / ĐƯỢC SỬA ĐỔI / ĐƯỢC XÓA |
| `design.md` | "Làm thế nào" - phương pháp tiếp cận kỹ thuật và các quyết định kiến trúc |
| `tasks.md` | Danh sách kiểm tra triển khai có các hộp kiểm |

**Các tài liệu liên quan được xây dựng dựa trên lẫn nhau:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            cập nhật khi bạn tìm hiểu thêm
```

Bạn luôn có thể quay lại và tinh chỉnh các tài liệu liên quan trước đó khi tìm hiểu thêm trong quá trình triển khai.

## Cách hoạt động của Specs Delta

Specs delta là khái niệm cốt lõi trong OpenSpec. Chúng hiển thị những gì đang thay đổi so với specs hiện tại của bạn.

### Định dạng

Specs delta sử dụng các phần để chỉ định loại thay đổi:

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
Hệ thống PHẢI yêu cầu yếu tố thứ hai trong quá trình đăng nhập.

#### Scenario: OTP required
- GIVEN một người dùng đã bật 2FA
- WHEN người dùng gửi thông tin đăng nhập hợp lệ
- THEN thử thách OTP sẽ được hiển thị

## MODIFIED Requirements

### Requirement: Session Timeout
Hệ thống SHALL hết hạn phiên đăng nhập sau 30 phút không hoạt động.
(Trước đây: 60 phút)

#### Scenario: Idle timeout
- GIVEN một phiên đăng nhập đã được xác thực
- WHEN 30 phút trôi qua mà không có hoạt động nào
- THEN phiên đăng nhập bị vô hiệu hóa

## REMOVED Requirements

### Requirement: Remember Me
(Đã ngừng sử dụng, thay thế bằng xác thực hai yếu tố)
```

### Điều gì xảy ra khi lưu trữ (archive)

Khi bạn lưu trữ một thay đổi:
1. Các yêu cầu **ĐƯỢC THÊM** được thêm vào cuối spec chính
2. Các yêu cầu **ĐƯỢC SỬA ĐỔI** thay thế phiên bản hiện tại
3. Các yêu cầu **ĐƯỢC XÓA** bị xóa khỏi spec chính

Thư mục thay đổi sẽ được di chuyển đến `openspec/changes/archive/` để lưu trữ lịch sử kiểm toán.

## Ví dụ: Thay đổi đầu tiên của bạn

Chúng ta hãy cùng thực hiện thêm chế độ tối cho một ứng dụng.

### 1. Bắt đầu thay đổi (mặc định)

```text
Bạn: /opsx:propose add-dark-mode

AI:  Đã tạo openspec/changes/add-dark-mode/
     ✓ proposal.md — lý do thực hiện, những gì thay đổi
     ✓ specs/       — yêu cầu và kịch bản
     ✓ design.md    — phương pháp tiếp cận kỹ thuật
     ✓ tasks.md     — danh sách kiểm tra triển khai
     Sẵn sàng để triển khai!
```

Nếu bạn đã kích hoạt hồ sơ quy trình làm việc mở rộng, bạn cũng có thể thực hiện thay đổi này qua hai bước: chạy `/opsx:new` trước, sau đó chạy `/opsx:ff` (hoặc `/opsx:continue` để thực hiện từng bước).

### 2. Những gì được tạo ra

**proposal.md** - Ghi lại mục tiêu của thay đổi:

```markdown
# Proposal: Add Dark Mode

## Intent
Người dùng đã yêu cầu thêm tùy chọn chế độ tối để giảm mỏi mắt
khi sử dụng vào ban đêm.

## Scope
- Thêm nút chuyển đổi chủ đề trong phần cài đặt
- Hỗ trợ phát hiện tùy chọn giao diện của hệ thống
- Lưu trữ tùy chọn trong localStorage

## Approach
Sử dụng CSS custom properties cho chủ đề giao diện, kết hợp với React context
để quản lý trạng thái.
```

**specs/ui/spec.md** - Specs delta hiển thị các yêu cầu mới:

```markdown
# Delta for UI

## ADDED Requirements

### Requirement: Theme Selection
Hệ thống SHALL cho phép người dùng lựa chọn giữa chủ đề sáng và tối.

#### Scenario: Manual toggle
- GIVEN người dùng đang ở bất kỳ trang nào
- WHEN người dùng nhấp vào nút chuyển đổi chủ đề
- THEN chủ đề sẽ chuyển đổi ngay lập tức
- AND tùy chọn được lưu lại giữa các phiên sử dụng

#### Scenario: System preference
- GIVEN người dùng không có tùy chọn đã lưu nào
- WHEN ứng dụng được tải
- THEN bảng màu ưa thích của hệ thống được sử dụng
```

**tasks.md** - Danh sách kiểm tra triển khai:

```markdown
# Tasks

## 1. Hạ tầng chủ đề
- [ ] 1.1 Tạo ThemeContext với trạng thái sáng/tối
- [ ] 1.2 Thêm CSS custom properties cho màu sắc
- [ ] 1.3 Triển khai lưu trữ lâu dài trong localStorage

## 2. Thành phần giao diện
- [ ] 2.1 Tạo thành phần ThemeToggle
- [ ] 2.2 Thêm nút chuyển đổi vào trang cài đặt
- [ ] 2.3 Cập nhật Header để thêm nút chuyển đổi nhanh

## 3. Định dạng giao diện
- [ ] 3.1 Xác định bảng màu chủ đề tối
- [ ] 3.2 Cập nhật các thành phần để sử dụng CSS variables
```

### 3. Triển khai

```
Bạn: /opsx:apply

AI:  Đang thực hiện các nhiệm vụ...
     ✓ 1.1 Đã tạo ThemeContext với trạng thái sáng/tối
     ✓ 1.2 Đã thêm CSS custom properties vào globals.css
     ✓ 1.3 Đã triển khai lưu trữ lâu dài trong localStorage
     ✓ 2.1 Đã tạo thành phần ThemeToggle
     ...
     Tất cả nhiệm vụ đã hoàn thành!
```

Trong quá trình triển khai, nếu bạn phát hiện thiết kế cần điều chỉnh, chỉ cần cập nhật tài liệu liên quan và tiếp tục.

### 4. Lưu trữ

```
Bạn: /opsx:archive

AI:  Đang lưu trữ add-dark-mode...
     ✓ Đã hợp nhất specs vào openspec/specs/ui/spec.md
     ✓ Đã di chuyển đến openspec/changes/archive/2025-01-24-add-dark-mode/
     Hoàn thành! Sẵn sàng cho tính năng tiếp theo.
```

Các specs delta của bạn hiện là một phần của specs chính, ghi lại cách hoạt động của hệ thống bạn.

## Kiểm tra và xem xét

Sử dụng CLI để kiểm tra các thay đổi của bạn:

```bash
# Liệt kê các thay đổi đang hoạt động
openspec list

# Xem chi tiết thay đổi
openspec show add-dark-mode

# Kiểm tra định dạng spec
openspec validate add-dark-mode

# Bảng điều khiển tương tác
openspec view
```

## Các bước tiếp theo

- [Khám phá trước](explore.md) - Sử dụng `/opsx:explore` để suy nghĩ kỹ ý tưởng trước khi cam kết thực hiện
- [Xem xét thay đổi](reviewing-changes.md) - Những điểm cần kiểm tra trong kế hoạch do AI soạn thảo, trước khi viết bất kỳ mã nào
- [Viết specs chất lượng](writing-specs.md) - Mẫu yêu cầu và kịch bản tốt trông như thế nào
- [Sử dụng OpenSpec trong dự án hiện có](existing-projects.md) - Bắt đầu với mã nguồn lớn thuộc dự án brownfield
- [Chỉnh sửa và lặp lại thay đổi](editing-changes.md) - Cập nhật tài liệu liên quan, quay lại các bước trước, đối chiếu các chỉnh sửa thủ công
- [Các khái niệm cốt lõi tổng quan](overview.md) - Toàn bộ mô hình tư duy trên một trang
- [Ví dụ và mẫu thực tế](examples.md) - Các thay đổi thực tế, từ đầu đến cuối
- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và thời điểm sử dụng từng lệnh
- [Lệnh](commands.md) - Tài liệu tham khảo đầy đủ cho tất cả lệnh slash
- [Khái niệm](concepts.md) - Hiểu sâu hơn về specs, thay đổi và schemas
- [Tùy chỉnh](customization.md) - Điều chỉnh OpenSpec phù hợp với nhu cầu của bạn
- [Stores](stores-beta/user-guide.md) - Kế hoạch trải rộng qua nhiều repos hoặc nhóm? Lưu trữ chúng trong repo riêng (beta)
- [Câu hỏi thường gặp](faq.md) và [Xử lý sự cố](troubleshooting.md) - Khi bạn gặp khó khăn