# Quy trình OPSX

> Chào đón phản hồi trên [Discord](https://discord.gg/YctCnvvshC).

## Đây là gì?

OPSX hiện là quy trình tiêu chuẩn cho OpenSpec.

Đây là một **quy trình linh hoạt, lặp đi lặp lại** cho các thay đổi của OpenSpec. Không còn các giai đoạn cứng nhắc — chỉ còn các hành động bạn có thể thực hiện bất cứ lúc nào.

## Lý Do Tồn Tại

Quy trình làm việc OpenSpec cũ vẫn hoạt động, nhưng nó bị **khóa cứng**:

- **Hướng dẫn được mã hóa cứng** — chôn trong TypeScript, bạn không thể thay đổi chúng
- **Tất cả hoặc không có gì** — một lệnh lớn tạo ra mọi thứ, không thể kiểm tra từng phần riêng lẻ
- **Cấu trúc cố định** — cùng một quy trình cho tất cả mọi người, không có tùy chỉnh
- **Hộp đen** — khi đầu ra AI xấu, bạn không thể điều chỉnh các prompt

**OPSX mở nó ra.** Giờ đây bất kỳ ai cũng có thể:

1. **Thử nghiệm với các hướng dẫn** — chỉnh sửa một mẫu, xem liệu AI có hoạt động tốt hơn không
2. **Kiểm tra chi tiết** — xác thực hướng dẫn của từng phần tử một cách độc lập
3. **Tùy chỉnh quy trình** — định nghĩa các phần tử và phụ thuộc của riêng bạn
4. **Lặp lại nhanh chóng** — thay đổi một mẫu, kiểm tra ngay lập tức, không cần xây dựng lại

```
Quy trình cũ:                         OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Mã hóa cứng trong    │           │  schema.yaml           │◄── Bạn chỉnh sửa cái này
│  gói (không thể thay  │           │  templates/*.md        │◄── Hoặc cái này
│  đổi)                  │           │        ↓               │
│        ↓               │           │  Hiệu lực tức thì      │
│  Chờ bản phát hành    │           │        ↓               │
│  mới                   │           │  Tự kiểm tra           │
│        ↓               │           │                        │
│  Hy vọng nó tốt hơn   │           │                        │
└────────────────────────┘           └────────────────────────┘
```

**Điều này dành cho tất cả mọi người:**
- **Nhóm** — tạo các quy trình phù hợp với cách bạn thực sự làm việc
- **Người dùng chuyên sâu** — điều chỉnh các prompt để có đầu ra AI tốt hơn cho cơ sở mã của bạn
- **Người đóng góp OpenSpec** — thử nghiệm các cách tiếp cận mới mà không cần phát hành bản mới

Tất cả chúng ta vẫn đang học cách nào hoạt động tốt nhất. OPSX cho phép chúng ta học cùng nhau.

## Trải Nghiệm Người Dùng

**Vấn đề với các quy trình tuyến tính:**
Bạn đang ở "giai đoạn lập kế hoạch", sau đó là "giai đoạn triển khai", rồi "hoàn thành". Nhưng công việc thực tế không diễn ra như vậy. Bạn triển khai một thứ gì đó, nhận ra thiết kế của mình sai, cần cập nhật đặc tả, tiếp tục triển khai. Các giai đoạn tuyến tính mâu thuẫn với cách công việc thực sự diễn ra.

**Cách tiếp cận OPSX:**
- **Hành động, không phải giai đoạn** — tạo, triển khai, cập nhật, lưu trữ — thực hiện bất kỳ lúc nào
- **Phụ thuộc là yếu tố kích hoạt** — chúng cho thấy điều gì có thể, chứ không phải điều gì là bắt buộc tiếp theo

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Thiết Lập

```bash
# Đảm bảo bạn đã cài đặt openspec — các kỹ năng được tạo tự động
openspec init
```

Điều này tạo ra các kỹ năng trong `.claude/skills/` (hoặc tương đương) mà các trợ lý lập trình AI tự động phát hiện.

Theo mặc định, OpenSpec sử dụng hồ sơ quy trình `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Nếu bạn muốn các lệnh quy trình mở rộng (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), hãy cấu hình chúng với `openspec config profile` và áp dụng với `openspec update`.

Trong quá trình thiết lập, bạn sẽ được nhắc tạo **cấu hình dự án** (`openspec/config.yaml`). Điều này là tùy chọn nhưng được khuyến nghị.

## Cấu Hình Dự Án

Cấu hình dự án cho phép bạn đặt giá trị mặc định và đưa ngữ cảnh cụ thể của dự án vào tất cả các phần tử.

### Tạo Cấu Hình

Cấu hình được tạo trong quá trình `openspec init`, hoặc thủ công:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  API conventions: RESTful, JSON responses
  Testing: Vitest for unit tests, Playwright for e2e
  Style: ESLint with Prettier, strict TypeScript

rules:
  proposal:
    - Include rollback plan
    - Identify affected teams
  specs:
    - Use Given/When/Then format for scenarios
  design:
    - Include sequence diagrams for complex flows
```

### Các Trường Cấu Hình

| Trường | Kiểu | Mô tả |
|--------|------|--------|
| `schema` | string | Schema mặc định cho các thay đổi mới (ví dụ: `spec-driven`) |
| `context` | string | Ngữ cảnh dự án được đưa vào tất cả các hướng dẫn phần tử |
| `rules` | object | Quy tắc cho từng phần tử, được đánh khóa bằng ID phần tử |

### Cách Thức Hoạt Động

**Thứ tự ưu tiên schema** (từ cao xuống thấp):
1. Cờ CLI (`--schema <name>`)
2. Siêu dữ liệu thay đổi (`.openspec.yaml` trong thư mục thay đổi)
3. Cấu hình dự án (`openspec/config.yaml`)
4. Mặc định (`spec-driven`)

**Tiêm ngữ cảnh:**
- Ngữ cảnh được thêm vào đầu mỗi hướng dẫn phần tử
- Được bọc trong các thẻ `<context>...</context>`
- Giúp AI hiểu các quy ước của dự án bạn

**Tiêm quy tắc:**
- Quy tắc chỉ được tiêm cho các phần tử phù hợp
- Được bọc trong các thẻ `<rules>...</rules>`
- Xuất hiện sau ngữ cảnh, trước mẫu

### ID Phần Tử Theo Schema

**spec-driven** (mặc định):
- `proposal` — Đề xuất thay đổi
- `specs` — Đặc tả
- `design` — Thiết kế kỹ thuật
- `tasks` — Tác vụ triển khai

### Xác Thực Cấu Hình

- Các ID phần tử không xác định trong `rules` tạo ra cảnh báo
- Tên schema được xác thực so với các schema có sẵn
- Ngữ cảnh có giới hạn kích thước 50KB
- YAML không hợp lệ được báo cáo kèm số dòng

### Khắc Phục Sự Cố

**"ID phần tử không xác định trong rules: X"**
- Kiểm tra ID phần tử có khớp với schema của bạn không (xem danh sách ở trên)
- Chạy `openspec schemas --json` để xem ID phần tử cho mỗi schema

**Cấu hình không được áp dụng:**
- Đảm bảo tệp nằm ở `openspec/config.yaml` (không phải `.yml`)
- Kiểm tra cú pháp YAML với trình xác thực
- Thay đổi cấu hình có hiệu lực ngay lập tức (không cần khởi động lại)

**Ngữ cảnh quá lớn:**
- Ngữ cảnh bị giới hạn ở 50KB
- Tóm tắt hoặc liên kết đến tài liệu bên ngoài thay thế

## Các Lệnh

| Lệnh | Chức năng |
|------|-----------|
| `/opsx:propose` | Tạo một thay đổi và tạo các phần tử lập kế hoạch trong một bước (đường dẫn nhanh mặc định) |
| `/opsx:explore` | Suy nghĩ về ý tưởng, điều tra vấn đề, làm rõ yêu cầu |
| `/opsx:new` | Bắt đầu một khung thay đổi mới (quy trình mở rộng) |
| `/opsx:continue` | Tạo phần tử tiếp theo (quy trình mở rộng) |
| `/opsx:ff` | Tua nhanh các phần tử lập kế hoạch (quy trình mở rộng) |
| `/opsx:apply` | Triển khai các tác vụ, cập nhật phần tử khi cần |
| `/opsx:verify` | Xác thực triển khai so với các phần tử (quy trình mở rộng) |
| `/opsx:sync` | Đồng bộ các đặc tả delta vào nhánh chính (quy trình mặc định, tùy chọn) |
| `/opsx:archive` | Lưu trữ khi hoàn thành |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi đã hoàn thành (quy trình mở rộng) |
| `/opsx:onboard` | Hướng dẫn từng bước về một thay đổi đầu-cuối (quy trình mở rộng) |

## Cách Sử Dụng

### Khám phá một ý tưởng
```
/opsx:explore
```
Suy nghĩ về ý tưởng, điều tra vấn đề, so sánh các lựa chọn. Không yêu cầu cấu trúc - chỉ là một đối tác suy nghĩ. Khi các hiểu biết hình thành, chuyển sang `/opsx:propose` (mặc định) hoặc `/opsx:new`/`/opsx:ff` (mở rộng).

### Bắt đầu một thay đổi mới
```
/opsx:propose
```
Tạo thay đổi và tạo các phần tử lập kế hoạch cần thiết trước khi triển khai.

Nếu bạn đã bật quy trình mở rộng, bạn có thể thay vào đó sử dụng:

```text
/opsx:new        # chỉ tạo khung
/opsx:continue   # tạo từng phần tử một
/opsx:ff         # tạo tất cả phần tử lập kế hoạch cùng lúc
```

### Tạo phần tử
```
/opsx:continue
```
Hiển thị những gì sẵn sàng để tạo dựa trên phụ thuộc, sau đó tạo một phần tử. Sử dụng lặp lại để xây dựng thay đổi của bạn một cách dần dần.

```
/opsx:ff add-dark-mode
```
Tạo tất cả phần tử lập kế hoạch cùng lúc. Sử dụng khi bạn có hình dung rõ ràng về những gì bạn đang xây dựng.

### Triển khai (phần linh hoạt)
```
/opsx:apply
```
Xử lý các tác vụ, đánh dấu hoàn thành khi bạn tiến hành. Nếu bạn đang xử lý nhiều thay đổi, bạn có thể chạy `/opsx:apply <name>`; nếu không, nó sẽ suy luận từ cuộc trò chuyện và nhắc bạn chọn nếu không thể xác định.

### Hoàn thành
```
/opsx:archive   # Chuyển vào lưu trữ khi hoàn thành (nhắc đồng bộ đặc tả nếu cần)
```

## Khi Nào Nên Cập Nhật So Với Bắt Đầu Mới

Bạn luôn có thể chỉnh sửa đề xuất hoặc đặc tả trước khi triển khai. Nhưng khi nào việc tinh chỉnh trở thành "đây là công việc khác"?

### Những Gì Một Đề Xuất Ghi Lại

Một đề xuất xác định ba điều:
1. **Ý định** — Bạn đang giải quyết vấn đề gì?
2. **Phạm vi** — Cái gì nằm trong/ngoài giới hạn?
3. **Cách tiếp cận** — Bạn sẽ giải quyết nó như thế nào?

Câu hỏi là: cái gì đã thay đổi, và thay đổi bao nhiêu?

### Cập Nhật Thay Đổi Hiện Có Khi:

**Cùng ý định, thực thi được tinh chỉnh**
- Bạn phát hiện các trường hợp biên bạn chưa xem xét
- Cách tiếp cận cần điều chỉnh nhưng mục tiêu không thay đổi
- Triển khai cho thấy thiết kế hơi sai

**Phạm vi thu hẹp**
- Bạn nhận ra phạm vi đầy đủ quá lớn, muốn xuất bản MVP trước
- "Thêm chế độ tối" → "Thêm nút bật/tắt chế độ tối (tùy chọn hệ thống trong v2)"

**Sửa đổi dựa trên học hỏi**
- Cơ sở mã không được cấu trúc như bạn nghĩ
- Một phụ thuộc không hoạt động như mong đợi
- "Sử dụng biến CSS" → "Sử dụng tiền tố dark: của Tailwind thay thế"

### Bắt Đầu Một Thay Đổi Mới Khi:

**Ý định thay đổi cơ bản**
- Bản thân vấn đề giờ đã khác
- "Thêm chế độ tối" → "Thêm hệ thống chủ đề toàn diện với màu sắc, phông chữ, khoảng cách tùy chỉnh"

**Phạm vi bùng nổ**
- Thay đổi phát triển lớn đến mức về cơ bản là công việc khác
- Đề xuất ban đầu sẽ không thể nhận ra sau khi cập nhật
- "Sửa lỗi đăng nhập" → "Viết lại hệ thống xác thực"

**Bản gốc có thể hoàn thành**
- Thay đổi ban đầu có thể được đánh dấu "hoàn thành"
- Công việc mới đứng riêng, không phải là sự tinh chỉnh
- Hoàn thành "Thêm MVP chế độ tối" → Lưu trữ → Thay đổi mới "Nâng cấp chế độ tối"

### Các Quy Tắc Heuristic

```
                        ┌─────────────────────────────────────┐
                        │     Đây có phải là cùng công việc?  │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Cùng ý định?     >50% trùng lặp?   Có thể hoàn thành
             Cùng vấn đề?    Cùng phạm vi?     bản gốc mà không
                    │                  │          có những thay đổi
                    │                  │          này không?
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         CÓ                KHÔNG CÓ          KHÔNG KHÔNG          CÓ
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       CẬP NHẬT          MỚI  CẬP NHẬT    MỚI  CẬP NHẬT        MỚI
```

| Thử nghiệm | Cập Nhật | Thay Đổi Mới |
|------------|----------|--------------|
| **Nhận dạng** | "Cùng một thứ, được tinh chỉnh" | "Công việc khác" |
| **Trùng lặp phạm vi** | >50% trùng lặp | <50% trùng lặp |
| **Hoàn thành** | Không thể "hoàn thành" nếu không có thay đổi | Có thể hoàn thành bản gốc, công việc mới đứng riêng |
| **Câu chuyện** | Chuỗi cập nhật kể một câu chuyện mạch lạc | Các bản vá sẽ gây nhầm lẫn hơn là làm rõ |

### Nguyên Tắc

> **Cập nhật bảo toàn ngữ cảnh. Thay đổi mới mang lại sự rõ ràng.**
>
> Chọn cập nhật khi lịch sử suy nghĩ của bạn có giá trị.
>
> Chọn mới khi bắt đầu lại sẽ rõ ràng hơn là vá lỗi.

Hãy nghĩ về nó như các nhánh git:
- Tiếp tục cam kết trong khi làm việc trên cùng một tính năng
- Bắt đầu một nhánh mới khi đó thực sự là công việc mới
- Đôi khi hợp nhất một tính năng một phần và bắt đầu lại cho giai đoạn 2

## Có gì khác biệt?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Cấu trúc** | Một tài liệu đề xuất lớn | Các thành phần riêng biệt có phụ thuộc |
| **Quy trình làm việc** | Các giai đoạn tuyến tính: lập kế hoạch → triển khai → lưu trữ | Các hành động linh hoạt — có thể thực hiện bất cứ lúc nào |
| **Lặp lại** | Khó khăn khi quay lại | Cập nhật các thành phần khi bạn tìm hiểu |
| **Tùy chỉnh** | Cấu trúc cố định | Được điều khiển bởi lược đồ (tự định nghĩa các thành phần của bạn) |

**Thông tin quan trọng:** công việc không phải là tuyến tính. OPSX ngừng giả vờ rằng nó là như vậy.

## Phân Tích Kiến Trúc Chi Tiết

Phần này giải thích cách OPSX hoạt động bên trong và so sánh nó với quy trình làm việc cũ.
Các ví dụ trong phần này sử dụng bộ lệnh mở rộng (`new`, `continue`, v.v.); người dùng `core` mặc định có thể ánh xạ cùng luồng công việc sang `propose → apply → sync → archive`.

### Triết Lý: Giai Đoạn vs Hành Động

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         QUY TRÌNH LÀM VIỆC CŨ                               │
│                    (Khóa Theo Giai Đoạn, Tất Cả Hoặc Không Gì)             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │   GIAI ĐOẠN  │ ───► │  GIAI ĐOẠN   │ ───► │  GIAI ĐOẠN   │             │
│   │   LẬP KẾ HOẠCH│      │ TRIỂN KHAI   │      │  LƯU TRỮ     │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Tạo TẤT CẢ các sản phẩm cùng lúc                                      │
│   • Không thể quay lại cập nhật đặc tả trong quá trình triển khai        │
│   • Cổng giai đoạn bắt buộc tiến trình tuyến tính                          │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                            QUY TRÌNH LÀM VIỆC OPSX                          │
│                      (Hành Động Linh Hoạt, Lặp)                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │           HÀNH ĐỘNG (không phải giai đoạn) │                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              bất kỳ thứ tự nào             │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Tạo sản phẩm từng cái một HOẶC chuyển tiếp nhanh                      │
│   • Cập nhật đặc tả/thiết kế/nhiệm vụ trong quá trình triển khai         │
│   • Phụ thuộc cho phép tiến trình, giai đoạn không tồn tại                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Kiến Trúc Thành Phần

**Quy trình làm việc cũ** sử dụng các mẫu cứng trong TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CÁC THÀNH PHẦN QUY TRÌNH CŨ                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Các Mẫu Cứng (chuỗi TypeScript)                                          │
│                    │                                                        │
│                    ▼                                                        │
│   Bộ cấu hình/bộ điều hợp dành riêng cho công cụ                           │
│                    │                                                        │
│                    ▼                                                        │
│   Các Tệp Lệnh Được Tạo (.claude/commands/openspec/*.md)                   │
│                                                                             │
│   • Cấu trúc cố định, không nhận biết sản phẩm                            │
│   • Thay đổi yêu cầu sửa đổi mã nguồn + biên dịch lại                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** sử dụng lược đồ bên ngoài và công cụ đồ thị phụ thuộc:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CÁC THÀNH PHẦN OPSX                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Định Nghĩa Lược Đồ (YAML)                                                │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Phụ thuộc                        │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Mẫu glob                         │   │
│   │      requires: [proposal]      ◄── Cho phép sau proposal            │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Công Cụ Đồ Thị Sản Phẩm                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Sắp xếp tôpô (thứ tự phụ thuộc)                                │   │
│   │  • Phát hiện trạng thái (sự tồn tại trên hệ thống tệp)            │   │
│   │  • Tạo hướng dẫn phong phú (mẫu + ngữ cảnh)                       │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Các Tệp Kỹ Năng (.claude/skills/openspec-*/SKILL.md)                     │
│                                                                             │
│   • Tương thích đa trình soạn thảo (Claude Code, Cursor, Windsurf)        │
│   • Các kỹ năng truy vấn CLI để lấy dữ liệu có cấu trúc                  │
│   • Có thể tùy chỉnh hoàn toàn thông qua các tệp lược đồ                 │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mô Hình Đồ Thị Phụ Thuộc

Các sản phẩm tạo thành một đồ thị có hướng không chu trình (DAG). Phụ thuộc là **bộ kích hoạt**, không phải cổng:

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
                                  │
                                  ▼
                          ┌──────────────┐
                          │ GIAI ĐOẠN    │
                          │ ÁP DỤNG      │
                          │ (yêu cầu:    │
                          │  tasks)      │
                          └──────────────┘
```

**Các chuyển đổi trạng thái:**

```
   BỊ CHẶN ────────────────► SẴN SÀNG ────────────────► HOÀN THÀNH
      │                        │                       │
   Thiếu phụ thuộc           Tất cả phụ thuộc        Tệp tồn tại
                             đã HOÀN THÀNH           trên hệ thống tệp
```

### Luồng Thông Tin

**Quy trình làm việc cũ** — tác nhân nhận hướng dẫn tĩnh:

```
  Người dùng: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
│  Hướng dẫn tĩnh:                        │
│  • Tạo proposal.md                      │
│  • Tạo tasks.md                         │
│  • Tạo design.md                        │
│  • Tạo specs/<capability>/spec.md       │
│                                         │
│  Không nhận biết những gì đã tồn tại   │
│  hoặc phụ thuộc giữa các sản phẩm      │
└─────────────────────────────────────────┘
           │
           ▼
  Tác nhân tạo TẤT CẢ sản phẩm trong một lần
```

**OPSX** — tác nhân truy vấn để lấy ngữ cảnh phong phú:

```
  Người dùng: "/opsx:continue"
           │
           ▼
  ┌──────────────────────────────────────────────────────────────────────────┐
│  Bước 1: Truy vấn trạng thái hiện tại                                   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  $ openspec status --change "add-auth" --json                      │  │
│  │                                                                    │  │
│  │  {                                                                 │  │
│  │    "artifacts": [                                                  │  │
│  │      {"id": "proposal", "status": "done"},                         │  │
│  │      {"id": "specs", "status": "ready"},      ◄── Sẵn sàng đầu tiên│  │
│  │      {"id": "design", "status": "ready"},                          │  │
│  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
│  │    ]                                                               │  │
│  │  }                                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Bước 2: Lấy hướng dẫn phong phú cho sản phẩm sẵn sàng                 │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  $ openspec instructions specs --change "add-auth" --json          │  │
│  │                                                                    │  │
│  │  {                                                                 │  │
│  │    "template": "# Specification\n\n## ADDED Requirements...",      │  │
│  │    "dependencies": [{"id": "proposal", "path": "...", "done": true}│  │
│  │    "unlocks": ["tasks"]                                            │  │
│  │  }                                                                 │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                          │
│  Bước 3: Đọc phụ thuộc → Tạo MỘT sản phẩm → Hiển thị những gì được mở khóa│
└──────────────────────────────────────────────────────────────────────────┘
```

### Mô Hình Lặp

**Quy trình làm việc cũ** — khó lặp lại:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Khoan, thiết kế sai rồi"
       │               │
       │               ├── Các lựa chọn:
       │               │   • Chỉnh sửa tệp thủ công (phá vỡ ngữ cảnh)
       │               │   • Bỏ cuộc và bắt đầu lại
       │               │   • Tiếp tục và sửa sau
       │               │
       │               └── Không có cơ chế "quay lại" chính thức
       │
       └── Tạo TẤT CẢ sản phẩm cùng lúc
```

**OPSX** — lặp lại tự nhiên:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Thiết kế sai rồi"
      │                │                  │
      │                │                  ▼
      │                │            Chỉ cần chỉnh sửa design.md
      │                │            và tiếp tục!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply tiếp tục từ
      │                │         nơi bạn đã dừng lại
      │                │
      │                └── Tạo MỘT sản phẩm, hiển thị những gì được mở khóa
      │
      └── Tạo khung thay đổi, chờ hướng dẫn
```

### Lược Đồ Tùy Chỉnh

Tạo các quy trình làm việc tùy chỉnh bằng các lệnh quản lý lược đồ:

```bash
# Tạo một lược đồ mới từ đầu (tương tác)
openspec schema init my-workflow

# Hoặc phân nhánh một lược đồ hiện có làm điểm bắt đầu
openspec schema fork spec-driven my-workflow

# Xác thực cấu trúc lược đồ của bạn
openspec schema validate my-workflow

# Xem lược đồ được giải quyết từ đâu (hữu ích để gỡ lỗi)
openspec schema which my-workflow
```

Các lược đồ được lưu trong `openspec/schemas/` (cục bộ dự án, kiểm soát phiên bản) hoặc `~/.local/share/openspec/schemas/` (toàn cục người dùng).

**Cấu trúc lược đồ:**
```
openspec/schemas/research-first/
├── schema.yaml
└── templates/
    ├── research.md
    ├── proposal.md
    └── tasks.md
```

**Ví dụ schema.yaml:**
```yaml
name: research-first
artifacts:
  - id: research        # Thêm trước proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Bây giờ phụ thuộc vào research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Đồ Thị Phụ Thuộc:**
```
   research ──► proposal ──► tasks
```

### Tóm Tắt

| Khía Cạnh | Cũ | OPSX |
|-----------|------|------|
| **Mẫu** | TypeScript cứng | YAML + Markdown bên ngoài |
| **Phụ thuộc** | Không (tất cả cùng lúc) | DAG với sắp xếp tôpô |
| **Trạng thái** | Mô hình tinh thần dựa trên giai đoạn | Sự tồn tại trên hệ thống tệp |
| **Tùy chỉnh** | Chỉnh sửa mã nguồn, biên dịch lại | Tạo schema.yaml |
| **Lặp lại** | Khóa theo giai đoạn | Linh hoạt, chỉnh sửa bất cứ thứ gì |
| **Hỗ trợ trình soạn thảo** | Bộ cấu hình/bộ điều hợp dành riêng cho công cụ | Thư mục kỹ năng duy nhất |

## Schemas

Schemas định nghĩa các artifact tồn tại và sự phụ thuộc của chúng. Hiện có sẵn:

- **spec-driven** (mặc định): proposal → specs → design → tasks

```bash
# Liệt kê các schema có sẵn
openspec schemas

# Xem tất cả schema cùng nguồn giải quyết của chúng
openspec schema which --all

# Tạo một schema mới một cách tương tác
openspec schema init my-workflow

# Phân nhánh một schema hiện có để tùy chỉnh
openspec schema fork spec-driven my-workflow

# Kiểm tra cấu trúc schema trước khi sử dụng
openspec schema validate my-workflow
```

## Mẹo

- Sử dụng `/opsx:explore` để suy nghĩ kỹ về một ý tưởng trước khi cam kết thực hiện thay đổi
- Dùng `/opsx:ff` khi bạn biết mình muốn gì, dùng `/opsx:continue` khi đang khám phá
- Trong quá trình `/opsx:apply`, nếu có gì sai — hãy sửa artifact, sau đó tiếp tục
- Các task theo dõi tiến độ thông qua các ô kiểm trong `tasks.md`
- Kiểm tra trạng thái bất cứ lúc nào: `openspec status --change "name"`

## Phản hồi

Đây là bản nháp. Điều đó là có chủ đích — chúng tôi đang học hỏi xem cái gì hiệu quả.

Tìm thấy lỗi? Có ý tưởng? Hãy tham gia cùng chúng tôi trên [Discord](https://discord.gg/YctCnvvshC) hoặc mở một issue trên [GitHub](https://github.com/Fission-AI/openspec/issues).