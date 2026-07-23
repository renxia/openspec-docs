# OPSX Workflow
> Phản hồi luôn được chào đón trên [Discord](https://discord.gg/YctCnvvshC).
## Nó là gì?
OPSX hiện là quy trình làm việc tiêu chuẩn cho OpenSpec.
Đây là **quy trình làm việc linh hoạt, lặp đi lặp lại** dành cho các thay đổi trong OpenSpec. Không còn các giai đoạn cứng nhắc nữa — chỉ còn các hành động bạn có thể thực hiện bất cứ lúc nào.

## Lý do tồn tại

Quy trình OpenSpec cũ hoạt động được, nhưng nó bị **khóa chặt**:

- **Hướng dẫn được hardcode** — nằm sâu trong mã TypeScript, bạn không thể thay đổi chúng
- **Tất cả hoặc không** — một lệnh lớn tạo ra mọi thứ, không thể kiểm tra từng phần riêng lẻ
- **Cấu trúc cố định** — quy trình giống nhau cho tất cả mọi người, không thể tùy chỉnh
- **Hộp đen** — khi đầu ra của AI không tốt, bạn không thể điều chỉnh các prompt

**OPSX mở khóa tất cả điều đó.** Bây giờ bất kỳ ai cũng có thể:

1. **Thử nghiệm với hướng dẫn** — chỉnh sửa một mẫu template, xem AI có hoạt động tốt hơn không
2. **Kiểm tra chi tiết từng phần** — xác thực hướng dẫn của từng artifact một cách độc lập
3. **Tùy chỉnh quy trình làm việc** — tự định nghĩa các artifact và phụ thuộc của riêng bạn
4. **Lặp lại nhanh chóng** — thay đổi một mẫu template, kiểm tra ngay lập tức, không cần build lại

```
Quy trình cũ:                      OPSX:
┌─────────────────────────────────────┐           ┌─────────────────────────────────────┐
│  Hardcoded trong package            │           │  schema.yaml           ◄── Bạn chỉnh sửa cái này
│  (không thể thay đổi)              │           │  templates/*.md        ◄── Hoặc cái này
│        ↓                           │           │        ↓               │
│  Chờ bản phát hành mới             │           │  Hiệu quả tức thì      │
│        ↓                           │           │        ↓               │
│  Hy vọng nó tốt hơn                │           │  Tự kiểm tra            │
└─────────────────────────────────────┘           └─────────────────────────────────────┘
```

**Đối tượng sử dụng:**
- **Các nhóm phát triển** — tạo quy trình làm việc phù hợp với cách các bạn thực sự làm việc
- **Người dùng nâng cao** — điều chỉnh các prompt để nhận được đầu ra AI tốt hơn cho cơ sở mã của bạn
- **Người đóng góp OpenSpec** — thử nghiệm các phương pháp tiếp cận mới mà không cần phát hành bản cập nhật

Tất cả chúng ta vẫn đang tìm ra cách hoạt động tốt nhất. OPSX giúp chúng ta học hỏi cùng nhau.

## Trải nghiệm người dùng

**Vấn đề của các quy trình làm việc tuyến tính:**
Bạn sẽ "ở giai đoạn lập kế hoạch", sau đó "ở giai đoạn thực hiện", rồi "hoàn thành". Nhưng công việc thực tế không hoạt động theo cách đó. Bạn thực hiện một việc gì đó, nhận ra thiết kế của mình sai, cần cập nhật các spec, rồi tiếp tục thực hiện. Các giai đoạn tuyến tính này đi ngược lại với cách công việc thực sự diễn ra.

**Cách tiếp cận của OPSX:**
- **Hành động, không phải giai đoạn** — tạo, thực hiện, cập nhật, lưu trữ — thực hiện bất kỳ hành động nào bất cứ lúc nào
- **Các phụ thuộc là công cụ hỗ trợ** — chúng hiển thị những gì có thể làm được, chứ không phải những gì cần làm tiếp theo

```
  proposal ──→ specs ──→ design ──→ tasks ──→ implement
```

## Cài đặt

```bash
# Đảm bảo bạn đã cài đặt openspec — các kỹ năng (skills) được tạo tự động
openspec init
```

Lệnh này sẽ tạo các kỹ năng (skills) trong thư mục `.claude/skills/` (hoặc thư mục tương ứng) mà các trợ lý lập trình AI có thể tự động phát hiện.

Theo mặc định, OpenSpec sử dụng hồ sơ quy trình làm việc `core` (`propose`, `explore`, `apply`, `sync`, `archive`). Nếu bạn muốn sử dụng các lệnh quy trình làm việc mở rộng (`new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`), hãy cấu hình chúng bằng lệnh `openspec config profile` và áp dụng bằng lệnh `openspec update`.

Trong quá trình cài đặt, bạn sẽ được nhắc tạo **cấu hình dự án** (`openspec/config.yaml`). Cấu hình này là tùy chọn nhưng được khuyến nghị.

## Cấu hình dự án

Cấu hình dự án cho phép bạn đặt các giá trị mặc định và chèn ngữ cảnh cụ thể của dự án vào tất cả các artifact.

### Tạo cấu hình

Cấu hình được tạo trong quá trình chạy `openspec init`, hoặc bạn có thể tạo thủ công:

```yaml
# openspec/config.yaml
schema: spec-driven

context: |
  Công nghệ sử dụng: TypeScript, React, Node.js
  Quy ước API: RESTful, phản hồi JSON
  Kiểm thử: Vitest cho kiểm thử đơn vị, Playwright cho kiểm thử end-to-end
  Phong cách mã: ESLint kết hợp với Prettier, TypeScript nghiêm ngặt

rules:
  proposal:
    - Bao gồm kế hoạch khôi phục
    - Xác định các nhóm bị ảnh hưởng
  specs:
    - Sử dụng định dạng Given/When/Then cho các kịch bản
  design:
    - Bao gồm sơ đồ trình tự cho các luồng phức tạp
```

### Các trường cấu hình

| Trường | Kiểu dữ liệu | Mô tả |
|-------|--------------|-------|
| `schema` | string | Schema mặc định cho các thay đổi mới (ví dụ: `spec-driven`) |
| `context` | string | Ngữ cảnh dự án được chèn vào tất cả hướng dẫn của các artifact |
| `rules` | object | Các quy tắc theo từng artifact, được khóa theo ID của artifact |

### Cách hoạt động

**Thứ tự ưu tiên schema** (từ cao đến thấp):
1. Cờ CLI (`--schema <tên>`)
2. Metadata của thay đổi (tệp `.openspec.yaml` trong thư mục thay đổi)
3. Cấu hình dự án (`openspec/config.yaml`)
4. Giá trị mặc định (`spec-driven`)

**Chèn ngữ cảnh:**
- Ngữ cảnh được thêm vào đầu của hướng dẫn mọi artifact
- Được bọc trong các thẻ `<context>...</context>`
- Giúp AI hiểu các quy ước của dự án bạn

**Chèn quy tắc:**
- Các quy tắc chỉ được chèn cho các artifact tương ứng
- Được bọc trong các thẻ `<rules>...</rules>`
- Xuất hiện sau ngữ cảnh, trước mẫu template

### ID các artifact theo Schema

**spec-driven** (mặc định):
- `proposal` — Đề xuất thay đổi
- `specs` — Đặc tả kỹ thuật
- `design` — Thiết kế kỹ thuật
- `tasks` — Các nhiệm vụ thực hiện

### Xác thực cấu hình

- Các ID artifact không xác định trong `rules` sẽ tạo ra cảnh báo
- Tên schema được xác thực với các schema có sẵn
- Ngữ cảnh có giới hạn kích thước 50KB
- Các tệp YAML không hợp lệ sẽ được báo cáo kèm số dòng

### Xử lý sự cố

**"ID artifact không xác định trong rules: X"**
- Kiểm tra xem các ID artifact có khớp với schema của bạn không (xem danh sách ở trên)
- Chạy lệnh `openspec schemas --json` để xem ID artifact của từng schema

**Cấu hình không được áp dụng:**
- Đảm bảo tệp nằm ở đường dẫn `openspec/config.yaml` (không phải `.yml`)
- Kiểm tra cú pháp YAML bằng công cụ xác thực
- Các thay đổi cấu hình có hiệu lực ngay lập tức (không cần khởi động lại)

**Ngữ cảnh quá lớn:**
- Ngữ cảnh bị giới hạn ở 50KB
- Tóm tắt hoặc liên kết đến tài liệu bên ngoài thay thế

## Các lệnh

| Lệnh | Chức năng |
|------|-----------|
| `/opsx:propose` | Tạo một thay đổi và tạo ra các artifact lập kế hoạch trong một bước (đường dẫn nhanh mặc định) |
| `/opsx:explore` | Suy nghĩ về các ý tưởng, điều tra vấn đề, làm rõ yêu cầu |
| `/opsx:new` | Bắt đầu khung thay đổi mới (quy trình làm việc mở rộng) |
| `/opsx:continue` | Tạo artifact tiếp theo (quy trình làm việc mở rộng) |
| `/opsx:ff` | Tạo nhanh tất cả các artifact lập kế hoạch (quy trình làm việc mở rộng) |
| `/opsx:apply` | Thực hiện các nhiệm vụ, cập nhật các artifact khi cần |
| `/opsx:update` | Chỉnh sửa các artifact lập kế hoạch của thay đổi và giữ cho chúng nhất quán |
| `/opsx:verify` | Xác thực phần thực hiện so với các artifact (quy trình làm việc mở rộng) |
| `/opsx:sync` | Đồng bộ các spec delta lên nhánh chính (quy trình làm việc mặc định, tùy chọn) |
| `/opsx:archive` | Lưu trữ khi hoàn thành |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi đã hoàn thành (quy trình làm việc mở rộng) |
| `/opsx:onboard` | Hướng dẫn từng bước cho một thay đổi đầu cuối đến đầu cuối (quy trình làm việc mở rộng) |

## Cách sử dụng

### Khám phá một ý tưởng
```
/opsx:explore
```
Suy nghĩ về các ý tưởng, điều tra vấn đề, so sánh các lựa chọn. Không cần cấu trúc cố định — chỉ cần một đối tác suy nghĩ cùng bạn. Khi các hiểu biết rõ ràng hơn, chuyển sang `/opsx:propose` (mặc định) hoặc `/opsx:new`/`/opsx:ff` (quy trình mở rộng).

### Bắt đầu một thay đổi mới
```
/opsx:propose
```
Tạo thay đổi và tạo ra các artifact lập kế hoạch cần thiết trước khi thực hiện.

Nếu bạn đã bật các quy trình làm việc mở rộng, bạn có thể sử dụng thay vào đó:

```text
/opsx:new        # Chỉ tạo khung thay đổi
/opsx:continue   # Tạo từng artifact một
/opsx:ff         # Tạo tất cả các artifact lập kế hoạch cùng lúc
```

### Tạo các artifact
```
/opsx:continue
```
Hiển thị những artifact nào sẵn sàng để tạo dựa trên các phụ thuộc, sau đó tạo một artifact. Sử dụng lặp đi lặp lại để xây dựng thay đổi của bạn từng bước một.

```
/opsx:ff add-dark-mode
```
Tạo tất cả các artifact lập kế hoạch cùng lúc. Sử dụng khi bạn có bức tranh rõ ràng về những gì bạn đang xây dựng.

### Thực hiện (phần linh hoạt)
```
/opsx:apply
```
Xử lý các nhiệm vụ, đánh dấu hoàn thành khi bạn làm xong. Nếu bạn đang xử lý nhiều thay đổi cùng lúc, bạn có thể chạy `/opsx:apply <tên>`; nếu không, hệ thống sẽ suy luận từ cuộc trò chuyện và nhắc bạn chọn nếu không thể xác định được.

### Cập nhật một thay đổi
```
/opsx:update add-dark-mode - chúng tôi đang lưu chủ đề trong cookie rồi
```
Chỉnh sửa các artifact lập kế hoạch hiện có của thay đổi và giữ cho chúng nhất quán — theo mọi hướng (việc chỉnh sửa thiết kế có thể ảnh hưởng ngược lại đến đề xuất). Chỉ tác động đến các artifact lập kế hoạch: nó không bao giờ chỉnh sửa mã, và không bao giờ tạo các artifact bị thiếu (đó là chức năng của `/opsx:continue`). Mọi chỉnh sửa đều được xác nhận với bạn trước. Nếu thay đổi đã được thực hiện trước đó, nó sẽ đề xuất chạy `/opsx:apply` để mã nguồn cập nhật theo kế hoạch đã chỉnh sửa. Nếu chỉnh sửa của bạn thay đổi *mục đích* của thay đổi, hãy bắt đầu lại từ đầu thay vào đó — xem [Khi nào nên cập nhật thay vì bắt đầu lại](#when-to-update-vs-start-fresh).

### Hoàn thành
```
/opsx:archive   # Chuyển vào kho lưu trữ khi hoàn thành (nhắc bạn đồng bộ spec nếu cần)
```

## Khi nào nên cập nhật thay vì bắt đầu lại

Bạn luôn có thể chỉnh sửa đề xuất hoặc spec của mình trước khi thực hiện. Nhưng khi nào thì việc tinh chỉnh trở thành "đây là công việc khác"?

### Những gì một đề xuất nắm bắt

Một đề xuất định nghĩa ba yếu tố:
1. **Mục đích** — Bạn đang giải quyết vấn đề gì?
2. **Phạm vi** — Những gì nằm trong/ngoài phạm vi?
3. **Phương pháp tiếp cận** — Bạn sẽ giải quyết vấn đề đó như thế nào?

Câu hỏi là: yếu tố nào đã thay đổi, và thay đổi bao nhiêu?

### Cập nhật thay đổi hiện tại khi:

**Cùng mục đích, tinh chỉnh cách thực hiện**
- Bạn phát hiện các trường hợp biên không cân nhắc trước đó
- Phương pháp tiếp cận cần điều chỉnh nhưng mục tiêu không thay đổi
- Quá trình thực hiện cho thấy thiết kế hơi lệch

**Phạm vi thu hẹp**
- Bạn nhận ra phạm vi đầy đủ quá lớn, muốn phát hành MVP trước
- "Thêm chế độ tối" → "Thêm nút chuyển chế độ tối (tùy chọn hệ thống trong v2)"

**Các chỉnh sửa dựa trên kinh nghiệm học hỏi**
- Cơ sở mã không được cấu trúc như bạn nghĩ
- Một phụ thuộc không hoạt động như mong đợi
- "Sử dụng biến CSS" → "Sử dụng tiền tố `dark:` của Tailwind thay thế"

### Bắt đầu thay đổi mới khi:

**Mục đích thay đổi căn bản**
- Vấn đề bản thân đã khác bây giờ
- "Thêm chế độ tối" → "Thêm hệ thống chủ đề toàn diện với màu sắc, phông chữ, khoảng cách tùy chỉnh"

**Phạm vi bùng nổ (quá lớn)**
- Thay đổi phát triển quá lớn đến mức về bản chất là công việc khác
- Đề xuất ban đầu sẽ không còn nhận ra được sau khi cập nhật
- "Sửa lỗi đăng nhập" → "Viết lại hệ thống xác thực"

**Bản gốc có thể hoàn thành**
- Thay đổi ban đầu có thể được đánh dấu "hoàn thành"
- Công việc mới độc lập, không phải là sự tinh chỉnh
- Hoàn thành "Thêm chế độ tối MVP" → Lưu trữ → Thay đổi mới "Nâng cấp chế độ tối"

### Các quy tắc ngầm

```
                        ┌─────────────────────────────────────┐
                        │     Đây có phải cùng công việc không?          │
                        └──────────────┬──────────────────────┘
                                       │
                    ┌──────────────────┼──────────────────┐
                    │                  │                  │
                    ▼                  ▼                  ▼
             Cùng mục đích?      >50% trùng lặp?      Bản gốc có thể
             Cùng vấn đề?       Cùng phạm vi?        "hoàn thành" mà không có
                    │                  │          các thay đổi này?
                    │                  │                  │
          ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
          │                 │  │             │   │               │
         CÓ               KHÔNG CÓ           KHÔNG  KHÔNG              CÓ
          │                 │  │             │   │               │
          ▼                 ▼  ▼             ▼   ▼               ▼
       CẬP NHẬT            MỚI  CẬP NHẬT       MỚI  CẬP NHẬT          MỚI
```

| Tiêu chí | Cập nhật | Thay đổi mới |
|----------|----------|--------------|
| **Bản sắc** | "Cùng một việc, được tinh chỉnh" | "Công việc khác" |
| **Mức độ trùng lặp phạm vi** | >50% trùng lặp | <50% trùng lặp |
| **Khả năng hoàn thành** | Không thể "hoàn thành" nếu không có thay đổi | Có thể hoàn thành bản gốc, công việc mới độc lập |
| **Câu chuyện** | Chuỗi cập nhật kể một câu chuyện nhất quán | Các bản vá sẽ gây nhầm lẫn hơn là làm rõ |

### Nguyên tắc

> **Cập nhật giữ lại ngữ cảnh. Thay đổi mới tạo sự rõ ràng.**
> Chọn cập nhật khi lịch sử suy nghĩ của bạn có giá trị.
> Chọn thay đổi mới khi bắt đầu lại từ đầu rõ ràng hơn là vá các bản vá.

Hãy nghĩ về nó như các nhánh git:
- Tiếp tục commit khi đang làm việc trên cùng một tính năng
- Bắt đầu nhánh mới khi đó thực sự là công việc mới
- Đôi khi hợp nhất một tính năng chưa hoàn thành và bắt đầu lại từ đầu cho giai đoạn 2

## Điểm khác biệt?

| | Legacy (`/openspec:proposal`) | OPSX (`/opsx:*`) |
|---|---|---|
| **Cấu trúc** | Một tài liệu đề xuất lớn | Các artifact riêng biệt với các phụ thuộc |
| **Quy trình làm việc** | Các giai đoạn tuyến tính: lập kế hoạch → thực hiện → lưu trữ | Các hành động linh hoạt — thực hiện bất kỳ hành động nào bất cứ lúc nào |
| **Lặp lại** | Khó khăn khi quay lại | Cập nhật các artifact khi bạn học hỏi thêm |
| **Tùy chỉnh** | Cấu trúc cố định | Dựa trên schema (tự định nghĩa các artifact của riêng bạn) |

**Insight then chốt:** công việc không phải là tuyến tính. OPSX ngừng giả vờ như vậy.

## Đi sâu vào Kiến trúc

Phần này giải thích cách OPSX hoạt động bên trong và so sánh với quy trình làm việc cũ.
Các ví dụ trong phần này sử dụng bộ lệnh mở rộng (`new`, `continue`, v.v.); người dùng `core` mặc định có thể ánh xạ cùng một luồng sang `propose → apply → sync → archive`.

### Triết lý: Giai đoạn so với Hành động

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         QUY TRÌNH LÀM VIỆC CŨ                              │
│                    (Khóa giai đoạn, Tất cả hoặc không)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐             │
│   │  LẬP KẾ HOẠCH│ ───► │ TRIỂN KHAI   │ ───► │   LƯU TRỮ   │             │
│   │   GIAI ĐOẠN  │      │   GIAI ĐOẠN  │      │   GIAI ĐOẠN  │             │
│   └──────────────┘      └──────────────┘      └──────────────┘             │
│         │                     │                     │                       │
│         ▼                     ▼                     ▼                       │
│   /openspec:proposal   /openspec:apply      /openspec:archive              │
│                                                                             │
│   • Tạo TẤT CẢ tài liệu cùng lúc                                          │
│   • Không thể quay lại cập nhật đặc tả trong quá trình triển khai           │
│   • Cổng giai đoạn thực thi tiến trình tuyến tính                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                            QUY TRÌNH LÀM VIỆC OPSX                          │
│                      (Hành động linh hoạt, Lặp lại)                        │
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
│   • Tạo tài liệu từng cái một HOẶC chuyển nhanh                            │
│   • Cập nhật đặc tả/thiết kế/nhiệm vụ trong quá trình triển khai            │
│   • Phụ thuộc cho phép tiến độ, không tồn tại giai đoạn                     │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Kiến trúc Thành phần

**Quy trình làm việc cũ** sử dụng mẫu được mã hóa cứng trong TypeScript:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      THÀNH PHẦN QUY TRÌNH LÀM VIỆC CŨ                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Mẫu được mã hóa cứng (chuỗi TypeScript)                                   │
│                    │                                                        │
│                    ▼                                                        │
│   Bộ cấu hình/bộ chuyển đổi theo công cụ cụ thể                             │
│                    │                                                        │
│                    ▼                                                        │
│   Tệp lệnh được tạo (.claude/commands/openspec/*.md)                        │
│                                                                             │
│   • Cấu trúc cố định, không nhận biết tài liệu                              │
│   • Thay đổi yêu cầu sửa đổi mã + xây dựng lại                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**OPSX** sử dụng lược đồ bên ngoài và công cụ đồ thị phụ thuộc:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         OPSX COMPONENTS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   Định nghĩa Lược đồ (YAML)                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  name: spec-driven                                                  │   │
│   │  artifacts:                                                         │   │
│   │    - id: proposal                                                   │   │
│   │      generates: proposal.md                                         │   │
│   │      requires: []              ◄── Phụ thuộc                        │   │
│   │    - id: specs                                                      │   │
│   │      generates: specs/**/*.md  ◄── Mẫu Glob                         │   │
│   │      requires: [proposal]      ◄── Cho phép sau đề xuất             │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Công cụ Đồ thị Tài liệu                                                   │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Sắp xếp topo (thứ tự phụ thuộc)                                  │   │
│   │  • Phát hiện trạng thái (sự tồn tại của hệ thống tệp)              │   │
│   │  • Tạo hướng dẫn phong phú (mẫu + ngữ cảnh)                         │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                    │                                                        │
│                    ▼                                                        │
│   Tệp Kỹ năng (.claude/skills/openspec-*/SKILL.md)                          │
│                                                                             │
│   • Tương thích đa trình soạn thảo (Claude Code, Cursor, Windsurf)           │
│   • CLI truy vấn kỹ năng cho dữ liệu có cấu trúc                            │
│   • Hoàn toàn có thể tùy chỉnh qua tệp lược đồ                               │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Mô hình Đồ thị Phụ thuộc

Các tài liệu tạo thành đồ thị có hướng không chu kỳ (DAG). Phụ thuộc là **điều kiện tiên quyết**, không phải cổng:

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
                          │ (yêu cầu:   │
                          │  tasks)      │
                          └──────────────┘
```

**Chuyển đổi trạng thái:**

```
   BỊ CHẶN ────────────────► SẴN SÀNG ────────────────► HOÀN THÀNH
      │                        │                       │
   Thiếu phụ thuộc         Tất cả phụ thuộc         Tệp tồn tại
                            đã HOÀN THÀNH            trên hệ thống tệp
```

### Luồng Thông tin

**Quy trình làm việc cũ** — tác nhân nhận hướng dẫn tĩnh:

```
  User: "/openspec:proposal"
           │
           ▼
  ┌─────────────────────────────────────────┐
  │  Hướng dẫn tĩnh:                        │
  │  • Tạo proposal.md                      │
  │  • Tạo tasks.md                         │
  │  • Tạo design.md                        │
  │  • Tạo specs/<capability>/spec.md       │
  │                                         │
  │  Không nhận biết những gì tồn tại hoặc   │
  │  phụ thuộc giữa các tài liệu            │
  └─────────────────────────────────────────┘
           │
           ▼
  Tác nhân tạo TẤT CẢ tài liệu cùng lúc
```

**OPSX** — tác nhân truy vấn ngữ cảnh phong phú:

```
  User: "/opsx:continue"
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
  │  Bước 2: Lấy hướng dẫn phong phú cho tài liệu sẵn sàng                  │
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
  │  Bước 3: Đọc phụ thuộc → Tạo MỘT tài liệu → Hiển thị những gì được mở khóa  │
  └──────────────────────────────────────────────────────────────────────────┘
```

### Mô hình Lặp lại

**Quy trình làm việc cũ** — khó lặp lại:

```
  ┌─────────┐     ┌─────────┐     ┌─────────┐
  │/proposal│ ──► │ /apply  │ ──► │/archive │
  └─────────┘     └─────────┘     └─────────┘
       │               │
       │               ├── "Khoan, thiết kế bị sai rồi"
       │               │
       │               ├── Các lựa chọn:
       │               │   • Chỉnh sửa tệp thủ công (làm mất ngữ cảnh)
       │               │   • Bỏ cuộc và bắt đầu lại từ đầu
       │               │   • Cố gắng hoàn thành và sửa sau
       │               │
       │               └── Không có cơ chế "quay lại" chính thức nào
       │
       └── Tạo ra TẤT CẢ sản phẩm phụ cùng lúc
```

**OPSX** — lặp lại tự nhiên:

```
  /opsx:new ───► /opsx:continue ───► /opsx:apply ───► /opsx:archive
      │                │                  │
      │                │                  ├── "Thiết kế bị sai rồi"
      │                │                  │
      │                │                  ▼
      │                │            Chỉ cần chỉnh sửa design.md
      │                │            và tiếp tục thôi!
      │                │                  │
      │                │                  ▼
      │                │         /opsx:apply sẽ tiếp tục
      │                │         từ điểm bạn dừng lại
      │                │
      │                └── Tạo ra MỘT sản phẩm phụ, hiển thị những gì đã được mở khóa
      │
      └── Xây dựng khung cho thay đổi, chờ chỉ đạo
```

### Lược đồ tùy chỉnh

Tạo quy trình làm việc tùy chỉnh bằng các lệnh quản lý lược đồ:

```bash
# Tạo lược đồ mới từ đầu (tương tác)
openspec schema init my-workflow

# Hoặc phân nhánh lược đồ hiện có làm điểm khởi đầu
openspec schema fork spec-driven my-workflow

# Xác thực cấu trúc lược đồ của bạn
openspec schema validate my-workflow

# Xem lược đồ được giải quyết từ đâu (hữu ích cho gỡ lỗi)
openspec schema which my-workflow
```

Các lược đồ được lưu trữ trong `openspec/schemas/` (cục bộ của dự án, được kiểm soát phiên bản) hoặc `~/.local/share/openspec/schemas/` (toàn cục của người dùng).

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
  - id: research        # Được thêm trước proposal
    generates: research.md
    requires: []

  - id: proposal
    generates: proposal.md
    requires: [research]  # Bây giờ phụ thuộc vào research

  - id: tasks
    generates: tasks.md
    requires: [proposal]
```

**Đồ thị phụ thuộc:**
```
   research ──► proposal ──► tasks
```

### Tóm tắt

| Khía cạnh | Phiên bản cũ | OPSX |
|--------|----------|------|
| **Mẫu** | TypeScript được hardcode | YAML + Markdown bên ngoài |
| **Phụ thuộc** | Không có (tạo tất cả cùng lúc) | DAG với sắp xếp topo |
| **Trạng thái** | Mô hình tư duy theo giai đoạn | Sự tồn tại của hệ thống tệp |
| **Tùy chỉnh** | Chỉnh sửa mã nguồn, biên dịch lại | Tạo file schema.yaml |
| **Lặp lại** | Khóa theo giai đoạn | Linh hoạt, chỉnh sửa bất kỳ đâu |
| **Hỗ trợ trình soạn thảo** | Bộ cấu hình/adapter phụ thuộc công cụ | Thư mục kỹ năng duy nhất |
## Lược đồ

Các lược đồ xác định các sản phẩm phụ tồn tại và phụ thuộc của chúng. Hiện có sẵn:

- **spec-driven** (mặc định): proposal → specs → design → tasks

```bash
# Liệt kê các lược đồ có sẵn
openspec schemas

# Xem tất cả lược đồ cùng nguồn giải quyết của chúng
openspec schema which --all

# Tạo lược đồ mới một cách tương tác
openspec schema init my-workflow

# Phân nhánh lược đồ hiện có để tùy chỉnh
openspec schema fork spec-driven my-workflow

# Xác thực cấu trúc lược đồ trước khi sử dụng
openspec schema validate my-workflow
```

## Mẹo

- Sử dụng `/opsx:explore` để suy nghĩ kỹ qua một ý tưởng trước khi cam kết thực hiện thay đổi
- Sử dụng `/opsx:ff` khi bạn đã biết rõ mình muốn làm gì, `/opsx:continue` khi đang trong giai đoạn khám phá
- Trong quá trình chạy `/opsx:apply`, nếu có gì đó sai — sửa sản phẩm phụ tương ứng, sau đó tiếp tục
- Các nhiệm vụ theo dõi tiến độ thông qua các hộp kiểm trong tệp `tasks.md`
- Kiểm tra trạng thái bất cứ lúc nào bằng lệnh: `openspec status --change "name"`

## Phản hồi

Phiên bản hiện tại còn thô. Điều đó hoàn toàn có chủ ý — chúng tôi đang tìm hiểu những cái gì hoạt động tốt.

Tìm thấy lỗi? Có bất kỳ ý tưởng nào? Hãy tham gia cùng chúng tôi trên [Discord](https://discord.gg/YctCnvvshC) hoặc mở một vấn đề trên [GitHub](https://github.com/Fission-AI/openspec/issues).
```