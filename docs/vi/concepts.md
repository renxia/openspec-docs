# Khái niệm

Hướng dẫn này giải thích các ý tưởng cốt lõi đằng sau OpenSpec và cách chúng liên kết với nhau. Để biết cách sử dụng thực tế, hãy xem [Bắt đầu](getting-started.md) và [Quy trình làm việc](workflows.md).

## Triết lý

OpenSpec được xây dựng dựa trên bốn nguyên tắc:

```
fluid not rigid         — no phase gates, work on what makes sense
iterative not waterfall — learn as you build, refine as you go
easy not complex        — lightweight setup, minimal ceremony
brownfield-first        — works with existing codebases, not just greenfield
```

### Tại sao những nguyên tắc này quan trọng

**Fluid not rigid.** Các hệ thống spec truyền thống gò bó bạn vào các giai đoạn: trước tiên bạn lập kế hoạch, sau đó triển khai, rồi hoàn thành. OpenSpec linh hoạt hơn — bạn có thể tạo các sản phẩm (artifacts) theo bất kỳ thứ tự nào có ý nghĩa cho công việc của bạn.

**Iterative not waterfall.** Yêu cầu thay đổi. Sự hiểu biết sâu hơn. Điều có vẻ là một cách tiếp cận tốt lúc đầu có thể không còn phù hợp khi bạn xem xét codebase. OpenSpec đón nhận thực tế này.

**Easy not complex.** Một số khuôn khổ spec yêu cầu thiết lập phức tạp, định dạng cứng nhắc, hoặc quy trình nặng nề. OpenSpec không cản trở bạn. Khởi tạo trong vài giây, bắt đầu làm việc ngay lập tức, tùy chỉnh chỉ khi cần.

**Brownfield-first.** Hầu hết công việc phần mềm không phải là xây dựng từ đầu — mà là sửa đổi các hệ thống hiện có. Cách tiếp cận dựa trên delta của OpenSpec giúp dễ dàng chỉ ra các thay đổi đối với hành vi hiện có, không chỉ mô tả các hệ thống mới.

## Tổng Quan

OpenSpec tổ chức công việc của bạn thành hai khu vực chính:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Nguồn sự thật      │◄─────│  Các sửa đổi được đề xuất     │   │
│   │  Hệ thống của bạn   │ merge│  Mỗi thay đổi = một thư mục  │   │
│   │  hoạt động hiện tại │      │  Chứa các sản phẩm + delta    │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** là nguồn sự thật — chúng mô tả cách hệ thống của bạn hoạt động hiện tại.

**Changes** là các sửa đổi được đề xuất — chúng nằm trong các thư mục riêng biệt cho đến khi bạn sẵn sàng hợp nhất chúng.

Sự tách biệt này là then chốt. Bạn có thể làm việc trên nhiều thay đổi song song mà không bị xung đột. Bạn có thể xem xét một thay đổi trước khi nó ảnh hưởng đến specs chính. Và khi bạn lưu trữ một thay đổi, các delta của nó sẽ hợp nhất một cách sạch sẽ vào nguồn sự thật.

## Specs

Specs mô tả hành vi hệ thống của bạn bằng các yêu cầu và kịch bản có cấu trúc.

### Cấu Trúc

```
openspec/specs/
├── auth/
│   └── spec.md           # Hành vi xác thực
├── payments/
│   └── spec.md           # Xử lý thanh toán
├── notifications/
│   └── spec.md           # Hệ thống thông báo
└── ui/
    └── spec.md           # Hành vi và giao diện UI
```

Tổ chức specs theo lĩnh vực — các nhóm logic có ý nghĩa đối với hệ thống của bạn. Các mẫu phổ biến:

- **Theo khu vực tính năng**: `auth/`, `payments/`, `search/`
- **Theo thành phần**: `api/`, `frontend/`, `workers/`
- **Theo ngữ cảnh giới hạn**: `ordering/`, `fulfillment/`, `inventory/`

### Định Dạng Spec

Một spec chứa các yêu cầu, và mỗi yêu cầu có các kịch bản:

