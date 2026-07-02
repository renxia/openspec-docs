# FAQ

Các câu trả lời nhanh cho những câu hỏi mà mọi người thường đặt ra. Nếu câu hỏi của bạn thực sự là một vấn đề "có thứ gì đó bị lỗi", vui lòng tham khảo trang [Troubleshooting](troubleshooting.md). Nếu bạn muốn định nghĩa một thuật ngữ, hãy xem [Glossary](glossary.md).

## Cơ bản

### OpenSpec là gì, trong một câu?

Một lớp nhẹ giúp bạn và trợ lý lập trình AI thống nhất về những gì cần xây dựng bằng văn bản trước khi bất kỳ mã nào được viết ra.

### Tại sao tôi nên sử dụng nó?

Bởi vì các trợ lý AI tự tin ngay cả khi họ sai. Khi yêu cầu chỉ tồn tại trong một luồng trò chuyện, AI sẽ điền vào những khoảng trống bằng phỏng đoán, và bạn mới biết điều đó sau khi mã đã tồn tại. OpenSpec đưa sự thống nhất lên sớm hơn, nơi mà những sai sót vẫn dễ dàng được sửa chữa. Xem [Tổng quan về các Khái niệm Cốt lõi](overview.md) để hiểu rõ hơn về trường hợp này.

### Tôi có bắt buộc phải sử dụng nó cho mọi thứ không?

Không. Hãy sử dụng nó ở những nơi mà sự thống nhất là điều quan trọng, tức là hầu hết các công việc không tầm thường. Đối với một lỗi đánh máy chỉ gồm một ký tự, nghi thức đó có lẽ không đáng giá, và điều đó cũng ổn thôi.

### Tôi có thể sử dụng nó trên một codebase lớn hiện có, hay chỉ trên các dự án mới?

Các codebase hiện có là trọng tâm chính. OpenSpec ưu tiên cho môi trường brownfield: bạn không cần phải tài liệu hóa toàn bộ ứng dụng ngay từ đầu. Bạn chỉ viết spec cho những gì mỗi thay đổi chạm tới, và các spec của bạn sẽ được bổ sung theo thời gian xung quanh công việc thực tế mà bạn làm. Có một hướng dẫn chuyên biệt: [Sử dụng OpenSpec trong Dự án Hiện có](existing-projects.md).

### Nó có gắn liền với một công cụ AI nào không?

Không. OpenSpec hoạt động với hơn 25 trợ lý, bao gồm Claude Code, Cursor, Windsurf, GitHub Copilot, Gemini CLI, Codex, và nhiều hơn nữa. Danh sách đầy đủ cùng chi tiết theo từng công cụ nằm trong [Supported Tools](supported-tools.md).

## Chạy lệnh

### Tôi gõ `/opsx:propose` ở đâu?

Trong cửa sổ chat của trợ lý AI, chứ không phải trong terminal. Đây là điểm gây nhầm lẫn phổ biến nhất, vì vậy nó có một trang riêng: [Cách các Lệnh hoạt động](how-commands-work.md). Tóm tắt ngắn gọn: `openspec ...` chạy trong terminal, `/opsx:...` chạy trong chat.

### Làm thế nào để tôi "bắt đầu chế độ tương tác"?

Không có chế độ riêng biệt nào cần khởi động. Bạn mở trợ lý AI của mình như bình thường và gõ một lệnh slash vào cửa sổ chat của nó. Lệnh slash là cách bạn "vào" OpenSpec. (Tính năng terminal thực sự tương tác duy nhất là `openspec view`, một bảng điều khiển để duyệt các spec và thay đổi.) Giải thích đầy đủ trong [Cách các Lệnh hoạt động](how-commands-work.md).

### Tôi đã gõ một lệnh slash nhưng không có gì xảy ra. Tại sao?

