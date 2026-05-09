# Quy trình làm việc

Hướng dẫn này đề cập đến các mẫu quy trình làm việc phổ biến cho OpenSpec và thời điểm sử dụng từng mẫu. Để thiết lập cơ bản, xem [Bắt đầu](getting-started.md). Để tham khảo lệnh, xem [Các lệnh](commands.md).

## Triết lý: Hành động, không phải giai đoạn

Các quy trình làm việc truyền thống bắt buộc bạn phải tuân theo các giai đoạn: lập kế hoạch, sau đó triển khai, rồi hoàn thành. Nhưng công việc thực tế không phù hợp với những khuôn mẫu cứng nhắc như vậy.

OPSX tiếp cận theo một cách khác:

```text
Truyền thống (khóa theo giai đoạn):

  LẬP KẾ HOẠCH ────────► TRIỂN KHAI ────────► HOÀN THÀNH
      │                    │
      │   "Không thể quay lại"  │
      └────────────────────┘

OPSX (hành động linh hoạt):

  đề xuất ──► đặc tả ──► thiết kế ──► tác vụ ──► triển khai
```

**Các nguyên tắc chính:**

- **Hành động, không phải giai đoạn** - Các lệnh là những việc bạn có thể làm, không phải là các giai đoạn bạn bị mắc kẹt
- **Các phụ thuộc là yếu tố kích hoạt** - Chúng cho thấy điều gì là khả thi, không phải điều gì là bắt buộc tiếp theo

> **Tùy chỉnh:** Các quy trình làm việc của OPSX được điều khiển bởi các lược đồ (schemas) xác định trình tự các sản phẩm (artifacts). Xem [Tùy chỉnh](customization.md) để biết chi tiết về việc tạo lược đồ tùy chỉnh.

## Hai Chế độ

### Đường dẫn nhanh mặc định (profile `core`)

Cài đặt mới mặc định sử dụng `core`, cung cấp:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Luồng công việc điển hình:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
```

### Quy trình làm việc Mở rộng/Đầy đủ (tùy chọn tùy chỉnh)

Nếu bạn muốn các lệnh scaffold-and-build rõ ràng (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), hãy bật chúng với:

```bash
openspec config profile
openspec update
```

## Các Mẫu Quy trình (Chế độ Mở rộng)

### Tính năng nhanh

Khi bạn biết rõ mình muốn xây dựng gì và chỉ cần thực thi:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Ví dụ hội thoại:**

```text
Bạn: /opsx:new add-logout-button

AI:  Đã tạo openspec/changes/add-logout-button/
     Sẵn sàng tạo: proposal

Bạn: /opsx:ff

AI:  Đang tạo tất cả các thành phần quy hoạch...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Sẵn sàng cho triển khai!

Bạn: /opsx:apply

AI:  Đang thực hiện các công việc...
     ✓ Đã thêm nút đăng xuất vào header
     ✓ Đã triển khai việc xóa session
     ✓ Đã thêm hộp thoại xác nhận
     Tất cả công việc đã hoàn thành!

Bạn: /opsx:archive

AI:  ✓ Đã hợp nhất specs
     ✓ Đã lưu trữ thay đổi
```

**Phù hợp nhất cho:** Các tính năng nhỏ đến vừa, sửa lỗi, các thay đổi đơn giản.

### Thám hiểm

Khi yêu cầu chưa rõ ràng hoặc bạn cần điều tra trước:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Ví dụ hội thoại:**

```text
Bạn: /opsx:explore

AI:  Bạn muốn thám hiểm điều gì?

Bạn: Tôi muốn cải thiện hiệu suất tải trang nhưng không chắc
     nút thắt cổ chai nằm ở đâu.

AI:  Hãy để tôi giúp điều tra...
     [Phân tích kích thước bundle, xác định các truy vấn chậm, xem xét
     các mẫu render component]

     Tôi đã tìm thấy ba nút thắt cổ chai chính:
     1. Hình ảnh lớn chưa được tối ưu hóa
     2. Lấy dữ liệu đồng bộ trong ProductList
     3. Render lại do thay đổi context

     Bạn muốn giải quyết vấn đề nào trước?

Bạn: Hãy giải quyết vấn đề lấy dữ liệu.

Bạn: /opsx:new optimize-product-list-fetching

AI:  Đã tạo thay đổi. Sẵn sàng tạo: proposal

Bạn: /opsx:continue

