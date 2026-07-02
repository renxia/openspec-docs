# Lệnh

Đây là tài liệu tham khảo cho các lệnh gạch chéo của OpenSpec. Các lệnh này được gọi trong giao diện trò chuyện của trợ lý lập trình AI (ví dụ: Claude Code, Cursor, Windsurf).

Đối với các mẫu quy trình làm việc và thời điểm sử dụng từng lệnh, hãy xem [Workflows](workflows.md). Đối với các lệnh CLI, hãy xem [CLI](cli.md).

## Tham Khảo Nhanh

### Đường Dẫn Nhanh Mặc Định (`core` profile)

| Command | Purpose |
|---------|---------|
| `/opsx:propose` | Tạo một thay đổi và tạo các artifact lập kế hoạch trong một bước |
| `/opsx:explore` | Suy nghĩ qua các ý tưởng trước khi cam kết vào một thay đổi |
| `/opsx:apply` | Triển khai các tác vụ từ thay đổi |
| `/opsx:sync` | Hợp nhất các spec delta vào các spec chính |
| `/opsx:archive` | Lưu trữ một thay đổi đã hoàn thành |

### Các Lệnh Quy Trình Làm Việc Mở Rộng (chọn tùy chỉnh quy trình làm việc)

| Command | Purpose |
|---------|---------|
| `/opsx:new` | Bắt đầu một khung thay đổi mới |
| `/opsx:continue` | Tạo artifact tiếp theo dựa trên các phụ thuộc |
| `/opsx:ff` | Tăng tốc (Fast-forward): tạo tất cả các artifact lập kế hoạch cùng một lúc |
| `/opsx:verify` | Xác thực rằng việc triển khai khớp với các artifact |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi cùng một lúc |
| `/opsx:onboard` | Hướng dẫn từng bước qua toàn bộ quy trình làm việc |

Hồ sơ toàn cục mặc định là `core`. Để kích hoạt các lệnh quy trình làm việc mở rộng, hãy chạy `openspec config profile`, chọn các quy trình làm việc, sau đó chạy `openspec update` trong dự án của bạn.

## Tham Chiếu Lệnh

### `/opsx:propose`

Tạo một thay đổi mới và tạo các tác phẩm lập kế hoạch trong một bước. Đây là lệnh khởi đầu mặc định trong profile `core`.

**Cú pháp:**
```text
/opsx:propose [change-name-or-description]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name-or-description` | Không | Tên theo định dạng kebab-case hoặc mô tả thay đổi bằng ngôn ngữ thông thường |

**Nó làm gì:**
- Tạo thư mục `openspec/changes/<change-name>/`
- Tạo các tác phẩm cần thiết trước khi triển khai (cho `spec-driven`: proposal, specs, design, tasks)
- Dừng lại khi thay đổi sẵn sàng cho `/opsx:apply`

**Ví dụ:**
```text
You: /opsx:propose add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     ✓ proposal.md
     ✓ specs/ui/spec.md
     ✓ design.md
     ✓ tasks.md
     Ready for implementation. Run /opsx:apply.
```

**Mẹo:**
- Sử dụng lệnh này cho quy trình từ đầu đến cuối nhanh nhất
- Nếu bạn muốn kiểm soát tác phẩm từng bước, hãy bật các quy trình mở rộng và sử dụng `/opsx:new` + `/opsx:continue`

---

### `/opsx:explore`

> **Hãy bắt đầu tại đây khi bạn không chắc chắn.** Explore là một đối tác tư duy không áp lực: nó đọc codebase của bạn, so sánh các lựa chọn và biến một ý tưởng mơ hồ thành một kế hoạch cụ thể trước khi bất kỳ thay đổi nào tồn tại. Nó có sẵn trong profile mặc định. Đối với trường hợp đầy đủ hơn và nhiều ví dụ hơn, hãy xem hướng dẫn [Explore First](explore.md).

Hãy suy nghĩ về các ý tưởng, điều tra các vấn đề và làm rõ các yêu cầu trước khi cam kết thực hiện một thay đổi.

**Cú pháp:**
```
/opsx:explore [topic]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `topic` | Không | Điều bạn muốn khám phá hoặc điều tra |

**Nó làm gì:**
- Mở một cuộc trò chuyện thăm dò mà không yêu cầu cấu trúc
- Điều tra codebase để trả lời các câu hỏi
- So sánh các lựa chọn và phương pháp tiếp cận
- Tạo sơ đồ trực quan để làm rõ suy nghĩ
- Có thể chuyển sang `/opsx:propose` (mặc định) hoặc `/opsx:new` (quy trình mở rộng) khi những hiểu biết được kết tinh

**Ví dụ:**
```text
You: /opsx:explore

