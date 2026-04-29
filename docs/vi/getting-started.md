# Bắt đầu

Hướng dẫn này giải thích cách OpenSpec hoạt động sau khi bạn đã cài đặt và khởi tạo nó. Để biết hướng dẫn cài đặt, xem [README chính](index.md#quick-start).

## Cách thức hoạt động

OpenSpec giúp bạn và trợ lý lập trình AI của bạn thống nhất về những gì cần xây dựng trước khi viết bất kỳ mã nào.

**Đường dẫn nhanh mặc định (hồ sơ cốt lõi):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

**Đường dẫn mở rộng (lựa chọn quy trình tùy chỉnh):**

```text
/opsx:new ──► /opsx:ff hoặc /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Hồ sơ toàn cục mặc định là `core`, bao gồm `propose`, `explore`, `apply` và `archive`. Bạn có thể kích hoạt các lệnh quy trình mở rộng bằng `openspec config profile` và sau đó `openspec update`.

## Những gì OpenSpec tạo ra

Sau khi chạy `openspec init`, dự án của bạn có cấu trúc sau:

```
openspec/
├── specs/              # Nguồn thông tin chính (hành vi của hệ thống của bạn)
│   └── <domain>/
│       └── spec.md
├── changes/            # Các cập nhật được đề xuất (mỗi thay đổi một thư mục)
│   └── <change-name>/
│       ├── proposal.md
│       ├── design.md
│       ├── tasks.md
│       └── specs/      # Các spec delta (những gì đang thay đổi)
│           └── <domain>/
│               └── spec.md
└── config.yaml         # Cấu hình dự án (tùy chọn)
```

**Hai thư mục chính:**

- **`specs/`** - Nguồn thông tin chính. Các spec này mô tả cách hệ thống của bạn hiện đang hoạt động. Được tổ chức theo lĩnh vực (ví dụ: `specs/auth/`, `specs/payments/`).

- **`changes/`** - Các sửa đổi được đề xuất. Mỗi thay đổi có thư mục riêng với tất cả các sản phẩm liên quan. Khi một thay đổi hoàn thành, các spec của nó sẽ được hợp nhất vào thư mục `specs/` chính.

## Hiểu về các sản phẩm

Mỗi thư mục thay đổi chứa các sản phẩm hướng dẫn công việc:

| Sản phẩm | Mục đích |
|----------|----------|
| `proposal.md` | "Tại sao" và "cái gì" - nắm bắt ý định, phạm vi và cách tiếp cận |
| `specs/` | Các spec delta hiển thị các yêu cầu ĐÃ THÊM/SỬA ĐỔI/XÓA |
| `design.md` | "Như thế nào" - cách tiếp cận kỹ thuật và quyết định kiến trúc |
| `tasks.md` | Danh sách kiểm tra triển khai với các ô đánh dấu |

**Các sản phẩm được xây dựng dựa trên nhau:**

```
proposal ──► specs ──► design ──► tasks ──► implement
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            cập nhật khi bạn học được
```

Bạn luôn có thể quay lại và tinh chỉnh các sản phẩm trước đó khi bạn học được nhiều hơn trong quá trình triển khai.

## Cách thức hoạt động của Delta Specs

Delta specs là khái niệm chính trong OpenSpec. Chúng hiển thị những gì đang thay đổi so với các spec hiện tại của bạn.

### Định dạng

Delta specs sử dụng các phần để chỉ ra loại thay đổi:

```markdown
# Delta cho Auth

## Các yêu cầu ĐÃ THÊM

### Yêu cầu: Xác thực hai yếu tố
Hệ thống BẮT BUỘC yêu cầu yếu tố thứ hai trong quá trình đăng nhập.

#### Kịch bản: Yêu cầu OTP
- CHO MỘT người dùng có 2FA được bật
- KHI người dùng gửi thông tin xác thực hợp lệ
- THÌ một thách thức OTP được trình bày

## Các yêu cầu ĐÃ SỬA ĐỔI

### Yêu cầu: Hết hạn phiên
Hệ thống SẼ hết hạn các phiên sau 30 phút không hoạt động.
(Trước đây: 60 phút)

#### Kịch bản: Hết hạn do nhàn rỗi
- CHO MỘT phiên đã xác thực
- KHI 30 phút trôi qua mà không có hoạt động
- THÌ phiên bị vô hiệu hóa

## Các yêu cầu ĐÃ XÓA

### Yêu cầu: Ghi nhớ đăng nhập
(Đã lỗi thời để ủng hộ 2FA)
```

### Điều gì xảy ra khi Lưu trữ

Khi bạn lưu trữ một thay đổi:

1. Các yêu cầu **ĐÃ THÊM** được thêm vào spec chính
2. Các yêu cầu **ĐÃ SỬA ĐỔI** thay thế phiên bản hiện có
3. Các yêu cầu **ĐÃ XÓA** bị xóa khỏi spec chính

Thư mục thay đổi được chuyển đến `openspec/changes/archive/` để lưu trữ lịch sử kiểm tra.

## Ví dụ: Thay đổi đầu tiên của bạn

Hãy cùng thực hiện việc thêm chế độ tối vào một ứng dụng.

### 1. Bắt đầu thay đổi (Mặc định)

```text
Bạn: /opsx:propose add-dark-mode

AI:  Đã tạo openspec/changes/add-dark-mode/
     ✓ proposal.md — tại sao chúng ta làm điều này, những gì đang thay đổi
     ✓ specs/       — các yêu cầu và kịch bản
     ✓ design.md    — cách tiếp cận kỹ thuật
     ✓ tasks.md     — danh sách kiểm tra triển khai
     Sẵn sàng để triển khai!
```

Nếu bạn đã kích hoạt hồ sơ quy trình mở rộng, bạn cũng có thể thực hiện điều này thành hai bước: `/opsx:new` sau đó `/opsx:ff` (hoặc `/opsx:continue` theo từng bước).

### 2. Những gì được tạo ra

**proposal.md** - Nắm bắt ý định:

```markdown# Đề xuất: Thêm Chế độ Tối

## Ý định
Người dùng đã yêu cầu tùy chọn chế độ tối để giảm mỏi mắt
trong quá trình sử dụng vào ban đêm.

## Phạm vi
- Thêm nút chuyển đổi chủ đề trong cài đặt
- Hỗ trợ phát hiện tùy chọn hệ thống
- Lưu trữ tùy chọn trong localStorage

## Cách tiếp cận
Sử dụng các thuộc tính CSS tùy chỉnh để tạo chủ đề với React context
để quản lý trạng thái.
```

**specs/ui/spec.md** - Delta hiển thị các yêu cầu mới:

```markdown# Delta cho UI

## Các yêu cầu ĐÃ THÊM

### Yêu cầu: Lựa chọn Chủ đề
Hệ thống SẼ cho phép người dùng chọn giữa các chủ đề sáng và tối.

#### Kịch bản: Chuyển đổi thủ công
- CHO MỘT người dùng ở bất kỳ trang nào
- KHI người dùng nhấp vào nút chuyển đổi chủ đề
- THÌ chủ đề chuyển đổi ngay lập tức
- VÀ tùy chọn được lưu trữ qua các phiên

#### Kịch bản: Tùy chọn hệ thống
- CHO MỘT người dùng không có tùy chọn đã lưu
- KHI ứng dụng tải
- THÌ tùy chọn màu sắc ưa thích của hệ thống được sử dụng
```

**tasks.md** - Danh sách kiểm tra triển khai:

```markdown# Nhiệm vụ

## 1. Cơ sở hạ tầng Chủ đề
- [ ] 1.1 Tạo ThemeContext với trạng thái sáng/tối
- [ ] 1.2 Thêm các thuộc tính CSS tùy chỉnh cho màu sắc
- [ ] 1.3 Triển khai lưu trữ localStorage

## 2. Các thành phần Giao diện
- [ ] 2.1 Tạo thành phần ThemeToggle
- [ ] 2.2 Thêm nút chuyển đổi vào trang cài đặt
- [ ] 2.3 Cập nhật Header để bao gồm nút chuyển đổi nhanh

## 3. Định dạng
- [ ] 3.1 Định nghĩa bảng màu chủ đề tối
- [ ] 3.2 Cập nhật các thành phần để sử dụng biến CSS
```

### 3. Triển khai

```
Bạn: /opsx:apply

AI:  Đang thực hiện các nhiệm vụ...
     ✓ 1.1 Đã tạo ThemeContext với trạng thái sáng/tối
     ✓ 1.2 Đã thêm các thuộc tính CSS tùy chỉnh vào globals.css
     ✓ 1.3 Đã triển khai lưu trữ localStorage
     ✓ 2.1 Đã tạo thành phần ThemeToggle
     ...
     Tất cả các nhiệm vụ đã hoàn thành!
```

Trong quá trình triển khai, nếu bạn phát hiện thiết kế cần điều chỉnh, chỉ cần cập nhật sản phẩm và tiếp tục.

### 4. Lưu trữ

```
Bạn: /opsx:archive

AI:  Đang lưu trữ add-dark-mode...
     ✓ Đã hợp nhất các spec vào openspec/specs/ui/spec.md
     ✓ Đã chuyển đến openspec/changes/archive/2025-01-24-add-dark-mode/
     Hoàn tất! Sẵn sàng cho tính năng tiếp theo.
```

Các delta spec của bạn bây giờ là một phần của các spec chính, ghi lại cách hệ thống của bạn hoạt động.

## Kiểm tra và Đánh giá

Sử dụng CLI để kiểm tra các thay đổi của bạn:

```bash
# Liệt kê các thay đổi đang hoạt động
openspec list

# Xem chi tiết thay đổi
openspec show add-dark-mode

# Xác thực định dạng spec
openspec validate add-dark-mode

# Bảng điều khiển tương tác
openspec view
``

## Bước tiếp theo

- [Quy trình](workflows.md) - Các mẫu phổ biến và khi nào sử dụng từng lệnh
- [Lệnh](commands.md) - Tham khảo đầy đủ cho tất cả các lệnh slash
- [Khái niệm](concepts.md) - Hiểu sâu hơn về các spec, thay đổi và schema
- [Tùy chỉnh](customization.md) - Tùy chỉnh OpenSpec theo cách của bạn