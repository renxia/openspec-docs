# Di chuyển sang OPSX

Hướng dẫn này giúp bạn chuyển đổi từ quy trình làm việc OpenSpec cũ sang OPSX. Quá trình di chuyển được thiết kế để diễn ra suôn sẻ—công việc hiện tại của bạn được giữ nguyên, và hệ thống mới mang lại nhiều tính linh hoạt hơn.

## Những gì thay đổi?

OPSX thay thế quy trình làm việc cũ bị khóa theo giai đoạn bằng một cách tiếp cận dựa trên hành động, linh hoạt và mượt mà. Đây là sự thay đổi cốt lõi:

| Khía cạnh | Legacy | OPSX |
|--------|--------|------|
| **Lệnh** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Mặc định: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (các lệnh quy trình làm việc mở rộng là tùy chọn) |
| **Quy trình làm việc** | Tạo tất cả artifact cùng lúc | Tạo từng phần hoặc tạo tất cả cùng lúc—tùy thuộc vào lựa chọn của bạn |
| **Quay lại** | Các cổng giai đoạn bất tiện | Tự nhiên—cập nhật bất kỳ artifact nào bất cứ lúc nào |
| **Khả năng tùy chỉnh** | Cấu trúc cố định | Dựa trên schema, hoàn toàn có thể tùy biến |
| **Cấu hình** | `CLAUDE.md` có đánh dấu + `project.md` | Cấu hình gọn gàng trong `openspec/config.yaml` |

**Sự thay đổi về triết lý:** Công việc không phải là quy trình tuyến tính. OPSX không còn giả vờ rằng nó là như vậy nữa.

---

## Trước Khi Bắt Đầu

### Công Việc Hiện Của Bạn Được Bảo Vệ

Quá trình di chuyển được thiết kế với mục tiêu bảo vệ dữ liệu:

- **Các thay đổi đang hoạt động trong `openspec/changes/`** — Được bảo vệ hoàn toàn. Bạn có thể tiếp tục chúng bằng các lệnh OPSX.
- **Các thay đổi đã lưu trữ** — Không bị thay đổi. Lịch sử của bạn vẫn nguyên vẹn.
- **Các đặc tả chính trong `openspec/specs/`** — Không bị thay đổi. Đây là nguồn sự thật của bạn.
- **Nội dung của bạn trong CLAUDE.md, AGENTS.md, v.v.** — Được bảo vệ. Chỉ các khối đánh dấu OpenSpec bị xóa; mọi nội dung bạn viết đều được giữ lại.

### Những Gì Bị Xóa

Chỉ các tệp được quản lý bởi OpenSpec đang được thay thế:

| Cái gì | Tại sao |
|--------|---------|
| Các thư mục/tệp lệnh slash cũ | Được thay thế bằng hệ thống kỹ năng mới |
| `openspec/AGENTS.md` | Bộ kích hoạt quy trình làm việc lỗi thời |
| Các đánh dấu OpenSpec trong `CLAUDE.md`, `AGENTS.md`, v.v. | Không còn cần thiết nữa |

**Vị trí lệnh cũ theo công cụ** (ví dụ—công cụ của bạn có thể khác):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.cinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (chỉ tiện ích mở rộng IDE; không được hỗ trợ trong Copilot CLI)
- Codex: OpenSpec hiện sử dụng `.codex/skills/openspec-*`; việc dọn dẹp cũ chỉ nhắm vào các tên tệp prompt được cho phép của OpenSpec trong `$CODEX_HOME/prompts` hoặc `~/.codex/prompts`, và chỉ xóa chúng sau khi các kỹ năng thay thế tồn tại.
- Và các công cụ khác (Augment, Continue, Amazon Q, v.v.)

Quá trình di chuyển sẽ phát hiện bất kỳ công cụ nào bạn đã cấu hình và dọn dẹp các tệp cũ của chúng.

Danh sách xóa có vẻ dài, nhưng đây đều là các tệp mà OpenSpec ban đầu đã tạo. Nội dung của bạn không bao giờ bị xóa.

### Những Gì Cần Sự Chú Ý Của Bạn

