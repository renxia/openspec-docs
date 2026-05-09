# Chuyển đổi sang OPSX

Hướng dẫn này giúp bạn chuyển đổi từ quy trình làm việc OpenSpec cũ sang OPSX. Quá trình chuyển đổi được thiết kế để diễn ra suôn sẻ—các công việc hiện tại của bạn được bảo toàn, và hệ thống mới mang lại sự linh hoạt hơn.

## Có những thay đổi gì?

OPSX thay thế quy trình làm việc cũ bị khóa giai đoạn bằng một cách tiếp cận linh hoạt, dựa trên hành động. Đây là sự thay đổi chính:

| Khía cạnh | Cũ | OPSX |
|-----------|-----|------|
| **Lệnh** | `/openspec:proposal`, `/openspec:apply`, `/openspec:archive` | Mặc định: `/opsx:propose`, `/opsx:apply`, `/opsx:sync`, `/opsx:archive` (các lệnh quy trình mở rộng là tùy chọn) |
| **Quy trình làm việc** | Tạo tất cả các sản phẩm cùng một lúc | Tạo dần dần hoặc tất cả cùng một lúc—tùy bạn |
| **Quay lại** | Các cổng giai đoạn phức tạp | Tự nhiên—cập nhật bất kỳ sản phẩm nào bất cứ lúc nào |
| **Tùy chỉnh** | Cấu trúc cố định | Được điều khiển bởi lược đồ, có thể tùy chỉnh hoàn toàn |
| **Cấu hình** | `CLAUDE.md` với các đánh dấu + `project.md` | Cấu hình sạch trong `openspec/config.yaml` |

**Sự thay đổi triết lý:** Công việc không phải là tuyến tính. OPSX ngừng giả vờ rằng nó là như vậy.

---

## Trước Khi Bắt Đầu

### Công Việc Hiện Tại Của Bạn Được An Toàn

Quá trình di chuyển được thiết kế với mục tiêu bảo toàn:

- **Các thay đổi đang hoạt động trong `openspec/changes/`** — Được bảo toàn hoàn toàn. Bạn có thể tiếp tục chúng với các lệnh OPSX.
- **Các thay đổi đã lưu trữ** — Không bị ảnh hưởng. Lịch sử của bạn vẫn nguyên vẹn.
- **Các thông số kỹ thuật chính trong `openspec/specs/`** — Không bị ảnh hưởng. Đây là nguồn chân lý của bạn.
- **Nội dung của bạn trong CLAUDE.md, AGENTS.md, v.v.** — Được bảo toàn. Chỉ các khối đánh dấu OpenSpec bị xóa; tất cả những gì bạn viết vẫn còn.

### Những Gì Bị Xóa

Chỉ các tệp do OpenSpec quản lý đang được thay thế:

| Cái gì | Tại sao |
|--------|---------|
| Các thư mục/tệp lệnh gạch chéo cũ | Được thay thế bằng hệ thống kỹ năng mới |
| `openspec/AGENTS.md` | Trình kích hoạt quy trình làm việc lỗi thời |
| Các đánh dấu OpenSpec trong `CLAUDE.md`, `AGENTS.md`, v.v. | Không còn cần thiết |

**Vị trí lệnh cũ theo công cụ** (ví dụ—công cụ của bạn có thể khác):

- Claude Code: `.claude/commands/openspec/`
- Cursor: `.cursor/commands/openspec-*.md`
- Windsurf: `.windsurf/workflows/openspec-*.md`
- Cline: `.clinerules/workflows/openspec-*.md`
- Roo: `.roo/commands/openspec-*.md`
- GitHub Copilot: `.github/prompts/openspec-*.prompt.md` (chỉ phần mở rộng IDE; không được hỗ trợ trong Copilot CLI)
- Và các công cụ khác (Augment, Continue, Amazon Q, v.v.)

Quá trình di chuyển phát hiện bất kỳ công cụ nào bạn đã cấu hình và dọn dẹp các tệp cũ của chúng.

