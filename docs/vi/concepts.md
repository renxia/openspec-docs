# Khái niệm

Hướng dẫn này giải thích các ý tưởng cốt lõi đằng sau OpenSpec và cách chúng kết hợp với nhau. Để biết hướng dẫn sử dụng thực tế, xem [Bắt đầu](getting-started.md) và [Quy trình làm việc](workflows.md).

## Triết lý

OpenSpec được xây dựng dựa trên bốn nguyên tắc:

```
linh hoạt chứ không cứng nhắc         — không có cổng giai đoạn, làm việc trên những nội dung phù hợp
lặp lại chứ không theo mô hình thác nước — học hỏi trong quá trình xây dựng, tinh chỉnh dần theo tiến độ
đơn giản chứ không phức tạp        — thiết lập nhẹ nhàng, ít thủ tục rườm rà
ưu tiên mã nguồn cũ        — hoạt động với các mã nguồn hiện có, không chỉ với các dự án khởi tạo từ đầu
```

### Tại sao các nguyên tắc này quan trọng

**Linh hoạt chứ không cứng nhắc.** Các hệ thống đặc tả truyền thống khóa bạn vào các giai đoạn cố định: đầu tiên bạn lập kế hoạch, sau đó bạn thực hiện, rồi bạn hoàn thành. OpenSpec linh hoạt hơn — bạn có thể tạo các tài liệu đặc tả theo bất kỳ thứ tự nào phù hợp với công việc của bạn.

**Lặp lại chứ không theo mô hình thác nước.** Yêu cầu thay đổi. Sự hiểu biết sâu sắc hơn. Cách tiếp cận có vẻ tốt lúc đầu có thể không còn phù hợp sau khi bạn xem xét toàn bộ mã nguồn. OpenSpec chấp nhận thực tế này.

**Đơn giản chứ không phức tạp.** Một số khung đặc tả yêu cầu thiết lập phức tạp, định dạng cứng nhắc hoặc quy trình nặng nề. OpenSpec không làm phiền bạn. Khởi tạo chỉ trong vài giây, bắt đầu làm việc ngay lập tức, chỉ tùy chỉnh nếu bạn có nhu cầu.

**Ưu tiên mã nguồn cũ.** Hầu hết công việc phát triển phần mềm không phải xây dựng từ đầu — đó là sửa đổi các hệ thống hiện có. Cách tiếp cận dựa trên delta của OpenSpec giúp bạn dễ dàng đặc tả các thay đổi đối với hành vi hiện tại, không chỉ mô tả các hệ thống mới.

## The Big Picture (Tổng Quan Tổng Thể)

OpenSpec tổ chức công việc của bạn thành hai lĩnh vực chính:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Source of truth    │◄─────│  Proposed modifications       │   │
│   │  How your system    │ merge│  Each change = one folder     │   │
│   │  currently works    │      │  Contains artifacts + deltas  │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs (Đặc tả)** là nguồn chân lý duy nhất — chúng mô tả cách hệ thống của bạn hoạt động hiện tại.

**Changes (Thay đổi)** là các sửa đổi được đề xuất — chúng được lưu trữ trong các thư mục riêng biệt cho đến khi bạn sẵn sàng gộp chúng.

Sự phân chia này là yếu tố then chốt. Bạn có thể làm việc trên nhiều thay đổi cùng lúc mà không xảy ra xung đột. Bạn có thể xem xét một thay đổi trước khi nó ảnh hưởng đến các đặc tả chính. Và khi bạn lưu trữ một thay đổi, các delta của nó sẽ được gộp một cách gọn gàng vào nguồn chân lý duy nhất.

## Specs (Đặc tả)

Các đặc tả mô tả hành vi của hệ thống bằng các yêu cầu có cấu trúc và các kịch bản.

### Cấu trúc

```
openspec/specs/
├── auth/
│   └── spec.md           # Authentication behavior
├── payments/
│   └── spec.md           # Payment processing
├── notifications/
│   └── spec.md           # Notification system
└── ui/
    └── spec.md           # UI behavior and themes
```