```markdown
# Spec Xác Thực

## Mục Đích
Xác thực và quản lý phiên cho ứng dụng.

## Yêu Cầu

### Yêu cầu: Xác thực Người dùng
Hệ thống PHẢI phát hành token JWT khi đăng nhập thành công.

#### Kịch bản: Thông tin hợp lệ
- KHI người dùng có thông tin hợp lệ
- KHI người dùng gửi biểu mẫu đăng nhập
- THÌ một token JWT được trả về
- VÀ người dùng được chuyển hướng đến trang tổng quan

#### Kịch bản: Thông tin không hợp lệ
- KHI thông tin không hợp lệ
- KHI người dùng gửi biểu mẫu đăng nhập
- THÌ một thông báo lỗi được hiển thị
- VÀ không có token nào được phát hành

### Yêu cầu: Hết Phiên
Hệ thống PHẢI làm hết hạn các phiên sau 30 phút không hoạt động.

#### Kịch bản: Hết thời gian chờ
- KHI có một phiên đã xác thực
- KHI 30 phút trôi qua mà không có hoạt động
- THÌ phiên bị vô hiệu hóa
- VÀ người dùng phải xác thực lại
```

**Các yếu tố chính:**

| Yếu tố | Mục đích |
|---------|---------|
| `## Mục Đích` | Mô tả cấp cao về lĩnh vực của spec này |
| `### Yêu cầu:` | Một hành vi cụ thể mà hệ thống phải có |
| `#### Kịch bản:` | Một ví dụ cụ thể về yêu cầu trong thực tế |
| SHALL/MUST/SHOULD | Các từ khóa RFC 2119 chỉ cường độ yêu cầu |

### Tại Sao Lại Cấu Trúc Specs Theo Cách Này

**Yêu cầu là "cái gì"** — chúng nêu rõ hệ thống nên làm gì mà không chỉ ra cách triển khai.

**Kịch bản là "khi nào"** — chúng cung cấp các ví dụ cụ thể có thể được xác minh. Các kịch bản tốt:
- Có thể kiểm tra được (bạn có thể viết một bài kiểm tra tự động cho chúng)
- Bao gồm cả đường dẫn hạnh phúc và các trường hợp biên
- Sử dụng định dạng có cấu trúc Given/When/Then hoặc tương tự

**Các từ khóa RFC 2119** (SHALL, MUST, SHOULD, MAY) truyền tải ý định:
- **MUST/SHALL** — yêu cầu tuyệt đối
- **SHOULD** — được khuyến nghị, nhưng có ngoại lệ
- **MAY** — tùy chọn

### Spec Là Gì (Và Không Phải Là Gì)

Spec là một **hợp đồng hành vi**, không phải là kế hoạch triển khai.

Nội dung spec tốt:
- Hành vi có thể quan sát được mà người dùng hoặc các hệ thống downstream dựa vào
- Đầu vào, đầu ra và các điều kiện lỗi
- Các ràng buộc bên ngoài (bảo mật, quyền riêng tư, độ tin cậy, tương thích)
- Các kịch bản có thể được kiểm tra hoặc xác nhận rõ ràng

Tránh trong specs:
- Tên lớp/hàm nội bộ
- Lựa chọn thư viện hoặc khuôn khổ
- Chi tiết triển khai từng bước
- Kế hoạch thực hiện chi tiết (những cái đó thuộc về `design.md` hoặc `tasks.md`)

Kiểm tra nhanh:
- Nếu việc triển khai có thể thay đổi mà không thay đổi hành vi hiển thị bên ngoài, thì nó có lẽ không thuộc về spec.

### Giữ Nhẹ Nhàng: Mức Độ Nghiêm Ngặt Tiến Tiến

OpenSpec nhằm tránh sự quan liêu. Sử dụng mức độ nhẹ nhất vẫn làm cho thay đổi có thể xác minh được.

**Spec Lite (mặc định):**
- Các yêu cầu ngắn gọn, ưu tiên hành vi
- Phạm vi và mục tiêu không rõ ràng
- Một vài kiểm tra chấp nhận cụ thể

**Spec đầy đủ (cho rủi ro cao hơn):**
- Thay đổi liên team hoặc liên repo
- Thay đổi API/hợp đồng, di chuyển, các mối quan tâm bảo mật/quyền riêng tư
- Các thay đổi mà sự mơ hồ có thể dẫn đến sửa chữa tốn kém

Hầu hết các thay đổi nên ở chế độ Lite.

### Cộng Tác Con Người + Agent

Trong nhiều nhóm, con người khám phá và agent soạn thảo các sản phẩm. Vòng lặp dự kiến là:

