# Cách các Lệnh hoạt động

**Điều cần biết: OpenSpec có hai loại lệnh, và chúng chạy ở hai nơi khác nhau.**

- Các lệnh `openspec ...` chạy trong **terminal**. (Ví dụ: `openspec init`.)
- Các lệnh `/opsx:...` chạy trong **trò chuyện của trợ lý AI**. (Ví dụ: `/opsx:propose`.)

Nếu bạn gõ `/opsx:propose` vào terminal mà không có gì xảy ra, thì trang này là câu trả lời. Bạn đang nói chuyện với nửa sai của OpenSpec. Các lệnh gạch chéo không phải là lệnh terminal. Chúng là các hướng dẫn bạn đưa cho trợ lý lập trình AI, trong cùng một hộp trò chuyện nơi bạn thường gõ "thêm một form đăng nhập".

Sự khác biệt duy nhất này là trở ngại phổ biến nhất đối với người dùng mới, vì vậy hãy làm rõ nó hoàn toàn.

## Hai nửa (The two halves)

OpenSpec là một dự án mang hai vai trò.

**CLI (nửa terminal).** Một chương trình tên là `openspec` mà bạn cài đặt và chạy từ shell của mình. Nó thiết lập dự án của bạn, liệt kê và xác thực các thay đổi, hiển thị bảng điều khiển, và lưu trữ công việc đã hoàn thành. Bạn gõ những lệnh này vào iTerm, terminal của VS Code, PowerShell, bất cứ nơi nào bạn chạy `git` hoặc `npm`.

```bash
openspec init        # thiết lập OpenSpec trong dự án này
openspec list        # xem các thay đổi đang hoạt động
openspec view        # mở bảng điều khiển tương tác
```

**Các lệnh gạch chéo (nửa trò chuyện).** Các lệnh ngắn như `/opsx:propose` và `/opsx:apply` mà bạn gõ vào trợ lý AI của mình. Chúng yêu cầu AI làm theo quy trình làm việc của OpenSpec: soạn thảo một đề xuất, viết các thông số kỹ thuật, xây dựng từ danh sách nhiệm vụ, lưu trữ khi hoàn thành. Bạn gõ những lệnh này vào Claude Code, Cursor, Windsurf, Copilot, hoặc bất kỳ trợ lý nào bạn sử dụng.

```text
/opsx:propose add-dark-mode    (gõ trong trò chuyện AI của bạn)
/opsx:apply                    (gõ trong trò chuyện AI của bạn)
/opsx:archive                  (gõ trong trò chuyện AI của bạn)
```

Đây là mô hình tư duy trong một bức ảnh:

```text
        TERMINAL CỦA BẠN                         TRÒ CHUYỆN CỦA TRỢ LÝ AI
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   cài đặt    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   các lệnh    │  /opsx:archive                │
   └──────────────────────┘    & kỹ năng   └──────────────────────────────┘
        chạy openspec ở đây                       chạy /opsx:* ở đây
```

Hãy chú ý đến mũi tên. Việc chạy `openspec init` trong terminal của bạn là thứ *cài đặt* các lệnh gạch chéo vào công cụ AI của bạn. Nửa terminal thiết lập nửa trò chuyện. Sau đó, việc vận hành hàng ngày phần lớn diễn ra trong trò chuyện.

## "Làm thế nào để bắt đầu chế độ tương tác?"

**Không có chế độ tương tác riêng biệt nào cần khởi động.** Câu hỏi này được hỏi rất nhiều, vì vậy nó xứng đáng nhận được một câu trả lời đơn giản.

Bạn không nhập vào một chế độ OpenSpec đặc biệt. Bạn chỉ cần mở trợ lý lập trình AI của mình như mọi khi bạn làm, và gõ một lệnh gạch chéo vào trò chuyện. Lệnh gạch chéo *chính là* cách bạn "vào" OpenSpec. Trợ lý của bạn nhận ra nó, tải kỹ năng OpenSpec tương ứng và bắt đầu tuân theo quy trình làm việc.

Vì vậy, hướng dẫn thực sự là:

1. Mở trợ lý lập trình AI của bạn (Claude Code, Cursor, Windsurf, v.v.) trong dự án của mình.
2. Gõ `/opsx:propose` vào trò chuyện của nó, cùng nơi bạn gõ bất kỳ yêu cầu nào khác.
3. Quan sát tính năng tự động hoàn thành: nếu OpenSpec đã được cài đặt, bạn sẽ thấy `/opsx:propose`, `/opsx:apply`, và những cái còn lại xuất hiện khi bạn gõ lệnh gạch chéo.

