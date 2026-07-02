# Khắc phục sự cố (Troubleshooting)

Những giải pháp cụ thể cho các vấn đề cụ thể. Mỗi mục đều nêu tên một triệu chứng, giải thích nguyên nhân có khả năng xảy ra trong một câu và đưa ra cách khắc phục. Nếu bạn không tìm thấy vấn đề của mình ở đây, [FAQ](faq.md) có thể giúp ích, còn [Discord](https://discord.gg/YctCnvvshC) chắc chắn sẽ giúp được.

## Cài đặt và thiết lập (Installation and setup)

### `openspec: command not found`

CLI chưa được cài đặt, hoặc shell của bạn không tìm thấy nó. Hãy cài đặt nó toàn cục (globally) và kiểm tra:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Nếu nó đã được cài đặt nhưng vẫn không tìm thấy, thì thư mục bin npm toàn cục của bạn có lẽ chưa nằm trong `PATH`. Chạy `npm bin -g` để xem các binary toàn cục nằm ở đâu và đảm bảo rằng đường dẫn đó có trong profile shell của bạn.

### "Requires Node.js 20.19.0 or higher"

OpenSpec chạy trên Node 20.19.0+. Hãy kiểm tra phiên bản của bạn và nâng cấp nếu cần:

```bash
node --version
```

Nếu bạn sử dụng bun để cài đặt OpenSpec, hãy lưu ý rằng OpenSpec vẫn *chạy* trên Node, vì vậy bạn cần có sẵn Node 20.19.0+ trong `PATH` bất kể thế nào. Xem [Installation](installation.md).

### `openspec init` không cấu hình công cụ AI của tôi

Init sẽ hỏi những công cụ nào cần được thiết lập. Nếu bạn bỏ qua công cụ của mình hoặc muốn thêm một công cụ khác, chỉ cần chạy lại nó, hoặc sử dụng dạng không tương tác (non-interactive):

```bash
openspec init --tools claude,cursor
```

Danh sách đầy đủ các ID công cụ nằm trong [Supported Tools](supported-tools.md). Sử dụng `--tools all` cho tất cả, `--tools none` để bỏ qua thiết lập công cụ.

## Các lệnh không hiển thị (Commands don't show up)

Nếu `/opsx:propose` (hoặc công cụ tương đương của bạn) không xuất hiện hoặc không làm gì cả, hãy xem qua danh sách này. Chúng được sắp xếp theo thứ tự kiểm tra nhanh nhất trước.

1. **Bạn có thể đang ở sai nơi.** Các lệnh slash (slash commands) phải được sử dụng trong cửa sổ chat của trợ lý AI, chứ không phải trong terminal. Nếu bạn gõ `/opsx:propose` vào shell, đó là vấn đề. Xem [How Commands Work](how-commands-work.md).

2. **Tạo lại các tệp tin.** Từ thư mục gốc dự án của bạn:

   ```bash
   openspec update
   ```

   Thao tác này sẽ ghi đè (rewrites) các tệp kỹ năng (skill) và lệnh cho mọi công cụ mà bạn đã cấu hình.

3. **Khởi động lại trợ lý của bạn.** Hầu hết các công cụ đều quét tìm kiếm các kỹ năng và lệnh khi khởi động. Một cửa sổ mới thường sẽ thực hiện việc này.

4. **Xác nhận rằng các tệp tin tồn tại.** Đối với Claude Code, hãy kiểm tra xem `.claude/skills/` có chứa các thư mục `openspec-*` hay không. Các công cụ khác sử dụng các thư mục riêng của chúng, tất cả đều được liệt kê trong [Supported Tools](supported-tools.md).

5. **Xác nhận rằng bạn đã khởi tạo dự án này.** Kỹ năng (Skills) được viết theo từng dự án. Nếu bạn clone một repo hoặc chuyển đổi thư mục, hãy chạy `openspec init` (hoặc `openspec update`) tại đó.

6. **Xác nhận công cụ của bạn hỗ trợ các tệp lệnh.** Một vài công cụ (Kimi CLI, Trae, ForgeCode, Mistral Vibe) không tạo ra các tệp lệnh `opsx-*`; chúng sử dụng việc gọi dựa trên kỹ năng (skill-based invocations) thay vào đó. Các dạng thức khác nhau cho từng công cụ: xem [Supported Tools](supported-tools.md) và [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

## Làm việc với các thay đổi (Working with changes)

### "Change not found" (Không tìm thấy thay đổi)

Lệnh không thể cho biết bạn muốn nói về thay đổi nào. Hãy đặt tên nó một cách rõ ràng, hoặc kiểm tra những gì đang tồn tại:

```bash
openspec list                    # xem các thay đổi đang hoạt động
/opsx:apply add-dark-mode        # đặt tên thay đổi trong chat
```

Hãy xác nhận thêm rằng bạn đang ở đúng thư mục dự án.

### "No artifacts ready" (Không có artifact nào sẵn sàng)

Mọi artifact đều đã được tạo hoặc đang bị chặn chờ một dependency. Hãy xem cái gì đang chặn:

```bash
openspec status --change <name>
```

Sau đó hãy tạo dependency còn thiếu trước. Hãy nhớ thứ tự: đề xuất (proposal) cho phép các spec và thiết kế; spec và thiết kế cùng nhau cho phép các tác vụ (tasks).

### `openspec validate` báo cáo cảnh báo hoặc lỗi

Validation kiểm tra các spec và thay đổi của bạn để tìm các vấn đề cấu trúc. Hãy đọc thông báo: nó nêu tên tệp và vấn đề.

```bash
openspec validate <name>           # xác thực một mục
openspec validate --all            # xác thực tất cả
openspec validate --all --strict   # kiểm tra nghiêm ngặt hơn, tốt cho CI
```

Nguyên nhân phổ biến là thiếu một phần bắt buộc (ví dụ: spec không có kịch bản nào) hoặc tiêu đề delta bị lỗi. Hãy sửa tệp và chạy lại. [CLI reference](cli.md#openspec-validate) tài liệu hóa định dạng đầu ra.

### AI tạo ra các artifact không hoàn chỉnh hoặc sai

AI không có đủ ngữ cảnh (context). Một vài cách sau sẽ giúp ích:

- Thêm ngữ cảnh dự án vào `openspec/config.yaml` để ngăn xếp (stack) và quy ước của bạn được đưa vào mọi yêu cầu. Xem [Customization](customization.md#project-configuration).
- Thêm `rules:` cho từng artifact để hướng dẫn chỉ áp dụng cho, ví dụ, các spec.
- Cung cấp mô tả chi tiết hơn khi bạn đề xuất (propose).
- Sử dụng `/opsx:continue` mở rộng để tạo một artifact tại một thời điểm và xem xét từng cái, thay vì để `/opsx:ff` làm tất cả cùng một lúc.

### Archive không hoàn thành, hoặc cảnh báo về các tác vụ chưa hoàn thành

Archive sẽ không *bị chặn* bởi các tác vụ chưa hoàn thành, nhưng nó cảnh báo bạn, bởi vì lưu trữ (archiving) thường có nghĩa là công việc đã hoàn thành. Nếu các tác vụ vẫn còn tồn tại một cách cố ý (bạn đang nộp một thay đổi một phần), hãy tiếp tục. Ngược lại, hãy hoàn thành các tác vụ trước. Archive cũng sẽ đề nghị đồng bộ hóa delta specs của bạn vào main specs nếu bạn chưa đồng bộ; hãy trả lời có trừ khi bạn có lý do không nên.

## Cấu hình (Configuration)

### `config.yaml` của tôi không được áp dụng

Ba nghi phạm thông thường:

1. **Tên tệp sai.** Nó phải là `openspec/config.yaml`, chứ không phải `.yml`.
2. **YAML không hợp lệ.** Hãy chạy nó qua bất kỳ trình xác thực YAML nào; CLI cũng báo cáo các lỗi cú pháp cùng với số dòng.
3. **Bạn mong đợi một lần khởi động lại.** Bạn không cần. Các thay đổi cấu hình có hiệu lực ngay lập tức.

### "Unknown artifact ID in rules: X" (ID artifact không xác định trong rules: X)

Một khóa dưới `rules:` không khớp với bất kỳ artifact nào trong schema của bạn. Đối với schema mặc định `spec-driven`, các ID hợp lệ là `proposal`, `specs`, `design`, `tasks`. Để xem các ID cho bất kỳ schema nào:

```bash
openspec schemas --json
```

### "Context too large" (Ngữ cảnh quá lớn)

Trường `context:` bị giới hạn ở mức 50KB, cố ý như vậy, vì nó được đưa vào mọi yêu cầu. Hãy tóm tắt nó, hoặc liên kết ra các tài liệu dài hơn thay vì dán chúng vào. Ngữ cảnh gọn gàng cũng tạo ra kết quả tốt hơn và nhanh hơn.

### "Schema not found" (Không tìm thấy schema)

Tên schema bạn tham chiếu không tồn tại. Liệt kê những gì có sẵn và kiểm tra chính tả:

```bash
openspec schemas                    # liệt kê các schema có sẵn
openspec schema which <name>        # xem một schema được giải quyết từ đâu
openspec schema init <name>         # tạo một cái tùy chỉnh
```

Xem [Customization](customization.md#custom-schemas).

## Di chuyển đổi từ quy trình cũ (Migration from the legacy workflow)

### "Legacy files detected in non-interactive mode" (Phát hiện tệp cũ ở chế độ không tương tác)

Bạn đang trong CI hoặc một shell không tương tác, và OpenSpec đã tìm thấy các tệp cũ để dọn dẹp nhưng không thể nhắc bạn. Hãy phê duyệt tự động:

```bash
openspec init --force
```

### Các lệnh không xuất hiện sau khi di chuyển đổi

Khởi động lại IDE của bạn. Kỹ năng được phát hiện khi khởi động. Nếu chúng vẫn không xuất hiện, hãy chạy `openspec update` và kiểm tra vị trí tệp trong [Supported Tools](supported-tools.md).

### `project.md` cũ của tôi đã không được di chuyển đổi

Điều đó là có chủ ý. OpenSpec không bao giờ tự động xóa `project.md` vì nó có thể chứa ngữ cảnh mà bạn đã viết. Hãy chuyển các phần hữu ích vào mục `context:` của `config.yaml`, sau đó tự mình xóa nó. [Migration Guide](migration-guide.md#migrating-projectmd-to-configyaml) hướng dẫn chi tiết về việc này, bao gồm cả một lời nhắc (prompt) bạn có thể đưa cho AI để chắt lọc.

## Vẫn bị mắc kẹt? (Still stuck?)

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Từ terminal của bạn:** `openspec feedback "what went wrong"` sẽ mở một issue cho bạn.

Khi báo cáo một vấn đề, hãy bao gồm phiên bản OpenSpec (`openspec --version`), phiên bản Node của bạn (`node --version`), công cụ AI và lệnh cùng đầu ra chính xác. Điều này giúp việc hỗ trợ nhanh hơn rất nhiều.