Tổ chức các đặc tả theo lĩnh vực — các nhóm logic phù hợp với hệ thống của bạn. Các mẫu phổ biến:

- **Theo lĩnh vực tính năng**: `auth/`, `payments/`, `search/`
- **Theo thành phần**: `api/`, `frontend/`, `workers/`
- **Theo ngữ cảnh giới hạn**: `ordering/`, `fulfillment/`, `inventory/`

### Định dạng đặc tả

Mỗi đặc tả chứa các yêu cầu, và mỗi yêu cầu có các kịch bản:

```markdown
# Auth Specification

## Purpose
Authentication and session management for the application.

## Requirements

### Requirement: User Authentication
The system SHALL issue a JWT token upon successful login.

#### Scenario: Valid credentials
- GIVEN a user with valid credentials
- WHEN the user submits login form
- THEN a JWT token is returned
- AND the user is redirected to dashboard

#### Scenario: Invalid credentials
- GIVEN invalid credentials
- WHEN the user submits login form
- THEN an error message is displayed
- AND no token is issued

### Requirement: Session Expiration
The system MUST expire sessions after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass without activity
- THEN the session is invalidated
- AND the user must re-authenticate
```

**Các yếu tố chính:**

| Yếu tố | Mục đích |
|---------|---------|
| `## Purpose` | Mô tả cấp cao về lĩnh vực của đặc tả này |
| `### Requirement:` | Một hành vi cụ thể mà hệ thống phải có |
| `#### Scenario:` | Một ví dụ cụ thể về yêu cầu đó khi được thực hiện |
| SHALL/MUST/SHOULD | Các từ khóa RFC 2119 thể hiện mức độ bắt buộc của yêu cầu |

### Tại sao cấu trúc đặc tả như thế này

**Yêu cầu là "cái gì"** — chúng nêu rõ hệ thống nên làm gì mà không chỉ định cách thực hiện.

**Kịch bản là "khi nào"** — chúng cung cấp các ví dụ cụ thể có thể được kiểm chứng. Các kịch bản tốt:
- Có thể kiểm tra được (bạn có thể viết bài kiểm tra tự động cho chúng)
- Bao gồm cả trường hợp thành công và các trường hợp biên
- Sử dụng định dạng Given/When/Then hoặc định dạng có cấu trúc tương tự

**Các từ khóa RFC 2119** (SHALL, MUST, SHOULD, MAY) truyền đạt ý định:
- **MUST/SHALL** — yêu cầu tuyệt đối
- **SHOULD** — được khuyến nghị, nhưng có thể có ngoại lệ
- **MAY** — tùy chọn

### Đặc tả là gì (và không phải là gì)

Một đặc tả là **hợp đồng về hành vi**, không phải là kế hoạch thực hiện.

Nội dung đặc tả tốt:
- Hành vi có thể quan sát được mà người dùng hoặc các hệ thống phụ thuộc dựa vào
- Đầu vào, đầu ra và các điều kiện lỗi
- Các ràng buộc bên ngoài (bảo mật, quyền riêng tư, độ tin cậy, khả năng tương thích)
- Các kịch bản có thể được kiểm tra hoặc xác nhận rõ ràng

Tránh trong đặc tả:
- Tên lớp/hàm nội bộ
- Lựa chọn thư viện hoặc khung làm việc
- Các chi tiết thực hiện từng bước
- Các kế hoạch thực hiện chi tiết (những nội dung này thuộc về `design.md` hoặc `tasks.md`)

Kiểm tra nhanh:
- Nếu cách thực hiện có thể thay đổi mà không làm thay đổi hành vi nhìn thấy được từ bên ngoài, thì nội dung đó có khả năng không thuộc về đặc tả.

### Giữ cho đặc tả nhẹ nhàng: Mức độ nghiêm ngặt tăng dần

OpenSpec hướng đến việc tránh quan liêu. Sử dụng mức độ nhẹ nhàng nhất vẫn đảm bảo thay đổi có thể được kiểm chứng.

**Đặc tả cơ bản (mặc định):**
- Các yêu cầu ngắn gọn, ưu tiên hành vi
- Phạm vi và mục tiêu không thực hiện rõ ràng
- Một vài kiểm tra chấp nhận cụ thể