Khả năng cao là bạn đã gõ nó trong terminal thay vì trong cửa sổ chat AI, hoặc các lệnh chưa được cài đặt. Chạy `openspec update` trong dự án của bạn, khởi động lại trợ lý, sau đó thử gõ `/opsx` trong chat và chú ý đến tính năng tự động hoàn thành (autocomplete). [Troubleshooting](troubleshooting.md#commands-dont-show-up) có bảng kiểm tra đầy đủ.

### Tại sao cú pháp là `/opsx:propose` trong một công cụ và `/opsx-propose` trong một công cụ khác?

Mỗi công cụ AI hiển thị các lệnh tùy chỉnh hơi khác nhau. Ý định là giống hệt, chỉ có dấu câu thay đổi. Hãy gõ một dấu slash vào cửa sổ chat của bạn và tính năng tự động hoàn thành sẽ cho bạn biết định dạng mà công cụ của bạn mong đợi. Bảng chi tiết theo từng công cụ nằm trong [How Commands Work](how-commands-work.md#slash-command-syntax-by-tool).

### Sự khác biệt giữa một skill (kỹ năng) và một command (lệnh) là gì?

Cả hai đều là các tệp tin mà OpenSpec viết để trợ lý của bạn có thể chạy quy trình làm việc. Skills (`.../skills/openspec-*/SKILL.md`) là tiêu chuẩn mới hơn áp dụng cho tất cả các công cụ; commands (`.../commands/opsx-*`) là các tệp tin slash cũ hơn theo từng công cụ. Bạn không cần phải chọn. Bạn chỉ cần gõ lệnh slash, và OpenSpec sẽ cài đặt loại mà công cụ của bạn sử dụng.

## Quy trình làm việc (Workflow)

### Tôi nên bắt đầu từ đâu nếu tôi không chắc chắn về những gì cần xây dựng?

Bắt đầu với `/opsx:explore`. Nó là một đối tác tư duy không rủi ro, đọc codebase của bạn, đưa ra các lựa chọn và biến một vấn đề mơ hồ thành một kế hoạch cụ thể, tất cả trước khi bất kỳ thay đổi hay mã nào tồn tại. Nó nằm trong profile mặc định, vì vậy nó luôn có sẵn. Khi kế hoạch đã rõ ràng, nó sẽ chuyển giao cho `/opsx:propose`. Đây là thói quen tốt nhất cần hình thành, bởi vì nó ngăn một AI háo hức tự tin xây dựng sai thứ. Xem [Explore First](explore.md).

### Quy trình làm việc đơn giản nhất có thể là gì?

```text
/opsx:explore (tùy chọn)   sau đó   /opsx:propose <những gì bạn muốn>   sau đó   /opsx:apply   sau đó   /opsx:archive
```

Sử dụng Explore để suy nghĩ, Propose để soạn thảo kế hoạch, Apply để xây dựng, Archive để lưu trữ. Bỏ qua Explore nếu bạn đã biết chính xác những gì mình muốn.

### Sự khác biệt giữa `/opsx:propose` và `/opsx:new` là gì?

`/opsx:propose` là lệnh một bước mặc định: nó tạo ra thay đổi và soạn thảo tất cả các artifact lập kế hoạch cùng một lúc. `/opsx:new` là một phần của tập hợp lệnh mở rộng và chỉ tạo khung (scaffold) một thay đổi trống, để bạn tự tạo các artifact từng cái một bằng `/opsx:continue` (hoặc tất cả cùng một lúc với `/opsx:ff`). Hãy sử dụng propose trừ khi bạn muốn kiểm soát từng bước. Xem [Commands](commands.md).

### Các profile `core` và mở rộng là gì?

Một profile quyết định những lệnh slash nào sẽ được cài đặt. **Core** (mặc định) cung cấp cho bạn `propose`, `explore`, `apply`, `sync`, `archive`. Bộ **expanded** bổ sung thêm `new`, `continue`, `ff`, `verify`, `bulk-archive`, và `onboard` để kiểm soát chi tiết hơn. Chuyển đổi bằng `openspec config profile`, sau đó áp dụng bằng `openspec update`.

### Tôi có cần chạy `/opsx:sync` không?

Thông thường là không. Sync hợp nhất các delta spec của một thay đổi vào các spec chính của bạn, và `/opsx:archive` sẽ đề nghị làm điều đó cho bạn. Chỉ chạy sync thủ công khi bạn muốn các spec được hợp nhất trước khi lưu trữ, ví dụ như đối với một thay đổi kéo dài. Xem [Commands](commands.md#opsxsync).

### Tôi chỉnh sửa proposal, spec hay task như thế nào sau khi đã bắt đầu?

Chỉ cần chỉnh sửa tệp tin. Mọi artifact đều là Markdown thuần túy trong `openspec/changes/<name>/`, và không có giai đoạn khóa hay chế độ chỉnh sửa đặc biệt nào. Hãy thay đổi nó bằng tay, hoặc yêu cầu AI của bạn sửa lại ("cập nhật thiết kế để sử dụng hàng đợi"), sau đó tiếp tục. AI luôn làm việc dựa trên nội dung tệp hiện tại. Hướng dẫn đầy đủ: [Editing & Iterating on a Change](editing-changes.md).

### Tôi có thể quay lại và thay đổi kế hoạch sau khi đã triển khai một phần không?

Có, bất cứ lúc nào. Quy trình làm việc là linh hoạt, vì vậy việc xem xét và chỉnh sửa không phải là những giai đoạn bạn bị khóa lại. Hãy chỉnh sửa artifact, rồi tiếp tục. Nếu bạn muốn một bước kiểm tra có cấu trúc để đảm bảo mã vẫn khớp với kế hoạch, hãy chạy `/opsx:verify`. Xem [Editing & Iterating on a Change](editing-changes.md#how-do-i-go-back-to-review-after-implementing).

### Tôi đã chỉnh sửa mã bằng tay. Làm thế nào để tôi hòa giải nó với spec?

Hãy đưa chúng trở lại đồng bộ trước khi bạn lưu trữ, vì việc lưu trữ khiến các spec của bạn trở thành hồ sơ sự thật (record of truth). Nếu mã hiện đã đúng, hãy cập nhật delta spec để khớp với những gì bạn đã gửi; nếu spec là đúng, hãy tiếp tục xây dựng cho đến khi mã đồng ý. `/opsx:verify` sẽ hiển thị những điểm không khớp. Xem [Editing & Iterating on a Change](editing-changes.md#i-edited-the-code-by-hand-how-do-i-reconcile-that-with-openspec).

### Khi nào tôi nên cập nhật một thay đổi hiện có so với bắt đầu một cái mới?

Cập nhật khi đó là cùng một công việc, được tinh chỉnh. Bắt đầu mới khi ý định đã thay đổi căn bản hoặc phạm vi đã bùng nổ thành các công việc khác nhau. Có một biểu đồ quy trình quyết định và ví dụ trong [Workflows](workflows.md#when-to-update-vs-start-fresh).

### Điều gì sẽ xảy ra nếu phiên làm việc của tôi hết ngữ cảnh, hoặc yêu cầu thay đổi giữa quá trình triển khai?

Đây là lúc các spec phát huy tác dụng. Bởi vì kế hoạch tồn tại trong các tệp (không chỉ trong lịch sử trò chuyện), bạn có thể xóa ngữ cảnh, bắt đầu một phiên AI mới và tiếp tục với `/opsx:apply`; nó sẽ đọc các artifact và tiếp tục từ task chưa được kiểm tra đầu tiên. Nếu yêu cầu thay đổi, hãy chỉnh sửa các artifact để phù hợp với thực tế mới và tiếp tục. Việc giữ một cửa sổ ngữ cảnh sạch cũng tạo ra kết quả tốt hơn; hãy xóa nó trước khi triển khai.

### Tôi có nên commit thư mục `openspec/` vào git không?

Có. Các spec, thay đổi đang hoạt động và archive của bạn là một phần lịch sử dự án. Hãy commit chúng như bất kỳ nguồn nào khác. Đặc biệt, archive trở thành một hồ sơ bền vững về lý do tại sao hệ thống của bạn hoạt động theo cách nó đang làm.

## Specs và Changes (Spec và Thay đổi)

### Cái gì thuộc về spec so với thiết kế (design)?

Một spec mô tả hành vi có thể quan sát được: hệ thống làm gì, đầu vào, đầu ra và các điều kiện lỗi. Một design mô tả cách bạn sẽ xây dựng nó: phương pháp kỹ thuật, quyết định kiến trúc, thay đổi tệp tin. Nếu việc triển khai có thể thay đổi mà không thay đổi hành vi hiển thị bên ngoài, thì nó thuộc về thiết kế chứ không phải spec. [Concepts](concepts.md#what-a-spec-is-and-is-not) đi sâu hơn.

### Delta spec là gì?

Một spec chỉ mô tả những gì đang thay đổi, sử dụng các phần `ADDED`, `MODIFIED` và `REMOVED`, thay vì trình bày lại toàn bộ spec. Đây là cách OpenSpec xử lý việc chỉnh sửa các hệ thống hiện có một cách sạch sẽ. Xem [Concepts](concepts.md#delta-specs).

### Các thay đổi đã được lưu trữ (archived) ở đâu?

Tại `openspec/changes/archive/YYYY-MM-DD-<name>/`, với tất cả các artifact được bảo toàn. Không có gì bị xóa; sự thay đổi chỉ di chuyển ra khỏi danh sách hoạt động của bạn.

## Cấu hình và Tùy chỉnh (Configuration and Customization)

### Tôi nói cho AI biết về tech stack của mình như thế nào?

Đặt nó vào `openspec/config.yaml` dưới mục `context:`. Văn bản đó sẽ được tiêm vào mọi yêu cầu lập kế hoạch, để AI luôn biết về stack và quy ước của bạn. Xem [Customization](customization.md#project-configuration).

### Tôi có thể tạo spec bằng ngôn ngữ nào khác ngoài tiếng Anh không?

Có. Thêm một hướng dẫn ngôn ngữ vào `context:` trong config của bạn. [Multi-Language](multi-language.md) có các đoạn mẫu để sao chép cho nhiều ngôn ngữ.

### Tôi có thể thay đổi chính quy trình làm việc (workflow) không?

Có, bằng cách sử dụng custom schema. Một schema định nghĩa những artifact nào tồn tại và chúng phụ thuộc lẫn nhau như thế nào. Fork từ mặc định bằng `openspec schema fork spec-driven my-workflow`, sau đó chỉnh sửa nó. Xem [Customization](customization.md#custom-schemas).

## Models, Quyền riêng tư và Nâng cấp (Models, Privacy, and Upgrades)

### Tôi nên sử dụng mô hình AI nào?

OpenSpec hoạt động tốt nhất với các mô hình có khả năng lý luận cao. README khuyến nghị các mô hình như Codex 5.5 và Opus 4.7 cho cả lập kế hoạch và triển khai. Hãy giữ cửa sổ ngữ cảnh của bạn sạch sẽ: xóa nó trước khi triển khai để đạt kết quả tốt nhất.

### OpenSpec có thu thập dữ liệu không?

Nó thu thập số liệu thống kê sử dụng ẩn danh: tên lệnh và phiên bản thôi. Không có đối số, đường dẫn, nội dung hoặc dữ liệu cá nhân, và nó tự động tắt trong CI. Hãy từ chối bằng `export OPENSPEC_TELEMETRY=0` hoặc `export DO_NOT_TRACK=1`.

### Tôi nâng cấp như thế nào?

Hai bước. Nâng cấp package (`npm install -g @fission-ai/openspec@latest`), sau đó chạy `openspec update` bên trong mỗi dự án để làm mới các skills và commands đã được tạo.

### Tôi gỡ cài đặt OpenSpec như thế nào?

Không có lệnh gỡ cài đặt, vì nó chỉ là một package toàn cục cộng với các tệp tin trong dự án của bạn. Hãy xóa package (`npm uninstall -g @fission-ai/openspec`), và tùy chọn xóa thư mục `openspec/` và các tệp công cụ đã được tạo. Hướng dẫn từng bước, bao gồm những gì an toàn để giữ lại, nằm trong [Installation: Uninstalling](installation.md#uninstalling).

## Nhận trợ giúp (Getting Help)

### Tôi nên hỏi câu hỏi hoặc báo cáo lỗi ở đâu?

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC)
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues)
- **Từ terminal của bạn:** `openspec feedback "tin nhắn của bạn"` sẽ mở một GitHub issue cho bạn.

### Tài liệu này sai hoặc khó hiểu. Tôi nên làm gì?

Hãy nói với chúng tôi, hoặc sửa nó. Các PR tài liệu được hoan nghênh và đánh giá cao. Hãy mở một issue hoặc gửi một pull request.