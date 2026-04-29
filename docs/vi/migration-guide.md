# Di chuyển sang OPSX

Hướng dẫn này giúp bạn chuyển đổi từ quy trình làm việc OpenSpec cũ sang OPSX. Quá trình di chuyển được thiết kế để diễn ra suôn sẻ—công việc hiện tại của bạn được giữ nguyên, và hệ thống mới mang lại sự linh hoạt hơn.

## Những thay đổi là gì?

OPSX thay thế quy trình làm việc bị khóa theo giai đoạn trước đây bằng một phương pháp linh hoạt, dựa trên hành động. Đây là sự thay đổi chính:

| Khía cạnh | Cũ | OPSX |
|--------|--------|------|
| **Lệnh** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Mặc định: `/opsx:propose`, `/opsx:apply`, `/opsx:archive` (các lệnh quy trình mở rộng là tùy chọn) |
| **Quy trình làm việc** | Tạo tất cả các sản phẩm cùng một lúc | Tạo dần dần hoặc tất cả cùng một lúc—bạn có quyền lựa chọn |
| **Quay lại** | Các cổng giai đoạn cứng nhắc | Tự nhiên—cập nhật bất kỳ sản phẩm nào bất cứ lúc nào |
| **Tùy chỉnh** | Cấu trúc cố định | Dựa trên schema, có thể tùy chỉnh hoàn toàn |
| **Cấu hình** | `CLAUDE.md` với các đánh dấu + `project.md` | Cấu hình rõ ràng trong `openspec/config.yaml` |

**Sự thay đổi triết lý:** Công việc không phải là tuyến tính. OPSX ngừng giả vờ rằng nó là như vậy.

---

## Trước Khi Bắt Đầu

### Công Việc Hiện Tại Của Bạn An Toàn

Quy trình di chuyển được thiết kế với nguyên tắc bảo toàn:

- **Thay đổi đang hoạt động trong `openspec/changes/`** — Được bảo toàn hoàn toàn. Bạn có thể tiếp tục chúng bằng các lệnh OPSX.
- **Các thay đổi đã lưu trữ** — Không thay đổi. Lịch sử của bạn vẫn nguyên vẹn.
- **Các thông số kỹ thuật chính trong `openspec/specs/`** — Không thay đổi. Đây là nguồn thông tin chính xác của bạn.
- **Nội dung của bạn trong CLAUDE.md, AGENTS.md, v.v.** — Được bảo toàn. Chỉ các khối đánh dấu OpenSpec bị xóa; mọi thứ bạn viết vẫn được giữ lại.

### Những Thứ Bị Xóa

Chỉ các tệp được quản lý bởi OpenSpec đang được thay thế:

| Thứ gì | Tại sao |
|------|-----|
| Các thư mục/tệp lệnh slash cũ | Được thay thế bằng hệ thống kỹ năng mới |
| `openspec/AGENTS.md` | Quy trình kích hoạt lỗi thời |
| Các đánh dấu OpenSpec trong `CLAUDE.md`, `AGENTS.md`, v.v. | Không còn cần thiết nữa |

**Vị trí lệnh cũ theo công cụ** (ví dụ—công cụ của bạn có thể khác):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (chỉ dành cho tiện ích IDE; không được hỗ trợ trong Copilot CLI)
- Và các công cụ khác (Augment, Continue, Amazon Q, v.v.)

Quy trình di chuyển sẽ phát hiện các công cụ bạn đã cấu hình và dọn dẹp các tệp cũ của chúng.

Danh sách xóa có vẻ dài, nhưng đây đều là những tệp mà OpenSpec ban đầu đã tạo ra. Nội dung của bạn không bao giờ bị xóa.

### Những Thứ Cần Bạn Chú Ý

Một tệp yêu cầu di chuyển thủ công:

**`openspec/project.md`** — Tệp này không bị xóa tự động vì nó có thể chứa bối cảnh dự án bạn đã viết. Bạn sẽ cần:

1. Xem lại nội dung của nó
2. Di chuyển bối cảnh hữu ích sang `openspec/config.yaml` (xem hướng dẫn bên dưới)
3. Xóa tệp khi đã sẵn sàng

**Tại sao chúng tôi thực hiện thay đổi này:**

Tệp `project.md` cũ mang tính thụ động—các agent có thể đọc nó, có thể không, có thể quên những gì đã đọc. Chúng tôi nhận thấy độ tin cậy không nhất quán.

Bối cảnh mới trong `config.yaml` được **chủ động đưa vào mọi yêu cầu lập kế hoạch của OpenSpec**. Điều này có nghĩa là các quy ước, ngăn xếp công nghệ và quy tắc dự án của bạn luôn hiện diện khi AI tạo ra các sản phẩm. Độ tin cậy cao hơn.

**Điều đánh đổi:**

Vì bối cảnh được đưa vào mọi yêu cầu, bạn sẽ muốn giữ nó ngắn gọn. Tập trung vào những gì thực sự quan trọng:
- Ngăn xếp công nghệ và các quy ước chính
- Các ràng buộc không hiển nhiên mà AI cần biết
- Các quy tắc thường bị bỏ qua trước đây

Đừng lo lắng về việc làm cho nó hoàn hảo. Chúng tôi vẫn đang tìm hiểu những gì hoạt động tốt nhất ở đây, và chúng tôi sẽ cải thiện cách thức hoạt động của việc đưa bối cảnh vào trong quá trình thử nghiệm.

---

## Chạy Quy Trình Di Cả

Cả `openspec init` và `openspec update` đều phát hiện các tệp cũ và hướng dẫn bạn qua cùng một quy trình dọn dẹp. Sử dụng lệnh phù hợp với tình huống của bạn:

- Cài đặt mới mặc định sử dụng hồ sơ `core` (`propose`, `explore`, `apply`, `archive`).
- Các cài đặt đã di chuyển bảo toàn các quy trình bạn đã cài đặt trước đó bằng cách tạo hồ sơ `custom` khi cần.

### Sử Dụng `openspec init`

Chạy lệnh này nếu bạn muốn thêm công cụ mới hoặc cấu hình lại các công cụ đã được thiết lập:

```bash
openspec init
```

Lệnh init phát hiện các tệp cũ và hướng dẫn bạn qua quy trình dọn dẹp:

```
Nâng cấp lên OpenSpec mới

OpenSpec hiện sử dụng kỹ năng agent, tiêu chuẩn mới nổi trong các
coding agent. Điều này đơn giản hóa thiết lập của bạn trong khi
giữ mọi thứ hoạt động như trước đây.

Các tệp cần xóa
Không có nội dung người dùng cần bảo toàn:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Các tệp cần cập nhật
Các đánh dấu OpenSpec sẽ bị xóa, nội dung của bạn được bảo toàn:
  • CLAUDE.md
  • AGENTS.md

Cần sự chú ý của bạn
  • openspec/project.md
    Chúng tôi sẽ không xóa tệp này. Nó có thể chứa bối cảnh dự án hữu ích.

    openspec/config.yaml mới có phần "context:" cho bối cảnh lập kế hoạch.
    Phần này được đưa vào mọi yêu cầu của OpenSpec và hoạt động đáng tin
    cậy hơn so với cách tiếp cận project.md cũ.

    Xem lại project.md, di chuyển bất kỳ nội dung hữu ích nào sang phần
    context của config.yaml, sau đó xóa tệp khi đã sẵn sàng.

? Nâng cấp và dọn dẹp các tệp cũ? (Y/n)
```

**Điều gì xảy ra khi bạn chọn có:**

1. Các thư mục lệnh slash cũ bị xóa
2. Các đánh dấu OpenSpec bị loại bỏ khỏi `CLAUDE.md`, `AGENTS.md`, v.v. (nội dung của bạn vẫn được giữ lại)
3. `openspec/AGENTS.md` bị xóa
4. Các kỹ năng mới được cài đặt trong `.claude/skills/`
5. `openspec/config.yaml` được tạo với schema mặc định

### Sử Dụng `openspec update`