Danh sách xóa có vẻ dài, nhưng đây là tất cả các tệp mà OpenSpec đã tạo ban đầu. Nội dung của riêng bạn không bao giờ bị xóa.

### Những Gì Cần Bạn Chú Ý

Một tệp yêu cầu di chuyển thủ công:

**`openspec/project.md`** — Tệp này không bị xóa tự động vì nó có thể chứa ngữ cảnh dự án bạn đã viết. Bạn sẽ cần:

1. Xem lại nội dung của nó
2. Di chuyển ngữ cảnh hữu ích sang `openspec/config.yaml` (xem hướng dẫn bên dưới)
3. Xóa tệp khi sẵn sàng

**Tại sao chúng tôi thực hiện thay đổi này:**

Tệp `project.md` cũ là thụ động—các agent có thể đọc nó, có thể không, có thể quên những gì chúng đọc. Chúng tôi thấy độ tin cậy không nhất quán.

Ngữ cảnh `config.yaml` mới được **tiêm tích cực vào mọi yêu cầu lập kế hoạch của OpenSpec**. Điều này có nghĩa là các quy ước dự án, ngăn xếp công nghệ và quy tắc của bạn luôn có mặt khi AI tạo ra các tạo phẩm. Độ tin cậy cao hơn.

**Sự đánh đổi:**

Vì ngữ cảnh được tiêm vào mọi yêu cầu, bạn sẽ muốn ngắn gọn. Tập trung vào những gì thực sự quan trọng:
- Ngăn xếp công nghệ và các quy ước chính
- Các ràng buộc không rõ ràng mà AI cần biết
- Các quy tắc thường bị bỏ qua trước đây

Đừng lo lắng về việc làm cho nó hoàn hảo. Chúng tôi vẫn đang học hỏi những gì hoạt động tốt nhất ở đây, và chúng tôi sẽ cải thiện cách tiêm ngữ cảnh hoạt động khi chúng tôi thử nghiệm.

---

## Chạy Quá Trình Di Chuyển

Cả `openspec init` và `openspec update` đều phát hiện các tệp cũ và hướng dẫn bạn qua cùng một quá trình dọn dẹp. Sử dụng lệnh nào phù hợp với tình huống của bạn:

- Các cài đặt mới mặc định sử dụng hồ sơ `core` (`propose`, `explore`, `apply`, `sync`, `archive`).
- Các cài đặt đã di chuyển bảo toàn các quy trình làm việc đã cài đặt trước đó của bạn bằng cách ghi một hồ sơ `custom` khi cần.

### Sử Dụng `openspec init`

Chạy lệnh này nếu bạn muốn thêm công cụ mới hoặc định cấu hình lại các công cụ được thiết lập:

```bash
openspec init
```

Lệnh init phát hiện các tệp cũ và hướng dẫn bạn qua quá trình dọn dẹp:

```
Upgrading to the new OpenSpec

OpenSpec now uses agent skills, the emerging standard across coding
agents. This simplifies your setup while keeping everything working
as before.

Files to remove
No user content to preserve:
  • .claude/commands/openspec/
  • openspec/AGENTS.md

Files to update
OpenSpec markers will be removed, your content preserved:
  • CLAUDE.md
  • AGENTS.md

Needs your attention
  • openspec/project.md
    We won't delete this file. It may contain useful project context.

    The new openspec/config.yaml has a "context:" section for planning
    context. This is included in every OpenSpec request and works more
    reliably than the old project.md approach.

    Review project.md, move any useful content to config.yaml's context
    section, then delete the file when ready.

? Upgrade and clean up legacy files? (Y/n)
```

**Điều gì xảy ra khi bạn đồng ý:**

