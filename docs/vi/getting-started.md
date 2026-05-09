# Bắt Đầu

Hướng dẫn này giải thích cách OpenSpec hoạt động sau khi bạn đã cài đặt và khởi tạo nó. Để biết hướng dẫn cài đặt, hãy xem [README chính](index.md#quick-start).

## Cách Hoạt Động

OpenSpec giúp bạn và trợ lý lập trình AI của bạn thống nhất về những gì cần xây dựng trước khi bất kỳ mã nào được viết.

**Lộ trình nhanh mặc định (profile core):**

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

**Lộ trình mở rộng (lựa chọn quy trình làm việc tùy chỉnh):**

```text
/opsx:new ──► /opsx:ff hoặc /opsx:continue ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

Profile toàn cục mặc định là `core`, bao gồm `propose`, `explore`, `apply`, `sync` và `archive`. Bạn có thể bật các lệnh quy trình làm việc mở rộng với `openspec config profile` và sau đó là `openspec update`.

## OpenSpec Tạo Ra Gì

Sau khi chạy `openspec init`, dự án của bạn có cấu trúc như sau:

```
openspec/
├── specs/              # Nguồn chân lý (hành vi của hệ thống bạn)
│   └── <domain>/
│       └── spec.md
├── changes/            # Các cập nhật được đề xuất (mỗi thay đổi một thư mục)
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

- **`specs/`** - Nguồn chân lý. Các spec này mô tả cách hệ thống của bạn hiện đang hoạt động. Được tổ chức theo domain (ví dụ: `specs/auth/`, `specs/payments/`).

- **`changes/`** - Các sửa đổi được đề xuất. Mỗi thay đổi có thư mục riêng với tất cả các tác phẩm liên quan. Khi một thay đổi hoàn tất, các spec của nó được hợp nhất vào thư mục `specs/` chính.

## Hiểu Các Tác Phẩm (Artifacts)

Mỗi thư mục thay đổi chứa các tác phẩm hướng dẫn công việc:

| Tác phẩm | Mục đích |
|----------|---------|
| `proposal.md` | "Tại sao" và "cái gì" - ghi lại ý định, phạm vi và cách tiếp cận |
| `specs/` | Delta specs hiển thị các yêu cầu ĐÃ THÊM/ĐÃ SỬA ĐỔI/ĐÃ XÓA |
| `design.md` | "Như thế nào" - cách tiếp cận kỹ thuật và quyết định kiến trúc |
| `tasks.md` | Danh sách kiểm tra triển khai với các ô đánh dấu |

**Các tác phẩm được xây dựng dựa trên nhau:**

```
proposal ──► specs ──► design ──► tasks ──► triển khai
   ▲           ▲          ▲                    │
   └───────────┴──────────┴────────────────────┘
            cập nhật khi bạn học được thêm
```

Bạn luôn có thể quay lại và tinh chỉnh các tác phẩm trước đó khi bạn học được thêm trong quá trình triển khai.

## Cách Delta Specs Hoạt Động

Delta specs là khái niệm chính trong OpenSpec. Chúng cho thấy những gì đang thay đổi so với các spec hiện tại của bạn.

### Định Dạng

Delta specs sử dụng các phần để chỉ loại thay đổi:

```markdown
# Delta cho Auth

## Các Yêu Cầu ĐÃ THÊM

### Yêu cầu: Xác thực Hai Yếu Tố
Hệ thống PHẢI yêu cầu một yếu tố thứ hai trong quá trình đăng nhập.

#### Kịch bản: Yêu cầu OTP
- CHO một người dùng đã bật 2FA
- KHI người dùng gửi thông tin xác thực hợp lệ
- THÌ một thử thách OTP được hiển thị

## Các Yêu Cầu ĐÃ SỬA ĐỔI

### Yêu cầu: Thời Gian Phiên Hết Hạn
Hệ thống SẼ hết hạn phiên sau 30 phút không hoạt động.
(Trước đây: 60 phút)

#### Kịch bản: Thời gian chờ không hoạt động
- CHO một phiên đã xác thực
- KHI 30 phút trôi qua mà không có hoạt động
- THÌ phiên bị vô hiệu hóa

## Các Yêu Cầu ĐÃ XÓA

### Yêu cầu: Ghi Nhớ Đăng Nhập
(Đã ngừng sử dụng để ưu tiên 2FA)
```

### Điều Gì Xảy Ra Khi Lưu Trữ (Archive)

Khi bạn lưu trữ một thay đổi:

1. Các yêu cầu **ĐÃ THÊM** được thêm vào spec chính
2. Các yêu cầu **ĐÃ SỬA ĐỔI** thay thế phiên bản hiện có
3. Các yêu cầu **ĐÃ XÓA** bị xóa khỏi spec chính

Thư mục thay đổi được chuyển đến `openspec/changes/archive/` để lưu lại lịch sử kiểm toán.

## Ví Dụ: Thay Đổi Đầu Tiên Của Bạn

Hãy cùng thực hiện việc thêm chế độ tối vào một ứng dụng.

### 1. Bắt Đầu Thay Đổi (Mặc Định)

```text
Bạn: /opsx:propose add-dark-mode

AI:  Đã tạo openspec/changes/add-dark-mode/
     ✓ proposal.md — tại sao chúng ta làm điều này, những gì đang thay đổi
     ✓ specs/       — các yêu cầu và kịch bản
     ✓ design.md    — cách tiếp cận kỹ thuật
     ✓ tasks.md     — danh sách kiểm tra triển khai
     Sẵn sàng để triển khai!
```

Nếu bạn đã bật profile quy trình làm việc mở rộng, bạn cũng có thể thực hiện điều này thành hai bước: `/opsx:new` rồi `/opsx:ff` (hoặc `/opsx:continue` theo từng bước).

### 2. Những Gì Được Tạo Ra

**proposal.md** - Ghi lại ý định:

```markdown
# Đề xuất: Thêm Chế Độ Tối

## Ý định
Người dùng đã yêu cầu tùy chọn chế độ tối để giảm mỏi mắt
khi sử dụng vào ban đêm.

## Phạm vi
- Thêm công tắc chuyển đổi giao diện trong cài đặt
- Hỗ trợ phát hiện tùy chọn hệ thống
- Lưu tùy chọn vào localStorage

## Cách tiếp cận
Sử dụng thuộc tính CSS tùy chỉnh cho giao diện với React context
để quản lý trạng thái.
```

**specs/ui/spec.md** - Delta hiển thị các yêu cầu mới:

```markdown
# Delta cho UI

## Các Yêu Cầu ĐÃ THÊM

### Yêu cầu: Lựa Chọn Giao Diện
Hệ thống SẼ cho phép người dùng chọn giữa giao diện sáng và tối.

#### Kịch bản: Chuyển đổi thủ công
- CHO một người dùng trên bất kỳ trang nào
- KHI người dùng nhấp vào công tắc chuyển đổi giao diện
- THÌ giao diện chuyển đổi ngay lập tức
- VÀ tùy chọn được lưu giữa các phiên

#### Kịch bản: Tùy chọn hệ thống
- CHO một người dùng không có tùy chọn đã lưu
- KHI ứng dụng tải
- THÌ sơ đồ màu ưa thích của hệ thống được sử dụng
```

**tasks.md** - Danh sách kiểm tra triển khai:

```markdown
# Các Công Việc

## 1. Cơ Sở Hạ Tầng Giao Diện
- [ ] 1.1 Tạo ThemeContext với trạng thái sáng/tối
- [ ] 1.2 Thêm thuộc tính CSS tùy chỉnh cho màu sắc
- [ ] 1.3 Triển khai lưu trữ localStorage

## 2. Các Thành Phần Giao Diện
- [ ] 2.1 Tạo thành phần ThemeToggle
- [ ] 2.2 Thêm công tắc vào trang cài đặt
- [ ] 2.3 Cập nhật Header để bao gồm công tắc nhanh

## 3. Kiểu Dáng
- [ ] 3.1 Xác định bảng màu giao diện tối
- [ ] 3.2 Cập nhật các thành phần để sử dụng biến CSS
```

### 3. Triển Khai

```
Bạn: /opsx:apply

AI:  Đang thực hiện các công việc...
     ✓ 1.1 Đã tạo ThemeContext với trạng thái sáng/tối
     ✓ 1.2 Đã thêm thuộc tính CSS tùy chỉnh vào globals.css
     ✓ 1.3 Đã triển khai lưu trữ localStorage
     ✓ 2.1 Đã tạo thành phần ThemeToggle
     ...
     Tất cả công việc đã hoàn tất!
```

Trong quá trình triển khai, nếu bạn phát hiện thiết kế cần điều chỉnh, chỉ cần cập nhật tác phẩm và tiếp tục.

### 4. Lưu Trữ

```
Bạn: /opsx:archive

AI:  Đang lưu trữ add-dark-mode...
     ✓ Đã hợp nhất specs vào openspec/specs/ui/spec.md
     ✓ Đã chuyển đến openspec/changes/archive/2025-01-24-add-dark-mode/
     Xong! Sẵn sàng cho tính năng tiếp theo.
```

Các delta specs của bạn bây giờ là một phần của spec chính, ghi lại cách hệ thống của bạn hoạt động.

## Xác Minh và Đánh Giá

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
```

## Các Bước Tiếp Theo

- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và khi nào sử dụng mỗi lệnh
- [Các lệnh](commands.md) - Tham chiếu đầy đủ cho tất cả các lệnh slash
- [Các khái niệm](concepts.md) - Hiểu sâu hơn về specs, thay đổi và lược đồ
- [Tùy chỉnh](customization.md) - Làm cho OpenSpec hoạt động theo cách của bạn