AI:  Đang tạo proposal dựa trên cuộc thám hiểm của chúng ta...
     [Viết proposal kết hợp các phát hiện từ cuộc điều tra]

     Sẵn sàng tạo: specs, design
     Bạn muốn cái nào tiếp theo?

Bạn: /opsx:continue

AI:  Đang tạo specs...
```

**Phù hợp nhất cho:** Tối ưu hóa hiệu suất, gỡ lỗi, quyết định kiến trúc, yêu cầu chưa rõ ràng.

### Thay đổi song song

Làm việc trên nhiều thay đổi cùng lúc:

```text
Thay đổi A: /opsx:new ──► /opsx:ff ──► /opsx:apply (đang tiến hành)
                                         │
                                    chuyển đổi ngữ cảnh
                                         │
Thay đổi B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Ví dụ hội thoại:**

```text
Bạn: Tôi đang làm việc trên add-dark-mode nhưng bị kéo vào sửa một lỗi

Bạn: /opsx:new fix-login-redirect

AI:  Đã tạo openspec/changes/fix-login-redirect/

Bạn: /opsx:ff

AI:  ✓ Đã tạo các thành phần quy hoạch

Bạn: /opsx:apply

AI:  Đang làm việc trên fix-login-redirect...
     [Triển khai bản sửa lỗi]
     Tất cả công việc đã hoàn thành!

Bạn: /opsx:archive

AI:  ✓ Đã lưu trữ fix-login-redirect

Bạn: Hãy quay lại chế độ tối

Bạn: /opsx:apply add-dark-mode

AI:  Tiếp tục add-dark-mode...
     Tiếp tục từ công việc 2.3: Cập nhật Header...
```

**Phù hợp nhất cho:** Các luồng công việc song song, gián đoạn khẩn cấp, cộng tác nhóm.

Khi bạn có nhiều thay đổi đã hoàn thành, hãy sử dụng `/opsx:bulk-archive`:

```text
Bạn: /opsx:bulk-archive

AI:  Tìm thấy 3 thay đổi đã hoàn thành:
     - add-dark-mode (tất cả công việc đã xong)
     - fix-login-redirect (tất cả công việc đã xong)
     - update-footer (tất cả công việc đã xong)

     Kiểm tra xung đột specs...
     ⚠ add-dark-mode và update-footer đều chạm vào specs/ui/

     Kiểm tra codebase để giải quyết...
     Cả hai thay đổi đều đã được triển khai. Sẽ áp dụng theo thứ tự thời gian.

     Lưu trữ tất cả 3 thay đổi?

Bạn: Có

AI:  ✓ Đã lưu trữ add-dark-mode
     ✓ Đã lưu trữ fix-login-redirect
     ✓ Đã lưu trữ update-footer
     Specs đã được hợp nhất theo thứ tự: add-dark-mode → update-footer
```

Lưu trữ hàng loạt phát hiện khi nhiều thay đổi chạm vào cùng specs và giải quyết xung đột bằng cách kiểm tra những gì thực sự đã được triển khai.

### Hoàn thành một Thay đổi

Luồng hoàn thành được khuyến nghị:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              xác thực          nhắc đồng bộ
              triển khai       nếu cần
```

#### Xác minh: Kiểm tra công việc của bạn

`/opsx:verify` xác thực triển khai so với các thành phần của bạn trên ba chiều:

```text
Bạn: /opsx:verify

AI:  Đang xác minh add-auth...

     TÍNH ĐẦY ĐỦ
     ✓ Tất cả 12 công việc trong tasks.md đã được đánh dấu
     ✓ Tất cả yêu cầu trong specs đều có mã tương ứng
     ⚠ Kịch bản "Hết thời gian session sau khi không hoạt động" chưa được kiểm tra

     TÍNH CHÍNH XÁC
     ✓ Triển khai khớp với ý định của spec
     ✓ Các trường hợp biên từ kịch bản đã được xử lý
     ✓ Trạng thái lỗi khớp với định nghĩa spec

     TÍNH MẠCH LẠC
     ✓ Các quyết định thiết kế được phản ánh trong cấu trúc mã
     ✓ Quy ước đặt tên nhất quán với design.md
     ⚠ Thiết kế đề cập "event-driven" nhưng triển khai sử dụng polling

     TÓM TẮT
     ─────────────────────────────
     Vấn đề nghiêm trọng: 0
     Cảnh báo: 2
     Sẵn sàng lưu trữ: Có (có cảnh báo)

     Khuyến nghị:
     1. Thêm kiểm thử cho kịch bản hết thời gian session
     2. Cân nhắc tái cấu trúc sang event-driven như đã thiết kế, hoặc cập nhật design.md