AI:  What would you like to explore?

You: How should we handle authentication for the mobile app?

AI:  Let me investigate your current auth setup...
     [Analyzes codebase]

     I see you're using session-based auth for the web app.
     For mobile, we have three main options:

     1. JWT tokens (stateless, works offline)
     2. OAuth2 (if you need third-party login)
     3. Extend current sessions (simpler, but requires connectivity)

     Your API already has CORS configured. Which direction interests you?

You: Let's go with JWT. Can we start a change for that?

AI:  Ready when you are. Run /opsx:propose add-jwt-auth to begin.
```

**Mẹo:**
- Sử dụng khi yêu cầu chưa rõ ràng hoặc bạn cần điều tra
- Không có tác phẩm nào được tạo ra trong quá trình khám phá
- Tốt cho việc so sánh nhiều phương pháp tiếp cận trước khi quyết định
- Có thể đọc các tệp và tìm kiếm codebase

---

### `/opsx:new`

Bắt đầu một khung thay đổi mới. Tạo thư mục thay đổi và chờ bạn tạo các tác phẩm bằng `/opsx:continue` hoặc `/opsx:ff`.

Lệnh này là một phần của bộ quy trình mở rộng (không có trong profile `core` mặc định).

**Cú pháp:**
```
/opsx:new [change-name] [--schema <schema-name>]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Tên cho thư mục thay đổi (sẽ được nhắc nếu không cung cấp) |
| `--schema` | Không | Schema quy trình cần sử dụng (mặc định: từ config hoặc `spec-driven`) |

**Nó làm gì:**
- Tạo thư mục `openspec/changes/<change-name>/`
- Tạo tệp siêu dữ liệu `.openspec.yaml` trong thư mục thay đổi
- Hiển thị mẫu tác phẩm đầu tiên sẵn sàng để tạo
- Nhắc tên thay đổi và schema nếu chưa được cung cấp

**Nó tạo ra gì:**
```
openspec/changes/<change-name>/
└── .openspec.yaml    # Siêu dữ liệu thay đổi (schema, ngày tạo)
```

**Ví dụ:**
```
You: /opsx:new add-dark-mode

AI:  Created openspec/changes/add-dark-mode/
     Schema: spec-driven

     Ready to create: proposal
     Use /opsx:continue to create it, or /opsx:ff to create all artifacts.
```

**Mẹo:**
- Sử dụng các tên mô tả: `add-feature`, `fix-bug`, `refactor-module`
- Tránh các tên chung chung như `update`, `changes`, `wip`
- Schema cũng có thể được đặt trong cấu hình dự án (`openspec/config.yaml`)

---

### `/opsx:continue`

Tạo tác phẩm tiếp theo trong chuỗi phụ thuộc. Tạo từng tác phẩm một để tiến triển tăng dần.

**Cú pháp:**
```
/opsx:continue [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi nào cần tiếp tục (sẽ được suy luận từ ngữ cảnh nếu không cung cấp) |

**Nó làm gì:**
- Truy vấn biểu đồ phụ thuộc tác phẩm
- Hiển thị những tác phẩm nào đã sẵn sàng so với bị chặn
- Tạo tác phẩm đầu tiên đã sẵn sàng
- Đọc các tệp phụ thuộc để lấy ngữ cảnh
- Hiển thị những gì sẽ có sẵn sau khi tạo

**Ví dụ:**
```
You: /opsx:continue

AI:  Change: add-dark-mode

     Artifact status:
     ✓ proposal    (done)
     ◆ specs       (ready)
     ◆ design      (ready)
     ○ tasks       (blocked - needs: specs)

     Creating specs...

     [Reads proposal.md, creates specs based on requirements]

     ✓ Created openspec/changes/add-dark-mode/specs/ui/spec.md

     Now available: tasks
     Run /opsx:continue to create the next artifact.