1. Các thư mục lệnh gạch chéo cũ bị xóa
2. Các đánh dấu OpenSpec bị loại bỏ khỏi `CLAUDE.md`, `AGENTS.md`, v.v. (nội dung của bạn vẫn còn)
3. `openspec/AGENTS.md` bị xóa
4. Các kỹ năng mới được cài đặt trong `.claude/skills/`
5. `openspec/config.yaml` được tạo với lược đồ mặc định

### Sử Dụng `openspec update`

Chạy lệnh này nếu bạn chỉ muốn di chuyển và làm mới các công cụ hiện có của mình lên phiên bản mới nhất:

```bash
openspec update
```

Lệnh update cũng phát hiện và dọn dẹp các tạo phẩm cũ, sau đó làm mới các kỹ năng/lệnh được tạo để khớp với hồ sơ và cài đặt giao hàng hiện tại của bạn.

### Môi Trường Không Tương Tác / CI

Đối với các quá trình di chuyển được lập kịch bản:

```bash
openspec init --force --tools claude
```

Cờ `--force` bỏ qua các lời nhắc và tự động chấp nhận dọn dẹp.

---

## Di Chuyển project.md Sang config.yaml

Tệp `openspec/project.md` cũ là một tệp markdown tự do cho ngữ cảnh dự án. Tệp `openspec/config.yaml` mới có cấu trúc và—quan trọng là—**được tiêm vào mọi yêu cầu lập kế hoạch** để các quy ước của bạn luôn có mặt khi AI làm việc.

### Trước (project.md)

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

### Sau (config.yaml)

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
| Một khối văn bản | Ngữ cảnh riêng biệt và các quy tắc theo tạo phẩm |
| Không rõ khi nào được sử dụng | Ngữ cảnh xuất hiện trong TẤT CẢ các tạo phẩm; quy tắc chỉ xuất hiện trong các tạo phẩm phù hợp |
| Không có lựa chọn lược đồ | Trường `schema:` rõ ràng thiết lập quy trình làm việc mặc định |

### Giữ Lại Gì, Bỏ Gì

Khi di chuyển, hãy chọn lọc. Hãy tự hỏi: "AI có cần điều này cho *mọi* yêu cầu lập kế hoạch không?"

**Các ứng viên tốt cho `context:`**
- Ngăn xếp công nghệ (ngôn ngữ,框架, cơ sở dữ liệu)
- Các mẫu kiến trúc chính (monorepo, microservices, v.v.)
- Các ràng buộc không rõ ràng ("chúng ta không thể sử dụng thư viện X vì...")
- Các quy ước quan trọng thường bị bỏ qua

**Chuyển sang `rules:` thay vào đó**
- Định dạng theo tạo phẩm cụ thể ("sử dụng Given/When/Then trong specs")
- Tiêu chí đánh giá ("các đề xuất phải bao gồm kế hoạch rollback")
- Chúng chỉ xuất hiện cho tạo phẩm phù hợp, giữ cho các yêu cầu khác nhẹ hơn

**Bỏ qua hoàn toàn**
- Các phương pháp hay nhất chung mà AI đã biết
- Các giải thích dài dòng có thể được tóm tắt
- Ngữ cảnh lịch sử không ảnh hưởng đến công việc hiện tại

### Các Bước Di Chuyển

1. **Tạo config.yaml** (nếu chưa được tạo bởi init):
   ```yaml
   schema: spec-driven
   ```

2. **Thêm ngữ cảnh của bạn** (hãy ngắn gọn—điều này đi vào mọi yêu cầu):
   ```yaml
   context: |
     Nền tảng dự án của bạn đi vào đây.
     Tập trung vào những gì AI thực sự cần biết.
   ```

3. **Thêm các quy tắc theo tạo phẩm** (tùy chọn):
   ```yaml
   rules:
     proposal:
       - Hướng dẫn cụ thể cho đề xuất của bạn
     specs:
       - Quy tắc viết thông số kỹ thuật của bạn
   ```

4. **Xóa project.md** khi bạn đã di chuyển mọi thứ hữu ích.