Chỉ vậy thôi. Không cần chuyển đổi chế độ, không cần khởi chạy daemon, không cần cửa sổ riêng biệt.

Một điều *thực sự* tương tác tồn tại trong terminal: `openspec view`. Nó mở một bảng điều khiển để duyệt các thông số kỹ thuật và thay đổi của bạn. Nhưng đó là một trình xem, chứ không phải là thứ mà bạn đề xuất và xây dựng. Việc xây dựng diễn ra thông qua các lệnh gạch chéo trong trò chuyện.

## Tại sao lại có sự phân chia này

Điều này đáng được hiểu, vì nó giải thích tại sao OpenSpec hoạt động với hơn 25 công cụ AI khác nhau.

CLI là **động cơ**. Nó biết các quy tắc: một thư mục thay đổi trông như thế nào, những artifact nào phụ thuộc vào cái nào, cách hợp nhất một delta spec vào nguồn sự thật của bạn. Nó giống nhau ở mọi nơi.

Các lệnh gạch chéo là **vô lăng**, và mỗi công cụ AI đều có một chiếc hơi khác nhau. Claude Code gọi chúng là commands (lệnh). Cursor và Windsurf có định dạng riêng. Một số công cụ gọi chúng là skills (kỹ năng). Khi bạn chạy `openspec init`, OpenSpec tạo ra loại tệp phù hợp cho từng công cụ bạn đã chọn, để cùng một ý định `/opsx:propose` hoạt động bất kể bạn thích trợ lý nào.

Sức mạnh của thiết kế này: bạn học quy trình làm việc một lần và áp dụng nó trên nhiều công cụ. Sự đánh đổi: cú pháp chính xác của một lệnh có thể khác biệt đôi chút giữa các công cụ, đó là phần tiếp theo.

## Cú pháp lệnh gạch chéo theo từng công cụ

Ý định (intent) là giống nhau ở mọi nơi. Dấu câu thì khác nhau. Hãy sử dụng định dạng phù hợp với trợ lý của bạn.

| Tool | Cách bạn gõ nó |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | skill-style, ví dụ: `/skill:openspec-propose` |
| Trae | skill-style, ví dụ: `/openspec-propose` |

Hầu hết các công cụ đều sử dụng định dạng dấu hai chấm (`/opsx:propose`) hoặc dấu gạch ngang (`/opsx-propose`). Một vài công cụ hiển thị OpenSpec như là các kỹ năng có tên thay vì lệnh gạch chéo; đối với những trường hợp đó, bạn gọi kỹ năng bằng tên. Danh sách đầy đủ theo từng công cụ, bao gồm chính xác những tệp nào được ghi ở đâu, nằm trong [Supported Tools](supported-tools.md).

Khi nghi ngờ, hãy gõ một dấu gạch chéo vào trò chuyện AI của bạn và xem tính năng tự động hoàn thành. Công cụ của bạn sẽ hiển thị định dạng mà nó mong đợi.

## Các lệnh đến từ đâu: skills và commands

Khi bạn chạy `openspec init` (hoặc `openspec update`), OpenSpec ghi các tệp nhỏ vào dự án của bạn để công cụ AI có thể tìm thấy quy trình làm việc. Tùy thuộc vào công cụ và cài đặt của bạn, chúng là **skills**, **commands**, hoặc cả hai.

- **Skills** nằm ở những nơi như `.claude/skills/openspec-*/SKILL.md`. Chúng là tiêu chuẩn chung đang nổi lên giữa các công cụ: một thư mục chứa các hướng dẫn mà trợ lý của bạn tự động phát hiện.
- **Commands** nằm ở những nơi như `.claude/commands/opsx/<id>.md`. Chúng là các tệp lệnh gạch chéo theo từng công cụ cũ hơn.

Bạn không cần quan tâm công cụ của mình sử dụng cái nào. Bạn chỉ cần gõ lệnh gạch chéo và nó sẽ hoạt động. Nhưng biết rằng những tệp này tồn tại giúp ích khi có điều gì đó sai: nếu các lệnh của bạn biến mất, điều đó thường có nghĩa là các tệp này bị thiếu hoặc đã lỗi thời, và `openspec update` sẽ tái tạo chúng.