Chạy lệnh này nếu bạn chỉ muốn di chuyển và làm mới các công cụ hiện có lên phiên bản mới nhất:

```bash
openspec update
```

Lệnh update cũng phát hiện và dọn dẹp các tệp cũ, sau đó làm mới các kỹ năng/lệnh được tạo để phù hợp với hồ sơ và thiết lập giao hiện tại của bạn.

### Môi Trường Phi Tương Tác / CI

Để thực hiện di chuyển theo kịch bản:

```bash
openspec init --force --tools claude
```

Cờ `--force` bỏ qua các nhắc nhở và tự động chấp nhận dọn dẹp.

---

## Di Chuyển project.md sang config.yaml

Tệp `openspec/project.md` cũ là một tệp markdown tự do cho bối cảnh dự án. Tệp `openspec/config.yaml` mới có cấu trúc và—quan trọng nhất—**được đưa vào mọi yêu cầu lập kế hoạch** để các quy ước của bạn luôn hiện diện khi AI làm việc.

### Trước đây (project.md)

```markdown
# Project Context

This is a TypeScript monorepo using React and Node.js.
We use Jest for testing and follow strict ESLint rules.
Our API is RESTful and documented in docs/api.md.

## Conventions

- All public APIs must maintain backwards compatibility
- New features should include tests
- Use Given/When/Then format for specifications
```

### Sau này (config.yaml)

```yaml
schema: spec-driven

context: |
  Tech stack: TypeScript, React, Node.js
  Testing: Jest with React Testing Library
  API: RESTful, documented in docs/api.md
  We maintain backwards compatibility for all public APIs

rules:
  proposal:
    - Include rollback plan for risky changes
  specs:
    - Use Given/When/Then format for scenarios
    - Reference existing patterns before inventing new ones
  design:
    - Include sequence diagrams for complex flows
```

### Sự Khác Biệt Chính

| project.md | config.yaml |
|------------|-------------|
| Markdown tự do | YAML có cấu trúc |
| Một khối văn bản duy nhất | Tách biệt bối cảnh và quy tắc cho từng sản phẩm |
| Không rõ khi nào nó được sử dụng | Bối cảnh xuất hiện trong TẤT CẢ sản phẩm; quy tắc chỉ xuất hiện trong sản phẩm tương ứng |
| Không có lựa chọn schema | Trường `schema:` rõ ràng thiết lập quy trình mặc định |

### Giữ Gì, Bỏ Gì

Khi di chuyển, hãy chọn lọc. Tự hỏi: "Liệu AI có cần điều này cho *mọi* yêu cầu lập kế hoạch không?"

**Ứng viên tốt cho `context:`**
- Ngăn xếp công nghệ (ngôn ngữ, khuôn khổ, cơ sở dữ liệu)
- Các mẫu kiến trúc chính (monorepo, microservices, v.v.)
- Các ràng buộc không hiển nhiên ("chúng ta không thể sử dụng thư viện X vì...")
- Các quy ước quan trọng thường bị bỏ qua

**Di chuyển sang `rules:` thay vì**
- Định dạng đặc thù cho sản phẩm ("sử dụng Given/When/Then trong specs")
- Tiêu chí đánh giá ("các đề xuất phải bao gồm kế hoạch hoàn nguyên")
- Những điều này chỉ xuất hiện cho sản phẩm tương ứng, giúp các yêu cầu khác nhẹ nhàng hơn

**Để lại hoàn toàn**
- Các phương pháp hay nhất chung mà AI đã biết
- Những giải thích dài dòng có thể được tóm tắt
- Bối cảnh lịch sử không ảnh hưởng đến công việc hiện tại

### Các Bước Di Chuyển

1. **Tạo config.yaml** (nếu chưa được tạo bởi init):
   ```yaml
   schema: spec-driven
   ```

2. **Thêm bối cảnh của bạn** (hãy ngắn gọn—phần này đi vào mọi yêu cầu):
   ```yaml
   context: |
     Bối cảnh dự án của bạn ở đây.
     Tập trung vào những gì AI thực sự cần biết.
   ```

