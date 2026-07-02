# Khái niệm

Hướng dẫn này giải thích các ý tưởng cốt lõi đằng sau OpenSpec và cách chúng hoạt động cùng nhau. Đối với việc sử dụng thực tế, hãy tham khảo [Getting Started](getting-started.md) và [Workflows](workflows.md).

## Triết lý

OpenSpec được xây dựng dựa trên bốn nguyên tắc:

```
fluid not rigid         — không có các cổng giai đoạn (phase gates), làm những gì có ý nghĩa
iterative not waterfall — học hỏi khi đang xây dựng, tinh chỉnh dần dần
easy not complex        — thiết lập nhẹ nhàng, quy trình tối thiểu
brownfield-first        — hoạt động với các codebase hiện có, chứ không chỉ là dự án mới hoàn toàn (greenfield)
```

### Tại sao những nguyên tắc này lại quan trọng

**Fluid not rigid.** Các hệ thống đặc tả truyền thống buộc bạn phải tuân theo các giai đoạn: trước tiên bạn lập kế hoạch, sau đó bạn triển khai, rồi xong. OpenSpec linh hoạt hơn — bạn có thể tạo ra các artifact (tác phẩm) theo bất kỳ thứ tự nào phù hợp với công việc của mình.

**Iterative not waterfall.** Các yêu cầu thay đổi. Sự hiểu biết ngày càng sâu sắc hơn. Điều tưởng chừng là một cách tiếp cận tốt lúc ban đầu có thể không còn phù hợp sau khi bạn xem xét codebase. OpenSpec chấp nhận thực tế này.

**Easy not complex.** Một số framework đặc tả đòi hỏi thiết lập phức tạp, định dạng cứng nhắc hoặc các quy trình nặng nề. OpenSpec sẽ không cản trở công việc của bạn. Khởi tạo chỉ trong vài giây, bắt đầu làm việc ngay lập tức, tùy chỉnh khi thực sự cần thiết.

**Brownfield-first.** Hầu hết các công việc phần mềm đều không phải là xây dựng từ đầu — mà là sửa đổi các hệ thống hiện có. Cách tiếp cận dựa trên delta của OpenSpec giúp dễ dàng đặc tả các thay đổi đối với hành vi hiện tại, chứ không chỉ mô tả các hệ thống mới.

## Bức Tranh Toàn Cảnh

OpenSpec tổ chức công việc của bạn thành hai lĩnh vực chính:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Nguồn sự thật      │◄─────│  Các thay đổi đề xuất        │   │
│   │  Cách hệ thống bạn    │ merge│  Mỗi thay đổi = một thư mục │   │
│   │  hoạt động hiện tại │      │  Chứa các artifacts + delta  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** là nguồn sự thật — chúng mô tả cách hệ thống của bạn hoạt động hiện tại.

**Changes** là các thay đổi đề xuất — chúng tồn tại trong các thư mục riêng biệt cho đến khi bạn sẵn sàng để hợp nhất (merge).

Sự tách biệt này là chìa khóa. Bạn có thể làm việc trên nhiều thay đổi song song mà không gặp xung đột. Bạn có thể xem xét một thay đổi trước khi nó ảnh hưởng đến các specs chính. Và khi bạn lưu trữ (archive) một thay đổi, các delta của nó sẽ được hợp nhất gọn gàng vào nguồn sự thật.

## Specs

Specs mô tả hành vi của hệ thống bằng cách sử dụng các yêu cầu và kịch bản có cấu trúc.

### Cấu Trúc

```
openspec/specs/
├── auth/
│   └── spec.md           # Hành vi xác thực (Authentication)
├── payments/
│   └── spec.md           # Xử lý thanh toán (Payment processing)
├── notifications/
│   └── spec.md           # Hệ thống thông báo (Notification system)
└── ui/
    └── spec.md           # Hành vi UI và chủ đề (Theme)
```

Hãy tổ chức specs theo miền (domain) — các nhóm logic có ý nghĩa đối với hệ thống của bạn. Các mẫu phổ biến:

- **Theo lĩnh vực tính năng**: `auth/`, `payments/`, `search/`
- **Theo thành phần (component)**: `api/`, `frontend/`, `workers/`
- **Theo ngữ cảnh giới hạn (bounded context)**: `ordering/`, `fulfillment/`, `inventory/`

### Định Dạng Spec

Một spec chứa các yêu cầu, và mỗi yêu cầu lại có các kịch bản (scenarios):