Một tệp cần di chuyển thủ công:

**`openspec/project.md`** — Tệp này không bị xóa tự động vì nó có thể chứa ngữ cảnh dự án bạn đã viết. Bạn cần:

1. Xem xét nội dung của nó
2. Di chuyển ngữ cảnh hữu ích đến `openspec/config.yaml` (xem hướng dẫn bên dưới)
3. Xóa tệp khi bạn đã sẵn sàng

**Tại sao chúng tôi thực hiện thay đổi này:**

Tệp `project.md` cũ là thụ động—các tác nhân có thể đọc nó, có thể không, có thể quên những gì họ đã đọc. Chúng tôi nhận thấy độ tin cậy không nhất quán.

Ngữ cảnh của `config.yaml` mới được **tiêm chủ động vào mọi yêu cầu lập kế hoạch OpenSpec**. Điều này có nghĩa là quy ước dự án, công nghệ và quy tắc của bạn luôn có mặt khi AI tạo các tác phẩm. Độ tin cậy cao hơn.

**Đánh đổi:**

Vì ngữ cảnh được tiêm vào mọi yêu cầu, bạn sẽ muốn súc tích. Tập trung vào những gì thực sự quan trọng:
- Công nghệ và quy ước chính
- Các ràng buộc không rõ ràng mà AI cần biết
- Các quy tắc thường bị bỏ qua trước đây

Đừng lo lắng về việc làm cho nó hoàn hảo. Chúng tôi vẫn đang tìm hiểu những gì hoạt động tốt nhất ở đây, và chúng tôi sẽ cải thiện cách hoạt động của việc tiêm ngữ cảnh khi chúng tôi thử nghiệm.

---

## Chạy Quá Trình Di Chuyển

Cả `openspec init` và `openspec update` đều phát hiện các tệp cũ và hướng dẫn bạn thực hiện quy trình dọn dẹp giống nhau. Sử dụng cái nào phù hợp với tình huống của bạn:

- Các bản cài đặt mới mặc định sử dụng hồ sơ `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Các bản cài đặt đã di chuyển giữ lại các quy trình làm việc bạn đã cài đặt trước đó bằng cách ghi hồ sơ `custom` khi cần thiết.

### Sử dụng `openspec init`

Chạy lệnh này nếu bạn muốn thêm công cụ mới hoặc cấu hình lại các công cụ được thiết lập:

```bash
openspec init
```

Lệnh init phát hiện các tệp cũ và hướng dẫn bạn thực hiện dọn dẹp:

```
Nâng cấp lên OpenSpec mới

OpenSpec hiện sử dụng kỹ năng tác nhân, tiêu chuẩn mới nổi đang phổ biến trên các tác nhân lập trình. Điều này đơn giản hóa cài đặt của bạn trong khi vẫn giữ mọi thứ hoạt động như trước.

Các tệp cần xóa
Không có nội dung người dùng cần bảo vệ:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Các tệp cần cập nhật
Các đánh dấu OpenSpec sẽ bị xóa, nội dung của bạn được giữ lại:
  • CLAUDE.md
  • AGENTS.md

Cần sự chú ý của bạn
  • openspec/project.md
    Chúng tôi sẽ không xóa tệp này. Nó có thể chứa ngữ cảnh dự án hữu ích.

    Tệp openspec/config.yaml mới có phần "context:" dành cho ngữ cảnh lập kế hoạch. Phần này được bao gồm trong mọi yêu cầu OpenSpec và hoạt động đáng tin cậy hơn so với cách tiếp cận project.md cũ.

    Xem xét project.md, di chuyển mọi nội dung hữu ích đến phần context của config.yaml, sau đó xóa tệp khi bạn đã sẵn sàng.

