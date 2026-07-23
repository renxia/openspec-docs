# Ví dụ & Công thức thực hiện

Những thay đổi thực tế, từ đầu đến cuối. Mỗi công thức thực hiện hiển thị các lệnh bạn cần nhập và kết quả trả về, để bạn có thể so sánh tình huống của mình với mẫu có sẵn và sao chép. Các công thức này sử dụng các lệnh **cốt lõi** mặc định (`propose`, `explore`, `apply`, `sync`, `archive`); nếu bộ lệnh mở rộng giúp ích, sẽ được ghi chú rõ.

Lưu ý trước khi bạn bắt đầu: các lệnh slash như `/opsx:propose` được nhập trong **khung chat của trợ lý AI**, còn các lệnh `openspec` được nhập trong **terminal của bạn**. Nếu đây là lần đầu bạn tiếp xúc, hãy đọc [Cách hoạt động của các lệnh](how-commands-work.md) trước. Trong các bản ghi bên dưới, `You:` và `AI:` là nội dung chat, còn các dòng bắt đầu bằng `$` là nội dung terminal.

> **Bạn vẫn chưa chắc mình sẽ xây dựng cái gì?** Hầu hết các công thức thực hiện này sẽ hiệu quả hơn nếu bạn bắt đầu với `/opsx:explore` để suy nghĩ kỹ trước. [Công thức thực hiện 3](#recipe-3-exploring-before-you-commit) minh họa cách dùng lệnh này trong thực tế, và hướng dẫn [Khám phá trước](explore.md) giải thích đầy đủ lý do nên làm vậy.

## Công thức thực hiện 1: Tính năng nhỏ, lộ trình nhanh

**Khi nào sử dụng:** Bạn đã biết rõ mình muốn làm gì và đây là một khối công việc độc lập. Đây là công thức thực hiện phổ biến nhất.

Toàn bộ quy trình chỉ cần 3 lệnh: Đề xuất (Propose), Xây dựng (Build), Lưu trữ (Archive).

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — why and what
     ✓ specs/      — the new requirement and its scenarios
     ✓ design.md   — technical approach
     ✓ tasks.md    — implementation checklist
     Ready for implementation. Run /opsx:apply.
```

Bây giờ hãy đọc kế hoạch. Mở đề xuất và bản delta spec. Đây là thời điểm OpenSpec được xây dựng để phục vụ: phát hiện giả định sai ngay khi nó chỉ là một đoạn văn, chứ không phải khi đã có 400 dòng code. Chỉnh sửa trực tiếp bất kỳ tài liệu nào nếu có gì không đúng, sau đó tiếp tục.

```text
You: /opsx:apply

AI:  Working through tasks...
     ✓ 1.1 Add logout button to header
     ✓ 1.2 Clear session on click
     ✓ 1.3 Add confirmation dialog
     All tasks complete!

You: /opsx:archive

AI:  Archiving add-logout-button...
     ✓ Merged specs into openspec/specs/auth/spec.md
     ✓ Moved to openspec/changes/archive/2026-06-22-add-logout-button/
     Done. Ready for the next change.
```

Xong rồi. Hành vi đăng xuất bây giờ đã là một phần của specs của bạn, và thay đổi đã được lưu trữ cùng toàn bộ ngữ cảnh liên quan.

## Công thức thực hiện 2: Sửa lỗi

**Khi nào sử dụng:** Có lỗi xảy ra và bạn muốn bản sửa lỗi được ghi nhận là một thay đổi hành vi có chủ đích, chứ không phải một commit không rõ lý do.

Các bản sửa lỗi hoạt động hoàn toàn giống như các tính năng. Sự khác biệt nằm ở cách bạn xây dựng đề xuất: hãy mô tả hành vi *đúng đắn*, chứ không chỉ nói "sửa lỗi".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     The proposal captures the current broken behavior and the
     intended behavior. The delta spec MODIFIES the redirect
     requirement so it's now precise and testable.
     Ready for implementation.
```

Vì bản sửa lỗi được lưu dưới dạng yêu cầu `MODIFIED` (đã sửa đổi) kèm một kịch bản mới, người tiếp theo (hoặc phiên AI tiếp theo) sẽ không chỉ thấy bạn đã sửa lỗi, mà còn thấy "đúng đắn" nghĩa là gì. Sau đó bạn thực hiện `/opsx:apply` và `/opsx:archive` như thông thường.

> Mẹo: đối với bản sửa lỗi, một kịch bản tốt chính là bài kiểm tra hồi quy được viết bằng văn bản. "GIVEN (Với điều kiện) người dùng đã đăng xuất, WHEN (Khi) họ gửi thông tin đăng nhập hợp lệ, THEN (Thì) họ sẽ được chuyển đến trang tổng quan và không bị chuyển hướng lại." Viết rõ kịch bản này, và quá trình xây dựng sẽ có mục tiêu rõ ràng.

## Công thức thực hiện 3: Khám phá trước khi cam kết thực hiện

**Khi nào sử dụng:** Bạn có một vấn đề nhưng chưa có kế hoạch giải quyết. Bạn không chắc nên xây dựng cái gì, hoặc phương án nào là đúng.

Bắt đầu với `/opsx:explore`. Đây là đối tác suy nghĩ không có cấu trúc cố định và không tạo ra bất kỳ tài liệu nào. Lệnh này sẽ đọc toàn bộ mã nguồn của bạn và giúp bạn đưa ra quyết định.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Page loads feel slow but I don't know where the time goes.

AI:  Let me look... I found three likely culprits:
     1. Large unoptimized images on the product list
     2. Synchronous data fetching that blocks render
     3. Re-renders triggered by context changes
     Which should we tackle first?

You: The data fetching one.

You: /opsx:propose optimize-product-list-fetching

AI:  Created the change, with a proposal informed by what we just
     found. Ready for implementation.
```

Quá trình khám phá giúp làm rõ suy nghĩ của bạn *trước* khi bạn dành một thay đổi cho vấn đề đó. Khi ý tưởng đã rõ ràng, hãy tạo đề xuất, và AI sẽ tiếp tục mang theo ngữ cảnh đó cho các bước tiếp theo.

## Công thức thực hiện 4: Xử lý nhiều thay đổi cùng lúc

**Khi nào sử dụng:** Bạn đang thực hiện một tính năng thì có lỗi khẩn cấp cần sửa ngay.

Các thay đổi được lưu trong các thư mục độc lập, nên công việc thực hiện song song không bị xung đột. Hãy bắt đầu sửa lỗi, hoàn thành và phát hành nó, sau đó quay lại tính năng ngay tại bước bạn đã dừng trước đó.

```text
You: I'm partway through add-dark-mode, but I need to fix a login bug now.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Ready for implementation.

You: /opsx:apply

AI:  Implemented the fix. All tasks complete.

You: /opsx:archive

AI:  ✓ Archived fix-login-redirect.

You: Back to dark mode.

You: /opsx:apply add-dark-mode

AI:  Resuming add-dark-mode. Picking up at task 2.3: Update Header...
```

Viết tên thay đổi trong lệnh `/opsx:apply add-dark-mode` là cách bạn chỉ định cho AI thực hiện một thay đổi cụ thể khi có nhiều thay đổi đang hoạt động. Vì các tác vụ được theo dõi tiến độ trong `tasks.md`, AI sẽ biết chính xác bạn đã dừng lại ở đâu.

Khi bạn hoàn thành nhiều thay đổi cùng lúc, lệnh mở rộng `/opsx:bulk-archive` sẽ lưu trữ tất cả chúng cùng lúc và giải quyết xung đột spec bằng cách kiểm tra những gì thực sự đã được triển khai. Xem thêm tại [Quy trình làm việc](workflows.md#parallel-changes).

## Công thức thực hiện 5: Tái cấu trúc mã không thay đổi hành vi

**Khi nào sử dụng:** Bạn đang tái cấu trúc mã nguồn, và hành vi nhìn thấy được từ bên ngoài phải giữ nguyên như cũ.

Đây là trường hợp đặc biệt, vì một lần tái cấu trúc thuần túy không có gì để thêm vào specs của bạn. Hợp đồng hành vi không thay đổi; chỉ phần triển khai thay đổi. Do đó, công việc chỉ nằm ở phần thiết kế (design) và tác vụ (tasks), còn bản delta spec trống hoặc không tồn tại.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. The proposal states the goal (split the
     payment module, no behavior change) and the design captures
     the new structure. No spec changes, since behavior is identical.
     Ready for implementation.
```

Khai báo delta trống một cách rõ ràng bằng cách đặt `skip_specs: true` trong file `.openspec.yaml` của thay đổi:

```yaml
schema: spec-driven
skip_specs: true
```

Nếu không có cờ đánh dấu này, lệnh `openspec validate` sẽ từ chối một thay đổi không có delta nào (để giai đoạn specs bị quên không bị bỏ sót); khi có cờ này, kiểm tra hợp lệ sẽ thành công và `openspec status` sẽ hiển thị giai đoạn specs là đã bỏ qua rõ ràng thay vì đang chờ. Nếu cuối cùng quá trình tái cấu trúc lại làm thay đổi hành vi, hãy xóa `skip_specs` khỏi file `.openspec.yaml` và viết các delta specs — lệnh validate sẽ xem cờ đánh dấu kèm các file spec là xung đột, nên cờ đánh dấu cũ không thể tồn tại âm thầm.

Lưu trữ một thay đổi đã đánh dấu không cần thêm cờ nào (vì không có delta nào cần hợp nhất). Độc lập với đó, cờ `--skip-specs` cho lệnh terminal biết bỏ qua bước spec một cách rõ ràng:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Cờ này cũng rất tiện cho các công cụ, CI, và các thay đổi chỉ liên quan đến tài liệu. Nguyên tắc chung là: specs mô tả hành vi, nên nếu hành vi không thay đổi, spec cũng không nên thay đổi. Xem thêm tại [Khái niệm](concepts.md#what-a-spec-is-and-is-not).

## Công thức thực hiện 6: Kiểm soát từng bước (lệnh mở rộng)

**Khi nào sử dụng:** Thay đổi phức tạp hoặc có rủi ro cao, bạn muốn xem xét từng tài liệu trước khi chuyển sang bước tiếp theo.

Lệnh cốt lõi `/opsx:propose` sẽ soạn thảo tất cả tài liệu cùng lúc. Khi bạn muốn thực hiện từng bước một, hãy bật các lệnh mở rộng:

```bash
$ openspec config profile      # select the expanded workflows
$ openspec update              # apply them to this project
```

Bây giờ bạn có thể tạo khung và xây dựng từng bước:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Ready to create: proposal.

You: /opsx:continue

AI:  Created proposal.md. Now available: specs, design.

You: /opsx:continue

AI:  Created specs/auth/spec.md. Now available: design.
```

Xem xét từng tài liệu ngay khi nó được tạo ra, chỉnh sửa tự do, và tiếp tục khi bạn hài lòng. Khi bạn muốn soạn thảo phần còn lại cùng lúc, lệnh `/opsx:ff` sẽ chuyển nhanh qua các tài liệu lập kế hoạch còn lại. Trước khi lưu trữ, lệnh `/opsx:verify` sẽ kiểm tra xem phần triển khai có thực sự khớp với specs hay không. Xem thêm tại [Quy trình làm việc](workflows.md#opsxff-vs-opsxcontinue).

## Công thức thực hiện 7: Học toàn bộ quy trình bằng thực hành

**Khi nào sử dụng:** Bạn đã cài đặt OpenSpec và muốn *cảm nhận* quy trình làm việc trên mã nguồn của chính mình, thay vì chỉ xem ví dụ giả lập.

Bật các lệnh mở rộng (xem Công thức thực hiện 6), sau đó:

```text
You: /opsx:onboard

AI:  Welcome to OpenSpec! I'll walk you through a complete change
     using your actual codebase. Let me scan for a small, safe
     improvement we can make together...
```

Lệnh `/opsx:onboard` sẽ tìm một cải tiến thực tế (nhỏ), tạo thay đổi cho nó, triển khai và lưu trữ, đồng thời giải thích từng bước. Quá trình này mất từ 15 đến 30 phút và để lại một thay đổi thực tế bạn có thể giữ lại hoặc loại bỏ. Đây là cách học nhẹ nhàng nhất. Xem thêm tại [Lệnh](commands.md#opsxonboard).

## Kiểm tra tiến độ từ terminal

Bất cứ lúc nào, từ terminal của bạn, bạn có thể kiểm tra trạng thái của các thay đổi:

```bash
$ openspec list                      # active changes
$ openspec show add-dark-mode        # one change in detail
$ openspec validate add-dark-mode    # check structure
$ openspec view                      # interactive dashboard
```

Đây là các công cụ chỉ đọc và kiểm tra. Việc tạo đề xuất và xây dựng thay đổi vẫn được thực hiện thông qua các lệnh slash trong khung chat. Thông tin chi tiết xem tại [Tài liệu tham khảo CLI](cli.md).

## Tài liệu tham khảo tiếp theo

- [Khám phá trước](explore.md): cách bắt đầu được khuyến nghị khi bạn chưa chắc chắn
- [Quy trình làm việc](workflows.md): các mẫu quy trình ở trên, kèm hướng dẫn quyết định khi nào nên sử dụng từng loại
- [Lệnh](commands.md): chi tiết tất cả các lệnh slash
- [Bắt đầu sử dụng](getting-started.md): hướng dẫn thực hiện thay đổi đầu tiên chuẩn xác
- [Khái niệm](concepts.md): lý do các thành phần kết hợp với nhau theo cách hiện tại