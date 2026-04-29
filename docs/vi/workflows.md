# Quy trình làm việc

Hướng dẫn này trình bày các mô hình quy trình làm việc phổ biến cho OpenSpec và thời điểm sử dụng từng mô hình. Để biết cách thiết lập cơ bản, xem phần [Bắt đầu](getting-started.md). Để tham khảo lệnh, xem phần [Lệnh](commands.md).

## Triết lý: Hành động, không phải giai đoạn

Các quy trình truyền thống bắt bạn phải tuân theo các giai đoạn: lập kế hoạch, sau đó triển khai, rồi hoàn thành. Nhưng công việc thực tế không phù hợp một cách gọn gàng vào các khuôn khổ như vậy.

OPSX tiếp cận theo một cách khác:

```text
Truyền thống (bị khóa theo giai đoạn):

  LẬP KẾ HOẠCH ────────► TRIỂN KHAI ────────► HOÀN THÀNH
      │                    │
      │   "Không thể quay lại"  │
      └────────────────────┘

OPSX (các hành động linh hoạt):

  đề xuất ──► thông số kỹ thuật ──► thiết kế ──► nhiệm vụ ──► triển khai
```

**Các nguyên tắc chính:**

- **Hành động, không phải giai đoạn** - Các lệnh là những việc bạn có thể làm, không phải những giai đoạn mà bạn bị mắc kẹt
- **Các phụ thuộc là yếu tố hỗ trợ** - Chúng chỉ ra những gì khả thi, không phải những gì bắt buộc phải làm tiếp theo

> **Tùy chỉnh:** Các quy trình OPSX được điều khiển bởi các lược đồ định trình tự các sản phẩm. Xem phần [Tùy chỉnh](customization.md) để biết chi tiết về cách tạo các lược đồ tùy chỉnh.

## Hai Chế độ

### Đường dẫn nhanh mặc định (hồ sơ `core`)

Cài đặt mới mặc định sử dụng `core`, cung cấp:
- `/opsx:propose`
- `/opsx:explore`
- `/opsx:apply`
- `/opsx:archive`

Luồng thông thường:

```text
/opsx:propose ──► /opsx:apply ──► /opsx:archive
```

### Luồng mở rộng/đầy đủ (lựa chọn tùy chỉnh)

Nếu bạn muốn có các lệnh tạo khung và xây dựng rõ ràng (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), hãy kích hoạt chúng bằng:

```bash
openspec config profile
openspec update
```

## Các mẫu luồng (Chế độ Mở rộng)

### Tính năng nhanh

Khi bạn biết mình muốn xây dựng gì và chỉ cần thực thi:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Ví dụ hội thoại:**

```text
You: /opsx:new add-logout-button

AI:  Đã tạo openspec/changes/add-logout-button/
     Sẵn sàng tạo: proposal

You: /opsx:ff

AI:  Đang tạo tất cả các artifact lập kế hoạch...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Sẵn sàng để triển khai!

You: /opsx:apply

AI:  Đang thực hiện các nhiệm vụ...
     ✓ Đã thêm nút đăng xuất vào header
     ✓ Đã triển khai việc xóa session
     ✓ Đã thêm hộp thoại xác nhận
     Tất cả các nhiệm vụ đã hoàn thành!

You: /opsx:archive

AI:  ✓ Đã hợp nhất specs
     ✓ Đã lưu trữ thay đổi
```

**Tốt nhất cho:** Các tính năng nhỏ đến trung bình, sửa lỗi, thay đổi đơn giản.

### Khám phá

Khi yêu cầu không rõ ràng hoặc bạn cần điều tra trước:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Ví dụ hội thoại:**

```text
You: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

You: Tôi muốn cải thiện hiệu suất tải trang nhưng không chắc
     bottleneck ở đâu.

AI:  Để tôi giúp điều tra...
     [Phân tích kích thước bundle, xác định các truy vấn chậm, xem xét
     các mẫu render component]

     Tôi đã tìm thấy ba bottleneck chính:
     1. Hình ảnh lớn chưa được tối ưu hóa
     2. Lấy dữ liệu đồng bộ trong ProductList
     3. Render lại do thay đổi context

     Bạn muốn giải quyết vấn đề nào trước?

You: Hãy giải quyết vấn đề lấy dữ liệu trước.

You: /opsx:new optimize-product-list-fetching

AI:  Đã tạo thay đổi. Sẵn sàng tạo: proposal

You: /opsx:continue

AI:  Đang tạo proposal dựa trên khám phá của chúng ta...
     [Viết proposal kết hợp các phát hiện từ điều tra]

     Sẵn sàng tạo: specs, design
     Bạn muốn tạo cái nào tiếp theo?

You: /opsx:continue

AI:  Đang tạo specs...
```

