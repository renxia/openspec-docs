# Khắc phục sự cố

Các giải pháp khắc phục cụ thể cho các vấn đề cụ thể. Mỗi mục nêu ra triệu chứng, giải thích nguyên nhân có thể trong một câu và đưa ra cách khắc phục cho bạn. Nếu bạn không thấy vấn đề của mình ở đây, tài liệu [FAQ](faq.md) có thể giúp ích, và cộng đồng [Discord](https://discord.gg/YctCnvvshC) chắc chắn sẽ hỗ trợ.

## Cài đặt và thiết lập

### `openspec: command not found`

CLI chưa được cài đặt, hoặc shell của bạn không tìm thấy nó. Hãy cài đặt toàn cục và kiểm tra:

```bash
npm install -g @fission-ai/openspec@latest
openspec --version
```

Nếu đã cài đặt nhưng vẫn không tìm thấy, có thể thư mục bin npm toàn cục của bạn không nằm trong `PATH` của hệ thống. Chạy lệnh `npm bin -g` để xem vị trí lưu trữ các tệp nhị phân toàn cục, và đảm bảo đường dẫn đó đã được thêm vào tệp cấu hình shell của bạn.

### "Requires Node.js 20.19.0 or higher"

OpenSpec chạy trên Node phiên bản 20.19.0 trở lên. Kiểm tra phiên bản của bạn và nâng cấp nếu cần:

```bash
node --version
```

Nếu bạn dùng bun để cài đặt OpenSpec, lưu ý rằng OpenSpec vẫn *chạy* trên Node, vì vậy bạn vẫn cần có Node 20.19.0 trở lên có sẵn trong `PATH` bất kể công cụ cài đặt. Xem thêm tài liệu [Installation](installation.md).

### `openspec init` didn't configure my AI tool

Lệnh init sẽ hỏi bạn muốn thiết lập những công cụ nào. Nếu bạn bỏ qua công cụ của mình hoặc muốn thêm công cụ khác, chỉ cần chạy lệnh này lại, hoặc dùng phiên bản không tương tác:

```bash
openspec init --tools claude,cursor
```

Danh sách đầy đủ ID công cụ được liệt kê trong tài liệu [Supported Tools](supported-tools.md). Dùng `--tools all` để thiết lập tất cả công cụ, `--tools none` để bỏ qua toàn bộ thiết lập công cụ.

## Các lệnh không hiển thị

Nếu lệnh `/opsx:propose` (hoặc lệnh tương ứng của công cụ bạn dùng) không xuất hiện hoặc không hoạt động, hãy kiểm tra theo danh sách dưới đây. Các mục được sắp xếp theo thứ tự kiểm tra nhanh nhất trước.

1. **Bạn có thể đang ở sai nơi.** Các lệnh slash được dùng trong cửa sổ trò chuyện của trợ lý AI, không phải trong terminal. Nếu bạn gõ `/opsx:propose` vào shell, đó chính là nguyên nhân của vấn đề. Xem thêm tài liệu [How Commands Work](how-commands-work.md).

2. **Tạo lại các tệp.** Từ thư mục gốc của dự án của bạn:

   ```bash
   openspec update
   ```

   Lệnh này sẽ ghi đè các tệp kỹ năng và lệnh cho tất cả các công cụ bạn đã cấu hình.

3. **Khởi động lại trợ lý của bạn.** Hầu hết các công cụ sẽ quét tìm kỹ năng và lệnh khi khởi động. Mở một cửa sổ mới thường sẽ giải quyết được vấn đề.

4. **Xác nhận các tệp tồn tại.** Đối với Claude Code, hãy kiểm tra thư mục `.claude/skills/` có chứa các thư mục `openspec-*` hay không. Các công cụ khác sử dụng thư mục riêng, tất cả đều được liệt kê trong tài liệu [Supported Tools](supported-tools.md).

5. **Kiểm tra xem bạn đã khởi tạo dự án này chưa.** Các kỹ năng được ghi theo từng dự án. Nếu bạn vừa nhân bản một kho lưu trữ hoặc vừa chuyển sang thư mục khác, hãy chạy lệnh `openspec init` (hoặc `openspec update`) ở thư mục dự án đó.

6. **Xác nhận công cụ của bạn hỗ trợ tệp lệnh.** Codex và một số công cụ khác (CodeArts, Kimi CLI, ForgeCode, Mistral Vibe) không được tạo tệp lệnh `opsx-*`; thay vào đó chúng sử dụng cách gọi dựa trên kỹ năng. Đối với Codex, hãy kiểm tra thư mục `.codex/skills/openspec-*`. Cú pháp lệnh khác nhau tùy theo công cụ: xem thêm tài liệu [Supported Tools](supported-tools.md) và [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

## Làm việc với các thay đổi

### "Change not found"

Lệnh không thể xác định bạn đang đề cập đến thay đổi nào. Hãy đặt tên rõ ràng cho thay đổi, hoặc kiểm tra các thay đổi hiện có:

```bash
openspec list                    # see active changes
/opsx:apply add-dark-mode        # name the change in chat
```

Đồng thời hãy xác nhận bạn đang ở trong thư mục dự án chính xác.

### "No artifacts ready"

Mỗi artifact đều đã được tạo hoặc bị chặn do chờ phụ thuộc. Hãy kiểm tra thứ gì đang chặn:

```bash
openspec status --change <name>
```

Sau đó hãy tạo phụ thuộc còn thiếu trước. Ghi nhớ thứ tự: proposal cho phép tạo specs và design; specs và design cùng nhau cho phép tạo tasks.

### `openspec validate` reports warnings or errors

Lệnh validate kiểm tra các specs và thay đổi của bạn xem có vấn đề về cấu trúc hay không. Đọc thông báo lỗi: nó sẽ nêu rõ tệp và vấn đề cụ thể.

```bash
openspec validate <name>           # validate one item
openspec validate --all            # validate everything
openspec validate --all --strict   # stricter checks, good for CI
```

Nguyên nhân phổ biến là thiếu phần bắt buộc (ví dụ specs không có scenarios) hoặc tiêu đề delta bị định dạng sai. Sửa tệp và chạy lại lệnh. Tài liệu [CLI reference](cli.md#openspec-validate) ghi rõ định dạng đầu ra.

### The AI created incomplete or wrong artifacts

AI không có đủ ngữ cảnh. Một số tùy chọn sau có thể giúp:

- Thêm ngữ cảnh dự án trong `openspec/config.yaml` để ngăn xếp và quy ước của dự án được đưa vào mọi yêu cầu. Xem thêm tài liệu [Customization](customization.md#project-configuration).
- Thêm thuộc tính `rules:` cho từng artifact để đưa ra hướng dẫn chỉ áp dụng cho, ví dụ, specs.
- Đưa ra mô tả chi tiết hơn khi bạn tạo proposal.
- Dùng lệnh mở rộng `/opsx:continue` để tạo từng artifact một và xem xét từng cái, thay vì dùng `/opsx:ff` để tạo tất cả cùng lúc.

### Archive won't finish, or warns about incomplete tasks

Lệnh archive sẽ không *chặn* các tasks chưa hoàn thành, nhưng sẽ cảnh báo bạn, vì lưu trữ thường có nghĩa là công việc đã hoàn thành. Nếu các tasks còn lại là cố ý (bạn đang nộp một thay đổi một phần), hãy tiếp tục. Nếu không, hãy hoàn thành các tasks trước. Lệnh lưu trữ cũng sẽ đề nghị đồng bộ hóa các delta specs của bạn vào specs chính nếu bạn chưa đồng bộ; hãy đồng ý trừ khi bạn có lý do không nên làm vậy.

## Cấu hình

### My `config.yaml` isn't being applied

Ba nguyên nhân phổ biến:

1. **Tên tệp sai.** Tên tệp phải là `openspec/config.yaml`, không phải `.yml`.
2. **Tệp YAML không hợp lệ.** Chạy tệp qua bất kỳ công cụ kiểm tra tính hợp lệ YAML nào; CLI cũng sẽ báo cáo lỗi cú pháp kèm số dòng.
3. **Bạn nghĩ cần khởi động lại.** Bạn không cần làm vậy. Các thay đổi cấu hình sẽ có hiệu lực ngay lập tức.

### "Unknown artifact ID in rules: X"

Khóa trong phần `rules:` không khớp với bất kỳ artifact nào trong schema của bạn. Đối với schema mặc định `spec-driven`, các ID hợp lệ là `proposal`, `specs`, `design`, `tasks`. Để xem các ID của bất kỳ schema nào:

```bash
openspec schemas --json
```

### "Context too large"

Trường `context:` được giới hạn ở 50KB có chủ ý, vì nó được đưa vào mọi yêu cầu. Hãy tóm tắt nội dung, hoặc liên kết đến các tài liệu dài hơn thay vì dán toàn bộ nội dung vào. Ngữ cảnh ngắn gọn cũng giúp tạo ra kết quả tốt hơn, nhanh hơn.

### "Schema not found"

Tên schema bạn tham chiếu không tồn tại. Liệt kê các schema có sẵn và kiểm tra chính tả:

```bash
openspec schemas                    # list available schemas
openspec schema which <name>        # see where a schema resolves from
openspec schema init <name>         # create a custom one
```

Xem thêm tài liệu [Customization](customization.md#custom-schemas).

## Di chuyển từ quy trình làm việc cũ

### "Legacy files detected in non-interactive mode"

Bạn đang ở trong môi trường CI hoặc shell không tương tác, và OpenSpec tìm thấy các tệp cũ cần dọn dẹp nhưng không thể hỏi bạn. Hãy phê duyệt tự động:

```bash
openspec init --force
```

Đối với Codex, OpenSpec có thể phát hiện các tệp nhắc cũ được quản lý trong `$CODEX_HOME/prompts` hoặc `~/.codex/prompts`. Việc dọn dẹp này chỉ giới hạn ở các tệp nhắc Codex cũ nằm trong danh sách cho phép của OpenSpec, và lệnh `openspec init` không tương tác chỉ xóa các tệp có tệp kỹ năng thay thế `.codex/skills/openspec-*` tương ứng. Lệnh `openspec update` không tương tác sẽ giữ nguyên tất cả việc dọn dẹp tệp cũ trừ khi bạn thêm tham số `--force`.

### Commands didn't appear after migrating

Khởi động lại IDE của bạn. Các kỹ năng được phát hiện khi khởi động. Nếu chúng vẫn không xuất hiện, hãy chạy lệnh `openspec update` và kiểm tra vị trí các tệp trong tài liệu [Supported Tools](supported-tools.md).

### My old `project.md` wasn't migrated

Đó là hành vi cố ý. OpenSpec không bao giờ xóa tệp `project.md` tự động vì tệp này có thể chứa ngữ cảnh bạn đã viết. Hãy di chuyển các phần hữu ích vào phần `context:` của tệp `config.yaml`, sau đó tự xóa tệp này. [Hướng dẫn di chuyển](migration-guide.md#migrating-projectmd-to-configyaml) sẽ hướng dẫn bạn thực hiện việc này, kèm theo một lời nhắc bạn có thể đưa cho AI để thực hiện việc tóm tắt nội dung.

## Vẫn gặp khó khăn?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Từ terminal của bạn:** Chạy lệnh `openspec feedback "what went wrong"` sẽ tự động mở một vấn đề trên GitHub cho bạn.

Khi bạn báo cáo vấn đề, hãy cung cấp phiên bản OpenSpec của bạn (`openspec --version`), phiên bản Node (`node --version`), công cụ AI bạn dùng, cùng lệnh và đầu ra chính xác. Điều này giúp quá trình hỗ trợ diễn ra nhanh hơn rất nhiều.