**Đừng suy nghĩ quá nhiều.** Bắt đầu với những điều cần thiết và lặp lại. Nếu bạn nhận thấy AI bỏ lỡ điều gì đó quan trọng, hãy thêm nó. Nếu ngữ cảnh có vẻ cồng kềnh, hãy cắt giảm nó. Đây là một tài liệu sống.

### Cần Trợ Giới? Sử Dụng Lời Nhắc Này

Nếu bạn không chắc chắn cách chắt lọc project.md của mình, hãy hỏi trợ lý AI:

```
I'm migrating from OpenSpec's old project.md to the new config.yaml format.

Here's my current project.md:
[paste your project.md content]

Please help me create a config.yaml with:
1. A concise `context:` section (this gets injected into every planning request, so keep it tight—focus on tech stack, key constraints, and conventions that often get ignored)
2. `rules:` for specific artifacts if any content is artifact-specific (e.g., "use Given/When/Then" belongs in specs rules, not global context)

Leave out anything generic that AI models already know. Be ruthless about brevity.
```

AI sẽ giúp bạn xác định điều gì là cần thiết so với những gì có thể được cắt giảm.

---

## Các Lệnh Mới

Tính khả dụng của lệnh phụ thuộc vào hồ sơ:

**Mặc định (hồ sơ `core`):**

| Lệnh | Mục đích |
|------|---------|
| `/opsx:propose` | Tạo một thay đổi và tạo các tạo phẩm lập kế hoạch trong một bước |
| `/opsx:explore` | Suy nghĩ về các ý tưởng mà không có cấu trúc |
| `/opsx:apply` | Triển khai các tác vụ từ tasks.md |
| `/opsx:archive` | Hoàn tất và lưu trữ thay đổi |

**Quy trình làm việc mở rộng (lựa chọn tùy chỉnh):**

| Lệnh | Mục đích |
|------|---------|
| `/opsx:new` | Bắt đầu một khung thay đổi mới |
| `/opsx:continue` | Tạo tạo phẩm tiếp theo (một lần một) |
| `/opsx:ff` | Chuyển tiếp nhanh—tạo các tạo phẩm lập kế hoạch cùng một lúc |
| `/opsx:verify` | Xác thực triển khai khớp với thông số kỹ thuật |
| `/opsx:sync` | Hợp nhất các thông số kỹ thuật delta vào thông số kỹ thuật chính |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi cùng một lúc |
| `/opsx:onboard` | Quy trình giới thiệu hướng dẫn từ đầu đến cuối |

Bật các lệnh mở rộng với `openspec config profile`, sau đó chạy `openspec update`.

### Ánh Xạ Lệnh Từ Cũ Sang Mới

| Cũ | Tương đương OPSX |
|----|-----------------|
| `/openspec:proposal` | `/opsx:propose` (mặc định) hoặc `/opsx:new` rồi `/opsx:ff` (mở rộng) |
| `/openspec:apply` | `/opsx:apply` |
| `/openspec:archive` | `/opsx:archive` |

### Các Khả Năng Mới

Các khả năng này là một phần của bộ lệnh quy trình làm việc mở rộng.

**Tạo tạo phẩm chi tiết:**
```
/opsx:continue
```
Tạo một tạo phẩm tại một thời điểm dựa trên các phụ thuộc. Sử dụng điều này khi bạn muốn xem xét từng bước.

**Chế độ khám phá:**
```
/opsx:explore
```
Suy nghĩ về các ý tưởng với một đối tác trước khi cam kết thực hiện thay đổi.

---

## Hiểu kiến trúc mới

### Từ cố định pha sang linh hoạt

Quy trình làm việc cũ bắt buộc tiến triển tuyến tính:

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   PLANNING   │ ───► │ IMPLEMENTING │ ───► │   ARCHIVING  │
│    PHASE     │      │    PHASE     │      │    PHASE     │
└──────────────┘      └──────────────┘      └──────────────┘