3. **Thêm quy tắc cho từng sản phẩm** (tùy chọn):
   ```yaml
   rules:
     proposal:
       - Hướng dẫn cụ thể cho đề xuất của bạn
     specs:
       - Quy tắc viết spec của bạn
   ```

4. **Xóa project.md** khi bạn đã di chuyển mọi thứ hữu ích.

**Đừng suy nghĩ quá nhiều.** Bắt đầu với những điều cơ bản và lặp lại. Nếu bạn nhận thấy AI bỏ sót điều quan trọng, hãy thêm nó. Nếu bối cảnh cảm thấy quá cồng kềnh, hãy cắt giảm. Đây là một tài liệu sống.

### Cần Trợ Giúp? Sử Dụng Prompt Này

Nếu bạn không chắc chắn cách tinh chỉnh project.md của mình, hãy hỏi trợ lý AI của bạn:

```
Tôi đang di chuyển từ project.md cũ của OpenSpec sang định dạng config.yaml mới.

Đây là project.md hiện tại của tôi:
[dán nội dung project.md của bạn]

Vui lòng giúp tôi tạo config.yaml với:
1. Phần `context:` ngắn gọn (phần này được đưa vào mọi yêu cầu lập kế hoạch, nên hãy giữ nó gọn—tập trung vào ngăn xếp công nghệ, các ràng buộc chính và các quy ước thường bị bỏ qua)
2. `rules:` cho các sản phẩm cụ thể nếu có nội dung đặc thù cho sản phẩm (ví dụ: "sử dụng Given/When/Then" thuộc về quy tắc specs, không phải bối cảnh toàn cục)

Bỏ qua bất kỳ điều gì chung chung mà các mô hình AI đã biết. Hãy tàn nhẫn về sự ngắn gọn.
```

AI sẽ giúp bạn xác định những gì là thiết yếu so với những gì có thể cắt giảm.

---

## Các Lệnh Mới

Khả dụng của lệnh phụ thuộc vào hồ sơ:

**Mặc định (hồ sơ `core`):**

| Lệnh | Mục đích |
|---------|---------|
| `/opsx:propose` | Tạo một thay đổi và tạo các sản phẩm lập kế hoạch trong một bước |
| `/opsx:explore` | Suy nghĩ về các ý tưởng không theo cấu trúc |
| `/opsx:apply` | Triển khai các nhiệm vụ từ tasks.md |
| `/opsx:archive` | Hoàn tất và lưu trữ thay đổi |

**Quy trình mở rộng (lựa chọn tùy chỉnh):**

| Lệnh | Mục đích |
|---------|---------|
| `/opsx:new` | Bắt đầu một khung thay đổi mới |
| `/opsx:continue` | Tạo sản phẩm tiếp theo (một lần một sản phẩm) |
| `/opsx:ff` | Tăng tốc—tạo tất cả sản phẩm lập kế hoạch cùng lúc |
| `/opsx:verify` | Xác minh triển khai khớp với spec |
| `/opsx:sync` | Xem trước/gộp spec mà không lưu trữ |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi cùng lúc |
| `/opsx:onboard` | Quy trình giới thiệu toàn diện có hướng dẫn |

Bật các lệnh mở rộng bằng `openspec config profile`, sau đó chạy `openspec update`.

### Ánh Xạ Lệnh Từ Phiên Bản Cũ

| Lệnh cũ | Lệnh OPSX tương đương |
|--------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (mặc định) hoặc `/opsx:new` sau đó `/opsx:ff` (mở rộng) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Khả Năng Mới

Các khả năng này là một phần của bộ lệnh quy trình mở rộng.

**Tạo sản phẩm chi tiết:**
```
/opsx:continue
```
Tạo một sản phẩm tại một thời điểm dựa trên sự phụ thuộc. Sử dụng lệnh này khi bạn muốn xem xét từng bước.

**Chế độ khám phá:**
```
/opsx:explore
```
Suy nghĩ về các ý tưởng với một đối tác trước khi cam kết thực hiện một thay đổi.

