# Ví dụ & Công thức (Recipes)

Những thay đổi thực tế, từ đầu đến cuối. Mỗi công thức đều hiển thị các lệnh bạn sẽ gõ và những gì bạn sẽ thấy trả về, để bạn có thể đối chiếu tình huống của mình với một mẫu và sao chép nó. Những ví dụ này sử dụng các lệnh **core** mặc định (`propose`, `explore`, `apply`, `sync`, `archive`); nếu cần bộ lệnh mở rộng hơn, điều đó sẽ được ghi chú lại.

Một lời nhắc nhở trước khi bạn bắt đầu: các lệnh gạch chéo (slash commands) như `/opsx:propose` được nhập vào **trò chuyện của trợ lý AI**, và các lệnh `openspec` được nhập vào **terminal**. Nếu bạn chưa quen, hãy đọc [Cách hoạt động của Lệnh](how-commands-work.md) trước. Trong các bản ghi bên dưới, `You:` và `AI:` là phần trò chuyện, còn các dòng bắt đầu bằng `$` là terminal.

> **Chưa chắc chắn về những gì mình đang xây dựng?** Hầu hết các công thức này sẽ sắc bén hơn nếu bạn bắt đầu với `/opsx:explore` để suy nghĩ trước. [Công thức 3](#recipe-3-exploring-before-you-commit) minh họa điều đó, và hướng dẫn [Khám phá Trước](explore.md) đưa ra lý lẽ đầy đủ.

## Công thức 1: Một tính năng nhỏ, con đường nhanh

**Khi nào nên sử dụng:** bạn biết mình muốn gì, và đó là một phần công việc giới hạn. Đây là công thức phổ biến nhất.

Toàn bộ quá trình chỉ gồm ba lệnh. Propose (Đề xuất), build (Xây dựng), archive (Lưu trữ).

```text
You: /opsx:propose add-logout-button

AI:  Created openspec/changes/add-logout-button/
     ✓ proposal.md — lý do và những gì
     ✓ specs/      — yêu cầu mới và các kịch bản của nó
     ✓ design.md   — phương pháp tiếp cận kỹ thuật
     ✓ tasks.md    — danh sách kiểm tra triển khai
     Sẵn sàng để triển khai. Chạy /opsx:apply.
```

Bây giờ hãy đọc kế hoạch. Mở proposal và delta spec. Đây là lúc OpenSpec được tạo ra: bắt được một giả định sai lầm khi nó vẫn chỉ là một đoạn văn, chứ không phải 400 dòng mã. Hãy chỉnh sửa bất kỳ artifact nào trực tiếp nếu có điều gì không ổn, sau đó tiếp tục.

```text
You: /opsx:apply

AI:  Đang thực hiện các tác vụ...
     ✓ 1.1 Thêm nút đăng xuất vào header
     ✓ 1.2 Xóa phiên khi nhấp
     ✓ 1.3 Thêm hộp thoại xác nhận
     Tất cả các tác vụ đã hoàn thành!

You: /opsx:archive

AI:  Đang lưu trữ add-logout-button...
     ✓ Đã hợp nhất specs vào openspec/specs/auth/spec.md
     ✓ Đã di chuyển đến openspec/changes/archive/2026-06-22-add-logout-button/
     Hoàn thành. Sẵn sàng cho thay đổi tiếp theo.
```

Thế là xong. Hành vi đăng xuất giờ đã là một phần của specs, và sự thay đổi được lưu lại cùng với toàn bộ ngữ cảnh của nó.

## Công thức 2: Một bản sửa lỗi (Bug fix)

**Khi nào nên sử dụng:** có thứ gì đó bị hỏng và bạn muốn việc sửa chữa này được ghi nhận như một thay đổi cố ý đối với hành vi, chứ không phải là một commit bí ẩn.

Các bản sửa lỗi hoạt động chính xác như các tính năng. Sự khác biệt nằm ở cách bạn đóng khung đề xuất: mô tả hành vi *đúng*, chứ không chỉ nói "sửa lỗi".

```text
You: /opsx:propose fix-login-redirect-loop

AI:  Created openspec/changes/fix-login-redirect-loop/
     Đề xuất đã ghi lại hành vi bị lỗi hiện tại và hành vi dự định. Delta spec SỬA ĐỔI yêu cầu redirect để nó trở nên chính xác và có thể kiểm thử được.
     Sẵn sàng để triển khai.
```

Vì bản sửa chữa này được đưa vào như một yêu cầu `MODIFIED` với một kịch bản mới, người tiếp theo (hoặc phiên AI tiếp theo) sẽ thấy không chỉ là bạn đã sửa nó, mà còn là điều gì "đúng" có nghĩa là gì. Sau đó `/opsx:apply` và `/opsx:archive` như bình thường.

Mẹo: đối với một bản sửa lỗi, một kịch bản tốt là bài kiểm thử hồi quy (regression test) bằng văn xuôi. "GIẢ ĐỊNH người dùng đã đăng xuất, KHI họ gửi thông tin xác thực hợp lệ, THÌ họ sẽ đến dashboard và không bị redirect lại." Hãy viết điều đó, và việc triển khai sẽ có một mục tiêu rõ ràng.

## Công thức 3: Khám phá trước khi cam kết (Commit)

**Khi nào nên sử dụng:** bạn có một vấn đề nhưng chưa có kế hoạch. Bạn không chắc chắn nên xây dựng cái gì, hay phương pháp tiếp cận nào là đúng.

Bắt đầu bằng `/opsx:explore`. Nó là một đối tác tư duy mà không có cấu trúc và không tạo ra artifact nào. Nó đọc codebase của bạn và giúp bạn quyết định.

```text
You: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

You: Trang tải chậm nhưng tôi không biết thời gian bị mất ở đâu.

AI:  Để tôi xem... Tôi tìm thấy ba nguyên nhân có khả năng:
     1. Hình ảnh lớn chưa được tối ưu trên danh sách sản phẩm
     2. Lấy dữ liệu đồng bộ (Synchronous data fetching) làm chặn render
     3. Re-renders do thay đổi context
     Chúng ta nên giải quyết cái nào trước?

You: Cái về việc lấy dữ liệu.

You: /opsx:propose optimize-product-list-fetching

AI:  Đã tạo sự thay đổi, với một đề xuất được thông báo bởi những gì chúng ta vừa tìm thấy. Sẵn sàng để triển khai.
```

Việc khám phá làm rõ suy nghĩ của bạn *trước khi* bạn dành một thay đổi cho nó. Khi nhận thức trở nên rõ ràng, hãy propose (đề xuất), và AI sẽ tiếp tục ngữ cảnh đó.

## Công thức 4: Xử lý hai thay đổi cùng lúc

**Khi nào nên sử dụng:** bạn đang ở giữa một tính năng và một bản sửa lỗi khẩn cấp nhảy lên hàng đợi.

Các thay đổi là các thư mục độc lập, vì vậy công việc song song sẽ không xung đột. Bắt đầu sửa lỗi, triển nó, sau đó quay lại với tính năng tại đúng nơi bạn đã dừng.

```text
You: Tôi đang làm dở add-dark-mode, nhưng tôi cần sửa một bug đăng nhập ngay bây giờ.

You: /opsx:propose fix-login-redirect

AI:  Created openspec/changes/fix-login-redirect/. Sẵn sàng để triển khai.

You: /opsx:apply

AI:  Đã triển bản sửa lỗi. Tất cả các tác vụ đã hoàn thành.

You: /opsx:archive

AI:  ✓ Đã lưu trữ fix-login-redirect.

You: Quay lại dark mode.

You: /opsx:apply add-dark-mode

AI:  Tiếp tục add-dark-mode. Tiếp tục từ tác vụ 2.3: Cập nhật Header...
```

Việc đặt tên sự thay đổi trong `/opsx:apply add-dark-mode` là cách bạn chỉ định AI vào một thay đổi cụ thể khi có nhiều hơn một đang hoạt động. Vì các tác vụ theo dõi việc hoàn thành trong `tasks.md`, nên AI biết chính xác bạn đã dừng ở đâu.

Khi nhiều thay đổi được thực hiện cùng lúc, `/opsx:bulk-archive` mở rộng sẽ gom chúng lại và giải quyết xung đột spec bằng cách kiểm tra những gì thực sự đã được triển khai. Xem [Workflows](workflows.md#parallel-changes).

## Công thức 5: Refactor (Tái cấu trúc) mà không thay đổi hành vi

**Khi nào nên sử dụng:** bạn đang tái cấu trúc mã, và hành vi hiển thị ra bên ngoài cần phải giữ nguyên.

Đây là trường hợp thú vị, bởi vì một refactor thuần túy *không có gì để thêm vào specs của bạn*. Hợp đồng hành vi không thay đổi; chỉ việc triển khai mới thay đổi. Vì vậy công việc nằm trong thiết kế và các tác vụ, còn delta spec thì trống hoặc vắng mặt.

```text
You: /opsx:propose refactor-payment-module

AI:  Created the change. Đề xuất nêu rõ mục tiêu (chia module thanh toán, không thay đổi hành vi) và thiết kế ghi lại cấu trúc mới. Không có thay đổi spec, vì hành vi là giống nhau. Sẵn sàng để triển khai.
```

Khi bạn lưu trữ một sự thay đổi mà không chạm đến specs, bạn có thể yêu cầu lệnh terminal bỏ qua bước spec:

```bash
$ openspec archive refactor-payment-module --skip-specs
```

Cờ (flag) tương tự này hữu ích cho tooling, CI và các thay đổi chỉ dành cho docs. Nguyên tắc là: specs mô tả hành vi, vì vậy nếu hành vi không thay đổi, spec cũng không nên thay đổi. Xem [Concepts](concepts.md#what-a-spec-is-and-is-not).

## Công thức 6: Kiểm soát từng bước (Lệnh mở rộng)

**Khi nào nên sử dụng:** một sự thay đổi phức tạp hoặc rủi ro cao mà bạn muốn xem xét từng artifact trước khi chuyển sang bước tiếp theo.

`/opsx:propose` core soạn thảo mọi thứ cùng một lúc. Khi bạn thà đi từng bước một, hãy bật các lệnh mở rộng:

```bash
$ openspec config profile      # chọn các quy trình làm việc mở rộng
$ openspec update              # áp dụng chúng vào dự án này
```

Bây giờ bạn có thể tạo khung (scaffold) và xây dựng tăng dần:

```text
You: /opsx:new add-2fa

AI:  Created openspec/changes/add-2fa/. Sẵn sàng để tạo: proposal.

You: /opsx:continue

AI:  Đã tạo proposal.md. Hiện có sẵn: specs, design.

You: /opsx:continue

AI:  Đã tạo specs/auth/spec.md. Hiện có sẵn: design.
```

Xem xét từng artifact khi nó xuất hiện, chỉnh sửa tự do, và tiếp tục khi bạn hài lòng. Khi bạn muốn phần còn lại được soạn thảo trong một lần, `/opsx:ff` sẽ tua nhanh qua các artifact lập kế hoạch còn lại. Trước khi lưu trữ, `/opsx:verify` kiểm tra rằng việc triển khai thực sự khớp với specs. Xem [Workflows](workflows.md#opsxff-vs-opsxcontinue).

## Công thức 7: Trải nghiệm toàn bộ vòng lặp (Loop) bằng tay

**Khi nào nên sử dụng:** bạn đã cài đặt OpenSpec và muốn *cảm nhận* quy trình làm việc trên mã của riêng mình, chứ không phải một ví dụ đồ chơi.

Bật các lệnh mở rộng (xem Công thức 6), sau đó:

```text
You: /opsx:onboard

AI:  Chào mừng đến với OpenSpec! Tôi sẽ hướng dẫn bạn qua một thay đổi hoàn chỉnh sử dụng codebase thực tế của bạn. Hãy để tôi quét tìm một cải tiến nhỏ, an toàn mà chúng ta có thể làm cùng nhau...
```

`/opsx:onboard` tìm một cải tiến thực sự (nhỏ), tạo một thay đổi cho nó, triển nó và lưu trữ nó, tường thuật từng bước. Nó mất từ 15 đến 30 phút và để lại cho bạn một thay đổi thực tế mà bạn có thể giữ hoặc loại bỏ. Đây là cách nhẹ nhàng nhất để học. Xem [Commands](commands.md#opsxonboard).

## Kiểm tra công việc của bạn từ terminal

Bất cứ lúc nào, từ terminal, bạn đều có thể kiểm tra trạng thái mọi thứ:

```bash
$ openspec list                      # các thay đổi đang hoạt động
$ openspec show add-dark-mode        # một thay đổi chi tiết
$ openspec validate add-dark-mode    # kiểm tra cấu trúc
$ openspec view                      # bảng điều khiển tương tác
```

Đây là những công cụ để đọc và kiểm tra. Việc đề xuất và xây dựng vẫn diễn ra thông qua các lệnh gạch chéo trong chat. Chi tiết đầy đủ trong [CLI reference](cli.md).

## Nên đi đâu tiếp theo

- [Explore First](explore.md): cách được khuyến nghị để bắt đầu khi bạn không chắc chắn
- [Workflows](workflows.md): các mẫu trên, cùng với hướng dẫn quyết định khi nào nên sử dụng từng cái
- [Commands](commands.md): mọi lệnh gạch chéo chi tiết
- [Getting Started](getting-started.md): quy trình làm việc thay đổi đầu tiên chuẩn mực
- [Concepts](concepts.md): lý do tại sao các mảnh ghép lại với nhau theo cách chúng đã được thiết kế