Xem [Supported Tools](supported-tools.md) để biết đường dẫn chính xác theo từng công cụ, và [Migration Guide](migration-guide.md) để biết cách skills thay thế phương pháp chỉ dùng lệnh cũ hơn.

## Xác nhận đã cài đặt

Kiểm tra nhanh, nhanh nhất trước:

1. **Gõ một dấu gạch chéo vào trò chuyện AI của bạn.** Bắt đầu gõ `/opsx` và tìm kiếm các gợi ý tự động hoàn thành. Nếu chúng xuất hiện, bạn đã ổn.
2. **Tìm các tệp.** Đối với Claude Code, hãy kiểm tra xem `.claude/skills/` có chứa các thư mục `openspec-*` không. Các công cụ khác sử dụng các thư mục riêng của chúng ([Supported Tools](supported-tools.md) liệt kê chúng).
3. **Chạy lại thiết lập.** Từ thư mục gốc dự án, chạy `openspec update`. Điều này sẽ tái tạo các tệp skill và command cho bất kỳ công cụ nào bạn đã cấu hình.
4. **Khởi động lại trợ lý của bạn.** Nhiều công cụ quét tìm kiếm skills và commands khi khởi động, vì vậy một cửa sổ mới có thể là bước còn thiếu.

## Tôi có những lệnh nào?

Theo mặc định, OpenSpec cài đặt bộ **cốt lõi** các lệnh gạch chéo:

- `/opsx:explore`: suy nghĩ về một ý tưởng với AI trước khi cam kết thay đổi (bước đầu tiên tuyệt vời khi bạn không chắc chắn)
- `/opsx:propose`: tạo một thay đổi và soạn thảo tất cả các artifact lập kế hoạch của nó trong một bước
- `/opsx:apply`: xây dựng thay đổi bằng cách hoàn thành danh sách nhiệm vụ của nó
- `/opsx:sync`: hợp nhất các cập nhật spec của một thay đổi vào các spec chính của bạn (thường là tự động)
- `/opsx:archive`: kết thúc một thay đổi và lưu trữ nó

Một nhịp điệu mặc định tốt: `explore` khi bạn đang tìm hiểu xem nên làm gì, sau đó là `propose`, `apply`, `archive`. Hướng dẫn [Explore First](explore.md) giải thích tại sao bước mở đầu này lại có giá trị.

Cũng có một bộ **mở rộng** dành cho những người muốn kiểm soát chi tiết hơn (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Bạn bật nó bằng `openspec config profile`, sau đó áp dụng bằng `openspec update`.

Mới bắt đầu? `/opsx:onboard` (trong bộ mở rộng) sẽ hướng dẫn bạn qua một thay đổi hoàn chỉnh trên codebase của riêng bạn, tường thuật từng bước. Đó là sự giới thiệu thân thiện nhất có thể.

Để biết chi tiết về chức năng của mỗi lệnh, hãy xem [Commands](commands.md). Để biết khi nào nên sử dụng cái nào, hãy xem [Workflows](workflows.md).

## Một lần chạy đầu tiên sạch sẽ

Tổng hợp lại, đây là toàn bộ trình tự với từng bước được dán nhãn theo nơi nó xảy ra.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (cài đặt các lệnh gạch chéo vào công cụ AI của bạn)

AI CHAT      /opsx:explore
              (tùy chọn: suy nghĩ về ý tưởng với AI trước)

AI CHAT      /opsx:propose add-dark-mode
              (AI soạn thảo đề xuất, thông số kỹ thuật, thiết kế, nhiệm vụ)

AI CHAT      /opsx:apply
              (AI xây dựng nó, đánh dấu các nhiệm vụ đã hoàn thành)

AI CHAT      /opsx:archive
              (thay đổi được hợp nhất vào spec và lưu trữ)
```

Hai bước terminal để thiết lập. Sau đó bạn sống trong trò chuyện. Đó là nhịp điệu.

## Liên quan

- [Getting Started](getting-started.md): hướng dẫn hoàn chỉnh cho thay đổi đầu tiên
- [Commands](commands.md): mọi lệnh gạch chéo chi tiết
- [CLI](cli.md): mọi lệnh terminal chi tiết
- [Supported Tools](supported-tools.md): cú pháp và vị trí tệp theo từng công cụ
- [FAQ](faq.md): các câu trả lời nhanh hơn
- [Troubleshooting](troubleshooting.md): cách khắc phục khi các lệnh không hiển thị