```

**Những gì xác minh kiểm tra:**

| Chiều | Những gì nó xác thực |
|-------|----------------------|
| Tính đầy đủ | Tất cả công việc đã xong, tất cả yêu cầu đã triển khai, kịch bản được bao phủ |
| Tính chính xác | Triển khai khớp với ý định spec, các trường hợp biên được xử lý |
| Tính mạch lạc | Các quyết định thiết kế được phản ánh trong mã, các mẫu nhất quán |

Xác minh sẽ không chặn lưu trữ, nhưng nó sẽ nêu ra các vấn đề bạn có thể muốn giải quyết trước.

#### Lưu trữ: Hoàn tất Thay đổi

`/opsx:archive` hoàn thành thay đổi và di chuyển nó vào kho lưu trữ:

```text
Bạn: /opsx:archive

AI:  Đang lưu trữ add-auth...

     Trạng thái thành phần:
     ✓ proposal.md tồn tại
     ✓ specs/ tồn tại
     ✓ design.md tồn tại
     ✓ tasks.md tồn tại (12/12 công việc hoàn thành)

     Delta specs: Chưa được đồng bộ vào main
     → Bạn có muốn đồng bộ ngay bây giờ không?

Bạn: Có

AI:  ✓ Đã đồng bộ specs vào openspec/specs/auth/spec.md
     ✓ Đã di chuyển vào openspec/changes/archive/2025-01-24-add-auth/

     Thay đổi đã được lưu trữ thành công.
```

Lưu trữ sẽ nhắc nếu specs chưa được đồng bộ. Nó sẽ không chặn các công việc chưa hoàn thành, nhưng nó sẽ cảnh báo bạn.

## Khi nào Sử dụng Cái gì

### `/opsx:ff` so với `/opsx:continue`

| Tình huống | Sử dụng |
|------------|---------|
| Yêu cầu rõ ràng, sẵn sàng xây dựng | `/opsx:ff` |
| Đang thám hiểm, muốn xem xét từng bước | `/opsx:continue` |
| Muốn lặp lại trên proposal trước khi tạo specs | `/opsx:continue` |
| Áp lực thời gian, cần di chuyển nhanh | `/opsx:ff` |
| Thay đổi phức tạp, muốn kiểm soát | `/opsx:continue` |

**Quy tắc chung:** Nếu bạn có thể mô tả toàn bộ phạm vi ngay từ đầu, hãy sử dụng `/opsx:ff`. Nếu bạn đang tìm hiểu trong quá trình làm, hãy sử dụng `/opsx:continue`.

### Khi nào Cập nhật so với Bắt đầu Mới

Một câu hỏi phổ biến: khi nào cập nhật một thay đổi hiện có là ổn, và khi nào bạn nên bắt đầu một cái mới?

**Cập nhật thay đổi hiện có khi:**

- Cùng ý định, thực thi được tinh chỉnh
- Phạm vi thu hẹp (MVP trước, phần còn lại sau)
- Các sửa đổi dựa trên học hỏi (codebase không như bạn mong đợi)
- Điều chỉnh thiết kế dựa trên các phát hiện triển khai

**Bắt đầu một thay đổi mới khi:**

- Ý định thay đổi cơ bản
- Phạm vi bùng nổ thành công việc hoàn toàn khác
- Thay đổi ban đầu có thể được đánh dấu "hoàn thành" độc lập
- Các bản vá sẽ gây nhầm lẫn hơn là làm rõ

```text
                     ┌─────────────────────────────────────┐
                     │     Đây có phải là cùng một công việc không? │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Cùng ý định?      >50% trùng lặp?      Có thể đánh dấu
          Cùng vấn đề?      Cùng phạm vi?        "hoàn thành" mà không
                 │                  │          có những thay đổi này?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      CÓ               KHÔNG CÓ           KHÔNG KHÔNG              CÓ
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    CẬP NHẬT          MỚI  CẬP NHẬT    MỚI  CẬP NHẬT          MỚI
```

**Ví dụ: "Thêm chế độ tối"**

- "Cũng cần hỗ trợ tùy chỉnh giao diện" → Thay đổi mới (phạm vi bùng nổ)
- "Phát hiện tùy chọn hệ thống khó hơn dự kiến" → Cập nhật (cùng ý định)
- "Hãy xuất bản nút chuyển đổi trước, thêm tùy chọn sau" → Cập nhật rồi lưu trữ, sau đó thay đổi mới

## Các Thực hành Tốt nhất

### Giữ các Thay đổi Tập trung

Một đơn vị logic công việc trên mỗi thay đổi. Nếu bạn đang "thêm tính năng X và đồng thời tái cấu trúc Y", hãy cân nhắc hai thay đổi riêng biệt.

**Tại sao nó quan trọng:**
- Dễ xem xét và hiểu hơn
- Lịch sử lưu trữ sạch hơn
- Có thể xuất bản độc lập
- Dễ dàng hoàn tác hơn nếu cần

### Sử dụng `/opsx:explore` cho các Yêu cầu Chưa Rõ ràng

Trước khi cam kết với một thay đổi, hãy khám phá không gian vấn đề:

```text
Bạn: /opsx:explore

