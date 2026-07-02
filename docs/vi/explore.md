# Khám phá (Explore)

**`/opsx:explore` là người bạn đồng hành tư duy của bạn.** Hãy tìm đến nó bất cứ khi nào bạn gặp một vấn đề nhưng chưa có kế hoạch giải quyết. Nó sẽ điều tra mã nguồn của bạn, cân nhắc các lựa chọn cùng với bạn và làm rõ những gì bạn thực sự muốn, tất cả trước khi tạo ra bất kỳ thành phẩm hay dòng mã nào. Khi bức tranh đã rõ ràng, nó sẽ chuyển giao cho `/opsx:propose`.

Nếu bạn rút ra một thói quen từ tài liệu này, hãy là điều này: **khi bạn không chắc chắn, hãy khám phá trước khi đề xuất.**

Đây là lý do tại sao điều đó quan trọng. Các trợ lý lập trình AI rất háo hức. Hãy hỏi một cách mơ hồ và chúng sẽ tự tin xây dựng *một cái gì đó*, nhưng có lẽ không phải là thứ bạn cần. Khám phá là liều thuốc giải. Đó là một cuộc trò chuyện không rủi ro, nơi bạn và AI cùng nhau tìm ra hướng đi đúng đắn, để khi bạn đề xuất, bạn đang đề xuất điều đúng đắn.

## Khi nào nên khám phá

Khám phá thường là bước đầu tiên phù hợp hơn nhiều so với những gì mọi người mong đợi. Hãy sử dụng nó khi bất kỳ điều nào sau đây là đúng:

- Bạn biết *vấn đề* nhưng không biết *giải pháp*. ("Các trang web chạy chậm." "Xác thực (Auth) đang rối tung.")
- Bạn đang lựa chọn giữa các phương pháp tiếp cận và muốn xem xét các đánh đổi (tradeoffs) dựa trên mã nguồn hiện tại của mình.
- Bạn mới làm quen với một codebase và cần hiểu cách mọi thứ hoạt động trước khi thay đổi nó.
- Các yêu cầu còn mơ hồ và bạn muốn làm sắc nét chúng trước khi cam kết.
- Bạn nghi ngờ công việc lớn hơn hoặc nhỏ hơn so với vẻ bề ngoài và muốn xác định phạm vi (scope) một cách trung thực.