---

## Hiểu về Kiến trúc Mới

### Từ Giai đoạn Khóa sang Dòng Chảy

Quy trình cũ buộc phải tiến triển theo đường thẳng:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   KẾ HOẠCH   │ ───► │  THỰC HIỆN  │ ───► │   LƯU TRỮ    │
│    GIAI ĐOẠN │      │    GIAI ĐOẠN │      │    GIAI ĐOẠN  │
└──────────────┘      └──────────────┘      └──────────────┘

Nếu bạn đang trong giai đoạn thực hiện và nhận ra thiết kế sai?
Tiếc là không được. Các cổng giai đoạn không cho phép bạn quay lại dễ dàng.
```

OPSX sử dụng hành động, không phải giai đoạn:

```
         ┌───────────────────────────────────────────────┐
         │           HÀNH ĐỘNG (không phải giai đoạn)   │
         │                                               │
         │     mới ◄──► tiếp tục ◄──► áp dụng ◄──► lưu trữ│
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    bất kỳ thứ tự nào         │
         └───────────────────────────────────────────────┘
```

### Đồ thị Phụ thuộc

Các sản phẩm tạo thành đồ thị có hướng. Các phụ thuộc là yếu tố kích hoạt, không phải cổng:

```
                        đề xuất
                       (nút gốc)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           thông số kỹ thuật            thiết kế
        (yêu cầu:                  (yêu cầu:
         đề xuất)                   đề xuất)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tác vụ
                     (yêu cầu:
                     thông số kỹ thuật, thiết kế)
```

Khi bạn chạy `/opsx:continue`, nó kiểm tra những gì đã sẵn sàng và đề xuất sản phẩm tiếp theo. Bạn cũng có thể tạo nhiều sản phẩm sẵn sàng theo bất kỳ thứ tự nào.

### Kỹ năng so với Lệnh

Hệ thống cũ sử dụng các tệp lệnh riêng cho từng công cụ:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX sử dụng tiêu chuẩn **kỹ năng** đang nổi lên:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Các kỹ năng được nhận diện trên nhiều công cụ lập trình AI khác nhau và cung cấp siêu dữ liệu phong phú hơn.

---

## Tiếp tục Các Thay đổi Hiện có

Các thay đổi đang thực hiện của bạn hoạt động liền mạch với các lệnh OPSX.

**Có một thay đổi đang hoạt động từ quy trình cũ?**

```
/opsx:apply add-my-feature
```

OPSX đọc các sản phẩm hiện có và tiếp tục từ nơi bạn đã dừng lại.

**Muốn thêm nhiều sản phẩm hơn vào một thay đổi hiện có?**

```
/opsx:continue add-my-feature
```

Hiển thị những gì sẵn sàng để tạo dựa trên những gì đã tồn tại.

**Cần xem trạng thái?**

```bash
openspec status --change add-my-feature
```

---

## Hệ thống Cấu hình Mới

### Cấu trúc config.yaml

```yaml
# Bắt buộc: Schema mặc định cho các thay đổi mới
schema: spec-driven

# Tùy chọn: Bối cảnh dự án (tối đa 50KB)
# Được đưa vào TẤT CẢ hướng dẫn sản phẩm
context: |
  Bối cảnh dự án của bạn, ngăn xếp công nghệ,
  quy ước và ràng buộc.

# Tùy chọn: Quy tắc cho từng sản phẩm
# Chỉ được đưa vào các sản phẩm tương ứng
rules:
  proposal:
    - Bao gồm kế hoạch hoàn nguyên
  specs:
    - Sử dụng định dạng Given/When/Then
  design:
    - Ghi lại các chiến lược dự phòng
  tasks:
    - Chia thành các phần tối đa 2 giờ