AI:  Bạn muốn thám hiểm điều gì?

Bạn: Chúng ta nên xử lý giới hạn tốc độ cho API của mình như thế nào?

AI:  Hãy để tôi điều tra thiết lập hiện tại và các tùy chọn của bạn...
     [Nghiên cứu codebase, xem xét các mẫu]

     Tôi thấy ba cách tiếp cận chúng ta có thể thực hiện:
     1. Dựa trên middleware (đơn giản, theo từng endpoint)
     2. Hỗ trợ bởi Redis (có thể mở rộng, trạng thái dùng chung)
     3. Token bucket cho mỗi người dùng (công bằng, phức tạp)

     Ngăn xếp công nghệ hiện tại của bạn gợi ý #1 hoặc #2. Quy mô của bạn là bao nhiêu?
```

Thám hiểm làm rõ suy nghĩ trước khi bạn tạo các thành phần.

### Xác minh trước khi Lưu trữ

Sử dụng `/opsx:verify` để kiểm tra triển khai khớp với các thành phần:

```text
Bạn: /opsx:verify

AI:  Đang xác minh add-dark-mode...

     ✓ Tất cả công việc trong tasks.md đã được đánh dấu
     ✓ Các yêu cầu trong specs đều có mã tương ứng
     ✓ Các quyết định thiết kế được phản ánh trong triển khai

     Sẵn sàng lưu trữ!
```

Phát hiện sự không khớp trước khi bạn đóng thay đổi.

### Đặt tên Thay đổi Rõ ràng

Tên tốt làm cho `openspec list` hữu ích:

```text
Tên tốt:                         Tránh:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Tham Khảo Nhanh Lệnh

Để biết chi tiết đầy đủ về lệnh và các tùy chọn, xem [Lệnh](commands.md).

| Lệnh | Mục đích | Khi nào sử dụng |
|---------|---------|-------------|
| `/opsx:propose` | Tạo thay đổi + các tài liệu lập kế hoạch | Đường dẫn mặc định nhanh (profile `core`) |
| `/opsx:explore` | Suy nghĩ về các ý tưởng | Yêu cầu chưa rõ ràng, điều tra |
| `/opsx:new` | Bắt đầu một khung thay đổi | Chế độ mở rộng, kiểm soát tài liệu rõ ràng |
| `/opsx:continue` | Tạo tài liệu tiếp theo | Chế độ mở rộng, tạo tài liệu từng bước |
| `/opsx:ff` | Tạo tất cả tài liệu lập kế hoạch | Chế độ mở rộng, phạm vi rõ ràng |
| `/opsx:apply` | Triển khai các tác vụ | Sẵn sàng viết mã |
| `/opsx:verify` | Xác nhận triển khai | Chế độ mở rộng, trước khi lưu trữ |
| `/opsx:sync` | Hợp nhất các thông số kỹ thuật delta | Chế độ mở rộng, tùy chọn |
| `/opsx:archive` | Hoàn thành thay đổi | Tất cả công việc đã hoàn thành |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi | Chế độ mở rộng, công việc song song |

## Các Bước Tiếp Theo

- [Lệnh](commands.md) - Tham chiếu đầy đủ về lệnh với các tùy chọn
- [Khái niệm](concepts.md) - Tìm hiểu sâu về thông số kỹ thuật, tài liệu và lược đồ
- [Tùy chỉnh](customization.md) - Tạo quy trình làm việc tùy chỉnh