Chỉ bỏ qua khám phá khi bạn đã biết chính xác những gì mình muốn và làm thế nào. Trong trường hợp đó, hãy đi thẳng đến [`/opsx:propose`](commands.md#opsxpropose).

## Nó làm được gì (và không làm được gì)

Khám phá là một **cuộc trò chuyện**, chứ không phải là một công cụ tạo ra sản phẩm.

**Nó làm:**
- Đọc và tìm kiếm codebase của bạn để trả lời các câu hỏi thực tế.
- So sánh các lựa chọn và nêu rõ những đánh đổi (tradeoffs) của từng cái.
- Vẽ sơ đồ để làm cho thiết kế dễ hiểu hơn.
- Giúp bạn thu hẹp một ý tưởng mơ hồ thành một phạm vi cụ thể, có thể xây dựng được.
- Chuyển giao sang `/opsx:propose` khi bạn sẵn sàng.

**Nó không:**
- Tạo thư mục thay đổi (change folder).
- Viết bất kỳ thành phẩm nào (không đề xuất, không thông số kỹ thuật, không thiết kế hay nhiệm vụ).
- Viết hoặc sửa mã.

Đó là ý nghĩa của nó. Khám phá không tốn kém gì và cũng không ràng buộc bạn vào điều gì cả. Bạn có thể khám phá ba ngõ cụt, học được điều gì đó từ mỗi cái, và sau đó mới đề xuất con đường đã sống sót qua thử thách.

## Nó đã được cài đặt sẵn

Tin tốt: `/opsx:explore` đi kèm trong hồ sơ **core** mặc định, ngay bên cạnh `propose`, `apply`, `sync`, và `archive`. Bạn không cần kích hoạt bất cứ thứ gì. Nếu OpenSpec đã được thiết lập trong dự án của bạn, khám phá sẽ sẵn sàng trong cuộc trò chuyện AI của bạn. (Cũng như tất cả các lệnh `/opsx:*`, bạn nhập nó vào cửa sổ chat của trợ lý, chứ không phải terminal. Xem [Cách Hoạt Động Của Các Lệnh](how-commands-work.md).)

## Một ví dụ đầy đủ

Hãy xem một mối lo lắng mơ hồ trở thành một thay đổi sắc nét, có thể xây dựng được như thế nào.

```text
You: /opsx:explore

AI:  What would you like to explore?

You: Our checkout sometimes creates duplicate orders. I don't know why
     and I don't know how to fix it safely.

AI:  Let me dig into the checkout path...
     [reads the order service, the payment webhook handler, and the
      client submit logic]

     Here's what I found. There are two ways a duplicate can happen:

     1. The client can submit twice (double-click, retry on slow network).
        Nothing debounces it.
     2. The payment webhook can fire more than once, and the handler
        creates an order each time. There's no idempotency key.

     Cause #2 is the dangerous one: it can charge and fulfill twice.

     Three ways to fix it, roughly in order of robustness:
     - Idempotency key on the order-creation endpoint (handles both causes)
     - Dedup on the webhook by payment-intent id (handles #2 only)
     - Client-side debounce (handles #1 only, papers over the real bug)

     Given your code already stores the payment-intent id, the
     idempotency-key approach is a small change with the biggest payoff.
     Want me to scope that?

You: Yes, let's do the idempotency key.

You: /opsx:propose add-order-idempotency-key

AI:  Created openspec/changes/add-order-idempotency-key/, with a proposal
     and delta spec grounded in what we just found. Ready for implementation.
```

Hãy chú ý những gì đã xảy ra. Điểm xuất phát là "có điều gì đó không ổn và tôi sợ chạm vào nó." Hai mươi giây khám phá đã biến điều đó thành một nguyên nhân gốc rễ được đặt tên, ba lựa chọn được xếp hạng, một đề xuất gắn liền với mã hiện có, và một thay đổi chính xác. Đề xuất tiếp theo trở nên sắc nét vì quá trình tư duy đã diễn ra trước tiên.

## Chuyển giao cho propose

Khám phá không lưu trữ vào bất cứ thứ gì. Khi bạn sẵn sàng, bạn chỉ cần bắt đầu một thay đổi, và AI sẽ mang ngữ cảnh từ cuộc trò chuyện của bạn vào các thành phẩm.

```text
explore  ──►  propose  ──►  apply  ──►  archive
 (think)     (agree)       (build)     (record)
```

Bạn có thể nói bằng ngôn ngữ thông thường ("hãy biến điều này thành một thay đổi") hoặc chạy `/opsx:propose <name>` trực tiếp. Dù theo cách nào, quá trình khám phá bạn vừa thực hiện sẽ trở thành nền tảng của đề xuất, chứ không phải là cuộc trò chuyện vô nghĩa.

Nếu bạn sử dụng bộ lệnh mở rộng, explore có thể chuyển giao cho `/opsx:new` thay thế, để tạo thành phẩm từng bước. Xem [Workflows](workflows.md).

## Mẹo để khám phá tốt

- **Mang vấn đề đến, không phải giải pháp.** "Đăng nhập chậm" sẽ cho AI cơ hội để điều tra. "Thêm cache Redis" đã cam kết bạn vào một câu trả lời mà bạn chưa kiểm tra.
- **Hãy hỏi về các đánh đổi (tradeoffs) thành tiếng nói lớn.** "Nhược điểm của mỗi lựa chọn là gì?" sẽ giúp bạn có được sự so sánh trung thực hơn.
- **Hãy để nó đọc trước.** Những cuộc khám phá tốt nhất bắt đầu bằng việc AI thực sự xem mã của bạn, chứ không phải đoán mò. Hãy chỉ cho nó khu vực liên quan nếu điều đó hữu ích.
- **Không sao cả nếu bỏ cuộc.** Nếu khám phá tiết lộ rằng ý tưởng này không đáng giá, đó là một chiến thắng. Bạn đã học được nó với chi phí thấp.
- **Khám phá lại giữa chừng thay đổi.** Bị mắc kẹt trong `/opsx:apply`? Bạn có thể lùi lại và khám phá một vấn đề phụ, sau đó quay lại.

## Những đánh đổi trung thực

**Bạn đạt được gì:** explore bắt được những khúc ngoặt sai ở thời điểm rẻ nhất có thể, trước khi bất kỳ thành phẩm nào tồn tại. Nó đặc biệt mạnh mẽ trong các mã nguồn không quen thuộc, nơi khả năng đọc và tóm tắt hệ thống của AI giúp bạn tiết kiệm một buổi chiều mò mẫm.

**Nó tốn bao nhiêu:** Một chút kiên nhẫn. Khám phá là một cuộc trò chuyện, vì vậy nó chậm hơn so với việc bắn `/opsx:propose` và hy vọng. Đối với công việc mà bạn thực sự đã hiểu rõ, bước bổ sung đó chỉ là gánh nặng thừa, và bạn nên bỏ qua nó.

Quy tắc chung: nhiệm vụ càng mơ hồ thì khám phá càng mang lại hiệu quả lớn. Nhiệm vụ càng rõ ràng thì bạn càng có thể bỏ thẳng vào đề xuất.

## Nên đi đâu tiếp theo

- [Commands: `/opsx:explore`](commands.md#opsxexplore): tài liệu tham khảo chính xác
- [Workflows](workflows.md): khám phá như một phần của vòng lặp hàng ngày
- [Examples & Recipes](examples.md#recipe-3-exploring-before-you-commit): khám phá trong một quy trình chi tiết
- [Getting Started](getting-started.md): hướng dẫn thay đổi đầu tiên, bao gồm cả khám phá