1. Con người cung cấp ý định, ngữ cảnh và ràng buộc.
2. Agent chuyển đổi chúng thành các yêu cầu và kịch bản ưu tiên hành vi.
3. Agent giữ chi tiết triển khai trong `design.md` và `tasks.md`, không phải `spec.md`.
4. Xác nhận xác nhận cấu trúc và sự rõ ràng trước khi triển khai.

Điều này giúp specs dễ đọc cho con người và nhất quán cho các agent.

## Changes

Một change là một sửa đổi được đề xuất cho hệ thống của bạn, được đóng gói thành một thư mục với mọi thứ cần thiết để hiểu và triển khai nó.

### Cấu Trúc Change

```
openspec/changes/add-dark-mode/
├── proposal.md           # Tại sao và cái gì
├── design.md             # Như thế nào (cách tiếp cận kỹ thuật)
├── tasks.md              # Danh sách kiểm tra triển khai
├── .openspec.yaml        # Siêu dữ liệu change (tùy chọn)
└── specs/                # Các delta specs
    └── ui/
        └── spec.md       # Những gì đang thay đổi trong ui/spec.md
```

Mỗi change là tự chứa. Nó có:
- **Sản phẩm** — các tài liệu nắm bắt ý định, thiết kế và các tác vụ
- **Delta specs** — các thông số kỹ thuật cho những gì đang được thêm, sửa đổi hoặc xóa
- **Siêu dữ liệu** — cấu hình tùy chọn cho thay đổi cụ thể này

### Tại Sao Changes Là Các Thư Mục

Đóng gói một change thành một thư mục có nhiều lợi ích:

1. **Mọi thứ ở cùng một nơi.** Đề xuất, thiết kế, tác vụ và specs sống ở một vị trí. Không cần tìm kiếm ở nhiều nơi khác nhau.

2. **Làm việc song song.** Nhiều change có thể tồn tại đồng thời mà không xung đột. Làm việc trên `add-dark-mode` trong khi `fix-auth-bug` cũng đang được thực hiện.

3. **Lịch sử sạch sẽ.** Khi được lưu trữ, các change chuyển đến `changes/archive/` với toàn bộ ngữ cảnh được bảo tồn. Bạn có thể nhìn lại và hiểu không chỉ những gì đã thay đổi, mà còn tại sao.

4. **Dễ xem xét.** Thư mục change rất dễ xem xét — mở nó, đọc đề xuất, kiểm tra thiết kế, xem các delta specs.

## Sản Phẩm

Sản phẩm là các tài liệu trong một change hướng dẫn công việc.

### Luồng Sản Phẩm

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   tại sao        cái gì       như thế nào    các bước
 + phạm vi      thay đổi     cách tiếp cận   cần thực hiện
```

Các sản phẩm xây dựng trên nhau. Mỗi sản phẩm cung cấp ngữ cảnh cho sản phẩm tiếp theo.

### Các Loại Sản Phẩm

#### Đề Xuất (`proposal.md`)

Đề xuất nắm bắt **ý định**, **phạm vi** và **cách tiếp cận** ở cấp độ cao.

```markdown
# Đề Xuất: Thêm Chế Độ Tối

## Ý Định
Người dùng đã yêu cầu tùy chọn chế độ tối để giảm mỏi mắt
khi sử dụng vào ban đêm và phù hợp với tùy chọn hệ thống.

## Phạm Vi
Trong phạm vi:
- Chuyển đổi chủ đề trong cài đặt
- Phát hiện tùy chọn hệ thống
- Lưu tùy chọn trong localStorage

Ngoài phạm vi:
- Các chủ đề màu tùy chỉnh (công việc tương lai)
- Ghi đè chủ đề theo trang