Nếu bạn đang trong giai đoạn triển khai và nhận ra thiết kế sai?
Quá tệ. Các cổng pha không cho phép bạn quay lại dễ dàng.
```

OPSX sử dụng các hành động, không phải các pha:

```
         ┌───────────────────────────────────────────────┐
         │           ACTIONS (not phases)                │
         │                                               │
         │     new ◄──► continue ◄──► apply ◄──► archive │
         │      │          │           │             │   │
         │      └──────────┴───────────┴─────────────┘   │
         │                    any order                  │
         └───────────────────────────────────────────────┘
```

### Đồ thị phụ thuộc

Các tạo phẩm tạo thành một đồ thị có hướng. Các phụ thuộc là yếu tố kích hoạt, không phải cổng:

```
                        proposal
                       (root node)
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
           specs                       design
        (requires:                  (requires:
         proposal)                   proposal)
              │                           │
              └─────────────┬─────────────┘
                            │
                            ▼
                         tasks
                     (requires:
                     specs, design)
```

Khi bạn chạy `/opsx:continue`, nó kiểm tra những gì sẵn sàng và đề xuất tạo phẩm tiếp theo. Bạn cũng có thể tạo nhiều tạo phẩm sẵn sàng theo bất kỳ thứ tự nào.

### Kỹ năng so với lệnh

Hệ thống cũ sử dụng các tệp lệnh dành riêng cho công cụ:

```
.claude/commands/openspec/
├── proposal.md
├── apply.md
└── archive.md
```

OPSX sử dụng tiêu chuẩn **skills** đang nổi lên:

```
.claude/skills/
├── openspec-explore/SKILL.md
├── openspec-new-change/SKILL.md
├── openspec-continue-change/SKILL.md
├── openspec-apply-change/SKILL.md
└── ...
```

Các kỹ năng được công nhận trên nhiều công cụ lập trình AI và cung cấp siêu dữ liệu phong phú hơn.

---

## Tiếp tục các thay đổi hiện có

Các thay đổi đang thực hiện của bạn hoạt động liền mạch với các lệnh OPSX.

**Có một thay đổi đang hoạt động từ quy trình làm việc cũ?**

```
/opsx:apply add-my-feature
```

OPSX đọc các tạo phẩm hiện có và tiếp tục từ nơi bạn đã dừng lại.

**Muốn thêm nhiều tạo phẩm hơn vào một thay đổi hiện có?**

```
/opsx:continue add-my-feature
```

Hiển thị những gì sẵn sàng để tạo dựa trên những gì đã tồn tại.

**Cần xem trạng thái?**

```bash
openspec status --change add-my-feature
```

---

## Hệ thống cấu hình mới

### Cấu trúc config.yaml

```yaml
# Bắt buộc: Schema mặc định cho các thay đổi mới
schema: spec-driven

# Tùy chọn: Ngữ cảnh dự án (tối đa 50KB)
# Được chèn vào TẤT CẢ các hướng dẫn tạo phẩm
context: |
  Nền tảng dự án, ngăn xếp công nghệ,
  quy ước và ràng buộc của bạn.

# Tùy chọn: Quy tắc cho từng loại tạo phẩm
# Chỉ được chèn vào các tạo phẩm phù hợp
rules:
  proposal:
    - Bao gồm kế hoạch khôi phục
  specs:
    - Sử dụng định dạng Given/When/Then
  design:
    - Ghi lại các chiến lược dự phòng
  tasks:
    - Chia thành các khối tối đa 2 giờ
