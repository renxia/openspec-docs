# Cách hoạt động của các lệnh

**Điều duy nhất bạn cần biết: OpenSpec có hai loại lệnh, và chúng chạy ở hai nơi khác nhau.**

- Các lệnh `openspec ...` chạy trên **terminal** của bạn. (Ví dụ: `openspec init`.)
- Các lệnh `/opsx:...` chạy trên **khung chat của trợ lý AI** của bạn. (Ví dụ: `/opsx:propose`.)

Nếu bạn từng gõ `/opsx:propose` vào terminal mà không có phản ứng gì, thì trang này sẽ giải thích lý do. Bạn đang nói chuyện với phần sai của OpenSpec. Các lệnh slash không phải là lệnh terminal. Chúng là các hướng dẫn bạn đưa ra cho trợ lý lập trình AI, trong cùng khung chat mà bạn thường gõ yêu cầu "thêm form đăng nhập".

Sự khác biệt duy nhất này là rào cản phổ biến nhất đối với người dùng mới, vì vậy hãy làm cho nó rõ ràng hoàn toàn.

## Hai phần của OpenSpec

OpenSpec là một dự án đội hai chiếc mũ.

**CLI (phần chạy trên terminal).** Một chương trình có tên `openspec` mà bạn cài đặt và chạy từ shell của mình. Nó thiết lập dự án của bạn, liệt kê và xác thực các thay đổi, hiển thị bảng điều khiển, và lưu trữ công việc đã hoàn thành. Bạn gõ các lệnh này vào iTerm, terminal của VS Code, PowerShell, hoặc bất kỳ nơi nào bạn thường chạy `git` hay `npm`.

```bash
openspec init        # thiết lập OpenSpec trong dự án này
openspec list        # xem các thay đổi đang hoạt động
openspec view        # mở bảng điều khiển tương tác
```

**Các lệnh slash (phần chạy trên chat).** Các lệnh ngắn như `/opsx:propose` và `/opsx:apply` mà bạn gõ vào trợ lý AI của mình. Chúng yêu cầu AI tuân theo quy trình làm việc OpenSpec: soạn thảo đề xuất, viết đặc tả, xây dựng từ danh sách công việc, lưu trữ khi hoàn thành. Bạn gõ các lệnh này vào Claude Code, Cursor, Windsurf, Copilot, hoặc bất kỳ trợ lý nào bạn sử dụng.

```text
/opsx:propose add-dark-mode    (gõ vào khung chat AI của bạn)
/opsx:apply                    (gõ vào khung chat AI của bạn)
/opsx:archive                  (gõ vào khung chat AI của bạn)
```

Đây là mô hình tư duy được trình bày trong một hình:

```text
        TERMINAL CỦA BẠN                         KHUNG CHAT CỦA TRỢ LÝ AI CỦA BẠN
   ┌──────────────────────┐               ┌──────────────────────────────┐
   │  $ openspec init     │   cài đặt    │  /opsx:propose add-dark-mode  │
   │  $ openspec list     │  ──────────►  │  /opsx:apply                  │
   │  $ openspec view     │   lệnh       │  /opsx:archive                │
   └──────────────────────┘    & kỹ năng   └──────────────────────────────┘
        chạy openspec ở đây                       chạy /opsx:* ở đây
```

Chú ý mũi tên. Chạy lệnh `openspec init` trên terminal của bạn là thao tác *cài đặt* các lệnh slash vào công cụ AI của bạn. Phần chạy trên terminal thiết lập phần chạy trên chat. Sau đó, các thao tác sử dụng hàng ngày chủ yếu diễn ra trên chat.

## "Làm thế nào để tôi bắt đầu chế độ tương tác?"

**Không có chế độ tương tác riêng biệt nào để khởi động.** Câu hỏi này xuất hiện rất nhiều, vì vậy nó xứng đáng nhận được câu trả lời rõ ràng.

Bạn không cần vào một chế độ OpenSpec đặc biệt nào. Bạn chỉ cần mở trợ lý lập trình AI như bạn vẫn thường làm, và gõ một lệnh slash vào chat. Lệnh slash chính là cách bạn "đi vào" OpenSpec. Trợ lý của bạn sẽ nhận ra nó, tải kỹ năng OpenSpec tương ứng, và bắt đầu tuân theo quy trình làm việc.

Vì vậy, các hướng dẫn thực tế là:
1. Mở trợ lý lập trình AI của bạn (Claude Code, Cursor, Windsurf, v.v.) trong dự án của bạn.
2. Gõ `/opsx:propose` vào khung chat của nó, cùng nơi bạn gõ mọi yêu cầu khác.
3. Quan sát tính năng tự động hoàn thành: nếu OpenSpec đã được cài đặt, bạn sẽ thấy `/opsx:propose`, `/opsx:apply` và các lệnh liên quan xuất hiện khi bạn gõ dấu slash.