## Cách Tiếp Cận
Sử dụng các thuộc tính CSS tùy chỉnh cho chủ đề với React context
để quản lý trạng thái. Phát hiện tùy chọn hệ thống khi tải lần đầu,
cho phép ghi đè thủ công.
```

**Khi nào cập nhật đề xuất:**
- Phạm vi thay đổi (thu hẹp hoặc mở rộng)
- Ý định được làm rõ (hiểu rõ hơn về vấn đề)
- Cách tiếp cận thay đổi cơ bản

#### Specs (các delta specs trong `specs/`)

Các delta specs mô tả **những gì đang thay đổi** so với specs hiện tại. Xem [Delta Specs](#delta-specs) bên dưới.

#### Thiết Kế (`design.md`)

Thiết kế nắm bắt **cách tiếp cận kỹ thuật** và **các quyết định kiến trúc**.

````markdown
# Thiết Kế: Thêm Chế Độ Tối

## Cách Tiếp Cận Kỹ Thuật
Trạng thái chủ đề được quản lý thông qua React Context để tránh truyền props sâu.
Các thuộc tính CSS tùy chỉnh cho phép chuyển đổi thời gian thực mà không cần chuyển đổi lớp.

## Quyết định Kiến trúc

### Quyết định: Context thay vì Redux
Sử dụng React Context cho trạng thái theme vì:
- Trạng thái nhị phân đơn giản (sáng/tối)
- Không có chuyển đổi trạng thái phức tạp
- Tránh thêm dependency Redux

### Quyết định: CSS Custom Properties
Sử dụng CSS variables thay vì CSS-in-JS vì:
- Hoạt động với stylesheet hiện có
- Không có chi phí runtime
- Giải pháp gốc của trình duyệt

## Luồng Dữ liệu
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## Thay đổi tệp
- `src/contexts/ThemeContext.tsx` (mới)
- `src/components/ThemeToggle.tsx` (mới)
- `src/styles/globals.css` (đã sửa đổi)
````

**Khi nào cần cập nhật thiết kế:**
- Triển khai cho thấy cách tiếp cận không khả thi
- Tìm ra giải pháp tốt hơn
- Phụ thuộc hoặc ràng buộc thay đổi

#### Các nhiệm vụ (`tasks.md`)

Nhiệm vụ là **danh sách kiểm tra triển khai** — các bước cụ thể có ô đánh dấu.

```markdown
# Các nhiệm vụ

## 1. Hạ tầng giao diện
- [ ] 1.1 Tạo ThemeContext với trạng thái light/dark
- [ ] 1.2 Thêm thuộc tính CSS tùy chỉnh cho màu sắc
- [ ] 1.3 Triển khai lưu trữ localStorage
- [ ] 1.4 Thêm phát hiện tùy chọn hệ thống

## 2. Các thành phần giao diện
- [ ] 2.1 Tạo thành phần ThemeToggle
- [ ] 2.2 Thêm nút chuyển đổi vào trang cài đặt
- [ ] 2.3 Cập nhật Header để bao gồm nút chuyển đổi nhanh

## 3. Kiểu dáng
- [ ] 3.1 Định nghĩa bảng màu giao diện tối
- [ ] 3.2 Cập nhật các thành phần để sử dụng biến CSS
- [ ] 3.3 Kiểm tra tỷ lệ tương phản để đảm bảo khả năng truy cập
```

**Các phương pháp hay nhất cho nhiệm vụ:**
- Nhóm các nhiệm vụ liên quan dưới các tiêu đề
- Sử dụng đánh số phân cấp (1.1, 1.2, v.v.)
- Giữ các nhiệm vụ đủ nhỏ để hoàn thành trong một phiên
- Đánh dấu các nhiệm vụ đã hoàn thành

## Delta Specs

Delta specs là khái niệm chính giúp OpenSpec hoạt động hiệu quả cho phát triển trên hệ thống hiện có. Chúng mô tả **điều gì đang thay đổi** thay vì nêu lại toàn bộ spec.

### Định dạng

```markdown
# Delta cho Auth

## YÊU CẦU ĐƯỢC THÊM

### Yêu cầu: Xác thực hai yếu tố
Hệ thống PHẢI hỗ trợ xác thực hai yếu tố dựa trên TOTP.

#### Kịch bản: Đăng ký 2FA
- KHI người dùng chưa bật 2FA
- KHI người dùng bật 2FA trong cài đặt
- THÌ mã QR được hiển thị để thiết lập ứng dụng xác thực
- VÀ người dùng phải xác minh bằng mã trước khi kích hoạt

#### Kịch bản: Đăng nhập 2FA
- KHI người dùng đã bật 2FA
- KHI người dùng gửi thông tin đăng nhập hợp lệ
- THÌ thách thức OTP được hiển thị
- VÀ việc đăng nhập chỉ hoàn tất sau khi nhập OTP hợp lệ

## YÊU CẦU ĐƯỢC SỬA ĐỔI

### Yêu cầu: Hết hạn phiên
Hệ thống PHẢI hết hạn phiên sau 15 phút không hoạt động.
(Trước đây: 30 phút)

