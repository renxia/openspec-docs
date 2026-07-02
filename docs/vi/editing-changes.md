# Chỉnh sửa và Cải tiến một Thay đổi

**Mọi tài sản (artifact) trong một thay đổi đều là một tệp Markdown mà bạn có thể chỉnh sửa bất cứ lúc nào.** Không có "giai đoạn lập kế hoạch" bị khóa, không có cổng phê duyệt, cũng không có chế độ chỉnh sửa đặc biệt nào cần phải vào. Bạn muốn thay đổi đề xuất sau khi đã bắt đầu xây dựng? Hãy mở `proposal.md` và thay đổi nó. Nhận ra thiết kế sai giữa quá trình triển khai? Sửa `design.md` và tiếp tục. Đó là toàn bộ câu trả lời, và đó là thiết kế như vậy.

Trang này dành cho khoảnh khắc bạn nghĩ "chờ đã, tôi có thể quay lại và thay đổi điều đó không?". Câu trả lời là Có. Đây là cách thực hiện cho từng trường hợp phổ biến.

## Hai cách để chỉnh sửa bất cứ thứ gì

Bạn luôn có cả hai lựa chọn:

1. **Chỉnh sửa trực tiếp tệp.** Các tài sản là Markdown thuần túy trong `openspec/changes/<name>/`. Mở `proposal.md`, `design.md`, `tasks.md`, hoặc một delta spec dưới `specs/` trong trình soạn thảo của bạn và thay đổi nó. Không cần bất cứ điều gì khác.

2. **Yêu cầu AI sửa lại.** Trong cuộc trò chuyện, chỉ cần nói những gì bạn muốn: "Cập nhật đề xuất để loại bỏ ý tưởng về caching và thêm một phần giới hạn tốc độ (rate-limit)," hoặc "thiết kế nên sử dụng hàng đợi (queue), chứ không phải polling." AI sẽ chỉnh sửa tài sản cho bạn, sử dụng phần còn lại của thay đổi làm ngữ cảnh.

Hãy sử dụng tùy chọn nào phù hợp với khoảnh khắc đó. Một điều chỉnh nhỏ về từ ngữ? Hãy chỉnh sửa tệp. Cần suy nghĩ lại một cách cơ bản? Hãy để AI sửa với toàn bộ ngữ cảnh.

## "Tôi nên cập nhật đề xuất (hoặc các thông số kỹ thuật) như thế nào sau khi đã bắt đầu?"

Cứ cập nhật nó. Thay đổi đó vẫn giữ nguyên, nhưng được tinh chỉnh.

Nếu bạn đang sử dụng các lệnh mở rộng (expanded commands), luồng tự nhiên là: chỉnh sửa tài sản, sau đó chạy `/opsx:continue` để tiếp tục từ trạng thái mới, hoặc `/opsx:apply` để tiếp tục triển khai dựa trên kế hoạch đã cập nhật. Nếu bạn đang dùng các lệnh `core` mặc định, hãy chỉnh sửa tài sản và chạy `/opsx:apply`; nó sẽ đọc các tệp hiện tại, vì vậy nó sẽ xây dựng dựa trên những gì mà các tài sản hiện có nói đến.

Mô hình tư duy: các tài sản là kế hoạch trực tiếp (live plan), chứ không phải một hợp đồng đã ký. AI luôn làm việc dựa trên nội dung hiện tại của chúng, do đó việc chỉnh sửa chúng sẽ định hướng công việc.

```text
Bạn: Tôi muốn thay đổi cách tiếp cận trong thay đổi này.

Bạn: [chỉnh sửa design.md, hoặc nói với AI:]
     Cập nhật design.md để sử dụng một background job thay vì một synchronous call.

AI:  Đã cập nhật design.md. Danh sách nhiệm vụ vẫn phù hợp; bạn có muốn tôi tiếp tục áp dụng không?

Bạn: /opsx:apply
```

Điều này trả lời một câu hỏi rất phổ biến: không có lệnh "cập nhật đề xuất" riêng biệt vì bạn không cần nó. Tệp là nguồn sự thật (source of truth), và việc chỉnh sửa nó (bằng tay hoặc thông qua AI) chính là bản cập nhật.

## "Tôi nên quay lại xem xét thế nào sau khi đã triển khai?"

Bạn không cần phải "quay lại," bởi vì bạn chưa bao giờ rời đi. Quy trình làm việc diễn ra linh hoạt: xem xét, chỉnh sửa và triển khai không phải là những giai đoạn tuần tự mà bạn bị mắc kẹt trong đó.

Cụ thể, sau một số công việc `/opsx:apply`:

- Muốn xem lại kế hoạch? Hãy mở các tài sản và đọc chúng, hoặc chạy `openspec show <change>` trong terminal để có cái nhìn tổng hợp.
- Tìm thấy điều gì cần thay đổi? Chỉnh sửa tài sản (hoặc yêu cầu AI), sau đó tiếp tục.
- Muốn một bước kiểm tra có cấu trúc rằng mã khớp với kế hoạch? Chạy `/opsx:verify` (lệnh mở rộng). Nó báo cáo về tính đầy đủ, tính chính xác và sự mạch lạc mà không chặn bất cứ điều gì. Xem [Workflows: Verify](workflows.md#verify-check-your-work).

Không có "giai đoạn xem xét" nào để quay lại, bởi vì việc xem xét là thứ bạn có thể làm tại bất kỳ thời điểm nào, bao gồm cả sau khi triển khai.

## "Tôi đã chỉnh sửa mã bằng tay. Tôi nên dung hòa điều đó với OpenSpec như thế nào?"

Điều này xảy ra liên tục và điều đó không sao. Bạn đã tinh chỉnh một cái gì đó trong trình soạn thảo của mình, và bây giờ mã và các tài sản đang không đồng nhất. Hãy đưa chúng trở lại đồng bộ theo hướng nào là đúng:

- **Mã hiện đã chính xác, thông số kỹ thuật bị lỗi thời.** Cập nhật delta spec (và tasks, nếu liên quan) để mô tả hành vi mà bạn thực sự đã triển khai. Thông số kỹ thuật nên khớp với thực tế trước khi bạn lưu trữ (archive), vì việc lưu trữ sẽ hợp nhất thông số kỹ thuật vào nguồn sự thật của bạn.
- **Thông số kỹ thuật là chính xác, mã bị sai lệch.** Tiếp tục xây dựng hoặc sửa chữa cho đến khi mã khớp với thông số kỹ thuật.

Một cách nhanh chóng để phát hiện các điểm không khớp là `/opsx:verify`: nó đọc tài sản và mã của bạn và nói cho bạn biết chúng khác nhau ở đâu. Hãy coi đầu ra của nó như một danh sách việc cần làm để dung hòa, sau đó lưu trữ khi chúng đồng ý.

Nguyên tắc: tại thời điểm lưu trữ, thông số kỹ thuật của bạn sẽ trở thành sự thật được ghi lại. Vì vậy trước khi lưu trữ, hãy làm cho các thông số kỹ thuật trung thực về những gì mã đang làm. Việc chỉnh sửa thủ công là điều được chào đón; chỉ cần đừng để chúng âm thầm làm mất đồng bộ thông số kỹ thuật.

## Tinh chỉnh một đề xuất mà bạn không hài lòng

Nếu một đề xuất được tạo ra chưa đạt yêu cầu, bạn có ba hành động tốt:

- **Lặp lại tại chỗ (Iterate in place).** Nói với AI điều gì sai ("phạm vi quá rộng, loại bỏ các tính năng quản trị") và để nó sửa. Đây là cách rẻ nhất và thường là đúng đắn.
- **Khám phá trước, sau đó đề xuất lại.** Nếu vấn đề là bản thân ý tưởng chưa rõ ràng, hãy lùi lại đến `/opsx:explore`, suy nghĩ kỹ lưỡng, và để một đề xuất sắc nét hơn xuất hiện từ đó. Xem [Explore First](explore.md).
- **Bắt đầu mới.** Nếu ý định đã thay đổi căn bản, một thay đổi mới có thể rõ ràng hơn là vá (patch) cái cũ.

Hành động cuối cùng này có hướng dẫn quyết định riêng, tiếp theo.

## Khi nào nên cập nhật so với bắt đầu một thay đổi mới

Tóm tắt ngắn gọn: **cập nhật khi đó là công việc tương tự được tinh chỉnh; bắt đầu mới khi ý định đã thay đổi căn bản hoặc phạm vi đã bùng nổ thành các công việc khác nhau.**

- Cùng mục tiêu, phương pháp tốt hơn? Cập nhật.
- Thu hẹp phạm vi (triển khai MVP trước, phần còn lại sau)? Cập nhật, sau đó lưu trữ, rồi một thay đổi mới cho giai đoạn hai.
- Bản thân vấn đề đã thay đổi ("thêm chế độ tối" trở thành "xây dựng một hệ thống chủ đề hoàn chỉnh")? Thay đổi mới.

Có một biểu đồ quy trình đầy đủ và các ví dụ hoạt động trong [Workflows: When to Update vs Start Fresh](workflows.md#when-to-update-vs-start-fresh) và một sự phân tích sâu hơn trong [OPSX: When to Update vs. Start Fresh](opsx.md#when-to-update-vs-start-fresh).

## Lưu ý về các nhiệm vụ (tasks)

`tasks.md` là một danh sách kiểm tra sống động, không phải là một kế hoạch cố định. Khi bạn triển khai, bạn có thể thêm các tác vụ mà bạn phát hiện ra, loại bỏ những cái đã thấy không cần thiết, hoặc sắp xếp lại chúng. AI sẽ đánh dấu hoàn thành khi nó thực hiện chúng trong quá trình `/opsx:apply`, và nó sẽ tiếp tục từ nhiệm vụ chưa được kiểm tra đầu tiên nếu bạn quay lại sau. Việc chỉnh sửa danh sách giữa chừng là điều được mong đợi.

## Nên đi đâu tiếp theo

- [Workflows](workflows.md) - các mẫu, cộng với hướng dẫn quyết định cập nhật so với mới
- [Explore First](explore.md) - nơi để lùi lại khi một ý tưởng cần được suy nghĩ lại
- [Commands](commands.md) - `/opsx:continue`, `/opsx:apply`, và `/opsx:verify` chi tiết
- [Concepts: Artifacts](concepts.md#artifacts) - mỗi tài sản dùng để làm gì