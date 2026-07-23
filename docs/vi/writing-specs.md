# Viết Đặc Tả Tốt

Bạn hiếm khi viết một đặc tả từ trang trắng. Bạn mô tả thay đổi bằng ngôn ngữ thông thường, lệnh `/opsx:propose` sẽ soạn thảo các yêu cầu và kịch bản, sau đó bạn chỉnh sửa chúng cho tốt. Trang này nói về phần cuối cùng đó — "tốt" là như thế nào, và cách điều hướng AI để đạt được kết quả đó.

Đây là tài liệu bổ sung cho [Xem xét Thay đổi](reviewing-changes.md): xem xét là tìm ra các điểm yếu trong bản nháp, còn viết đặc tả là biết một bản đặc tả tốt được tạo thành từ những gì.

## Đặc tả là hành vi, không phải mã nguồn

Đặc tả mô tả hệ thống của bạn *làm gì*, theo cách mà bất kỳ ai cũng có thể kiểm tra — không phải cách nó được xây dựng. Nó được cấu tạo từ **yêu cầu** (các mô tả hành vi) và **kịch bản** (các ví dụ cụ thể để chứng minh các yêu cầu đó).

```markdown
### Requirement: Session Timeout
The system SHALL expire a session after 30 minutes of inactivity.

#### Scenario: Idle timeout
- GIVEN an authenticated session
- WHEN 30 minutes pass with no activity
- THEN the session is invalidated and the user must re-authenticate
```

Giữ phần *cách thực hiện* — hàng đợi, thư viện, lược đồ bảng — trong tệp `design.md` hoặc mã nguồn. Khi hành vi và cách triển khai được trộn lẫn vào cùng một yêu cầu, yêu cầu đó sẽ không còn có thể kiểm tra được và bắt đầu lỗi thời ngay khi mã nguồn thay đổi.

## Điều gì tạo nên một yêu cầu tốt

Một yêu cầu tốt là một hành vi duy nhất, được mô tả rõ ràng đến mức bạn có thể đưa cho người khác để kiểm tra.

- **Một mô tả, một `SHALL`/`MUST`.** Nếu một yêu cầu có ba mệnh đề "và cũng" thì thực chất đó là ba yêu cầu riêng biệt. Hãy tách chúng ra.
- **Có thể quan sát được.** Người không làm việc với mã nguồn cũng có thể xác định xem yêu cầu đó có được đáp ứng hay không. "Hệ thống SHALL hiển thị biển báo lỗi khi tải lên vượt quá 10 MB" là có thể quan sát được. "Hệ thống SHALL xử lý các tệp tải lên lớn một cách mượt mà" thì không.
- **Độ mạnh phù hợp.** OpenSpec sử dụng các từ khóa theo RFC 2119, và chúng có ý nghĩa khác nhau:

  | Từ khóa | Ý nghĩa |
  |---------|---------|
  | `MUST` / `SHALL` | Yêu cầu bắt buộc. Không thể thỏa hiệp. |
  | `SHOULD` | Khuyến nghị mạnh mẽ, có thể ngoại lệ nếu có lý do chính đáng. |
  | `MAY` | Hoàn toàn tùy chọn. |

  Mặc định hãy sử dụng `MUST`/`SHALL`. Chỉ dùng `SHOULD` khi bạn thực sự muốn nói "trừ khi có lý do chính đáng để không làm vậy".

Cách kiểm tra một yêu cầu: *một người kiểm tra chưa từng xem mã nguồn có thể xác định yêu cầu đó có đạt hay không không?* Nếu không, yêu cầu đó cần được làm rõ hơn.

## Điều gì tạo nên một kịch bản tốt

Kịch bản là nơi yêu cầu chứng minh được giá trị của mình. Mỗi kịch bản là một bộ GIVEN / WHEN / THEN cụ thể, có thể được chuyển thành bài kiểm tra tự động.

- **Nó kiểm tra đúng yêu cầu liên quan.** Một kịch bản chỉ lặp lại yêu cầu bằng cách khác thì không kiểm tra được gì cả. Hãy biến nó thành một tình huống cụ thể với kết quả cụ thể.
- **Đảm bảo các trường hợp quan trọng, không chỉ đường đi lý tưởng.** Đăng nhập hợp lệ rất dễ. Nhập trống, token hết hạn, nhấp lần thứ hai, những lỗi xảy ra — đó là nơi lỗi tồn tại, và là nơi kịch bản có giá trị nhất.
- **Đặt tên trường hợp trong tiêu đề.** "Kịch bản: Từ chối token hết hạn" cho người xem xét biết ngay nội dung được kiểm tra; còn "Kịch bản: Kiểm tra 2" thì không.

Thói quen hữu ích: trước khi phê duyệt, hãy tự hỏi *trường hợp nào tôi sẽ rất tiếc nếu bị lỗi?* — và đảm bảo có một kịch bản đề cập đến trường hợp đó.

## Chọn loại delta phù hợp

Một thay đổi mô tả các chỉnh sửa của nó đối với đặc tả bằng ba loại phần. Sử dụng đúng loại phần giúp các đặc tả đã lưu trữ của bạn luôn chính xác:

- **`## ADDED Requirements`** — hành vi hoàn toàn mới, chưa từng tồn tại trước đây.
- **`## MODIFIED Requirements`** — hành vi đã tồn tại trước và đang thay đổi. Hãy đưa ra phiên bản mới đầy đủ; một ghi chú ngắn về những gì thay đổi sẽ giúp người xem xét dễ dàng hơn.
- **`## REMOVED Requirements`** — hành vi đang bị loại bỏ, kèm theo lý do loại bỏ.

Khi lưu trữ, phần ADDED sẽ được thêm vào cuối đặc tả chính, phần MODIFIED sẽ thay thế phiên bản cũ, và phần REMOVED sẽ bị xóa. Nếu bạn đánh dấu một thay đổi thực tế là ADDED, bạn sẽ kết thúc với hai yêu cầu mâu thuẫn; nếu bạn mô tả hành vi mới là MODIFIED, sẽ không có gì để thay thế. Khi không chắc chắn, hãy mở đặc tả hiện tại và kiểm tra xem yêu cầu đó đã tồn tại chưa.

## Chọn kích thước thay đổi phù hợp

Lỗi phổ biến nhất khi soạn thảo không phải là yêu cầu diễn đạt kém — mà là một thay đổi đang cố gắng làm việc của ba thay đổi khác.

**Một thay đổi tốt chỉ có một mục đích bạn có thể nói trong một câu.** "Thêm nút chuyển đổi chế độ tối." "Giới hạn tốc độ cho điểm cuối đăng nhập." "Di chuyển phiên làm việc ra khỏi cookie." Nếu việc mô tả thay đổi cần rất nhiều "và cũng", đó là dấu hiệu bạn cần tách nó ra.

Dấu hiệu một thay đổi quá lớn:
- Phạm vi của đề xuất trông giống như một danh sách các tính năng không liên quan đến nhau.
- Xem xét nó sẽ mất cả buổi chiều, nên không ai làm cả.
- Hai người không thể làm việc cùng nhau trên nó mà không xảy ra xung đột.
- Nửa số nhiệm vụ có thể được phát hành độc lập.

Các thay đổi nhỏ hơn dễ xem xét hơn, dễ xây dựng trong một phiên làm việc tập trung, và dễ phân tích hơn sáu tháng sau khi chỉ còn lại bản lưu trữ. Bạn luôn có thể thực hiện nhiều thay đổi song song — xem [Chỉnh sửa & lặp lại](editing-changes.md) và [Quy trình làm việc](workflows.md).

Trường hợp ngược lại cũng xảy ra: sửa lỗi chính tả chỉ một dòng không cần ba yêu cầu và tài liệu thiết kế. Hãy phù hợp mức độ nghiêm ngặt của quy trình với mức độ rủi ro của thay đổi.

## Cách điều hướng AI để tạo bản nháp tốt

Vì lệnh `/opsx:propose` tạo bản nháp đầu tiên, chất lượng kết quả bạn nhận được phụ thuộc vào chất lượng thông tin bạn cung cấp cho nó. Bạn không cần viết yêu cầu bằng tay — bạn chỉ cần điều hướng AI một cách chính xác:

- **Nêu rõ mục đích và phạm vi.** *"Thêm nút chuyển đổi chế độ tối, tự động theo cài đặt hệ điều hành khi tải lần đầu — không được chỉnh sửa API chủ đề hiện có."* Phần ngoài phạm vi cũng quan trọng không kém phần trong phạm vi.
- **Nêu rõ các trường hợp bạn quan tâm.** *"Đảm bảo có kịch bản cho người dùng đã tự chọn chủ đề thủ công."* AI sẽ bao quát những gì bạn chỉ định.
- **Sau đó chỉnh sửa.** Đây là Markdown thuần. Làm rõ các `SHALL` mơ hồ, xóa các kịch bản không kiểm tra được gì, thêm các trường hợp nó bỏ sót — hoặc yêu cầu AI làm điều đó: *"yêu cầu về thời gian chờ mơ hồ, hãy cố định thành 30 phút."*

Soạn nháp, làm rõ, lặp lại. Vài vòng lặp như vậy sẽ tạo ra một đặc tả bạn có thể tin tưởng, đó chính là mục đích cuối cùng.

## Danh sách kiểm tra nhanh

- [ ] Mỗi yêu cầu là một hành vi có thể quan sát được, đi kèm với `SHALL`/`MUST`.
- [ ] Không có chi tiết triển khai nào được nhúng vào trong các yêu cầu.
- [ ] Mỗi yêu cầu có ít nhất một kịch bản thực sự kiểm tra nó.
- [ ] Các trường hợp biên và lỗi quan trọng đều có kịch bản riêng, không chỉ có đường đi lý tưởng.
- [ ] Các delta sử dụng ADDED / MODIFIED / REMOVED đúng cách so với đặc tả hiện tại.
- [ ] Toàn bộ thay đổi chỉ có một mục đích bạn có thể nêu trong một câu.

## Tài liệu tham khảo tiếp theo

- [Xem xét Thay đổi](reviewing-changes.md) — bước kiểm tra nhanh 2 phút để tìm ra những điểm bị bỏ sót.
- [Khái niệm cốt lõi](concepts.md) — mô hình sâu hơn đằng sau đặc tả, thay đổi và delta.
- [Ví dụ & Công thức](examples.md) — các thay đổi thực tế từ đầu đến cuối.