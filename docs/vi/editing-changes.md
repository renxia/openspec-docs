# Chỉnh sửa & Lặp lại một Thay đổi

**Mọi artifact trong một thay đổi chỉ đơn giản là tệp Markdown mà bạn có thể chỉnh sửa bất cứ lúc nào.** Không có "giai đoạn lập kế hoạch" bị khóa, không có cổng phê duyệt, không có chế độ chỉnh sửa đặc biệt nào cần truy cập. Muốn thay đổi đề xuất sau khi bạn đã bắt đầu xây dựng? Mở `proposal.md` và chỉnh sửa nó. Nhận ra thiết kế sai giữa chừng quá trình triển khai? Sửa `design.md` và tiếp tục làm việc. Đó là toàn bộ câu trả lời, và điều này được thiết kế có chủ ý.

Trang này dành cho khoảnh khắc bạn tự hỏi "khoan, tôi có thể quay lại và thay đổi nó không?" Có. Dưới đây là cách thực hiện cho từng trường hợp phổ biến.

## Hai cách để chỉnh sửa bất cứ thứ gì

Bạn luôn có cả hai lựa chọn:

1. **Chỉnh sửa tệp trực tiếp.** Các artifact là tệp Markdown thuần nằm trong thư mục `openspec/changes/<name>/`. Mở `proposal.md`, `design.md`, `tasks.md`, hoặc delta spec nằm trong thư mục `specs/` bằng trình soạn thảo của bạn và chỉnh sửa nó. Không cần thực hiện thêm thao tác nào khác.

2. **Yêu cầu AI của bạn chỉnh sửa lại.** Trong cuộc trò chuyện, chỉ cần nói những gì bạn muốn: "Cập nhật đề xuất để loại bỏ ý tưởng bộ nhớ đệm và thêm phần giới hạn tốc độ," hoặc "thiết kế nên sử dụng hàng đợi, không phải polling." AI sẽ chỉnh sửa artifact thay cho bạn, sử dụng toàn bộ nội dung của thay đổi hiện tại làm ngữ cảnh.

Sử dụng cách nào phù hợp với tình huống của bạn. Chỉnh sửa nhỏ về cách diễn đạt? Chỉnh sửa tệp trực tiếp. Tư duy lại toàn bộ nội dung có ý nghĩa? Để AI chỉnh sửa lại với đầy đủ ngữ cảnh.

## "Làm thế nào để cập nhật đề xuất (hoặc thông số kỹ thuật) sau khi tôi đã bắt đầu?"

Chỉ cần cập nhật nó. Cùng một thay đổi, được tinh chỉnh thêm.

Nếu bạn đang sử dụng các lệnh mở rộng, luồng làm việc tự nhiên là: chỉnh sửa artifact, sau đó chạy `/opsx:continue` để tiếp tục từ trạng thái mới, hoặc `/opsx:apply` để tiếp tục triển khai dựa trên kế hoạch đã cập nhật. Nếu bạn đang sử dụng các lệnh `core` mặc định, chỉnh sửa artifact và chạy `/opsx:apply`; lệnh này sẽ đọc các tệp hiện tại, do đó nó sẽ xây dựng dựa trên nội dung hiện tại của các artifact.

Mô hình tư duy: các artifact là kế hoạch hoạt động thực tế, không phải hợp đồng đã ký. AI luôn làm việc dựa trên nội dung hiện tại của chúng, do đó chỉnh sửa chúng sẽ định hướng công việc.

```text
Bạn: Tôi muốn thay đổi cách tiếp cận trong thay đổi này.

Bạn: [chỉnh sửa design.md, hoặc nói với AI:]
     Cập nhật design.md để sử dụng tác vụ nền thay vì cuộc gọi đồng bộ.

AI:  Đã cập nhật design.md. Danh sách nhiệm vụ vẫn phù hợp; bạn có muốn tôi tiếp tục triển khai không?

Bạn: /opsx:apply
```

Điều này trả lời một câu hỏi rất phổ biến: không có lệnh "cập nhật đề xuất" riêng biệt vì bạn không cần đến nó. Tệp là nguồn thông tin chính xác duy nhất, và chỉnh sửa nó (bằng tay hoặc thông qua AI) chính là thao tác cập nhật.

## "Làm thế nào để quay lại xem xét sau khi triển khai?"

Bạn không cần phải "quay lại", vì bạn chưa bao giờ rời đi. Luồng làm việc rất linh hoạt: xem xét, chỉnh sửa và triển khai không phải là các giai đoạn tuần tự mà bạn bị mắc kẹt trong đó.