Thế là xong. Không có chế độ nào để bật/tắt, không có dịch vụ nền nào để khởi chạy, không có cửa sổ riêng biệt nào.

Một thứ thực sự tương tác nằm trên terminal: `openspec view`. Nó mở một bảng điều khiển để duyệt đặc tả và các thay đổi của bạn. Nhưng đó chỉ là công cụ xem, không phải là thứ bạn dùng để đề xuất và xây dựng. Việc xây dựng diễn ra thông qua các lệnh slash trên chat.

## Tại sao lại có sự phân chia này

Việc hiểu điều này rất đáng giá, vì nó giải thích tại sao OpenSpec hoạt động được với hơn 25 công cụ AI khác nhau.

CLI là **động cơ**. Nó biết tất cả các quy tắc: thư mục thay đổi trông như thế nào, các tác phẩm phụ thuộc vào cái nào, cách hợp nhất đặc tả delta vào nguồn dữ liệu gốc của bạn. Nó giống nhau ở mọi nơi.

Các lệnh slash là **vô-lăng**, và mỗi công cụ AI có một cái hơi khác nhau. Claude Code gọi chúng là lệnh. Cursor và Windsurf có định dạng riêng của mình. Một số công cụ gọi chúng là kỹ năng. Khi bạn chạy `openspec init`, OpenSpec sẽ tạo ra loại file phù hợp cho mỗi công cụ bạn đã chọn, vì vậy cùng một ý định `/opsx:propose` sẽ hoạt động bất kể bạn dùng trợ lý nào.

Điểm mạnh của thiết kế này: bạn chỉ cần học quy trình làm việc một lần và có thể áp dụng nó trên mọi công cụ. Điểm đánh đổi: cú pháp chính xác của lệnh có thể khác nhau một chút giữa các công cụ, đó là nội dung của phần tiếp theo.

## Cú pháp lệnh slash theo từng công cụ

Ý định của lệnh là giống nhau ở mọi nơi. Chỉ có dấu câu khác nhau. Hãy sử dụng dạng phù hợp với trợ lý của bạn.

| Công cụ | Cách bạn gõ |
|------|-----------------|
| Claude Code | `/opsx:propose`, `/opsx:apply` |
| Cursor | `/opsx-propose`, `/opsx-apply` |
| Windsurf | `/opsx-propose`, `/opsx-apply` |
| GitHub Copilot (IDE) | `/opsx-propose`, `/opsx-apply` |
| CodeArts | dạng kỹ năng, ví dụ: `/openspec-propose` |
| Codex | dạng kỹ năng thông qua `.codex/skills/openspec-*` |
| Oh My Pi | `/opsx-propose`, `/opsx-apply` |
| Kimi CLI | dạng kỹ năng, ví dụ: `/skill:openspec-propose` |
| Trae | `/opsx-propose`, `/opsx:apply` |

Hầu hết các công cụ sử dụng hoặc dạng dấu hai chấm (`/opsx:propose`) hoặc dạng dấu gạch ngang (`/opsx-propose`). Một số công cụ hiển thị OpenSpec dưới dạng các kỹ năng có tên thay vì lệnh slash; đối với các công cụ này, bạn gọi kỹ năng bằng tên của nó. Danh sách đầy đủ theo từng công cụ, bao gồm cả các file được ghi chính xác ở đâu, nằm ở [Supported Tools](supported-tools.md).

Khi không chắc chắn, hãy gõ dấu slash vào khung chat AI của bạn và xem tính năng tự động hoàn thành. Công cụ của bạn sẽ hiển thị dạng lệnh mà nó mong đợi.

## Các lệnh được đặt ở đâu: kỹ năng và lệnh

Khi bạn chạy `openspec init` (hoặc `openspec update`), OpenSpec sẽ ghi các file nhỏ vào dự án của bạn để công cụ AI có thể tìm thấy quy trình làm việc. Tùy thuộc vào công cụ và cài đặt của bạn, chúng có thể là **kỹ năng**, **lệnh**, hoặc cả hai.

- Các **kỹ năng** nằm ở các vị trí như `.claude/skills/openspec-*/SKILL.md`. Chúng là tiêu chuẩn mới nổi giữa các công cụ: một thư mục chứa các hướng dẫn mà trợ lý của bạn tự động phát hiện.
- Các **lệnh** nằm ở các vị trí như `.claude/commands/opsx/<id>.md`. Chúng là các file lệnh slash cũ hơn, dành riêng cho từng công cụ. Codex không nhận được các file lệnh được tạo tự động; hãy sử dụng `.codex/skills/openspec-*`.

Bạn không cần quan tâm công cụ của mình sử dụng loại nào. Bạn chỉ cần gõ lệnh slash và nó sẽ hoạt động. Nhưng biết rằng các file này tồn tại sẽ giúp ích khi có sự cố xảy ra: nếu các lệnh của bạn biến mất, thường là do các file này bị thiếu hoặc lỗi thời, và `openspec update` sẽ tạo lại chúng.

