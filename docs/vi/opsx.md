# OPSX Workflow

> Phản hồi được chào đón trên [Discord](https://discord.gg/YctCnvvshC).

## Nó là gì?

OPSX hiện là quy trình làm việc tiêu chuẩn cho OpenSpec.

Đây là một **quy trình làm việc linh hoạt, lặp đi lặp lại** cho các thay đổi OpenSpec. Không còn các giai đoạn cứng nhắc nữa — chỉ có các hành động bạn có thể thực hiện bất cứ lúc nào.

## Tại sao cần điều này

Quy trình làm việc OpenSpec cũ hoạt động được, nhưng nó bị **khóa cứng**:

- **Hướng dẫn được mã hóa cứng** — ẩn trong TypeScript, bạn không thể thay đổi chúng
- **Tất cả hoặc không có gì** — một lệnh lớn tạo ra mọi thứ, không thể kiểm tra từng phần riêng lẻ
- **Cấu trúc cố định** — cùng một quy trình cho tất cả mọi người, không có tùy chỉnh
- **Hộp đen** — khi đầu ra của AI không tốt, bạn không thể tinh chỉnh các prompt

**OPSX mở ra nó.** Bây giờ bất kỳ ai cũng có thể:

1. **Thử nghiệm với hướng dẫn** — chỉnh sửa một mẫu, xem liệu AI có hoạt động tốt hơn không
2. **Kiểm tra chi tiết** — xác thực hướng dẫn của từng artifact một cách độc lập
3. **Tùy chỉnh quy trình làm việc** — định nghĩa artifact và phụ thuộc của riêng bạn
4. **Lặp lại nhanh chóng** — thay đổi một mẫu, kiểm tra ngay lập tức, không cần xây dựng lại

```
Quy trình cũ:                          OPSX:
┌────────────────────────┐           ┌────────────────────────┐
│  Mã hóa cứng trong gói │           │  schema.yaml           │◄── Bạn chỉnh sửa cái này
│  (không thể thay đổi)  │           │  templates/*.md        │◄── Hoặc cái này
│        ↓               │           │        ↓               │
│  Chờ bản phát hành mới │           │  Hiệu ứng tức thì     │
│        ↓               │           │        ↓               │
│  Hy vọng nó tốt hơn   │           │  Tự kiểm tra          │
└────────────────────────┘           └────────────────────────┘
```

**Đây là cho tất cả mọi người:**
- **Các nhóm** — tạo quy trình làm việc phù hợp với cách bạn thực sự làm việc
- **Người dùng nâng cao** — tinh chỉnh prompt để có đầu ra AI tốt hơn cho codebase của bạn
- **Người đóng góp OpenSpec** — thử nghiệm các cách tiếp cận mới mà không cần phát hành

Chúng ta vẫn đang học hỏi điều gì hoạt động tốt nhất. OPSX cho phép chúng ta học hỏi cùng nhau.

## Trải nghiệm người dùng

**Vấn đề với quy trình tuyến tính:**
Bạn đang ở "giai đoạn lập kế hoạch", sau đó "giai đoạn triển khai", rồi "hoàn thành". Nhưng công việc thực tế không hoạt động như vậy. Bạn triển khai một thứ gì đó, nhận ra thiết kế của mình sai, cần cập nhật spec, tiếp tục triển khai. Các giai đoạn tuyến tính mâu thuẫn với cách công việc thực sự diễn ra.

**Cách tiếp cận của OPSX:**
- **Hành động, không phải giai đoạn** — tạo, triển khai, cập nhật, lưu trữ — thực hiện bất kỳ hành động nào bất cứ lúc nào
- **Phụ thuộc là yếu tố kích hoạt** — chúng cho thấy điều gì khả thi, không phải điều gì cần làm tiếp theo

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Thiết lập

```bash
# Đảm bảo bạn đã cài đặt openspec — skill được tạo tự động
openspec init
```

Lệnh này tạo các skill trong `.claude/skills/` (hoặc tương đương) mà các trợ lý lập trình AI tự động phát hiện.

Theo mặc định, OpenSpec sử dụng hồ sơ quy trình làm việc `core` (`propose`, `explore`, `apply`, `archive`). Nếu bạn muốn các lệnh quy trình làm việc mở rộng (`new`, `continue`, `ff`, `verify`, `sync`, `bulk-archive`, `onboard`), hãy cấu hình chúng bằng `openspec config profile` và áp dụng bằng `openspec update`.

Trong quá trình thiết lập, bạn sẽ được nhắc tạo một **file cấu hình dự án** (`openspec/config.yaml`). Điều này là tùy chọn nhưng được khuyến nghị.

## Cấu hình dự án

Cấu hình dự án cho phép bạn đặt giá trị mặc định và chèn ngữ cảnh cụ thể của dự án vào tất cả các artifact.

### Tạo cấu hình

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

### Các trường cấu hình

| Trường | Kiểu | Mô tả |
|-------|------|-------------|
| `schema` | string | Schema mặc định cho các thay đổi mới (ví dụ: `spec-driven`) |
| `context` | string | Ngữ cảnh dự án được chèn vào hướng dẫn của tất cả artifact |
| `rules` | object | Quy tắc theo artifact, được đánh dấu bằng ID artifact |

### Cách nó hoạt động

**Thứ tự ưu tiên Schema** (từ cao đến thấp):
1. Cờ CLI (`--schema <name>`)
2. Metadata thay đổi (`.openspec.yaml` trong thư mục thay đổi)
3. Cấu hình dự án (`openspec/config.yaml`)
4. Mặc định (`spec-driven`)

**Chèn ngữ cảnh:**
- Ngữ cảnh được thêm vào đầu hướng dẫn của mỗi artifact
- Được bọc trong thẻ `<context>...</context>`
- Giúp AI hiểu quy ước dự án của bạn

**Chèn quy tắc:**
- Quy tắc chỉ được chèn cho các artifact khớp
- Được bọc trong thẻ `<rules>...</rules>`
- Xuất hiện sau ngữ cảnh, trước mẫu

### ID Artifact theo Schema

**spec-driven** (mặc định):
- `proposal` — Đề xuất thay đổi
- `specs` — Thông số kỹ thuật
- `design` — Thiết kế kỹ thuật
- `tasks` — Các nhiệm vụ triển khai

### Xác thực cấu hình

- Các ID artifact không xác định trong `rules` sẽ tạo cảnh báo
- Tên schema được xác thực dựa trên các schema có sẵn
- Ngữ cảnh có giới hạn kích thước 50KB
- YAML không hợp lệ được báo cáo kèm số dòng

### Khắc phục sự cố

**"Unknown artifact ID in rules: X"**
- Kiểm tra ID artifact có khớp với schema của bạn không (xem danh sách ở trên)
- Chạy `openspec schemas --json` để xem ID artifact cho mỗi schema

**Cấu hình không được áp dụng:**
- Đảm bảo file nằm ở `openspec/config.yaml` (không phải `.yml`)
- Kiểm tra cú pháp YAML bằng trình xác thực
- Thay đổi cấu hình có hiệu lực ngay lập tức (không cần khởi động lại)

**Ngữ cảnh quá lớn:**
- Ngữ cảnh bị giới hạn ở 50KB
- Tóm tắt hoặc liên kết đến tài liệu bên ngoài thay thế

## Lệnh

| Lệnh | Chức năng |
|---------|--------------|
| `/opsx:propose` | Tạo một thay đổi và tạo các artifact lập kế hoạch trong một bước (đường dẫn nhanh mặc định) |
| `/opsx:explore` | Suy nghĩ về ý tưởng, nghiên cứu vấn đề, làm rõ yêu cầu |
| `/opsx:new` | Bắt đầu một khung thay đổi mới (quy trình mở rộng) |
| `/opsx:continue` | Tạo artifact tiếp theo (quy trình mở rộng) |
| `/opsx:ff` | Tăng tốc các artifact lập kế hoạch (quy trình mở rộng) |
| `/opsx:apply` | Triển khai các nhiệm vụ, cập nhật artifact khi cần thiết |
| `/opsx:verify` | Xác thực việc triển khai so với artifact (quy trình mở rộng) |
| `/opsx:sync` | Đồng bộ delta spec lên nhánh chính (quy trình mở rộng, tùy chọn) |
| `/opsx:archive` | Lưu trữ khi hoàn thành |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi đã hoàn thành (quy trình mở rộng) |
| `/opsx:onboard` | Hướng dẫn từng bước một thay đổi đầu cuối (quy trình mở rộng) |

## Cách sử dụng

### Khám phá một ý tưởng
```
/opsx:explore
```
Suy nghĩ về ý tưởng, nghiên cứu vấn đề, so sánh các lựa chọn. Không cần cấu trúc - chỉ cần một đối tác tư duy. Khi những hiểu biết được kết tinh, chuyển sang `/opsx:propose` (mặc định) hoặc `/opsx:new`/`/opsx:ff` (mở rộng).

### Bắt đầu một thay đổi mới
```
/opsx:propose
```
Tạo thay đổi và tạo các artifact lập kế hoạch cần thiết trước khi triển khai.

Nếu bạn đã bật quy trình làm việc mở rộng, bạn có thể sử dụng thay thế:

```text
/opsx:new        # chỉ tạo khung
/opsx:continue   # tạo một artifact tại một thời điểm
/opsx:ff         # tạo tất cả artifact lập kế hoạch cùng lúc
```

### Tạo artifact
```
/opsx:continue
```
Hiển thị những gì sẵn sàng tạo dựa trên phụ thuộc, sau đó tạo một artifact. Sử dụng lặp lại để xây dựng thay đổi của bạn dần dần.

```
/opsx:ff add-dark-mode
```
Tạo tất cả artifact lập kế hoạch cùng lúc. Sử dụng khi bạn có bức tranh rõ ràng về những gì bạn đang xây dựng.

### Triển khai (phần linh hoạt)
```
/opsx:apply
```
Xử lý các nhiệm vụ, đánh dấu hoàn thành khi bạn tiến hành. Nếu bạn đang xử lý nhiều thay đổi, bạn có thể chạy `/opsx:apply <name>`; nếu không, nó nên suy luận từ cuộc trò chuyện và nhắc bạn chọn nếu nó không thể xác định.

### Hoàn thành
```
/opsx:archive   # Chuyển sang lưu trữ khi hoàn thành (nhắc đồng bộ spec nếu cần)
```

## Khi nào nên cập nhật so với bắt đầu lại

Bạn luôn có thể chỉnh sửa đề xuất hoặc spec của mình trước khi triển khai. Nhưng khi nào việc tinh chỉnh trở thành "đây là công việc khác"?

### Một đề xuất nắm bắt điều gì

Một đề xuất xác định ba điều:
1. **Mục đích** — Bạn đang giải quyết vấn đề gì?
2. **Phạm vi** — Điều gì nằm trong/ngoài phạm vi?
3. **Cách tiếp cận** — Bạn sẽ giải quyết nó như thế nào?

Câu hỏi là: cái gì đã thay đổi, và thay đổi nhiều như thế nào?

### Cập nhật thay đổi hiện tại khi:

**Cùng mục đích, thực thi được tinh chỉnh**
- Bạn phát hiện các trường hợp biên mà bạn chưa xem xét
- Cách tiếp cận cần điều chỉnh nhưng mục tiêu không thay đổi
- Việc triển khai cho thấy thiết kế hơi lệch

**Phạm vi thu hẹp**
- Bạn nhận ra phạm vi đầy đủ quá lớn, muốn phát hành MVP trước
- "Thêm chế độ tối" → "Thêm nút chuyển đổi chế độ tối (sở thích hệ thống trong v2)"

**Sửa đổi dựa trên học hỏi**
- Codebase không được cấu trúc như bạn nghĩ
- Một phụ thuộc không hoạt động như mong đợi
- "Sử dụng CSS variables" → "Sử dụng tiền tố dark: của Tailwind thay thế"

### Bắt đầu thay đổi mới khi:

**Mục đích thay đổi cơ bản**
- Bản thân vấn đề giờ đã khác
- "Thêm chế độ tối" → "Thêm hệ thống chủ đề toàn diện với màu sắc, phông chữ, khoảng cách tùy chỉnh"

**Phạm vi bùng nổ**
- Thay đổi phát triển đến mức nó thực sự là công việc khác
- Đề xuất ban đầu sẽ không thể nhận ra sau khi cập nhật
- "Sửa lỗi đăng nhập" → "Viết lại hệ thống xác thực"

**Bản gốc có thể hoàn thành**
- Thay đổi ban đầu có thể được đánh dấu "hoàn thành"
- Công việc mới độc lập, không phải sự tinh chỉnh
- Hoàn thành "Thêm chế độ tối MVP" → Lưu trữ → Thay đổi mới "Nâng cấp chế độ tối"

### Các nguyên tắc

```
                        ┌─────────────────────────────────────┐
                        │     Đây có phải cùng một công việc? │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Cùng mục đích?    >50% chồng chéo?   Bản gốc có thể
             Cùng vấn đề?      Cùng phạm vi?      "hoàn thành" mà không
                    │                  │          có những thay đổi này?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         CÓ                KHÔNG CÓ          KHÔNG KHÔNG         CÓ
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       CẬP NHẬT         MỚI CẬP NHẬT     MỚI CẬP NHẬT       MỚI
```

| Kiểm tra | Cập nhật | Thay đổi mới |
|------|--------|------------|
| **Bản sắc** | "Cùng một thứ, được tinh chỉnh" | "Công việc khác" |
| **Chồng chéo phạm vi** | >50% chồng chéo | <50% chồng chéo |
| **Hoàn thành** | Không thể "hoàn thành" nếu không có thay đổi | Có thể hoàn thành bản gốc, công việc mới độc lập |
| **Câu chuyện** | Chuỗi cập nhật kể câu chuyện mạch lạc | Các bản sửa lỗi sẽ gây nhầm lẫn hơn là làm rõ |

### Nguyên tắc

> **Cập nhật bảo toàn ngữ cảnh. Thay đổi mới mang lại sự rõ ràng.**
>
> Chọn cập nhật khi lịch sử suy nghĩ của bạn có giá trị.
> Chọn thay đổi mới khi bắt đầu lại sẽ rõ ràng hơn là sửa chữa.

Hãy nghĩ về nó như các nhánh git:
- Tiếp tục commit trong khi làm việc trên cùng một tính năng
- Bắt đầu một nhánh mới khi đó thực sự là công việc mới
- Đôi khi hợp nhất một tính năng một phần và bắt đầu lại cho giai đoạn 2

## Điểm Khác Biệt?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Cấu trúc** | Một tài liệu đề xuất lớn | Các thành phần riêng biệt với phụ thuộc |
| **Quy trình làm việc** | Các giai đoạn tuyến tính: lên kế hoạch → triển khai → lưu trữ | Các hành động linh hoạt — thực hiện bất cứ lúc nào |
| **Tính lặp lại** | Khó khăn khi quay lại | Cập nhật các thành phần khi bạn học được |
| **Tùy chỉnh** | Cấu trúc cố định | Điều khiển bởi schema (định nghĩa các thành phần của riêng bạn) |

**Điểm mấu chốt là:** công việc không phải là tuyến tính. OPSX ngừng giả vờ rằng nó là vậy.

## Khám Phá Sâu Về Kiến Trúc

Phần này giải thích cách OPSX hoạt động bên trong và so sánh nó với quy trình làm việc cũ.
Các ví dụ trong phần này sử dụng bộ lệnh mở rộng (`new`, `continue`, v.v.); người dùng `core` mặc định có thể ánh xạ cùng luồng công việc sang `propose → apply → archive`.

### Triết Lý: Các Giai Đoạn vs Các Hành Động

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         QUY TRÌNH LÀM VIỆC CŨ                              │
│                    (Khóa Giai Đoạn, Hoàn Toàn Hoặc Không Gì)               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │    GIAI       │ ───► │   THỰC HIỆN  │ ───► │    LƯU TRỮ   │             │
│   │    ĐOẠN       │      │    GIAI       │      │    GIAI       │             │
│   │    LẬP KẾ HOẠCH│      │    ĐOẠN       │      │    ĐOẠN       │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Tạo TẤT CẢ các sản phẩm cùng một lúc                                  │
│   • Không thể quay lại cập nhật spec trong quá trình thực hiện             │
│   • Các cổng giai đoạn bắt buộc tiến trình tuyến tính                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────────────┐
│                         QUY TRÌNH LÀM VIỆC OPSX                            │
│                      (Các Hành Động Linh Hoạt, Lặp Lại)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│              ┌────────────────────────────────────────────┐                 │
│              │        CÁC HÀNH ĐỘNG (không phải giai đoạn)│                 │
│              │                                            │                 │
│              │   new ◄──► continue ◄──► apply ◄──► archive │                 │
│              │    │          │           │           │    │                 │
│              │    └──────────┴───────────┴───────────┘    │                 │
│              │              bất kỳ thứ tự nào             │                 │
│              └────────────────────────────────────────────┘                 │
│                                                                             │
│   • Tạo các sản phẩm một lần HOẶC tiến nhanh                              │
│   • Cập nhật spec/thiết kế/nhiệm vụ trong quá trình thực hiện             │
│   • Các phụ thuộc cho phép tiến độ, các giai đoạn không tồn tại           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Kiến Trúc Thành Phần

**Quy trình làm việc cũ** sử dụng các mẫu được mã hóa cứng trong TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CÁC THÀNH PHẦN QUY TRÌNH CŨ                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Các Mẫu Mã Hóa Cứng (Chuỗi TypeScript)                                  │
│                    │                                                        │
│                    ▼                                                        │
│   Các bộ cấu hình/bộ chuyển đổi chuyên dụng cho công cụ                   │
│                    │                                                        │
│                    ▼                                                        │
│   Các Tệp Lệnh Được Tạo (.claude/commands/openspec/*.md)                  │
│                                                                             │
│   • Cấu trúc cố định, không nhận biết sản phẩm                             │
│   • Thay đổi yêu cầu sửa đổi mã + xây dựng lại                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** sử dụng các lược đồ bên ngoài và một động cơ đồ thị phụ thuộc:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CÁC THÀNH PHẦN OPSX                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Định Nghĩa Lược Đồ (YAML)                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Phụ thuộc                        │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Mẫu glob                        │   │
│   │      requires: [proposal]      ◄── Cho phép sau proposal           │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Động Cơ Đồ Thị Sản Phẩm                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Sắp xếp topo (thứ tự phụ thuộc)                                 │   │
│   │  • Phát hiện trạng thái (tồn tại hệ thống tệp)                     │   │
│   │  • Tạo hướng dẫn phong phú (mẫu + ngữ cảnh)                        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Các Tệp Kỹ Năng (.claude/skills/openspec-*/SKILL.md)                     │
│                                                                             │
│   • Tương thích đa trình soạn thảo (Claude Code, Cursor, Windsurf)         │
│   • Các kỹ năng truy vấn CLI để lấy dữ liệu có cấu trúc                  │
│   • Hoàn toàn tùy chỉnh được thông qua các tệp lược đồ                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mô Hình Đồ Thị Phụ Thuộc

Các sản phẩm tạo thành một đồ thị có hướng không chu trình (DAG). Các phụ thuộc là **chất xúc tác**, không phải cổng:

```
                              proposal
                             (nút gốc)
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
                 specs                       design
              (yêu cầu:                   (yêu cầu:
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
                          │ (yêu cầu:   │
                          │  tasks)      │
                          └──────────────┘
```

**Chuyển đổi trạng thái:**

```
   BỊ KHÓA ────────────────► SẴN SÀNG ────────────────► HOÀN THÀNH
      │                        │                       │
   Thiếu                  Tất cả phụ             Tệp tồn tại
   phụ thuộc               thuộc đều               trên hệ thống
                           HOÀN THÀNH              tệp
```

### Luồng Thông Tin

**Quy trình làm việc cũ** — agent nhận hướng dẫn tĩnh:

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
  │  Không nhận biết những gì đã tồn tại    │
  │  hoặc phụ thuộc giữa các sản phẩm       │
  └─────────────────────────────────────────┘
           │
           ▼
  Agent tạo TẤT CẢ các sản phẩm cùng một lúc
```

**OPSX** — agent truy vấn ngữ cảnh phong phú:

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
  │  │      {"id": "specs", "status": "ready"},      ◄── Đầu tiên sẵn sàng│  │
  │  │      {"id": "design", "status": "ready"},                          │  │
  │  │      {"id": "tasks", "status": "blocked", "missingDeps": ["specs"]}│  │
  │  │    ]                                                               │  │
  │  │  }                                                                 │  │
  │  └────────────────────────────────────────────────────────────────────┘  │
  │                                                                          │
  │  Bước 2: Lấy hướng dẫn phong phú cho sản phẩm sẵn sàng                  │
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
  │  Bước 3: Đọc phụ thuộc → Tạo MỘT sản phẩm → Hiển thị những gì được mở  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Mô Hình Lặp Lại

**Quy trình làm việc cũ** — khó lặp lại:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Khoan đã, thiết kế bị sai"
       │               │
       │               ├── Các lựa chọn:
       │               │   • Chỉnh sửa tệp thủ công (phá vỡ ngữ cảnh)
       │               │   • Bỏ cuộc và bắt đầu lại
       │               │   • Đẩy qua và sửa sau
       │               │
       │               └── Không có cơ chế "quay lại" chính thức
       │
       └── Tạo TẤT CẢ các sản phẩm cùng một lúc
```

**OPSX** — lặp lại tự nhiên:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Thiết kế bị sai"
      │                │                  │
      │                │                  ▼
      │                │            Chỉ cần chỉnh sửa design.md
      │                │            và tiếp tục!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply tiếp tục
      │                │         từ nơi bạn đã dừng
      │                │
      │                └── Tạo MỘT sản phẩm, hiển thị những gì được mở
      │
      └── Xây dựng khung thay đổi, chờ chỉ đạo
```

### Các Lược Đồ Tùy Chỉnh

Tạo các quy trình làm việc tùy chỉnh bằng các lệnh quản lý lược đồ:

```bash
# Tạo lược đồ mới từ đầu (trực quan)
openspec schema init my-workflow

# Hoặc sao chép lược đồ hiện có làm điểm bắt đầu
openspec schema fork spec-driven my-workflow

# Xác thực cấu trúc lược đồ của bạn
openspec schema validate my-workflow

# Xem lược đồ được giải quyết từ đâu (hữu ích cho gỡ lỗi)
openspec schema which my-workflow
```

Các lược đồ được lưu trữ trong `openspec/schemas/` (cục bộ dự án, được kiểm soát phiên bản) hoặc `~/.local/share/openspec/schemas/` (toàn cục người dùng).

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
  - id: research        # Thêm vào trước proposal
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
|--------|----------|------|
| **Mẫu** | TypeScript mã hóa cứng | YAML bên ngoài + Markdown |
| **Phụ Thuộc** | Không có (tất cả cùng lúc) | DAG với sắp xếp topo |
| **Trạng Thái** | Mô hình tinh thần dựa trên giai đoạn | Tồn tại hệ thống tệp |
| **Tùy Chỉnh** | Chỉnh sửa mã nguồn, xây dựng lại | Tạo schema.yaml |
| **Lặp Lại** | Bị khóa giai đoạn | Linh hoạt, chỉnh sửa bất kỳ |
| **Hỗ Trợ Trình Soạn Thảo** | Bộ cấu hình/bộ chuyển đổi chuyên dụng cho công cụ | Thư mục kỹ năng duy nhất |

## Schemas

Schemas định nghĩa các artifact tồn tại và các phụ thuộc của chúng. Hiện tại có sẵn:

- **spec-driven** (mặc định): proposal → specs → design → tasks

```bash
# Liệt kê các schemas khả dụng
openspec schemas

# Xem tất cả schemas cùng nguồn phân giải của chúng
openspec schema which --all

# Tạo một schema mới một cách tương tác
openspec schema init my-workflow

# Fork một schema hiện có để tùy chỉnh
openspec schema fork spec-driven my-workflow

# Xác thực cấu trúc schema trước khi sử dụng
openspec schema validate my-workflow
```

## Mẹo

- Sử dụng `/opsx:explore` để suy nghĩ kỹ về một ý tưởng trước khi thực hiện thay đổi
- `/opsx:ff` khi bạn biết mình muốn gì, `/opsx:continue` khi đang khám phá
- Trong quá trình `/opsx:apply`, nếu có gì sai — hãy sửa artifact, sau đó tiếp tục
- Các task theo dõi tiến độ thông qua các checkbox trong `tasks.md`
- Kiểm tra trạng thái bất cứ lúc nào: `openspec status --change "name"`

## Phản hồi

Đây là phiên bản thô. Điều đó là có chủ đích — chúng tôi đang học hỏi những gì hiệu quả.

Tìm thấy lỗi? Có ý tưởng? Tham gia cùng chúng tôi trên [Discord](https://discord.gg/YctCnvvshC) hoặc mở issue trên [GitHub](https://github.com/Fission-AI/openspec/issues).