#### Kịch bản: Hết thời gian chờ
- KHI có phiên đã xác thực
- KHI 15 phút trôi qua mà không có hoạt động
- THÌ phiên bị vô hiệu hóa

## YÊU CẦU BỊ XÓA

### Yêu cầu: Ghi nhớ đăng nhập
(Đã ngừng sử dụng để ủng hộ 2FA. Người dùng nên xác thực lại mỗi phiên.)
```

### Các phần của Delta

| Phần | Ý nghĩa | Điều gì xảy ra khi lưu trữ |
|------|---------|-----------------------------|
| `## YÊU CẦU ĐƯỢC THÊM` | Hành vi mới | Được thêm vào spec chính |
| `## YÊU CẦU ĐƯỢC SỬA ĐỔI` | Hành vi đã thay đổi | Thay thế yêu cầu hiện có |
| `## YÊU CẦU BỊ XÓA` | Hành vi đã ngừng sử dụng | Bị xóa khỏi spec chính |

### Tại sao dùng Delta thay vì Spec đầy đủ

**Rõ ràng.** Delta cho thấy chính xác điều gì đang thay đổi. Khi đọc một spec đầy đủ, bạn phải tự so sánh nó với phiên bản hiện tại.

**Tránh xung đột.** Hai thay đổi có thể tác động đến cùng một tệp spec mà không xung đột, miễn là chúng sửa đổi các yêu cầu khác nhau.

**Hiệu quả kiểm tra.** Người kiểm tra thấy thay đổi, không phải bối cảnh không thay đổi. Tập trung vào điều quan trọng.

**Phù hợp với hệ thống hiện có.** Hầu hết công việc là sửa đổi hành vi hiện có. Delta biến việc sửa đổi thành yếu tố chính, không phải là suy nghĩ sau.

## Schemas

Schemas định nghĩa các loại sản phẩm và phụ thuộc của chúng cho một quy trình làm việc.

### Schemas hoạt động như thế nào

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Không có phụ thuộc, có thể tạo trước

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Cần proposal trước khi tạo

  - id: design
    generates: design.md
    requires: [proposal]      # Có thể tạo song song với specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Cần cả specs và design trước