Cụ thể, sau một số lần chạy `/opsx:apply` để triển khai:
- Muốn xem xét lại kế hoạch? Mở các artifact và đọc chúng, hoặc chạy lệnh `openspec show <change>` trong terminal của bạn để xem gộp toàn bộ nội dung.
- Tìm thấy thứ gì đó cần thay đổi? Chỉnh sửa artifact (hoặc yêu cầu AI chỉnh sửa), sau đó tiếp tục làm việc.
- Muốn kiểm tra có cấu trúc rằng mã nguồn khớp với kế hoạch? Chạy `/opsx:verify` (lệnh mở rộng). Lệnh này báo cáo mức độ đầy đủ, tính chính xác và sự nhất quán mà không chặn bất kỳ thao tác nào. Xem [Luồng làm việc: Xác minh](workflows.md#verify-check-your-work).

Không có "giai đoạn xem xét" nào để quay lại, vì việc xem xét là thứ bạn có thể thực hiện bất cứ lúc nào, kể cả sau khi triển khai xong.

## "Tôi đã chỉnh sửa mã nguồn bằng tay. Làm thế nào để đồng bộ hóa điều đó với OpenSpec?"

Việc này xảy ra thường xuyên và hoàn toàn bình thường. Bạn đã điều chỉnh thứ gì đó trong trình soạn thảo của mình, và giờ đây mã nguồn và các artifact không khớp với nhau. Đồng bộ hóa chúng trở lại theo hướng phù hợp với thực tế:
- **Mã nguồn hiện tại là chính xác, thông số kỹ thuật đã lỗi thời.** Cập nhật delta spec (và các nhiệm vụ trong `tasks.md`, nếu liên quan) để mô tả hành vi mà bạn thực sự đã phát hành. Thông số kỹ thuật phải khớp với thực tế trước khi bạn thực hiện archive, vì thao tác archive sẽ hợp nhất thông số kỹ thuật vào nguồn thông tin chính xác của bạn.
- **Thông số kỹ thuật là chính xác, mã nguồn bị lệch.** Tiếp tục xây dựng hoặc sửa lỗi cho đến khi mã nguồn khớp với thông số kỹ thuật.

Cách nhanh để phát hiện sự không khớp là chạy `/opsx:verify`: lệnh này sẽ đọc các artifact và mã nguồn của bạn, sau đó thông báo những điểm mà chúng khác nhau. Coi kết quả trả về như một danh sách việc cần làm để đồng bộ hóa, sau đó thực hiện archive khi chúng đã khớp với nhau.

Nguyên tắc: tại thời điểm thực hiện archive, các thông số kỹ thuật của bạn sẽ trở thành dữ liệu gốc chính xác. Do đó trước khi archive, hãy đảm bảo các thông số kỹ thuật phản ánh đúng những gì mã nguồn thực sự làm. Các chỉnh sửa thủ công đều được chào đón; chỉ cần không để chúng làm cho thông số kỹ thuật bị lệch mà không phát hiện.

## Tinh chỉnh đề xuất mà bạn không hài lòng

Nếu đề xuất được tạo ra không đúng ý bạn, bạn có ba lựa chọn phù hợp:
- **Lặp lại tại chỗ.** Nói cho AI biết điểm nào không đúng ("phạm vi quá rộng, loại bỏ các tính năng dành cho quản trị viên") và để nó chỉnh sửa lại. Cách này tốn ít chi phí nhất và thường đúng hướng.
- **Khám phá trước, sau đó tạo đề xuất lại.** Nếu vấn đề là ý tưởng ban đầu còn chưa rõ ràng, hãy quay lại sử dụng `/opsx:explore`, suy nghĩ kỹ về nó, và để một đề xuất rõ ràng hơn ra đời từ đó. Xem [Khám phá trước](explore.md).
- **Bắt đầu lại từ đầu.** Nếu mục tiêu đã thay đổi cơ bản, một thay đổi mới có thể rõ ràng hơn là sửa chữa thay đổi cũ.

Lựa chọn cuối cùng này có hướng dẫn quyết định riêng, ở phần tiếp theo.

## Khi nào nên cập nhật thay đổi hiện tại và khi nào nên bắt đầu thay đổi mới

Phiên bản ngắn gọn: **cập nhật khi đó là cùng một công việc được tinh chỉnh; bắt đầu thay đổi mới khi mục tiêu đã thay đổi cơ bản hoặc phạm vi đã mở rộng thành các công việc hoàn toàn khác.**

- Cùng mục tiêu, cách tiếp cận tốt hơn? Cập nhật thay đổi hiện tại.
- Thu hẹp phạm vi (phát hành phiên bản MVP ngay bây giờ, các tính năng khác sau)? Cập nhật thay đổi hiện tại, sau đó archive, sau đó tạo thay đổi mới cho giai đoạn hai.
- Vấn đề bản thân đã thay đổi ("thêm chế độ tối" trở thành "xây dựng hệ thống chủ đề hoàn chỉnh")? Tạo thay đổi mới.

Bạn có thể xem sơ đồ quy trình đầy đủ và các ví dụ thực tế tại [Luồng làm việc: Khi nào cập nhật thay đổi hiện tại và khi nào bắt đầu lại từ đầu](workflows.md#when-to-update-vs-start-fresh), và nội dung phân tích sâu hơn tại [OPSX: Khi nào cập nhật thay đổi hiện tại và khi nào bắt đầu lại từ đầu](opsx.md#when-to-update-vs-start-fresh).

## Lưu ý về các nhiệm vụ

`tasks.md` là danh sách kiểm tra sống động, không phải kế hoạch cố định. Trong quá trình triển khai, bạn có thể thêm các nhiệm vụ phát hiện ra, xóa các nhiệm vụ hóa ra không cần thiết, hoặc sắp xếp lại thứ tự chúng. AI sẽ đánh dấu hoàn thành các mục khi thực hiện xong trong quá trình chạy `/opsx:apply`, và sẽ tiếp tục từ mục chưa được đánh dấu đầu tiên nếu bạn quay lại sau. Việc chỉnh sửa danh sách giữa chừng quá trình làm việc là điều hoàn toàn dự kiến.

## Tài liệu tham khảo tiếp theo

- [Luồng làm việc](workflows.md) - các mẫu quy trình, cộng với hướng dẫn quyết định cập nhật hay tạo mới
- [Xem xét một thay đổi](reviewing-changes.md) - bước kiểm tra nhanh 2 phút cho kế hoạch trước khi bạn xây dựng
- [Khám phá trước](explore.md) - nơi bạn có thể lùi lại suy nghĩ khi một ý tưởng cần được xem xét lại
- [Lệnh](commands.md) - giải thích chi tiết về `/opsx:continue`, `/opsx:apply` và `/opsx:verify`
- [Khái niệm: Artifacts](concepts.md#artifacts) - mục đích của từng artifact