**Tốt nhất cho:** Tối ưu hóa hiệu suất, gỡ lỗi, quyết định kiến trúc, yêu cầu không rõ ràng.

### Thay đổi song song

Làm việc trên nhiều thay đổi cùng lúc:

```text
Thay đổi A: /opsx:new ──► /opsx:ff ──► /opsx:apply (đang thực hiện)
                                         │
                                    chuyển ngữ cảnh
                                         │
Thay đổi B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Ví dụ hội thoại:**

```text
You: Tôi đang làm add-dark-mode nhưng bị gọi đi sửa lỗi

You: /opsx:new fix-login-redirect

AI:  Đã tạo openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Đã tạo các artifact lập kế hoạch

You: /opsx:apply

AI:  Đang làm fix-login-redirect...
     [Triển khai bản sửa lỗi]
     Tất cả các nhiệm vụ đã hoàn thành!

You: /opsx:archive

AI:  ✓ Đã lưu trữ fix-login-redirect

You: Quay lại làm dark mode thôi

You: /opsx:apply add-dark-mode

AI:  Đang tiếp tục add-dark-mode...
     Tiếp tục tại nhiệm vụ 2.3: Cập nhật Header...
```

**Tốt nhất cho:** Các luồng công việc song song, gián đoạn khẩn cấp, cộng tác nhóm.

Khi bạn có nhiều thay đổi đã hoàn thành, sử dụng `/opsx:bulk-archive`:

```text
You: /opsx:bulk-archive

AI:  Tìm thấy 3 thay đổi đã hoàn thành:
     - add-dark-mode (tất cả nhiệm vụ xong)
     - fix-login-redirect (tất cả nhiệm vụ xong)
     - update-footer (tất cả nhiệm vụ xong)

     Kiểm tra xung đột specs...
     ⚠ add-dark-mode và update-footer đều chạm vào specs/ui/

     Đang kiểm tra codebase để giải quyết...
     Cả hai thay đổi đều đã triển khai. Sẽ áp dụng theo thứ tự thời gian.

     Lưu trữ tất cả 3 thay đổi?

You: Có

AI:  ✓ Đã lưu trữ add-dark-mode
     ✓ Đã lưu trữ fix-login-redirect
     ✓ Đã lưu trữ update-footer
     Specs đã hợp nhất theo thứ tự: add-dark-mode → update-footer
```

Lưu trữ hàng loạt phát hiện khi nhiều thay đổi chạm vào cùng một specs và giải quyết xung đột bằng cách kiểm tra những gì thực sự đã được triển khai.

### Hoàn thành một thay đổi

Luồng hoàn thành được khuyến nghị:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              kiểm tra          nhắc nhở đồng bộ
              triển khai        nếu cần
```

#### Verify: Kiểm tra công việc của bạn

`/opsx:verify` kiểm tra việc triển khai so với các artifact của bạn trên ba chiều:

```text
You: /opsx:verify

AI:  Đang kiểm tra add-auth...

     ĐẦY ĐỦ
     ✓ Tất cả 12 nhiệm vụ trong tasks.md đã được đánh dấu
     ✓ Tất cả yêu cầu trong specs đều có code tương ứng
     ⚠ Kịch bản "Session timeout after inactivity" chưa được kiểm tra

     CHÍNH XÁC
     ✓ Triển khai phù hợp với ý định spec
     ✓ Các trường hợp biên từ kịch bản đã được xử lý
     ✓ Các trạng thái lỗi khớp với định nghĩa spec

     NHẤT QUÁN
     ✓ Các quyết định thiết kế được phản ánh trong cấu trúc code
     ✓ Quy tắc đặt tên nhất quán với design.md
     ⚠ Thiết kế đề cập "event-driven" nhưng triển khai sử dụng polling

     TÓM TẮT
     ─────────────────────────────
     Vấn đề nghiêm trọng: 0
     Cảnh báo: 2
     Sẵn sàng lưu trữ: Có (với cảnh báo)

     Khuyến nghị:
     1. Thêm kiểm tra cho kịch bản session timeout
     2. Cân nhắc tái cấu trúc thành event-driven như thiết kế, hoặc cập nhật design.md
```