```

### Giải quyết Schema

Khi xác định sử dụng schema nào, OPSX kiểm tra theo thứ tự:

1. **Cờ CLI**: `--schema <tên>` (ưu tiên cao nhất)
2. **Siêu dữ liệu thay đổi**: `.openspec.yaml` trong thư mục thay đổi
3. **Cấu hình dự án**: `openspec/config.yaml`
4. **Mặc định**: `spec-driven`

### Các Schema Khả dụng

| Schema | Sản phẩm | Phù hợp nhất cho |
|--------|----------|-------------------|
| `spec-driven` | đề xuất → thông số kỹ thuật → thiết kế → tác vụ | Hầu hết các dự án |

Liệt kê tất cả các schema khả dụng:

```bash
openspec schemas
```

### Schema Tùy chỉnh

Tạo quy trình của riêng bạn:

```bash
openspec schema init my-workflow
```

Hoặc sao chép một schema hiện có:

```bash
openspec schema fork spec-driven my-workflow
```

Xem [Tùy chỉnh](customization.md) để biết chi tiết.

---

## Khắc phục sự cố

### "Phát hiện tệp cũ trong chế độ không tương tác"

Bạn đang chạy trong môi trường CI hoặc không tương tác. Sử dụng:

```bash
openspec init --force
```

### Lệnh không xuất hiện sau khi di chuyển

Khởi động lại IDE của bạn. Các kỹ năng được phát hiện khi khởi động.

### "ID sản phẩm không xác định trong rules"

Kiểm tra rằng các khóa `rules:` của bạn khớp với ID sản phẩm của schema:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Chạy lệnh này để xem các ID sản phẩm hợp lệ:

```bash
openspec schemas --json
```

### Cấu hình không được áp dụng

1. Đảm bảo tệp nằm tại `openspec/config.yaml` (không phải `.yml`)
2. Xác thực cú pháp YAML
3. Thay đổi cấu hình có hiệu lực ngay lập tức—không cần khởi động lại

### project.md không được di chuyển

Hệ thống cố ý giữ lại `project.md` vì nó có thể chứa nội dung tùy chỉnh của bạn. Hãy xem xét thủ công, chuyển các phần hữu ích sang `config.yaml`, sau đó xóa nó.

### Muốn xem những gì sẽ được dọn dẹp?

Chạy init và từ chối lời nhắc dọn dẹp—bạn sẽ thấy toàn bộ tóm tắt phát hiện mà không có thay đổi nào được thực hiện.

---

## Tham khảo Nhanh

### Các Tệp Sau khi Di chuyển

```
project/
├── openspec/
│   ├── specs/                    # Không thay đổi
│   ├── changes/                  # Không thay đổi
│   │   └── archive/              # Không thay đổi
│   └── config.yaml               # MỚI: Cấu hình dự án
├── .claude/
│   └── skills/                   # MỚI: Kỹ năng OPSX
│       ├── openspec-propose/     # hồ sơ cốt lõi mặc định
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       └── ...                   # hồ sơ mở rộng thêm new/continue/ff/etc.
├── CLAUDE.md                     # Đã xóa các đánh dấu OpenSpec, nội dung của bạn được giữ lại
└── AGENTS.md                     # Đã xóa các đánh dấu OpenSpec, nội dung của bạn được giữ lại
```

### Những gì đã Biến mất

- `.claude/commands/openspec/` — đã được thay thế bằng `.claude/skills/`
- `openspec/AGENTS.md` — đã lỗi thời
- `openspec/project.md` — di chuyển sang `config.yaml`, sau đó xóa
- Các khối đánh dấu OpenSpec trong `CLAUDE.md`, `AGENTS.md`, v.v.

### Bảng Tóm tắt Lệnh

```text
/opsx:propose      Bắt đầu nhanh (hồ sơ cốt lõi mặc định)
/opsx:apply        Thực hiện tác vụ
/opsx:archive      Hoàn thành và lưu trữ

# Quy trình mở rộng (nếu được bật):
/opsx:new          Tạo khung cho một thay đổi
/opsx:continue     Tạo sản phẩm tiếp theo
/opsx:ff           Tạo các sản phẩm lập kế hoạch
```

---

## Nhận Trợ giúp

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Tài liệu**: [docs/opsx.md](opsx.md) cho tham khảo OPSX đầy đủ