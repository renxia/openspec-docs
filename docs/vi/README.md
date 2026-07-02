# Tài liệu OpenSpec

Chào mừng bạn. Đây là nơi tập hợp mọi thứ về OpenSpec.

OpenSpec giúp bạn và trợ lý lập trình AI **thống nhất về những gì cần xây dựng trước khi bất kỳ dòng mã nào được viết ra.** Bạn mô tả sự thay đổi, AI soạn một bản đặc tả ngắn gọn và danh sách nhiệm vụ; cả hai cùng xem xét kế hoạch đó, và sau đó công việc mới diễn ra. Không còn tình trạng phát hiện ra giữa chừng rằng AI đã xây dựng sai thứ gì đó.

Nếu bạn chỉ đọc một điều, hãy đọc hai trang này:

1. [Getting Started](getting-started.md): cài đặt, khởi tạo và triển khai thay đổi đầu tiên của bạn.
2. [How Commands Work](how-commands-work.md): nơi bạn thực sự gõ `/opsx:propose` (gợi ý: trong cuộc trò chuyện AI của bạn, chứ không phải trong terminal). Điều này khiến hầu hết mọi người gặp khó khăn một lần.

Điều thứ hai quan trọng hơn vẻ bề ngoài của nó. OpenSpec có hai nửa: một công cụ dòng lệnh mà bạn chạy trong terminal, và các lệnh slash (slash commands) mà bạn đưa cho trợ lý AI của mình. Biết cái nào là gì sẽ giúp bạn tránh được sự nhầm lẫn phổ biến nhất.

> **Thói quen tốt nhất cần xây dựng đầu tiên: khi bạn không chắc chắn về những gì cần xây dựng, hãy bắt đầu bằng `/opsx:explore`.** Đây là một đối tác tư duy không áp lực, nó đọc mã của bạn, cân nhắc các lựa chọn và tinh chỉnh một ý tưởng mơ hồ thành một kế hoạch cụ thể trước khi bất kỳ tạo phẩm (artifact) hay mã nào tồn tại. Hướng dẫn [Explore First](explore.md) đã chứng minh điều này.

## Chọn con đường của bạn

**Tôi hoàn toàn mới.** Bắt đầu với [Getting Started](getting-started.md), sau đó xem lướt qua [Core Concepts at a Glance](overview.md). Khi có điều gì đó cảm thấy bí ẩn, [FAQ](faq.md) và [Glossary](glossary.md) sẽ ở gần đó.

**Tôi có một vấn đề nhưng chưa có kế hoạch.** Đây là trường hợp phổ biến, và nó có một câu trả lời chuyên biệt: [Explore First](explore.md). Hãy sử dụng `/opsx:explore` để cùng AI suy nghĩ về vấn đề trước khi cam kết bất cứ điều gì.

**Tôi có một codebase lớn đã tồn tại.** Bạn không cần tài liệu hóa tất cả. [Using OpenSpec in an Existing Project](existing-projects.md) cho thấy cách bắt đầu trên mã thực tế, "brownfield" mà không cần phải giải quyết mọi thứ cùng lúc.

**Tôi chỉ muốn làm cho nó hoạt động.** [Install](installation.md), chạy `openspec init`, sau đó đọc [How Commands Work](how-commands-work.md) để lệnh slash đầu tiên của bạn đến đúng nơi.

**Tôi học bằng ví dụ.** Trang [Examples & Recipes](examples.md) sẽ hướng dẫn qua các thay đổi thực tế từ đầu đến cuối: một tính năng nhỏ, một bản sửa lỗi, một lần refactor, hoặc một buổi khám phá.

**Tôi đang chuyển từ quy trình cũ.** [Migration Guide](migration-guide.md) giải thích những gì đã thay đổi và tại sao, đồng thời đảm bảo công việc hiện có của bạn vẫn an toàn.

**Tôi muốn điều chỉnh nó theo quy trình của đội nhóm mình.** [Customization](customization.md) đề cập đến cấu hình dự án, lược đồ tùy chỉnh (custom schemas), và ngữ cảnh dùng chung.

**Có thứ gì đó bị hỏng.** [Troubleshooting](troubleshooting.md) thu thập những lỗi mà mọi người thực sự gặp phải, kèm theo các bản sửa lỗi.

## Toàn bộ bản đồ

### Bắt đầu tại đây