**Những gì verify kiểm tra:**

| Chiều | Những gì nó kiểm tra |
|-----------|------------------|
| Đầy đủ | Tất cả nhiệm vụ hoàn thành, tất cả yêu cầu được triển khai, kịch bản được bao phủ |
| Chính xác | Triển khai phù hợp với ý định spec, các trường hợp biên được xử lý |
| Nhất quán | Các quyết định thiết kế được phản ánh trong code, các mẫu nhất quán |

Verify sẽ không chặn việc lưu trữ, nhưng nó hiển thị các vấn đề bạn có thể muốn giải quyết trước.

#### Archive: Hoàn tất thay đổi

`/opsx:archive` hoàn thành thay đổi và chuyển nó vào lưu trữ:

```text
You: /opsx:archive

AI:  Đang lưu trữ add-auth...

     Trạng thái artifact:
     ✓ proposal.md tồn tại
     ✓ specs/ tồn tại
     ✓ design.md tồn tại
     ✓ tasks.md tồn tại (12/12 nhiệm vụ hoàn thành)

     Delta specs: Chưa được đồng bộ với nhánh chính
     → Bạn có muốn đồng bộ ngay bây giờ không?

You: Có

AI:  ✓ Đã đồng bộ specs đến openspec/specs/auth/spec.md
     ✓ Đã chuyển đến openspec/changes/archive/2025-01-24-add-auth/

     Đã lưu trữ thay đổi thành công.
```

Archive sẽ nhắc nhở nếu specs chưa được đồng bộ. Nó sẽ không chặn vì các nhiệm vụ chưa hoàn thành, nhưng nó sẽ cảnh báo bạn.

## Khi nào sử dụng cái gì

### `/opsx:ff` so với `/opsx:continue`

| Tình huống | Sử dụng |
|-----------|-----|
| Yêu cầu rõ ràng, sẵn sàng xây dựng | `/opsx:ff` |
| Đang khám phá, muốn xem xét từng bước | `/opsx:continue` |
| Muốn lặp lại proposal trước khi tạo specs | `/opsx:continue` |
| Áp lực thời gian, cần di chuyển nhanh | `/opsx:ff` |
| Thay đổi phức tạp, muốn kiểm soát | `/opsx:continue` |

**Nguyên tắc chung:** Nếu bạn có thể mô tả toàn bộ phạm vi ngay từ đầu, hãy sử dụng `/opsx:ff`. Nếu bạn đang tìm hiểu dần dần, hãy sử dụng `/opsx:continue`.

### Khi nào cập nhật so với bắt đầu mới

Một câu hỏi phổ biến: khi nào việc cập nhật một thay đổi hiện tại là được, và khi nào bạn nên bắt đầu một thay đổi mới?

**Cập nhật thay đổi hiện tại khi:**

- Cùng ý định, thực thi được tinh chỉnh
- Phạm vi thu hẹp (MVP trước, phần còn lại sau)
- Sửa đổi dựa trên học hỏi (codebase không như bạn mong đợi)
- Điều chỉnh thiết kế dựa trên những phát hiện từ triển khai

**Bắt đầu thay đổi mới khi:**

- Ý định thay đổi cơ bản
- Phạm vi bùng nổ thành công việc hoàn toàn khác
- Thay đổi ban đầu có thể được đánh dấu "hoàn thành" độc lập
- Các bản vá sẽ gây nhầm lẫn hơn là làm rõ

```text
                     ┌─────────────────────────────────────┐
                     │     Đây có phải cùng một công việc? │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Cùng ý định?      >50% trùng lặp?      Thay đổi ban đầu
          Cùng vấn đề?      Cùng phạm vi?        có thể "hoàn thành" mà
                 │                  │          không cần thay đổi này?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      CÓ                KHÔNG CÓ           KHÔNG KHÔNG              CÓ
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    CẬP NHẬT         MỚI CẬP NHẬT       MỚI CẬP NHẬT          MỚI
```

**Ví dụ: "Thêm chế độ tối"**