Xem [Supported Tools](supported-tools.md) để biết đường dẫn chính xác cho từng công cụ, và [Migration Guide](migration-guide.md) để biết cách kỹ năng đã thay thế cách tiếp cận chỉ dùng lệnh cũ hơn.

## Xác nhận đã cài đặt

Các kiểm tra nhanh, theo thứ tự từ nhanh nhất:
1. **Gõ dấu slash vào khung chat AI của bạn.** Bắt đầu gõ `/opsx` và quan sát các gợi ý tự động hoàn thành. Nếu chúng xuất hiện, bạn đã sẵn sàng.
2. **Tìm các file tương ứng.** Đối với Claude Code, hãy kiểm tra xem thư mục `.claude/skills/` có chứa các thư mục `openspec-*` hay không. Các công cụ khác sử dụng thư mục riêng của chúng ([Supported Tools](supported-tools.md) liệt kê chúng).
3. **Chạy lại quá trình thiết lập.** Từ thư mục gốc của dự án, hãy chạy `openspec update`. Thao tác này sẽ tạo lại các file kỹ năng và lệnh cho tất cả các công cụ bạn đã cấu hình.
4. **Khởi động lại trợ lý của bạn.** Nhiều công cụ quét tìm kỹ năng và lệnh khi khởi chạy, vì vậy mở một cửa sổ mới có thể là bước còn thiếu.

## Tôi thậm chí có những lệnh nào?

Theo mặc định, OpenSpec cài đặt bộ lệnh slash **cốt lõi**:
- `/opsx:explore`: suy nghĩ về một ý tưởng với AI trước khi cam kết thực hiện thay đổi (bước đầu tiên tuyệt vời khi bạn không chắc chắn)
- `/opsx:propose`: tạo một thay đổi và soạn thảo tất cả các tác phẩm kế hoạch của nó trong một bước
- `/opsx:apply`: xây dựng thay đổi bằng cách thực hiện qua danh sách công việc của nó
- `/opsx:sync`: hợp nhất các cập nhật đặc tả của thay đổi vào đặc tả chính của bạn (thường được thực hiện tự động)
- `/opsx:archive`: hoàn thành một thay đổi và lưu trữ nó

Nhịp điệu làm việc mặc định tốt: dùng `explore` khi bạn đang tìm hiểu xem nên làm gì, sau đó `propose`, `apply`, `archive`. Hướng dẫn [Khám phá trước](explore.md) giải thích lý do tại sao bước mở đầu này đáng giá.

Có cả bộ **mở rộng** dành cho những người muốn kiểm soát chi tiết hơn (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`). Bạn bật nó bằng lệnh `openspec config profile`, sau đó áp dụng bằng `openspec update`.

Mới làm quen với tất cả những điều này? `/opsx:onboard` (trong bộ mở rộng) sẽ hướng dẫn bạn thực hiện một thay đổi hoàn chỉnh trên mã nguồn của chính bạn, giải thích từng bước. Đây là lời giới thiệu thân thiện nhất có thể.

Để biết chi tiết chức năng của từng lệnh, xem [Lệnh](commands.md). Để biết nên dùng lệnh nào khi nào, xem [Quy trình làm việc](workflows.md).

## Lần chạy đầu tiên hoàn chỉnh

Đặt tất cả vào cùng nhau, đây là toàn bộ chuỗi thao tác với từng bước được ghi nhãn theo nơi diễn ra.

```text
TERMINAL   $ npm install -g @fission-ai/openspec@latest
TERMINAL   $ cd your-project
TERMINAL   $ openspec init
              (cài đặt các lệnh slash vào công cụ AI của bạn)

CHAT AI      /opsx:explore
              (tùy chọn: suy nghĩ về ý tưởng với AI trước)

CHAT AI      /opsx:propose add-dark-mode
              (AI soạn thảo đề xuất, đặc tả, thiết kế, danh sách công việc)

CHAT AI      /opsx:apply
              (AI xây dựng nó, đánh dấu hoàn thành các công việc)

CHAT AI      /opsx:archive
              (thay đổi được hợp nhất vào đặc tả của bạn và lưu trữ)
```

Hai bước trên terminal để thiết lập. Sau đó bạn hoạt động chủ yếu trên chat. Đó là nhịp điệu làm việc.

## Liên quan

- [Bắt đầu](getting-started.md): hướng dẫn thực hiện thay đổi đầu tiên đầy đủ
- [Lệnh](commands.md): chi tiết từng lệnh slash
- [CLI](cli.md): chi tiết từng lệnh terminal
- [Supported Tools](supported-tools.md): cú pháp và vị trí file theo từng công cụ
- [FAQ](faq.md): thêm các câu trả lời nhanh
- [Khắc phục sự cố](troubleshooting.md): các cách khắc phục khi lệnh không hiển thị