| Tài liệu | Nó cung cấp cho bạn điều gì |
|-----|-------------------|
| [Getting Started](getting-started.md) | Cài đặt, khởi tạo và chạy thay đổi đầu tiên của bạn từ đầu đến cuối |
| [Explore First](explore.md) | Sử dụng `/opsx:explore` để suy nghĩ về một ý tưởng trước khi cam kết |
| [How Commands Work](how-commands-work.md) | Nơi các lệnh slash hoạt động, ý nghĩa của "chế độ tương tác", terminal so với chat |
| [Core Concepts at a Glance](overview.md) | Toàn bộ mô hình tư duy trên một trang: đặc tả (specs), thay đổi (changes), delta, lưu trữ (archive) |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix và cách xác minh nó đã hoạt động |

### Sử dụng hàng ngày

| Tài liệu | Nó cung cấp cho bạn điều gì |
|-----|-------------------|
| [Workflows](workflows.md) | Các mẫu phổ biến và khi nào nên sử dụng từng lệnh |
| [Examples & Recipes](examples.md) | Hướng dẫn đầy đủ về các thay đổi thực tế, có thể sao chép |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Áp dụng OpenSpec trên một codebase lớn "brownfield" |
| [Editing & Iterating on a Change](editing-changes.md) | Cập nhật các tạo phẩm (artifacts), quay lại, hòa giải các chỉnh sửa thủ công |
| [Commands](commands.md) | Tài liệu tham khảo cho mọi lệnh slash `/opsx:*` |
| [CLI](cli.md) | Tài liệu tham khảo cho mọi lệnh terminal `openspec` |

### Hiểu sâu sắc

| Tài liệu | Nó cung cấp cho bạn điều gì |
|-----|-------------------|
| [Concepts](concepts.md) | Giải thích chi tiết về đặc tả, thay đổi, tạo phẩm, lược đồ (schemas), và lưu trữ |
| [OPSX Workflow](opsx.md) | Tại sao quy trình này lại linh hoạt thay vì bị khóa theo giai đoạn, cùng với một bài phân tích kiến trúc chuyên sâu |
| [Glossary](glossary.md) | Định nghĩa mọi thuật ngữ tại một nơi |

### Cá nhân hóa cho bạn

| Tài liệu | Nó cung cấp cho bạn điều gì |
|-----|-------------------|
| [Customization](customization.md) | Cấu hình dự án, lược đồ tùy chỉnh, ngữ cảnh dùng chung |
| [Multi-Language](multi-language.md) | Tạo các tạo phẩm bằng ngôn ngữ khác ngoài tiếng Anh |
| [Supported Tools](supported-tools.md) | Hơn 25 công cụ AI mà OpenSpec tích hợp, và nơi các tệp tin được lưu trữ |

### Khi bạn cần trợ giúp

| Tài liệu | Nó cung cấp cho bạn điều gì |
|-----|-------------------|
| [FAQ](faq.md) | Các câu trả lời nhanh cho những câu hỏi mọi người thường đặt ra |
| [Troubleshooting](troubleshooting.md) | Các bản sửa lỗi cụ thể cho các thất bại cụ thể |
| [Migration Guide](migration-guide.md) | Chuyển từ quy trình cũ sang OPSX |

### Phối hợp giữa các repo (beta)

| Tài liệu | Nó cung cấp cho bạn điều gì |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Lập kế hoạch trong repo riêng khi công việc của bạn trải rộng qua nhiều repo hoặc đội nhóm |
| [Agent Contract](agent-contract.md) | Các giao diện CLI mà tác nhân (agents) đọc được |

## Phiên bản ba mươi giây

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

Bước 1 và 2 diễn ra trong terminal của bạn. Những bước còn lại diễn ra trong cuộc trò chuyện với trợ lý AI của bạn. Sự phân chia này là điều đáng để ghi nhớ, và [How Commands Work](how-commands-work.md) giải thích chính xác tại sao. Bước 3 là tùy chọn, nhưng bắt đầu bằng `/opsx:explore` khi bạn không chắc chắn là thói quen đáng để hình thành nhất.

## Nơi khác để nhận trợ giúp

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) cho các câu hỏi, ý tưởng và sự hỗ trợ.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) cho lỗi và yêu cầu tính năng.
- **`openspec feedback "your message"`** gửi phản hồi trực tiếp từ terminal của bạn (nó sẽ mở một GitHub issue).

Bạn tìm thấy điều gì đó trong các tài liệu này là sai, đã cũ hoặc gây nhầm lẫn? Đó là một lỗi. Hãy mở một issue hoặc một PR. Cải thiện tài liệu là một trong những đóng góp giá trị nhất mà bạn có thể thực hiện.