- "Cần hỗ trợ thêm theme tùy chỉnh" → Thay đổi mới (phạm vi bùng nổ)
- "Phát hiện tùy chọn hệ thống khó hơn dự kiến" → Cập nhật (cùng ý định)
- "Hãy phát hành nút chuyển đổi trước, thêm tùy chọn sau" → Cập nhật rồi lưu trữ, sau đó tạo thay đổi mới

## Các phương pháp hay nhất

### Giữ các thay đổi tập trung

Một đơn vị công việc logic cho mỗi thay đổi. Nếu bạn đang làm "thêm tính năng X và cũng tái cấu trúc Y", hãy cân nhắc hai thay đổi riêng biệt.

**Tại sao điều này quan trọng:**
- Dễ xem xét và hiểu hơn
- Lịch sử lưu trữ sạch hơn
- Có thể phát hành độc lập
- Hoàn nguyên đơn giản hơn nếu cần

### Sử dụng `/opsx:explore` cho yêu cầu không rõ ràng

Trước khi cam kết với một thay đổi, hãy khám phá không gian vấn đề:

```text
You: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

You: Chúng ta nên xử lý rate limiting cho API như thế nào?

AI:  Để tôi điều tra thiết lập hiện tại và các tùy chọn của bạn...
     [Nghiên cứu codebase, xem xét các mẫu]

     Tôi thấy ba cách tiếp cận chúng ta có thể thực hiện:
     1. Dựa trên Middleware (đơn giản, theo endpoint)
     2. Hỗ trợ Redis (có thể mở rộng, trạng thái chia sẻ)
     3. Token bucket theo người dùng (công bằng, phức tạp)

     Stack hiện tại của bạn gợi ý #1 hoặc #2. Quy mô của bạn là bao nhiêu?
```

Khám phá làm rõ tư duy trước khi bạn tạo các artifact.

### Kiểm tra trước khi lưu trữ

Sử dụng `/opsx:verify` để kiểm tra triển khai có khớp với các artifact không:

```text
You: /opsx:verify

AI:  Đang kiểm tra add-dark-mode...

     ✓ Tất cả nhiệm vụ trong tasks.md đã được đánh dấu
     ✓ Yêu cầu trong specs đều có code tương ứng
     ✓ Các quyết định thiết kế được phản ánh trong triển khai

     Sẵn sàng lưu trữ!
```

Phát hiện sự không khớp trước khi bạn đóng thay đổi.

### Đặt tên thay đổi rõ ràng

Tên tốt giúp `openspec list` hữu dụng:

```text`
Tốt:                          Tránh:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Tham Khảo Nhanh Lệnh

Để xem chi tiết đầy đủ và các tùy chọn của lệnh, vui lòng tham khảo [Lệnh](commands.md).

| Lệnh | Mục đích | Khi nào sử dụng |
|---------|---------|-------------|
| `/opsx:propose` | Tạo thay đổi + các biểu mẫu quy hoạch | Con đường mặc định nhanh (hồ sơ `core`) |
| `/opsx:explore` | Suy ngẫm về các ý tưởng | Yêu cầu chưa rõ ràng, điều tra |
| `/opsx:new` | Bắt đầu tạo khung thay đổi | Chế độ mở rộng, kiểm soát biểu mẫu rõ ràng |
| `/opsx:continue` | Tạo biểu mẫu tiếp theo | Chế độ mở rộng, tạo biểu mẫu từng bước |
| `/opsx:ff` | Tạo tất cả biểu mẫu quy hoạch | Chế độ mở rộng, phạm vi rõ ràng |
| `/opsx:apply` | Triển khai các nhiệm vụ | Sẵn sàng viết mã |
| `/opsx:verify` | Xác thực việc triển khai | Chế độ mở rộng, trước khi lưu trữ |
| `/opsx:sync` | Hợp nhất các đặc tả delta | Chế độ mở rộng, tùy chọn |
| `/opsx:archive` | Hoàn thành thay đổi | Tất cả công việc đã hoàn tất |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi | Ch chế độ mở rộng, công việc song song |

## Các Bước Tiếp Theo

- [Lệnh](commands.md) - Tham khảo đầy đủ về lệnh với các tùy chọn
- [Khái niệm](concepts.md) - Tìm hiểu sâu về đặc tả, biểu mẫu và lược đồ
- [Tùy chỉnh](customization.md) - Tạo quy trình làm việc tùy chỉnh