```

### Phân giải Schema

Khi xác định sử dụng schema nào, OPSX kiểm tra theo thứ tự:

1. **Cờ CLI**: `--schema <name>` (ưu tiên cao nhất)
2. **Siêu dữ liệu thay đổi**: `.openspec.yaml` trong thư mục thay đổi
3. **Cấu hình dự án**: `openspec/config.yaml`
4. **Mặc định**: `spec-driven`

### Các Schema có sẵn

| Schema | Tạo phẩm | Phù hợp nhất cho |
|--------|-----------|-------------------|
| `spec-driven` | proposal → specs → design → tasks | Hầu hết các dự án |

Liệt kê tất cả các schema có sẵn:

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

Xem [Tùy chỉnh](customization.md) để biết chi tiết.

---

## Khắc phục sự cố

### "Phát hiện tệp cũ ở chế độ không tương tác"

Bạn đang chạy trong CI hoặc môi trường không tương tác. Sử dụng:

```bash
openspec init --force
```

### Lệnh không xuất hiện sau khi di chuyển

Khởi động lại IDE của bạn. Các kỹ năng được phát hiện khi khởi động.

### "ID tạo phẩm không xác định trong quy tắc"

Kiểm tra rằng các khóa `rules:` của bạn khớp với ID tạo phẩm trong schema của bạn:

- **spec-driven**: `proposal`, `specs`, `design`, `tasks`

Chạy lệnh này để xem các ID tạo phẩm hợp lệ:

```bash
openspec schemas --json
```

### Cấu hình không được áp dụng

1. Đảm bảo tệp nằm ở `openspec/config.yaml` (không phải `.yml`)
2. Xác thực cú pháp YAML
3. Các thay đổi cấu hình có hiệu lực ngay lập tức—không cần khởi động lại

### project.md chưa được di chuyển

Hệ thống cố tình giữ lại `project.md` vì nó có thể chứa nội dung tùy chỉnh của bạn. Xem xét nó thủ công, di chuyển các phần hữu ích sang `config.yaml`, sau đó xóa nó.

### Muốn xem những gì sẽ được dọn dẹp?

Chạy init và từ chối lời nhắc dọn dẹp—bạn sẽ thấy toàn bộ bản tóm tắt phát hiện mà không thực hiện bất kỳ thay đổi nào.

---

## Tham chiếu nhanh

### Các tệp sau khi di chuyển

```
project/
├── openspec/
│   ├── specs/                    # Không thay đổi
│   ├── changes/                  # Không thay đổi
│   │   └── archive/              # Không thay đổi
│   └── config.yaml               # MỚI: Cấu hình dự án
├── .claude/
│   └── skills/                   # MỚI: Các kỹ năng OPSX
│       ├── openspec-propose/     # hồ sơ cốt lõi mặc định
│       ├── openspec-explore/
│       ├── openspec-apply-change/
│       ├── openspec-sync-specs/
│       └── ...                   # hồ sơ mở rộng thêm new/continue/ff/etc.
├── CLAUDE.md                     # Các đánh dấu OpenSpec đã được xóa, nội dung của bạn được giữ nguyên
└── AGENTS.md                     # Các đánh dấu OpenSpec đã được xóa, nội dung của bạn được giữ nguyên
```

### Những gì đã bị loại bỏ

- `.claude/commands/openspec/` — được thay thế bởi `.claude/skills/`
- `openspec/AGENTS.md` — đã lỗi thời
- `openspec/project.md` — di chuyển sang `config.yaml`, sau đó xóa
- Các khối đánh dấu OpenSpec trong `CLAUDE.md`, `AGENTS.md`, v.v.

### Bảng ghi chép lệnh

```text
/opsx:propose      Bắt đầu nhanh (hồ sơ cốt lõi mặc định)
/opsx:apply        Triển khai các tác vụ
/opsx:archive      Hoàn thành và lưu trữ

# Quy trình làm việc mở rộng (nếu được bật):
/opsx:new          Tạo khung cho một thay đổi
/opsx:continue     Tạo tạo phẩm tiếp theo
/opsx:ff           Tạo các tạo phẩm lập kế hoạch
```

---

## Nhận trợ giúp

- **Discord**: [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues**: [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Tài liệu**: [docs/opsx.md](opsx.md) để tham khảo đầy đủ về OPSX