```

**Các sản phẩm tạo thành đồ thị phụ thuộc:**

```
                    proposal
                   (nút gốc)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (yêu cầu:                  (yêu cầu:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (yêu cầu:
                specs, design)
```

**Phụ thuộc là yếu tố kích hoạt, không phải cổng.** Chúng cho thấy điều gì có thể được tạo, không phải điều bạn phải tạo tiếp theo. Bạn có thể bỏ qua design nếu không cần. Bạn có thể tạo specs trước hoặc sau design — cả hai đều chỉ phụ thuộc vào proposal.

### Schemas có sẵn

**spec-driven** (mặc định)

Quy trình làm việc tiêu chuẩn cho phát triển dựa trên spec:

```
proposal → specs → design → tasks → implement
```

Phù hợp cho: Hầu hết công việc tính năng khi bạn muốn đồng ý về specs trước khi triển khai.

### Schemas tùy chỉnh

Tạo schemas tùy chỉnh cho quy trình làm việc của nhóm bạn:

```bash
# Tạo từ đầu
openspec schema init research-first

# Hoặc tạo nhánh từ schema hiện có
openspec schema fork spec-driven research-first
```

**Ví dụ schema tùy chỉnh:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Nghiên cứu trước

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal được thông tin từ nghiên cứu

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Bỏ qua specs/design, đi thẳng đến tasks
```

Xem [Tùy chỉnh](customization.md) để biết chi tiết đầy đủ về việc tạo và sử dụng schemas tùy chỉnh.

## Lưu trữ

Lưu trữ hoàn tất một thay đổi bằng cách hợp nhất delta specs của nó vào specs chính và lưu giữ thay đổi để lưu trữ lịch sử.

### Điều gì xảy ra khi bạn lưu trữ

```
Trước khi lưu trữ:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ hợp nhất
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Sau khi lưu trữ:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Bây giờ bao gồm yêu cầu 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Được lưu giữ cho lịch sử
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Quy trình lưu trữ

1. **Hợp nhất delta.** Mỗi phần delta spec (THÊM/SỬA ĐỔI/XÓA) được áp dụng cho spec chính tương ứng.

2. **Di chuyển vào lưu trữ.** Thư mục thay đổi di chuyển vào `changes/archive/` với tiền tố ngày để sắp xếp theo thứ tự thời gian.

3. **Bảo toàn bối cảnh.** Tất cả sản phẩm vẫn nguyên vẹn trong lưu trữ. Bạn luôn có thể xem lại để hiểu tại sao một thay đổi được thực hiện.

### Tại sao lưu trữ quan trọng

**Trạng thái sạch.** Các thay đổi đang hoạt động (`changes/`) chỉ hiển thị công việc đang thực hiện. Công việc đã hoàn thành di chuyển ra ngoài.

**Dấu vết kiểm toán.** Lưu trữ bảo toàn bối cảnh đầy đủ của mọi thay đổi — không chỉ những gì đã thay đổi, mà còn proposal giải thích tại sao, design giải thích như thế nào, và các nhiệm vụ cho thấy công việc đã thực hiện.

**Sự phát triển của spec.** Specs phát triển tự nhiên khi các thay đổi được lưu trữ. Mỗi lần lưu trữ hợp nhất các delta của nó, xây dựng dần một spec toàn diện theo thời gian.

## Cách tất cả hoạt động cùng nhau

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              QUY TRÌNH OPENSPEC                              │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. BẮT ĐẦU   │  /opsx:propose (cốt lõi) hoặc /opsx:new (mở rộng)      │
│   │     THAY ĐỔI   │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. TẠO        │  /opsx:ff hoặc /opsx:continue (quy trình mở rộng)      │
│   │     SẢN PHẨM   │  Tạo proposal → specs → design → tasks                 │
│   │                │  (dựa trên phụ thuộc schema)                            │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. TRIỂN KHAI │  /opsx:apply                                            │
│   │     NHIỆM VỤ   │  Thực hiện các nhiệm vụ, đánh dấu hoàn thành          │
│   │                │◄──── Cập nhật sản phẩm khi học được                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. XÁC NHẬN   │  /opsx:verify (tùy chọn)                               │
│   │     CÔNG VIỆC  │  Kiểm tra triển khai có khớp với specs không           │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. LƯU TRỮ    │────►│  Delta specs hợp nhất vào specs chính        │    │
│   │     THAY ĐỔI   │     │  Thư mục thay đổi di chuyển vào archive/    │    │
│   └────────────────┘     │  Specs bây giờ là nguồn sự thật đã cập nhật │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Vòng lặp virtuous:**

1. Specs mô tả hành vi hiện tại
2. Các thay đổi đề xuất sửa đổi (dạng delta)
3. Triển khai biến thay đổi thành hiện thực
4. Lưu trữ hợp nhất delta vào specs
5. Specs bây giờ mô tả hành vi mới
6. Thay đổi tiếp theo xây dựng trên specs đã cập nhật

## Thuật ngữ

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| **Artifact** | Một tài liệu trong một thay đổi (đề xuất, thiết kế, tác vụ hoặc các spec delta) |
| **Archive** | Quy trình hoàn thành một thay đổi và hợp nhất các delta của nó vào các spec chính |
| **Change** | Một đề xuất sửa đổi hệ thống, được đóng gói dưới dạng thư mục chứa các artifact |
| **Delta spec** | Một spec mô tả các thay đổi (ĐÃ THÊM/ĐÃ SỬA/ĐÃ XÓA) so với các spec hiện tại |
| **Domain** | Một nhóm logic cho các spec (ví dụ: `auth/`, `payments/`) |
| **Requirement** | Một hành vi cụ thể mà hệ thống phải có |
| **Scenario** | Một ví dụ cụ thể của requirement, thường theo định dạng Given/When/Then |
| **Schema** | Định nghĩa các loại artifact và sự phụ thuộc giữa chúng |
| **Spec** | Một specification mô tả hành vi hệ thống, chứa các requirement và scenario |
| **Source of truth** | Thư mục `openspec/specs/`, chứa các hành vi hiện đã được thỏa thuận |

## Các bước tiếp theo

- [Bắt đầu](getting-started.md) - Các bước thực tế đầu tiên
- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và khi nào sử dụng từng mẫu
- [Lệnh](commands.md) - Tham chiếu đầy đủ về lệnh
- [Tùy chỉnh](customization.md) - Tạo các schema tùy chỉnh và cấu hình dự án của bạn