```markdown
# Auth Specification

## Purpose
Mục đích của tài liệu này là xác thực và quản lý phiên cho ứng dụng.

## Requirements

### Requirement: User Authentication
Hệ thống PHẢI cấp phát một token JWT sau khi đăng nhập thành công.

#### Scenario: Valid credentials (Thông tin đăng nhập hợp lệ)
- GIVEN người dùng có thông tin đăng nhập hợp lệ
- WHEN người dùng gửi form đăng nhập
- THEN một token JWT được trả về
- AND người dùng được chuyển hướng đến dashboard

#### Scenario: Invalid credentials (Thông tin đăng nhập không hợp lệ)
- GIVEN thông tin đăng nhập không hợp lệ
- WHEN người dùng gửi form đăng nhập
- THEN một thông báo lỗi được hiển thị
- AND không có token nào được cấp phát

### Requirement: Session Expiration
Hệ thống PHẢI hết hạn các phiên sau 30 phút không hoạt động.

#### Scenario: Idle timeout (Thời gian chờ không hoạt động)
- GIVEN một phiên đã xác thực
- WHEN 30 phút trôi qua mà không có hoạt động nào
- THEN phiên đó bị vô hiệu hóa
- AND người dùng phải tự xác thực lại
```

**Các yếu tố chính:**

| Element | Mục đích |
|---------|---------|
| `## Purpose` | Mô tả cấp cao về miền của spec này |
| `### Requirement:` | Một hành vi cụ thể mà hệ thống cần có |
| `#### Scenario:` | Một ví dụ cụ thể về yêu cầu đang hoạt động |
| SHALL/MUST/SHOULD | Các từ khóa RFC 2119 chỉ ra mức độ quan trọng của yêu cầu |

### Tại Sao Cần Cấu Trúc Specs Như Vậy

**Yêu cầu (Requirements) là "cái gì"** — chúng nêu rõ hệ thống nên làm gì mà không quy định cách triển khai.

**Kịch bản (Scenarios) là "khi nào"** — chúng cung cấp các ví dụ cụ thể có thể được kiểm chứng. Các kịch bản tốt:
- Có thể kiểm thử (bạn có thể viết một bài kiểm thử tự động cho chúng)
- Bao gồm cả đường đi thành công (happy path) và các trường hợp biên (edge cases)
- Sử dụng định dạng cấu trúc Given/When/Then hoặc tương tự

**Các từ khóa RFC 2119** (SHALL, MUST, SHOULD, MAY) truyền đạt ý định:
- **MUST/SHALL** — Yêu cầu tuyệt đối
- **SHOULD** — Được khuyến nghị, nhưng vẫn có ngoại lệ
- **MAY** — Tùy chọn

### Spec Là Gì (Và Không Phải Là Gì)

Một spec là một **hợp đồng hành vi**, chứ không phải là kế hoạch triển khai.

Nội dung spec tốt:
- Hành vi có thể quan sát được mà người dùng hoặc các hệ thống hạ nguồn dựa vào
- Đầu vào, đầu ra và các điều kiện lỗi
- Các ràng buộc bên ngoài (bảo mật, quyền riêng tư, độ tin cậy, khả năng tương thích)
- Các kịch bản có thể được kiểm thử hoặc xác thực rõ ràng

Những điều nên tránh trong spec:
- Tên lớp/hàm nội bộ
- Lựa chọn thư viện hoặc framework
- Chi tiết triển khai từng bước
- Kế hoạch thực thi chi tiết (những thứ này thuộc về `design.md` hoặc `tasks.md`)

Bài kiểm tra nhanh:
- Nếu việc triển khai có thể thay đổi mà không làm thay đổi hành vi hiển thị bên ngoài, thì nó có lẽ không nên nằm trong spec.

### Giữ Cho Nó Nhẹ Nhàng: Sự Nghiêm Ngặt Tăng Dần (Progressive Rigor)

OpenSpec nhằm tránh sự quan liêu hóa. Hãy sử dụng mức độ nhẹ nhất vẫn đảm bảo thay đổi đó có thể được kiểm chứng.

**Lite spec (mặc định):**
- Các yêu cầu ngắn gọn, tập trung vào hành vi
- Phạm vi và các mục tiêu không mong muốn rõ ràng
- Một vài kiểm tra chấp nhận cụ thể

**Full spec (cho rủi ro cao hơn):**
- Các thay đổi liên phòng ban hoặc liên repo
- Thay đổi API/hợp đồng, di chuyển dữ liệu (migrations), các mối quan ngại về bảo mật/quyền riêng tư
- Những thay đổi mà sự mơ hồ có khả năng gây ra công việc làm lại tốn kém