```

**Mẹo:**
- Sử dụng khi bạn muốn xem xét từng tác phẩm trước khi tiếp tục
- Tốt cho các thay đổi phức tạp nơi bạn muốn có sự kiểm soát
- Nhiều tác phẩm có thể sẵn sàng cùng một lúc
- Bạn có thể chỉnh sửa các tác phẩm đã tạo trước khi tiếp tục

---

### `/opsx:ff`

Tăng tốc qua quá trình tạo tác phẩm. Tạo tất cả các tác phẩm lập kế hoạch cùng một lúc.

**Cú pháp:**
```
/opsx:ff [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi nào cần tăng tốc (sẽ được suy luận từ ngữ cảnh nếu không cung cấp) |

**Nó làm gì:**
- Tạo tất cả các tác phẩm theo thứ tự phụ thuộc
- Theo dõi tiến độ thông qua danh sách việc cần làm (todo list)
- Dừng lại khi tất cả các tác phẩm `apply-required` đã hoàn thành
- Đọc từng phụ thuộc trước khi tạo tác phẩm tiếp theo

**Ví dụ:**
```
You: /opsx:ff add-dark-mode

AI:  Fast-forwarding add-dark-mode...

     ✓ Creating proposal.md
     ✓ Creating specs/ui/spec.md
     ✓ Creating design.md
     ✓ Creating tasks.md

     All planning artifacts complete!
     Ready for implementation. Run /opsx:apply to begin.
```

**Mẹo:**
- Sử dụng khi bạn có cái nhìn rõ ràng về những gì mình đang xây dựng
- Nhanh hơn `/opsx:continue` đối với các thay đổi đơn giản
- Bạn vẫn có thể chỉnh sửa tác phẩm sau đó
- Tốt cho các tính năng nhỏ đến trung bình

---

### `/opsx:apply`

Triển khai các nhiệm vụ từ thay đổi. Thực hiện qua danh sách công việc, viết mã và đánh dấu hoàn thành.

**Cú pháp:**
```
/opsx:apply [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi nào cần triển khai (sẽ được suy luận từ ngữ cảnh nếu không cung cấp) |

**Nó làm gì:**
- Đọc `tasks.md` và xác định các nhiệm vụ chưa hoàn thành
- Thực hiện từng nhiệm vụ một
- Viết mã, tạo tệp, chạy kiểm thử khi cần thiết
- Đánh dấu nhiệm vụ đã hoàn thành bằng hộp kiểm `[x]`

**Ví dụ:**
```
You: /opsx:apply

AI:  Implementing add-dark-mode...

     Reading tasks.md:
     - [ ] 1.1 Create ThemeContext
     - [ ] 1.2 Add CSS custom properties
     - [ ] 1.3 Implement localStorage persistence

     Working on 1.1: Create ThemeContext...
     [Creates src/context/ThemeContext.tsx]

     ✓ 1.1 Complete

     Working on 1.2: Add CSS custom properties...
     [Updates src/styles/globals.css]

     ✓ 1.2 Complete
     ...
```

**Mẹo:**
- Có thể tiếp tục từ nơi bạn đã dừng nếu bị gián đoạn
- Sử dụng cho các thay đổi song song bằng cách chỉ định tên thay đổi
- Trạng thái hoàn thành được theo dõi trong hộp kiểm `tasks.md`

---

### `/opsx:verify`

Xác thực rằng việc triển khai khớp với các tác phẩm thay đổi của bạn. Kiểm tra tính đầy đủ, tính chính xác và sự mạch lạc.

**Cú pháp:**
```
/opsx:verify [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi nào cần xác minh (sẽ được suy luận từ ngữ cảnh nếu không cung cấp) |

**Nó làm gì:**
- Kiểm tra ba khía cạnh chất lượng triển khai
- Tìm kiếm bằng chứng cứ triển khai trong codebase
- Báo cáo các vấn đề được phân loại là CRITICAL, WARNING hoặc SUGGESTION
- Không chặn việc lưu trữ (archive), nhưng sẽ hiển thị các vấn đề

**Các chiều kích thước xác minh:**

| Chiều kích thước | Nó xác thực điều gì |
|-----------|-------------------|
| **Completeness** | Tất cả nhiệm vụ đã hoàn thành, tất cả yêu cầu đã được triển khai, kịch bản đã được bao phủ |
| **Correctness** | Triển khai khớp với ý định của spec, các trường hợp biên (edge cases) đã được xử lý |
| **Coherence** | Các quyết định thiết kế phản ánh trong mã, các mẫu (patterns) nhất quán |

**Ví dụ:**
```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "System preference detection" has no test coverage

     CORRECTNESS
     ✓ Implementation matches spec intent
     ✓ Edge cases from scenarios are handled
     ✓ Error states match spec definitions

     COHERENCE
     ✓ Design decisions reflected in code structure
     ✓ Naming conventions consistent with design.md
     ⚠ Design mentions "CSS variables" but implementation uses Tailwind classes

     SUMMARY
     ─────────────────────────────
     Critical issues: 0
     Warnings: 2
     Ready to archive: Yes (with warnings)

     Recommendations:
     1. Add test for system preference detection
     2. Update design.md to reflect Tailwind usage, or refactor to use CSS variables
```

**Mẹo:**
- Chạy trước khi lưu trữ để bắt các sự không khớp sớm
- Cảnh báo (Warnings) không chặn việc lưu trữ nhưng cho biết có vấn đề tiềm ẩn
- Tốt cho việc xem xét công việc của AI trước khi cam kết
- Có thể tiết lộ sự sai lệch giữa các tác phẩm và triển khai

---

### `/opsx:sync`

**Lệnh tùy chọn.** Hợp nhất các spec delta từ một thay đổi vào các spec chính. Archive sẽ nhắc đồng bộ nếu cần, vì vậy bạn thường không cần chạy lệnh này thủ công.

**Cú pháp:**
```
/opsx:sync [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi nào cần đồng bộ (sẽ được suy luận từ ngữ cảnh nếu không cung cấp) |

**Nó làm gì:**
- Đọc các spec delta từ thư mục thay đổi
- Phân tích các phần ADDED/MODIFIED/REMOVED/RENAMED
- Hợp nhất các thay đổi vào thư mục `openspec/specs/` chính
- Bảo toàn nội dung hiện có không được đề cập trong delta
- Không lưu trữ (archive) thay đổi (vẫn còn hoạt động)

**Ví dụ:**
```text
You: /opsx:sync

AI:  Syncing add-dark-mode delta specs...

     Reading: openspec/changes/add-dark-mode/specs/ui/spec.md
     Target:  openspec/specs/ui/spec.md

     Changes to apply:
     ✓ ADDED: Theme Selection requirement (2 scenarios)
     ✓ ADDED: Accessibility requirement (1 scenario)

     Merging...
     ✓ openspec/specs/ui/spec.md updated

     Change remains active. Run /opsx:archive when ready to complete.
```

**Khi nào nên sử dụng thủ công:**

| Kịch bản | Có cần sync không? |
|----------|-----------|
| Thay đổi kéo dài, muốn có spec trong chính trước khi lưu trữ | Có |
| Nhiều thay đổi song song cần các spec cơ sở đã được cập nhật | Có |
| Muốn xem trước/xem xét việc hợp nhất một cách riêng biệt | Có |
| Thay đổi nhanh, đi thẳng đến archive | Không (archive sẽ xử lý) |

**Mẹo:**
- Sync là thông minh, không phải sao chép
- Có thể thêm các kịch bản vào các yêu cầu hiện có mà không cần trùng lặp
- Thay đổi vẫn còn hoạt động sau khi sync (không được lưu trữ)
- Hầu hết người dùng sẽ không bao giờ cần gọi trực tiếp lệnh này—archive sẽ nhắc nếu cần

---

### `/opsx:archive`

Lưu trữ một thay đổi đã hoàn thành. Hoàn thiện thay đổi và di chuyển nó đến thư mục archive.

**Cú pháp:**
```
/opsx:archive [change-name]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-name` | Không | Thay đổi nào cần lưu trữ (sẽ được suy luận từ ngữ cảnh nếu không cung cấp) |

**Nó làm gì:**
- Kiểm tra trạng thái hoàn thành của tác phẩm
- Kiểm tra việc hoàn thành nhiệm vụ (cảnh báo nếu chưa hoàn thành)
- Đề nghị đồng bộ delta specs nếu chưa được đồng bộ
- Di chuyển thư mục thay đổi đến `openspec/changes/archive/YYYY-MM-DD-<name>/`
- Bảo toàn tất cả các tác phẩm để truy vết kiểm toán

**Ví dụ:**
```text
You: /opsx:archive

AI:  Archiving add-dark-mode...

     Artifact status:
     ✓ proposal.md exists
     ✓ specs/ exists
     ✓ design.md exists
     ✓ tasks.md exists (8/8 tasks complete)

     Delta specs: Not yet synced
     → Sync now? (recommended)

You: Yes

AI:  ✓ Synced specs to openspec/specs/ui/spec.md
     ✓ Moved to openspec/changes/archive/2025-01-24-add-dark-mode/

     Change archived successfully.
```

**Mẹo:**
- Archive sẽ không chặn nếu nhiệm vụ chưa hoàn thành, nhưng sẽ cảnh báo
- Delta specs có thể được đồng bộ trong quá trình archive hoặc trước đó
- Các thay đổi đã lưu trữ được bảo toàn cho lịch sử
- Sử dụng `/opsx:verify` trước để bắt các vấn đề

---

### `/opsx:bulk-archive`

Lưu trữ nhiều thay đổi đã hoàn thành cùng một lúc. Xử lý xung đột spec giữa các thay đổi.

**Cú pháp:**
```
/opsx:bulk-archive [change-names...]
```

**Đối số:**
| Đối số | Bắt buộc | Mô tả |
|----------|----------|-------------|
| `change-names` | Không | Các thay đổi cụ thể cần lưu trữ (sẽ được nhắc chọn nếu không cung cấp) |

**Nó làm gì:**
- Liệt kê tất cả các thay đổi đã hoàn thành
- Xác thực từng thay đổi trước khi lưu trữ
- Phát hiện xung đột spec giữa các thay đổi
- Giải quyết xung đột bằng cách kiểm tra những gì thực sự được triển khai
- Lưu trữ theo thứ tự thời gian

**Ví dụ:**
```
You: /opsx:bulk-archive

AI:  Found 3 completed changes:
     - add-dark-mode (8/8 tasks complete)
     - fix-login-bug (3/3 tasks complete)
     - update-footer (2/2 tasks complete)

     Checking for spec conflicts...
     ⚠ add-dark-mode and update-footer both touch specs/ui/

     Inspecting codebase to resolve...
     Both changes are implemented. Will merge in chronological order:
     1. add-dark-mode (created Jan 20)
     2. update-footer (created Jan 22)

     Archive all 3 changes?

You: Yes

AI:  ✓ Archived add-dark-mode
     ✓ Archived fix-login-bug
     ✓ Archived update-footer
     Specs merged: add-dark-mode → update-footer
```

**Mẹo:**
- Tốt cho các luồng công việc song song
- Giải quyết xung đột là hành động của agent (kiểm tra codebase)
- Các thay đổi được lưu trữ theo thứ tự tạo
- Nhắc trước khi ghi đè nội dung spec

---

### `/opsx:onboard`

Hướng dẫn onboarding qua toàn bộ quy trình OpenSpec. Một bài hướng dẫn tương tác sử dụng codebase thực tế của bạn.

**Cú pháp:**
```
/opsx:onboard
```

**Nó làm gì:**
- Đi qua một chu kỳ quy trình hoàn chỉnh với lời tường thuật
- Quét codebase để tìm các cơ hội cải tiến thực sự
- Tạo một thay đổi thực tế với các tác phẩm thực tế
- Triển khai công việc thực tế (các thay đổi nhỏ, an toàn)
- Lưu trữ thay đổi đã hoàn thành
- Giải thích từng bước khi nó xảy ra

**Các giai đoạn:**
1. Chào mừng và phân tích codebase
2. Tìm một cơ hội cải tiến
3. Tạo một thay đổi (`/opsx:new`)
4. Viết proposal
5. Tạo specs
6. Viết thiết kế (design)
7. Tạo tasks
8. Triển khai tasks (`/opsx:apply`)
9. Xác minh triển khai
10. Lưu trữ thay đổi
11. Tóm tắt và các bước tiếp theo

**Ví dụ:**
```
You: /opsx:onboard

AI:  Welcome to OpenSpec!

     I'll walk you through the complete workflow using your actual codebase.
     We'll find something small to improve, create a proper change for it,
     implement it, and archive it.

     Let me scan your codebase for opportunities...

     [Analyzes codebase]

     I found a few things we could work on:
     1. Add input validation to the contact form
     2. Improve error messages in the auth flow
     3. Add loading states to async buttons

     Which interests you? (or suggest something else)
```

**Mẹo:**
- Tốt nhất cho người dùng mới học quy trình làm việc
- Sử dụng mã thực tế, không phải ví dụ đồ chơi
- Tạo một thay đổi thực sự mà bạn có thể giữ lại hoặc loại bỏ
- Mất khoảng 15-30 phút để hoàn thành

## Cú pháp Lệnh theo Công cụ AI

Các công cụ AI khác nhau sử dụng cú pháp lệnh hơi khác nhau. Hãy sử dụng định dạng phù hợp với công cụ của bạn:

| Tool | Syntax Example |
|------|----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | Skill-based invocations such as `/skill:openspec-propose`, `/skill:openspec-apply-change` (no generated `opsx-*` command files) |
| Trae | Skill-based invocations such as `/openspec-propose`, `/openspec-apply-change` (no generated `opsx-*` command files) |

Mục đích là như nhau trên tất cả các công cụ, nhưng cách hiển thị lệnh có thể khác tùy thuộc vào tích hợp.

> **Lưu ý:** Các lệnh của GitHub Copilot (`.github/prompts/*.prompt.md`) chỉ khả dụng trong các tiện ích mở rộng IDE (VS Code, JetBrains, Visual Studio). GitHub Copilot CLI hiện không hỗ trợ các tệp prompt tùy chỉnh — hãy xem [Supported Tools](supported-tools.md) để biết chi tiết và các giải pháp thay thế.

---

## Lệnh Cũ (Legacy)

Các lệnh này sử dụng quy trình làm việc "tất cả cùng một lúc" cũ hơn. Chúng vẫn hoạt động nhưng các lệnh OPSX được khuyến nghị.

| Command | What it does |
|---------|--------------|
| `/openspec:proposal` | Tạo tất cả các tài sản cùng một lúc (đề xuất, thông số kỹ thuật, thiết kế, nhiệm vụ) |
| `/openspec:apply` | Triển khai thay đổi |
| `/openspec:archive` | Lưu trữ thay đổi |

**Khi nào nên sử dụng các lệnh cũ:**
- Các dự án hiện có đang sử dụng quy trình làm việc cũ
- Các thay đổi đơn giản mà bạn không cần tạo tài sản tăng dần
- Ưu tiên phương pháp tiếp cận tất cả hoặc không gì

**Chuyển đổi sang OPSX:**
Các thay đổi cũ vẫn có thể được thực hiện bằng các lệnh OPSX. Cấu trúc tài sản là tương thích.

---

## Khắc phục sự cố

### "Change not found" (Không tìm thấy thay đổi)

Lệnh không thể xác định thay đổi nào để xử lý.

**Giải pháp:**
- Chỉ định rõ tên thay đổi: `/opsx:apply add-dark-mode`
- Kiểm tra xem thư mục thay đổi có tồn tại hay không: `openspec list`
- Xác minh rằng bạn đang ở trong đúng thư mục dự án

### "No artifacts ready" (Không có tài sản nào sẵn sàng)

Tất cả các tài sản đều đã hoàn thành hoặc bị chặn bởi các phụ thuộc còn thiếu.

**Giải pháp:**
- Chạy `openspec status --change <name>` để xem cái gì đang gây tắc nghẽn
- Kiểm tra xem các tài sản cần thiết có tồn tại không
- Tạo trước các tài sản phụ thuộc còn thiếu

### "Schema not found" (Không tìm thấy schema)

Schema được chỉ định không tồn tại.

**Giải pháp:**
- Liệt kê các schema khả dụng: `openspec schemas`
- Kiểm tra chính tả tên schema
- Tạo schema nếu nó là tùy chỉnh: `openspec schema init <name>`

### Commands not recognized (Các lệnh không được nhận diện)

Công cụ AI không nhận ra các lệnh OpenSpec.

**Giải pháp:**
- Đảm bảo OpenSpec đã được khởi tạo: `openspec init`
- Tái tạo lại skills: `openspec update`
- Kiểm tra xem thư mục `.claude/skills/` có tồn tại không (đối với Claude Code)
- Khởi động lại công cụ AI của bạn để nhận các skills mới

### Artifacts not generating properly (Tài sản không được tạo đúng cách)

AI tạo ra các tài sản không đầy đủ hoặc không chính xác.

**Giải pháp:**
- Thêm ngữ cảnh dự án vào `openspec/config.yaml`
- Thêm các quy tắc cho từng tài sản để có hướng dẫn cụ thể
- Cung cấp thêm chi tiết trong mô tả thay đổi của bạn
- Sử dụng `/opsx:continue` thay vì `/opsx:ff` để kiểm soát tốt hơn

---

## Các Bước Tiếp Theo

- [Workflows](workflows.md) - Các mẫu phổ biến và khi nào nên sử dụng từng lệnh
- [CLI](cli.md) - Các lệnh Terminal để quản lý và xác thực
- [Customization](customization.md) - Tạo các schema và quy trình làm việc tùy chỉnh