**Đặc tả đầy đủ (dành cho rủi ro cao hơn):**
- Các thay đổi liên quan đến nhiều nhóm hoặc nhiều kho lưu trữ
- Thay đổi API/hợp đồng, di chuyển dữ liệu, các vấn đề về bảo mật/quyền riêng tư
- Các thay đổi mà sự mơ hồ có khả năng gây ra chi phí làm lại công việc cao

Hầu hết các thay đổi nên ở chế độ cơ bản.

### Hợp tác giữa người và Agent (Tác tác)

Ở nhiều nhóm, con người thực hiện khám phá và các agent soạn thảo các tác phẩm (Artifacts). Vòng lặp dự kiến là:

1. Con người cung cấp ý định, ngữ cảnh và các ràng buộc.
2. Agent chuyển đổi những nội dung này thành các yêu cầu ưu tiên hành vi và các kịch bản.
3. Agent giữ các chi tiết thực hiện trong `design.md` và `tasks.md`, không để trong `spec.md`.
4. Xác nhận hợp lệ cấu trúc và sự rõ ràng trước khi thực hiện.

Điều này giúp các đặc tả dễ đọc đối với con người và nhất quán đối với các agent.

## Changes (Thay đổi)

Một thay đổi là một sửa đổi được đề xuất cho hệ thống của bạn, được đóng gói thành một thư mục chứa tất cả những gì cần thiết để hiểu và thực hiện nó.

### Cấu trúc thay đổi

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional): schema, created, skip_specs
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Mỗi thay đổi là độc lập. Nó bao gồm:
- **Artifacts (Tác phẩm)** — các tài liệu ghi lại ý định, thiết kế và các nhiệm vụ
- **Delta specs (Đặc tả delta)** — các đặc tả cho những nội dung đang được thêm vào, sửa đổi hoặc xóa bỏ
- **Metadata (Siêu dữ liệu)** — cấu hình tùy chọn cho thay đổi cụ thể này

### Tại sao thay đổi là các thư mục

Đóng gói một thay đổi thành thư mục có nhiều lợi ích:

1. **Tất cả mọi thứ trong một nơi.** Đề xuất, thiết kế, nhiệm vụ và đặc tả nằm cùng một chỗ. Không cần tìm kiếm khắp các vị trí khác nhau.
2. **Làm việc song song.** Nhiều thay đổi có thể tồn tại cùng lúc mà không xung đột. Làm việc trên `add-dark-mode` trong khi `fix-auth-bug` cũng đang được thực hiện.
3. **Lịch sử rõ ràng.** Khi được lưu trữ, các thay đổi được chuyển đến `changes/archive/` với toàn bộ ngữ cảnh được giữ nguyên. Bạn có thể xem lại và hiểu không chỉ những gì đã thay đổi, mà còn lý do tại sao.
4. **Thuận tiện cho việc xem xét.** Một thư mục thay đổi rất dễ xem xét — mở nó ra, đọc đề xuất, kiểm tra thiết kế, xem các delta của đặc tả.

## Artifacts (Tác phẩm)

Các tác phẩm là các tài liệu trong một thay đổi, dùng để hướng dẫn công việc.

### Luồng của tác phẩm

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Các tác phẩm được xây dựng dựa trên nhau. Mỗi tác phẩm cung cấp ngữ cảnh cho tác phẩm tiếp theo.

### Các loại tác phẩm

#### Proposal (Đề xuất) (`proposal.md`)

Đề xuất ghi lại **ý định**, **phạm vi** và **phương pháp tiếp cận** ở cấp độ cao.

```markdown
# Proposal: Add Dark Mode

## Intent
Users have requested a dark mode option to reduce eye strain
during nighttime usage and match system preferences.

## Scope
In scope:
- Theme toggle in settings
- System preference detection
- Persist preference in localStorage

Out of scope:
- Custom color themes (future work)
- Per-page theme overrides

## Approach
Use CSS custom properties for theming with a React context
for state management. Detect system preference on first load,
allow manual override.
```