Hầu hết các thay đổi nên ở chế độ Lite.

### Hợp Tác Giữa Con Người và Agent

Trong nhiều đội nhóm, con người sẽ khám phá và agent sẽ soạn thảo artifacts. Vòng lặp dự kiến là:

1. Con người cung cấp ý định (intent), ngữ cảnh và ràng buộc.
2. Agent chuyển đổi điều này thành các yêu cầu và kịch bản tập trung vào hành vi.
3. Agent giữ chi tiết triển khai trong `design.md` và `tasks.md`, chứ không phải `spec.md`.
4. Việc xác thực sẽ xác nhận cấu trúc và sự rõ ràng trước khi triển khai.

Điều này giúp specs dễ đọc đối với con người và nhất quán đối với agent.

## Changes (Các Thay Đổi)

Một Change là một đề xuất thay đổi đối với hệ thống của bạn, được đóng gói dưới dạng một thư mục chứa mọi thứ cần thiết để hiểu và thực hiện nó.

### Cấu Trúc Change

```
openspec/changes/add-dark-mode/
├── proposal.md           # Tại sao và cái gì (Why and what)
├── design.md             # Cách thức (Cách tiếp cận kỹ thuật)
├── tasks.md              # Danh sách kiểm tra triển khai
├── .openspec.yaml        # Metadata của thay đổi (tùy chọn)
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # Những gì đang thay đổi trong ui/spec.md
```

Mỗi Change đều tự chứa đựng. Nó bao gồm:
- **Artifacts** — Các tài liệu ghi lại ý định, thiết kế và các tác vụ
- **Delta specs** — Các đặc tả về những gì đang được thêm, sửa hoặc xóa
- **Metadata** — Cấu hình tùy chọn cho thay đổi cụ thể này

### Tại Sao Changes Lại Là Thư Mục

Việc đóng gói một Change dưới dạng một thư mục mang lại nhiều lợi ích:

1. **Tất cả ở cùng một nơi.** Proposal, thiết kế, tác vụ và specs đều nằm ở một chỗ. Không cần phải tìm kiếm qua các vị trí khác nhau.

2. **Làm việc song song.** Nhiều Changes có thể tồn tại đồng thời mà không xung đột. Hãy làm việc trên `add-dark-mode` trong khi `fix-auth-bug` cũng đang được tiến hành.

3. **Lịch sử gọn gàng.** Khi được lưu trữ (archived), các Change sẽ chuyển đến `changes/archive/` với toàn bộ ngữ cảnh được bảo tồn. Bạn có thể nhìn lại và hiểu không chỉ những gì đã thay đổi, mà còn tại sao nó thay đổi.

4. **Dễ xem xét (Review-friendly).** Một thư mục Change rất dễ để review — mở nó ra, đọc proposal, kiểm tra thiết kế, xem các delta spec.

## Artifacts

Artifacts là các tài liệu bên trong một Change giúp định hướng công việc.

### Luồng Artifacts

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Các Artifacts được xây dựng dựa trên lẫn nhau. Mỗi artifact cung cấp ngữ cảnh cho cái tiếp theo.

### Các Loại Artifacts

#### Proposal (`proposal.md`)

Proposal ghi lại **ý định (intent)**, **phạm vi (scope)** và **cách tiếp cận (approach)** ở mức độ cao.

```markdown
# Proposal: Add Dark Mode

## Intent
Người dùng đã yêu cầu tùy chọn chế độ tối để giảm mỏi mắt khi sử dụng vào ban đêm và phù hợp với sở thích của hệ thống.

## Scope
Trong phạm vi:
- Chuyển đổi chủ đề (Theme toggle) trong cài đặt
- Phát hiện sở thích của hệ thống
- Lưu giữ sở thích trong localStorage

Ngoài phạm vi:
- Các chủ đề màu tùy chỉnh (công việc tương lai)
- Ghi đè chủ đề theo từng trang

## Approach
Sử dụng các thuộc tính CSS tùy chỉnh (CSS custom properties) cho việc định kiểu cùng với một React context để quản lý trạng thái. Phát hiện sở thích hệ thống khi tải lần đầu, cho phép ghi đè thủ công.
```

**Khi nào cần cập nhật Proposal:**
- Thay đổi phạm vi (thu hẹp hoặc mở rộng)
- Ý định được làm rõ hơn (hiểu vấn đề tốt hơn)
- Cách tiếp cận thay đổi cơ bản