? Nâng cấp và dọn dẹp các tệp cũ? (Y/n)
```

**Những gì xảy ra khi bạn trả lời có:**

1. Các thư mục lệnh slash cũ bị xóa
2. Các đánh dấu OpenSpec bị xóa khỏi `CLAUDE.md`, `AGENTS.md`, v.v. (nội dung của bạn được giữ lại)
3. Tệp `openspec/AGENTS.md` bị xóa
4. Các kỹ năng mới được cài đặt trong `.claude/skills/`
5. Tệp `openspec/config.yaml` được tạo với lược đồ mặc định

### Sử dụng `openspec update`

Chạy lệnh này nếu bạn chỉ muốn di chuyển và làm mới các công cụ hiện tại lên phiên bản mới nhất:

```bash
openspec update
```

Lệnh update cũng phát hiện và dọn dẹp các tác phẩm cũ, sau đó làm mới các kỹ năng/lệnh được tạo để khớp với hồ sơ và cài đặt phân phối hiện tại của bạn.

### Môi trường không tương tác / CI

Đối với các di chuyển được viết kịch bản:

```bash
openspec init --force --tools claude
```

Cờ `--force` bỏ qua các lời nhắc và tự động chấp nhận dọn dẹp.

Điều này bao gồm cả việc dọn dẹp các tệp prompt Codex được quản lý bởi OpenSpec trong thư mục prompt Codex toàn cục. Việc dọn dẹp chỉ nhắm vào các tên tệp prompt Codex cũ được cho phép của OpenSpec, chỉ xóa chúng sau khi các kỹ năng `.codex/skills/openspec-*` thay thế tồn tại, và giữ lại tất cả các tệp khác.

---

## Di chuyển project.md sang config.yaml

Tệp `openspec/project.md` cũ là một tệp markdown tự do dùng cho ngữ cảnh dự án. Tệp `openspec/config.yaml` mới có cấu trúc và—quan trọng nhất—**được tiêm vào mọi yêu cầu lập kế hoạch** để các quy ước của bạn luôn có mặt khi AI làm việc.

### Trước (project.md)

```markdown
# Ngữ Cảnh Dự Án

Đây là kho mã đơn (monorepo) TypeScript sử dụng React và Node.js.
Chúng tôi sử dụng Jest để kiểm thử và tuân theo các quy tắc ESLint nghiêm ngặt.
API của chúng tôi là RESTful và được ghi chú trong docs/api.md.

## Quy Ước

- Tất cả các API công khai phải duy trì khả năng tương thích ngược
- Các tính năng mới nên bao gồm kiểm thử
- Sử dụng định dạng Given/When/Then cho các đặc tả
```

### Sau (config.yaml)

```yaml
schema: spec-driven

context: |
  Công nghệ: TypeScript, React, Node.js
  Kiểm thử: Jest với React Testing Library
  API: RESTful, được ghi chú trong docs/api.md
  Chúng tôi duy trì khả năng tương thích ngược cho tất cả các API công khai

rules:
  proposal:
    - Bao gồm kế hoạch hoàn tác cho các thay đổi rủi ro
  specs:
    - Sử dụng định dạng Given/When/Then cho các kịch bản
    - Tham khảo các mẫu hiện có trước khi tạo ra các mẫu mới
  design:
    - Bao gồm sơ đồ trình tự cho các luồng phức tạp