**Khi nào cần cập nhật đề xuất:**
- Thay đổi phạm vi (thu hẹp hoặc mở rộng)
- Ý định được làm rõ (hiểu rõ hơn về vấn đề)
- Phương pháp tiếp cận thay đổi căn bản

#### Specs (Đặc tả delta trong thư mục `specs/`)

Các đặc tả delta mô tả **những gì đang thay đổi** so với các đặc tả hiện tại. Xem phần [Delta Specs](#delta-specs) bên dưới.

#### Design (Thiết kế) (`design.md`)

Thiết kế ghi lại **phương pháp tiếp cận kỹ thuật** và **các quyết định kiến trúc**.

````markdown
# Design: Add Dark Mode

## Technical Approach
Theme state managed via React Context to avoid prop drilling.
CSS custom properties enable runtime switching without class toggling.

## Architecture Decisions

### Decision: Context over Redux
Using React Context for theme state because:
- Simple binary state (light/dark)
- No complex state transitions
- Avoids adding Redux dependency

### Decision: CSS Custom Properties
Using CSS variables instead of CSS-in-JS because:
- Works with existing stylesheet
- No runtime overhead
- Browser-native solution

## Data Flow
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## File Changes
- `src/contexts/ThemeContext.tsx` (new)
- `src/components/ThemeToggle.tsx` (new)
- `src/styles/globals.css` (modified)
````

**Khi nào cần cập nhật thiết kế:**
- Thực hiện cho thấy phương pháp tiếp cận không hoạt động
- Tìm ra giải pháp tốt hơn
- Các phụ thuộc hoặc ràng buộc thay đổi

#### Tasks (Nhiệm vụ) (`tasks.md`)

Các nhiệm vụ là **danh sách kiểm tra thực hiện** — các bước cụ thể có hộp kiểm.

```markdown
# Tasks

## 1. Theme Infrastructure
- [ ] 1.1 Create ThemeContext with light/dark state
- [ ] 1.2 Add CSS custom properties for colors
- [ ] 1.3 Implement localStorage persistence
- [ ] 1.4 Add system preference detection

## 2. UI Components
- [ ] 2.1 Create ThemeToggle component
- [ ] 2.2 Add toggle to settings page
- [ ] 2.3 Update Header to include quick toggle

## 3. Styling
- [ ] 3.1 Define dark theme color palette
- [ ] 3.2 Update components to use CSS variables
- [ ] 3.3 Test contrast ratios for accessibility
```

**Các thực hành tốt nhất cho nhiệm vụ:**
- Nhóm các nhiệm vụ liên quan dưới các tiêu đề
- Sử dụng đánh số phân cấp (1.1, 1.2, v.v.)
- Giữ các nhiệm vụ đủ nhỏ để hoàn thành trong một phiên làm việc
- Đánh dấu hoàn thành các nhiệm vụ khi bạn làm xong

## Delta Specs (Đặc tả delta)

Các đặc tả delta là khái niệm then chốt giúp OpenSpec hoạt động được với phát triển phần mềm hiện có (brownfield). Chúng mô tả **những gì đang thay đổi** thay vì lặp lại toàn bộ đặc tả.

### Định dạng

```markdown
# Delta for Auth

## ADDED Requirements

### Requirement: Two-Factor Authentication
The system MUST support TOTP-based two-factor authentication.

#### Scenario: 2FA enrollment
- GIVEN a user without 2FA enabled
- WHEN the user enables 2FA in settings
- THEN a QR code is displayed for authenticator app setup
- AND the user must verify with a code before activation

#### Scenario: 2FA login
- GIVEN a user with 2FA enabled
- WHEN the user submits valid credentials
- THEN an OTP challenge is presented
- AND login completes only after valid OTP

## MODIFIED Requirements

### Requirement: Session Expiration
The system MUST expire sessions after 15 minutes of inactivity.
(Previously: 30 minutes)

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 15 minutes pass without activity
- THEN the session is invalidated

## REMOVED Requirements

### Requirement: Remember Me
(Deprecated in favor of 2FA. Users should re-authenticate each session.)
```

### Các phần delta

| Phần | Ý nghĩa | Điều gì xảy ra khi lưu trữ |
|---------|---------|------------------------|
| `## ADDED Requirements` | Hành vi mới | Được thêm vào cuối đặc tả chính |
| `## MODIFIED Requirements` | Hành vi đã thay đổi | Thay thế yêu cầu hiện có |
| `## REMOVED Requirements` | Hành vi đã ngừng sử dụng | Được xóa khỏi đặc tả chính |

### Tại sao dùng delta thay vì đặc tả đầy đủ

**Rõ ràng.** Một delta hiển thị chính xác những gì đang thay đổi. Khi đọc một đặc tả đầy đủ, bạn phải so sánh khác biệt trong đầu với phiên bản hiện tại.

**Tránh xung đột.** Hai thay đổi có thể tác động đến cùng một tệp đặc tả mà không xung đột, miễn là chúng sửa đổi các yêu cầu khác nhau.

**Hiệu quả xem xét.** Người xem xét thấy thay đổi, không phải ngữ cảnh không thay đổi. Tập trung vào những gì quan trọng.

**Phù hợp với phát triển phần mềm hiện có (brownfield).** Hầu hết công việc sửa đổi hành vi hiện có. Các delta giúp các sửa đổi trở thành đối tượng ưu tiên, không phải là ý tưởng sau cùng.

## Lược đồ

Lược đồ xác định các loại artifact và các phụ thuộc của chúng trong một quy trình làm việc.

### Cách hoạt động của lược đồ

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Không có phụ thuộc, có thể tạo đầu tiên

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Cần có proposal trước khi tạo

  - id: design
    generates: design.md
    requires: [proposal]      # Có thể tạo song song với specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Cần cả specs và design trước tiên
```

**Các artifact tạo thành một đồ thị phụ thuộc:**

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

**Các phụ thuộc là yếu tố hỗ trợ, không phải rào cản.** Chúng cho thấy những gì có thể tạo được, chứ không phải những gì bạn phải tạo tiếp theo. Bạn có thể bỏ qua bước design nếu không cần thiết. Bạn có thể tạo artifact specs trước hoặc sau artifact design — cả hai chỉ phụ thuộc vào artifact proposal.

### Lược đồ tích hợp sẵn

**spec-driven** (mặc định)

Quy trình làm việc chuẩn cho phát triển theo spec-driven:

```
proposal → specs → design → tasks → triển khai
```

Phù hợp với: Hầu hết các công việc phát triển tính năng mà bạn muốn thống nhất về các spec trước khi triển khai.

### Lược đồ tùy chỉnh

Tạo lược đồ tùy chỉnh cho quy trình làm việc của nhóm bạn:

```bash
# Tạo từ đầu
openspec schema init research-first

# Hoặc sao chép từ lược đồ có sẵn
openspec schema fork spec-driven research-first
```

**Ví dụ lược đồ tùy chỉnh:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Thực hiện nghiên cứu trước tiên

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal được xây dựng dựa trên kết quả nghiên cứu

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Bỏ qua bước specs/design, đi thẳng đến tác vụ
```

Xem phần [Tùy chỉnh](customization.md) để biết đầy đủ chi tiết về cách tạo và sử dụng lược đồ tùy chỉnh.

## Lưu trữ

Lưu trữ hoàn thành một thay đổi bằng cách gộp các delta spec vào các spec chính và lưu giữ thay đổi đó cho lịch sử.

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
        ├── design.md                │ gộp
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Sau khi lưu trữ:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Bây giờ bao gồm các yêu cầu 2FA
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

1. **Gộp các delta.** Mỗi phần của delta spec (ADDED/MODIFIED/REMOVED) được áp dụng vào spec chính tương ứng.
2. **Di chuyển vào kho lưu trữ.** Thư mục thay đổi được di chuyển đến `changes/archive/` với tiền tố ngày để sắp xếp theo thứ tự thời gian.
3. **Lưu giữ ngữ cảnh.** Tất cả các artifact đều được giữ nguyên trong kho lưu trữ. Bạn luôn có thể xem lại để hiểu lý do một thay đổi được thực hiện.

### Tại sao lưu trữ lại quan trọng

**Trạng thái sạch sẽ.** Các thay đổi đang hoạt động (`changes/`) chỉ hiển thị công việc đang thực hiện. Công việc đã hoàn thành được di chuyển ra khỏi vùng làm việc chính.

**Dấu vết kiểm toán.** Kho lưu trữ giữ lại toàn bộ ngữ cảnh của mọi thay đổi — không chỉ những gì đã thay đổi, mà còn cả proposal giải thích lý do, design giải thích cách thực hiện, và các tác vụ thể hiện công việc đã làm.

**Sự phát triển của spec.** Các spec phát triển tự nhiên khi các thay đổi được lưu trữ. Mỗi lần lưu trữ gộp các delta của nó, xây dựng dần một đặc tả toàn diện theo thời gian.

## Tất cả kết hợp với nhau như thế nào

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              LUỒNG CÔNG VIỆC OPENSPEC                       │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. BẮT ĐẦU   │  /opsx:propose (core) or /opsx:new (expanded)           │
│   │     THAY ĐỔI  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. TẠO       │  /opsx:ff or /opsx:continue (expanded workflow)         │
│   │     ARTIFACT  │  Tạo ra proposal → specs → design → tasks              │
│   │                │  (dựa trên các phụ thuộc của lược đồ)                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. TRIỂN KHAI│  /opsx:apply                                            │
│   │     TÁC VỤ    │  Thực hiện lần lượt các tác vụ, đánh dấu hoàn thành từng cái │
│   │                │◄──── Cập nhật các artifact khi bạn có thông tin mới                      │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. KIỂM TRA  │  /opsx:verify (optional)                                │
│   │     CÔNG VIỆC │  Kiểm tra xem phần triển khai có khớp với các spec không                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. LƯU TRỮ   │────►│  Các delta spec được gộp vào các spec chính   │    │
│   │     THAY ĐỔI  │     │  Thư mục thay đổi được di chuyển đến archive/ │    │
│   └────────────────┘     │  Các spec bây giờ là nguồn thông tin chính được cập nhật   │    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Chu kỳ tích cực:**

1. Các spec mô tả hành vi hiện tại
2. Các thay đổi đề xuất sửa đổi (dưới dạng delta)
3. Việc triển khai biến các thay đổi thành hiện thực
4. Lưu trữ gộp các delta vào các spec
5. Các spec bây giờ mô tả hành vi mới
6. Thay đổi tiếp theo được xây dựng dựa trên các spec đã cập nhật

## Thuật ngữ

| Thuật ngữ | Định nghĩa |
|----------|------------|
| **Artifact** | Tài liệu nằm trong một thay đổi (proposal, design, tasks hoặc delta spec) |
| **Archive** | Quy trình hoàn thành một thay đổi và gộp các delta của nó vào các spec chính |
| **Change** | Sự sửa đổi được đề xuất đối với hệ thống, được đóng gói thành một thư mục chứa các artifact |
| **Delta spec** | Một spec mô tả các thay đổi (ADDED/MODIFIED/REMOVED) so với các spec hiện tại |
| **Domain** | Nhóm logic cho các spec (ví dụ: `auth/`, `payments/`) |
| **Requirement** | Một yêu cầu cụ thể mà hệ thống phải đáp ứng |
| **Scenario** | Ví dụ cụ thể của một yêu cầu, thường ở định dạng Given/When/Then |
| **Schema** | Định nghĩa về các loại artifact và các phụ thuộc của chúng |
| **Spec** | Đặc tả mô tả hành vi của hệ thống, chứa các yêu cầu và kịch bản |
| **Source of truth** | Thư mục `openspec/specs/`, chứa các hành vi đã được thống nhất hiện tại |

## Các bước tiếp theo

- [Bắt đầu](getting-started.md) - Các bước thực tế đầu tiên
- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và thời điểm sử dụng từng loại
- [Lệnh](commands.md) - Tài liệu tham khảo đầy đủ về lệnh
- [Tùy chỉnh](customization.md) - Tạo lược đồ tùy chỉnh và cấu hình dự án của bạn