#### Specs (delta specs trong `specs/`)

Delta specs mô tả **những gì đang thay đổi** so với các specs hiện tại. Xem [Delta Specs](#delta-specs) bên dưới.

#### Design (`design.md`)

Design ghi lại **cách tiếp cận kỹ thuật** và **các quyết định kiến trúc**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Trạng thái chủ đề được quản lý thông qua React Context để tránh prop drilling. Các thuộc tính CSS tùy chỉnh cho phép chuyển đổi thời gian chạy mà không cần bật/tắt class.

## Architecture Decisions (Các quyết định kiến trúc)

### Decision: Context over Redux
Sử dụng React Context cho trạng thái chủ đề vì:
- Trạng thái nhị phân đơn giản (sáng/tối)
- Không có sự chuyển đổi trạng thái phức tạp
- Tránh thêm dependency Redux

### Decision: CSS Custom Properties
Sử dụng biến CSS thay vì CSS-in-JS vì:
- Hoạt động với stylesheet hiện tại
- Không có chi phí thời gian chạy (runtime overhead)
- Giải pháp gốc của trình duyệt

## Data Flow (Luồng dữ liệu)
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (áp dụng cho :root)
```

## File Changes (Thay đổi tệp tin)
- `src/contexts/ThemeContext.tsx` (mới)
- `src/components/ThemeToggle.tsx` (mới)
- `src/styles/globals.css` (đã sửa đổi)
````

**Khi nào cần cập nhật Design:**
- Triển khai cho thấy cách tiếp cận không khả thi
- Phát hiện ra giải pháp tốt hơn
- Các dependency hoặc ràng buộc thay đổi

#### Tasks (`tasks.md`)

Tasks là **danh sách kiểm tra triển khai** — các bước cụ thể với ô đánh dấu (checkbox).

```markdown
# Tasks

## 1. Theme Infrastructure (Cơ sở hạ tầng Chủ đề)
- [ ] 1.1 Tạo ThemeContext với trạng thái light/dark
- [ ] 1.2 Thêm các thuộc tính CSS tùy chỉnh cho màu sắc
- [ ] 1.3 Triển khai lưu trữ trong localStorage
- [ ] 1.4 Thêm phát hiện sở thích hệ thống

## 2. UI Components (Các thành phần UI)
- [ ] 2.1 Tạo component ThemeToggle
- [ ] 2.2 Thêm toggle vào trang cài đặt
- [ ] 2.3 Cập nhật Header để bao gồm quick toggle

## 3. Styling (Định kiểu)
- [ ] 3.1 Xác định bảng màu chủ đề tối
- [ ] 3.2 Cập nhật các component để sử dụng biến CSS
- [ ] 3.3 Kiểm tra tỷ lệ tương phản cho khả năng tiếp cận
```

**Thực hành tốt nhất đối với Tasks:**
- Gom nhóm các tác vụ liên quan dưới tiêu đề
- Sử dụng đánh số phân cấp (1.1, 1.2, v.v.)
- Giữ các tác vụ đủ nhỏ để hoàn thành trong một phiên làm việc
- Đánh dấu hoàn thành khi bạn hoàn thành chúng

## Delta Specs (Đặc Tả Thay Đổi)

Delta specs là khái niệm then chốt giúp OpenSpec hoạt động cho phát triển trên hệ thống hiện có (brownfield development). Chúng mô tả **những gì đang thay đổi** chứ không phải trình bày lại toàn bộ spec.

### Định Dạng

```markdown
# Delta for Auth

## ADDED Requirements (Các Yêu Cầu ĐƯỢC THÊM)

### Requirement: Two-Factor Authentication
Hệ thống PHẢI hỗ trợ xác thực hai yếu tố dựa trên TOTP.

#### Scenario: 2FA enrollment (Đăng ký 2FA)
- GIVEN người dùng chưa bật 2FA
- WHEN người dùng bật 2FA trong cài đặt
- THEN một mã QR được hiển thị để thiết lập ứng dụng xác thực
- AND người dùng phải xác minh bằng mã trước khi kích hoạt

#### Scenario: 2FA login (Đăng nhập 2FA)
- GIVEN người dùng đã bật 2FA
- WHEN người dùng gửi thông tin đăng nhập hợp lệ
- THEN một thử thách thức OTP được trình bày
- AND việc đăng nhập chỉ hoàn tất sau khi có OTP hợp lệ

## MODIFIED Requirements (Các Yêu Cầu ĐƯỢC SỬA)

### Requirement: Session Expiration
Hệ thống PHẢI hết hạn các phiên sau 15 phút không hoạt động.
(Trước đây: 30 phút)

#### Scenario: Idle timeout
- GIVEN một phiên đã xác thực
- WHEN 15 phút trôi qua mà không có hoạt động nào
- THEN phiên đó bị vô hiệu hóa

## REMOVED Requirements (Các Yêu Cầu ĐƯỢC XÓA)

### Requirement: Remember Me
(Đã lỗi thời thay thế bằng 2FA. Người dùng nên tự xác thực lại mỗi phiên.)
```

### Các Phần Delta

| Section | Ý nghĩa | Điều gì xảy ra khi Lưu trữ (Archive) |
|---------|---------|------------------------|
| `## ADDED Requirements` | Hành vi mới | Được thêm vào spec chính |
| `## MODIFIED Requirements` | Hành vi đã thay đổi | Thay thế yêu cầu hiện có |
| `## REMOVED Requirements` | Hành vi đã lỗi thời | Bị xóa khỏi spec chính |

### Tại Sao Dùng Deltas Thay Vì Full Specs

**Sự rõ ràng.** Một delta cho thấy chính xác những gì đang thay đổi. Nếu đọc một full spec, bạn sẽ phải tự so sánh nó với phiên bản hiện tại.

**Tránh xung đột.** Hai Changes có thể chạm vào cùng một tệp spec mà không bị xung đột, miễn là chúng sửa đổi các yêu cầu khác nhau.

**Hiệu quả review.** Người xem sẽ thấy sự thay đổi, chứ không phải ngữ cảnh không thay đổi. Tập trung vào những gì quan trọng.

**Phù hợp với Brownfield.** Hầu hết công việc đều sửa đổi hành vi hiện có. Deltas biến các sửa đổi thành hạng mục đầu tiên (first-class), chứ không phải là một suy nghĩ sau cùng.

## Schemas

Schemas định nghĩa các loại artifact và sự phụ thuộc của chúng đối với một workflow.

### Cách hoạt động của Schemas

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Không có sự phụ thuộc, có thể tạo trước
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

**Artifacts tạo thành một đồ thị phụ thuộc:**

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

**Sự phụ thuộc là yếu tố kích hoạt (enablers), không phải rào cản (gates).** Chúng cho thấy những gì có thể được tạo ra, chứ không phải bạn bắt buộc phải tạo cái gì tiếp theo. Bạn có thể bỏ qua thiết kế nếu không cần nó. Bạn có thể tạo specs trước hoặc sau design — cả hai đều chỉ phụ thuộc vào proposal.

### Schemas tích hợp sẵn (Built-in Schemas)

**spec-driven** (mặc định)

Workflow tiêu chuẩn cho phát triển dựa trên spec:

```
proposal → specs → design → tasks → implement
```

Tốt nhất cho: Hầu hết các công việc tính năng, nơi bạn muốn thống nhất về specs trước khi thực hiện.

### Custom Schemas (Schemas tùy chỉnh)

Hãy tạo schemas tùy chỉnh cho workflow của nhóm bạn:

```bash
# Tạo từ đầu
openspec schema init research-first

# Hoặc fork một cái có sẵn
openspec schema fork spec-driven research-first
```

**Ví dụ về custom schema:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Hãy nghiên cứu trước
  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal được thông báo bởi nghiên cứu
  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Bỏ qua specs/design, đi thẳng vào tasks
```

Xem [Customization](customization.md) để biết chi tiết đầy đủ về việc tạo và sử dụng custom schemas.

## Archive (Lưu trữ)

Archiving hoàn tất một thay đổi bằng cách hợp nhất các delta spec của nó vào main specs và bảo toàn sự thay đổi đó cho lịch sử.

### Điều gì xảy ra khi bạn Lưu trữ (Archive)?

```
Trước khi lưu trữ:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │    design.md                │ merge
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Sau khi lưu trữ:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Bây giờ đã bao gồm các yêu cầu về 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Được bảo toàn cho lịch sử
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Quy trình Lưu trữ (The Archive Process)

1. **Hợp nhất deltas.** Mỗi phần delta spec (ADDED/MODIFIED/REMOVED) được áp dụng vào main spec tương ứng.

2. **Di chuyển vào archive.** Thư mục thay đổi di chuyển đến `changes/archive/` với tiền tố ngày để sắp xếp theo trình tự thời gian.

3. **Bảo toàn ngữ cảnh.** Tất cả các artifact đều được giữ nguyên trong archive. Bạn luôn có thể nhìn lại để hiểu tại sao một thay đổi được thực hiện.

### Tại sao việc Lưu trữ lại quan trọng (Why Archive Matters)

**Trạng thái sạch sẽ (Clean state).** Các thay đổi đang hoạt động (`changes/`) chỉ hiển thị công việc đang tiến hành. Công việc đã hoàn thành sẽ được di chuyển ra ngoài.

**Dấu vết kiểm toán (Audit trail).** Archive bảo toàn toàn bộ ngữ cảnh của mọi thay đổi — không chỉ là những gì đã thay đổi, mà còn bao gồm proposal giải thích tại sao, design giải thích như thế nào và tasks cho thấy công việc đã làm.

**Sự tiến hóa của Spec.** Specs phát triển một cách tự nhiên khi các thay đổi được lưu trữ. Mỗi archive hợp nhất deltas của nó, xây dựng nên một tài liệu đặc tả toàn diện theo thời gian.

## Cách mọi thứ kết nối với nhau (How It All Fits Together)

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              QUY TRÌNH OPENSPEC                                   │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. BẮT ĐẦU      │  /opsx:propose (core) hoặc /opsx:new (expanded)           │
│   │     THAY ĐỔI     │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. TẠO         │  /opsx:ff hoặc /opsx:continue (quy trình mở rộng)         │
│   │     ARTIFACTS  │  Tạo proposal → specs → design → tasks              │
│   │                │  (dựa trên sự phụ thuộc của schema)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. THỰC HIỆN   │  /opsx:apply                                            │
│   │     NHIỆM VỤ    │  Làm việc qua các nhiệm vụ, đánh dấu chúng đã hoàn thành                  │
│   │                │◄──── Cập nhật artifacts khi bạn học hỏi                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. XÁC MINH     │  /opsx:verify (tùy chọn)                                │
│   │     CÔNG VIỆC     │  Kiểm tra xem việc thực hiện có khớp với specs không                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. LƯU TRỮ (ARCHIVE) │────►│  Hợp nhất delta specs vào main specs           │    │
│   │     THAY ĐỔI     │     │  Thư mục thay đổi di chuyển đến archive/             │    │
│   └────────────────┘     │  Specs giờ là nguồn sự thật đã được cập nhật   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Vòng tuần hoàn hảo (The virtuous cycle):**

1. Specs mô tả hành vi hiện tại
2. Các thay đổi đề xuất sửa đổi (dưới dạng deltas)
3. Việc thực hiện biến các thay đổi thành sự thật
4. Archive hợp nhất các deltas vào specs
5. Specs giờ mô tả hành vi mới
6. Thay đổi tiếp theo được xây dựng dựa trên specs đã cập nhật

## Glossary (Thuật ngữ)

| Term | Definition |
|------|------------|
| **Artifact** | Một tài liệu trong một thay đổi (proposal, design, tasks, hoặc delta specs) |
| **Archive** | Quá trình hoàn tất một thay đổi và hợp nhất các deltas của nó vào main specs |
| **Change** | Một đề xuất sửa đổi đối với hệ thống, được đóng gói dưới dạng một thư mục chứa các artifact |
| **Delta spec** | Một spec mô tả những thay đổi (ADDED/MODIFIED/REMOVED) so với các specs hiện tại |
| **Domain** | Một nhóm logic cho các specs (ví dụ: `auth/`, `payments/`) |
| **Requirement** | Một hành vi cụ thể mà hệ thống phải có |
| **Scenario** | Một ví dụ cụ thể của một requirement, thường ở định dạng Given/When/Then |
| **Schema** | Định nghĩa về các loại artifact và sự phụ thuộc của chúng |
| **Spec** | Một tài liệu đặc tả mô tả hành vi của hệ thống, chứa requirements và scenarios |
| **Source of truth** | Thư mục `openspec/specs/`, chứa hành vi đã được thống nhất hiện tại |

## Next Steps (Các bước tiếp theo)

- [Getting Started](getting-started.md) - Các bước thực tế để bắt đầu
- [Workflows](workflows.md) - Các mẫu phổ biến và khi nào nên sử dụng từng loại
- [Commands](commands.md) - Tài liệu tham chiếu lệnh đầy đủ
- [Customization](customization.md) - Tạo custom schemas và cấu hình dự án của bạn