```

### Khác Biệt Chính

| project.md | config.yaml |
|------------|-------------|
| Markdown tự do | YAML có cấu trúc |
| Một khối văn bản | Ngữ cảnh riêng và quy tắc cho từng tác phẩm |
| Không rõ khi nào được sử dụng | Ngữ cảnh xuất hiện trong TẤT CẢ các tác phẩm; quy tắc chỉ xuất hiện trong các tác phẩm tương ứng |
| Không có lựa chọn lược đồ | Trường `schema:` rõ ràng đặt quy trình làm việc mặc định |

### Giữ Lại Gì, Bỏ Đi Gì

Khi di chuyển, hãy chọn lọc. Hãy tự hỏi bản thân: "AI có cần điều này cho *mọi* yêu cầu lập kế hoạch không?"

**Các ứng viên phù hợp cho `context:`**
- Công nghệ (ngôn ngữ, khung phát triển, cơ sở dữ liệu)
- Các mẫu kiến trúc chính (kho mã đơn, vi dịch vụ, v.v.)
- Các ràng buộc không rõ ràng ("chúng tôi không thể sử dụng thư viện X vì...")
- Các quy ước quan trọng thường bị bỏ qua

**Di chuyển sang `rules:` thay vào đó**
- Định dạng dành riêng cho tác phẩm ("sử dụng Given/When/Then trong các đặc tả")
- Tiêu chí đánh giá ("các đề xuất phải bao gồm kế hoạch hoàn tác")
- Chúng chỉ xuất hiện cho tác phẩm tương ứng, giữ cho các yêu cầu khác nhẹ hơn

**Bỏ hoàn toàn**
- Các thực hành tốt chung mà AI đã biết
- Các giải thích dài dòng có thể được tóm tắt
- Ngữ cảnh lịch sử không ảnh hưởng đến công việc hiện tại

### Các Bước Di Chuyển

1. **Tạo config.yaml** (nếu chưa được tạo bởi init):
   ```yaml
   schema: spec-driven
   ```

2. **Thêm ngữ cảnh của bạn** (hãy súc tích—phần này sẽ được đưa vào mọi yêu cầu):
   ```yaml
   context: |
     Nền tảng dự án của bạn đặt ở đây.
     Tập trung vào những gì AI thực sự cần biết.
   ```

3. **Thêm quy tắc cho từng tác phẩm** (tùy chọn):
   ```yaml
   rules:
     proposal:
       - Hướng dẫn dành riêng cho đề xuất của bạn
     specs:
       - Quy tắc viết đặc tả của bạn
   ```

4. **Xóa project.md** sau khi bạn đã di chuyển tất cả nội dung hữu ích.

**Đừng suy nghĩ quá nhiều về nó.** Bắt đầu với những điều cốt lõi và lặp lại. Nếu bạn nhận thấy AI bỏ sót điều gì quan trọng, hãy thêm vào. Nếu ngữ cảnh cảm thấy quá dài, hãy cắt bớt. Đây là tài liệu sống.

### Cần Trợ Giúp? Sử dụng Lời Nhắc Này

Nếu bạn không chắc cách nào tinh lọc project.md của mình, hãy hỏi trợ lý AI của bạn:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI sẽ giúp bạn xác định những gì là thiết yếu so với những gì có thể cắt bớt.

---

## Các Lệnh Mới

Tính khả dụng của lệnh phụ thuộc vào hồ sơ:

**Mặc định (hồ sơ `core`):**

| Lệnh | Mục đích |
|------|---------|
| `/opsx:propose` | Tạo một thay đổi và tạo các tác phẩm lập kế hoạch trong một bước |
| `/opsx:explore` | Suy nghĩ về các ý tưởng mà không có cấu trúc |
| `/opsx:apply` | Thực hiện các nhiệm vụ từ tasks.md |
| `/opsx:archive` | Hoàn tất và lưu trữ thay đổi |

**Quy trình làm việc mở rộng (lựa chọn tùy chỉnh):**

| Lệnh | Mục đích |
|------|---------|
| `/opsx:new` | Bắt đầu khung thay đổi mới |
| `/opsx:continue` | Tạo tác phẩm tiếp theo (từng cái một) |
| `/opsx:ff` | Chuyển nhanh—tạo tất cả các tác phẩm lập kế hoạch cùng lúc |
| `/opsx:verify` | Xác thực việc triển khai khớp với các đặc tả |
| `/opsx:sync` | Gộp các đặc tả delta vào các đặc tả chính |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi cùng lúc |
| `/opsx:onboard` | Quy trình làm việc hướng dẫn toàn bộ quá trình làm quen |

Kích hoạt các lệnh mở rộng bằng `openspec config profile`, sau đó chạy `openspec update`.

### Ánh Xạ Lệnh Từ Hệ Thống Cũ

| Hệ thống cũ | Tương đương OPSX |
|-------------|-----------------|
| `/openspec:proposal` | `/opsx:propose` (mặc định) hoặc `/opsx:new` sau đó `/opsx:ff` (mở rộng) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Khả Năng Mới

Các khả năng này là một phần của bộ lệnh quy trình làm việc mở rộng.

**Tạo tác phẩm chi tiết:**
```
/opsx:continue
```
Tạo từng tác phẩm một dựa trên các phụ thuộc. Sử dụng lệnh này khi bạn muốn xem xét từng bước.

**Chế độ khám phá:**
```
/opsx:explore
```
Suy nghĩ về các ý tưởng với đối tác trước khi cam kết thực hiện một thay đổi.

---

## Hiểu Kiến Trúc Mới

### Từ Khóa Pha Cố Định Sang Linh Hoạt

Quy trình làm việc cũ buộc phải tiến triển tuyến tính:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PHA LẬP    │ ───► │  PHA TRIỂN   │ ───► │   PHA LƯU    │
│   KẾ HOẠCH   │      │    KHAI      │      │    TRỮ      │
└──────────────┘      └──────────────┘      └──────────────┘

Nếu bạn đang ở giai đoạn triển khai và nhận ra thiết kế sai?
Thật không may. Các cổng pha không cho phép bạn quay lại dễ dàng.
```

OPSX sử dụng hành động, không phải các pha:

```
         ┌───────────────────────────────────────────────┐
         │           HÀNH ĐỘNG (không phải pha)          │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    mọi thứ tự                 │
         └───────────────────────────────────────────────┘
```

### Đồ Thị Phụ Thuộc

Các tác phẩm tạo thành một đồ thị có hướng. Các phụ thuộc là bộ kích hoạt, không phải cổng:

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

Khi bạn chạy `/opsx:continue`, nó sẽ kiểm tra những gì đã sẵn sàng và đề xuất tác phẩm tiếp theo. Bạn cũng có thể tạo nhiều tác phẩm đã sẵn sàng theo bất kỳ thứ tự nào.

### Kỹ Năng So Với Lệnh

Hệ thống cũ sử dụng các tệp lệnh dành riêng cho công cụ:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX sử dụng tiêu chuẩn **kỹ năng** mới nổi:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Các kỹ năng được công nhận trên nhiều công cụ lập trình AI khác nhau và cung cấp siêu dữ liệu phong phú hơn.

Codex chỉ sử dụng kỹ năng trong OPSX. OpenSpec không còn tạo các tệp prompt tùy chỉnh Codex nữa; thay vào đó hãy sử dụng các thư mục `.codex/skills/openspec-*` được tạo ra.

## Tiếp tục các thay đổi đang thực hiện

Các thay đổi bạn đang thực hiện hoạt động liền mạch với các lệnh OPSX.

**Bạn có thay đổi đang hoạt động từ quy trình làm việc cũ?**

```
/opsx:apply add-my-feature
```

OPSX sẽ đọc các tài liệu hiện có và tiếp tục từ điểm bạn đã dừng lại trước đó.

**Muốn thêm nhiều tài liệu hơn vào một thay đổi đang tồn tại?**

```
/opsx:continue add-my-feature
```

Lệnh này sẽ hiển thị những nội dung sẵn sàng để tạo dựa trên những gì đã tồn tại.

**Cần xem trạng thái thay đổi?**

```bash
openspec status --change add-my-feature
```

---

## Hệ thống cấu hình mới

### Cấu trúc của tệp config.yaml

```yaml
# Bắt buộc: Schema mặc định cho các thay đổi mới
schema: spec-driven

# Tùy chọn: Ngữ cảnh dự án (tối đa 50KB)
# Được chèn vào TẤT CẢ hướng dẫn tạo tài liệu
context: |
  Your project background, tech stack,
  conventions, and constraints.

# Tùy chọn: Quy tắc cho từng loại tài liệu
# Chỉ được chèn vào các tài liệu tương ứng
rules:
  proposal:
    - Bao gồm kế hoạch rollback
  specs:
    - Sử dụng định dạng Given/When/Then
  design:
    - Ghi lại các chiến lược dự phòng
  tasks:
    - Chia thành các phần nhỏ tối đa 2 giờ
```

### Thứ tự ưu tiên Schema

Khi xác định schema nào sẽ sử dụng, OPSX sẽ kiểm tra theo thứ tự:

1. **Cờ CLI**: `--schema <tên>` (ưu tiên cao nhất)
2. **Siêu dữ liệu thay đổi**: Tệp `.openspec.yaml` trong thư mục thay đổi
3. **Cấu hình dự án**: Tệp `openspec/config.yaml`
4. **Mặc định**: `spec-driven`

### Các Schema có sẵn

| Schema | Tài liệu | Phù hợp nhất với |
|--------|-----------|----------|
| `spec-driven` | proposal → specs → design → tasks | Hầu hết các dự án |

Chạy lệnh sau để liệt kê tất cả các schema có sẵn:

```bash
openspec schemas
```

### Schema tùy chỉnh

Tạo quy trình làm việc của riêng bạn:

```bash
openspec schema init my-workflow
```

Hoặc phân nhánh từ một schema hiện có:

```bash
openspec schema fork spec-driven my-workflow
```

Xem phần [Tùy chỉnh](customization.md) để biết chi tiết.

---

## Xử lý sự cố

### "Phát hiện tệp cũ trong chế độ không tương tác"

Bạn đang chạy trong môi trường CI hoặc môi trường không tương tác. Sử dụng lệnh sau:

```bash
openspec init --force
```

### Các lệnh không xuất hiện sau khi di chuyển

Khởi động lại IDE của bạn. Các kỹ năng (skills) được phát hiện khi khởi động chương trình.

### "Không nhận dạng được ID tài liệu trong phần quy tắc"

Kiểm tra xem các khóa trong mục `rules:` của bạn có khớp với ID tài liệu của schema đang sử dụng không:
- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Chạy lệnh sau để xem các ID tài liệu hợp lệ:

```bash
openspec schemas --json
```

### Cấu hình không được áp dụng

1. Đảm bảo tệp cấu hình nằm ở đường dẫn `openspec/config.yaml` (không phải `.yml`)
2. Kiểm tra tính hợp lệ của cú pháp YAML
3. Các thay đổi cấu hình sẽ có hiệu lực ngay lập tức—không cần khởi động lại chương trình

### Tệp project.md không được di chuyển

Hệ thống cố tình giữ lại tệp `project.md` vì tệp này có thể chứa nội dung tùy chỉnh của bạn. Hãy xem xét thủ công, di chuyển các phần hữu ích sang tệp `config.yaml`, sau đó xóa tệp `project.md`.

### Muốn xem những nội dung nào sẽ được dọn dẹp?

Chạy lệnh `init` và từ chối lời nhắc dọn dẹp—bạn sẽ thấy toàn bộ tóm tắt phát hiện mà không có thay đổi nào được thực hiện.

---

## Tham khảo nhanh

### Các tệp sau khi di chuyển

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
│       ├── openspec-sync-specs/
│       └── ...                   # hồ sơ mở rộng thêm các lệnh new/continue/ff/v.v.
├── CLAUDE.md                     # Các đánh dấu OpenSpec đã được xóa, nội dung của bạn được giữ lại
└── AGENTS.md                     # Các đánh dấu OpenSpec đã được xóa, nội dung của bạn được giữ lại
```

### Những gì đã bị loại bỏ

- `.claude/commands/openspec/` — được thay thế bằng `.claude/skills/`
- `openspec/AGENTS.md` — không còn sử dụng nữa
- `openspec/project.md` — di chuyển nội dung sang `config.yaml`, sau đó xóa tệp
- Các khối đánh dấu OpenSpec trong `CLAUDE.md`, `AGENTS.md`, v.v.

### Bảng tra lệnh nhanh

```text
/opsx:propose      Bắt đầu nhanh (hồ sơ cốt lõi mặc định)
/opsx:apply        Triển khai các tác vụ
/opsx:archive      Hoàn thành và lưu trữ

# Quy trình làm việc mở rộng (nếu được bật):
/opsx:new          Tạo khung cho một thay đổi
/opsx:continue     Tạo tài liệu tiếp theo
/opsx:ff           Tạo các tài liệu lập kế hoạch
```

---

## Nhận trợ giúp

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Tài liệu**: [docs/opsx.md](opsx.md) để tham khảo đầy đủ về OPSX