# Quy trình làm việc

Hướng dẫn này đề cập đến các mẫu quy trình làm việc phổ biến cho OpenSpec và khi nào nên sử dụng từng mẫu. Đối với thiết lập cơ bản, xem [Getting Started](getting-started.md). Đối với tài liệu tham khảo lệnh, xem [Commands](commands.md).

## Triết lý: Hành động, không phải Giai đoạn

Các quy trình làm việc truyền thống buộc bạn phải trải qua các giai đoạn: lập kế hoạch, sau đó triển khai, rồi hoàn thành. Nhưng công việc thực tế không thể vừa vặn vào những chiếc hộp cố định.

OPSX có một cách tiếp cận khác:

```text
Traditional (phase-locked):

  PLANNING ────────► IMPLEMENTING ────────► DONE
      │                    │
      │   "Can't go back"  │
      └────────────────────┘

OPSX (fluid actions):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Các nguyên tắc chính:**

- **Hành động, không phải giai đoạn** - Các lệnh là những việc bạn có thể làm, chứ không phải là các giai đoạn mà bạn bị mắc kẹt.
- **Sự phụ thuộc là yếu tố kích hoạt (enablers)** - Chúng cho thấy những gì là khả thi, chứ không phải những gì cần thiết tiếp theo.

> **Tùy chỉnh (Customization):** Các quy trình làm việc của OPSX được điều khiển bởi các schemas định nghĩa trình tự các artifact. Xem [Customization](customization.md) để biết chi tiết về cách tạo các schema tùy chỉnh.

## Hai Chế Độ

### Đường dẫn Nhanh Mặc Định (`core` profile)

Các cài đặt mới mặc định sử dụng `core`, cung cấp:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Luồng hoạt động điển hình:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (optional)
```

#### Bắt đầu bằng việc khám phá (thói quen cần thiết lập)

`/opsx:explore` là một phần của profile mặc định, không phải là một tiện ích nâng cao. Đây là hành động nên thực hiện bất cứ khi nào bạn có một vấn đề nhưng chưa có kế hoạch, điều này xảy ra hầu hết thời gian với sự hỗ trợ của AI.

```text
You: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

You: Các kết quả tìm kiếm của chúng tôi có vẻ cũ kỹ. Tôi không chắc liệu đó là do caching,
     indexing hay bản thân truy vấn.

AI:  Để tôi xem xét... [đọc dịch vụ tìm kiếm và lớp cache]
     Vấn đề nằm ở index: nó chỉ được xây dựng lại hàng đêm, vì vậy các chỉnh sửa
     không hiển thị cho đến ngày hôm sau. Có hai lựa chọn: rebuild on write (đơn giản,
     tải nặng hơn) hoặc invalidation cache TTL ngắn (nhiều thành phần hơn,
     ít tải hơn). Với lượng ghi của bạn là thấp, rebuild-on-write là giải pháp sạch sẽ hơn. Bạn có muốn giới hạn phạm vi không?

You: Có.

You: /opsx:propose rebuild-search-index-on-write
```

Khám phá không tạo ra bất kỳ artifact nào và cũng không viết mã. Đây là một cuộc trò chuyện miễn phí, không rủi ro giúp biến một mối lo lắng mơ hồ thành một thay đổi cụ thể, nhờ đó mà đề xuất tiếp theo trở nên sắc bén. Đã biết chính xác những gì bạn muốn? Bỏ qua nó và đi thẳng đến `/opsx:propose`. Hướng dẫn đầy đủ: [Explore First](explore.md).

### Quy trình làm việc mở rộng/Đầy đủ (chọn lọc tùy chỉnh)

Nếu bạn muốn các lệnh scaffolding và build rõ ràng (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), hãy kích hoạt chúng bằng cách:

```bash
openspec config profile
openspec update
```

## Các Mẫu Quy Trình Làm Việc (Chế Độ Mở Rộng)

### Tính năng Nhanh chóng

Khi bạn biết mình muốn xây dựng gì và chỉ cần thực hiện nó:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Ví dụ về cuộc trò chuyện:**

```text
You: /opsx:new add-logout-button

AI:  Đã tạo openspec/changes/add-logout-button/
     Sẵn sàng để tạo: proposal

You: /opsx:ff

AI:  Đang tạo tất cả các artifact lập kế hoạch...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Sẵn sàng cho việc triển khai!

You: /opsx:apply

AI:  Đang thực hiện các tác vụ...
     ✓ Đã thêm nút đăng xuất vào tiêu đề
     ✓ Đã triển khai xóa phiên
     ✓ Đã thêm hộp thoại xác nhận
     Tất cả các tác vụ đã hoàn thành!

You: /opsx:archive

AI:  ✓ Đã hợp nhất specs
     ✓ Đã lưu trữ thay đổi
```

**Tốt nhất cho:** Các tính năng nhỏ đến trung bình, sửa lỗi, những thay đổi đơn giản.

### Khám phá

Khi yêu cầu chưa rõ ràng hoặc bạn cần điều tra trước:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Ví dụ về cuộc trò chuyện:**

```text
You: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

You: Tôi muốn cải thiện hiệu suất tải trang nhưng tôi không chắc chắn
     các nút thắt cổ chai nằm ở đâu.

AI:  Hãy để tôi giúp điều tra...
     [Phân tích kích thước bundle, xác định các truy vấn chậm, xem xét các mẫu render component]

     Tôi đã tìm thấy ba nút thắt cổ chai chính:
     1. Hình ảnh lớn chưa được tối ưu hóa
     2. Truy xuất dữ liệu đồng bộ trong ProductList
     3. Tái render từ thay đổi context

     Bạn muốn giải quyết vấn đề nào trước?

You: Hãy xử lý vấn đề truy xuất dữ liệu.

You: /opsx:new optimize-product-list-fetching

AI:  Đã tạo change. Sẵn sàng để tạo: proposal

You: /opsx:continue

AI:  Đang tạo proposal dựa trên quá trình khám phá của chúng ta...
     [Viết proposal kết hợp các hiểu biết từ cuộc điều tra]

     Sẵn sàng để tạo: specs, design
     Bạn muốn tiếp theo gì?

You: /opsx:continue

AI:  Đang tạo specs...
```

**Tốt nhất cho:** Tối ưu hóa hiệu suất, gỡ lỗi (debugging), quyết định kiến trúc, yêu cầu chưa rõ ràng.

### Các Thay Đổi Song Song

Làm việc trên nhiều thay đổi cùng một lúc:

```text
Change A: /opsx:new ──► /opsx:ff ──► /opsx:apply (đang tiến hành)
                                         │
                                    context switch
                                         │
Change B: /opsx:new ──► /opsx:ff ──────► /opsx:apply
```

**Ví dụ về cuộc trò chuyện:**

```text
You: Tôi đang làm add-dark-mode nhưng bị kéo vào một bản sửa lỗi

You: /opsx:new fix-login-redirect

AI:  Đã tạo openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Đã tạo các artifact lập kế hoạch

You: /opsx:apply

AI:  Đang làm fix-login-redirect...
     [Triển khai bản sửa lỗi]
     Tất cả các tác vụ đã hoàn thành!

You: /opsx:archive

AI:  ✓ Đã lưu trữ fix-login-redirect

You: Hãy quay lại với dark mode

You: /opsx:apply add-dark-mode

AI:  Tiếp tục add-dark-mode...
     Bắt đầu từ tác vụ 2.3: Cập nhật Header...
```

**Tốt nhất cho:** Các luồng công việc song song, ngắt quãng khẩn cấp, cộng tác nhóm.

Khi bạn có nhiều thay đổi đã hoàn thành, hãy sử dụng `/opsx:bulk-archive`:

```text
You: /opsx:bulk-archive

AI:  Tìm thấy 3 thay đổi đã hoàn thành:
     - add-dark-mode (tất cả các tác vụ đã xong)
     - fix-login-redirect (tất cả các tác vụ đã xong)
     - update-footer (tất cả các tác vụ đã xong)

     Đang kiểm tra xung đột spec...
     ⚠ add-dark-mode và update-footer đều chạm vào specs/ui/

     Đang kiểm tra codebase để giải quyết...
     Cả hai thay đổi đều đã được triển khai. Sẽ áp dụng theo thứ tự thời gian.

     Lưu trữ cả 3 thay đổi?

You: Có

AI:  ✓ Đã lưu trữ add-dark-mode
     ✓ Đã lưu trữ fix-login-redirect
     ✓ Đã lưu trữ update-footer
     Specs được hợp nhất theo thứ tự: add-dark-mode → update-footer
```

Bulk archive phát hiện khi nhiều thay đổi chạm vào cùng một spec và giải quyết xung đột bằng cách kiểm tra những gì thực sự đã được triển khai.

### Hoàn thành một Thay Đổi

Luồng hoàn thành được khuyến nghị:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              validates          prompts to sync
              implementation     if needed
```

#### Xác minh: Kiểm tra công việc của bạn

`/opsx:verify` xác thực triển khai so với các artifact của bạn trên ba khía cạnh:

```text
You: /opsx:verify

AI:  Đang xác minh add-auth...

     TÍNH HOÀN CHỈNH (COMPLETENESS)
     ✓ Tất cả 12 tác vụ trong tasks.md đã được kiểm tra
     ✓ Tất cả các yêu cầu trong specs đều có mã tương ứng
     ⚠ Kịch bản "Hết thời gian phiên sau khi không hoạt động" chưa được thử nghiệm

     TÍNH CHÍNH XÁC (CORRECTNESS)
     ✓ Triển khai khớp với ý định của spec
     ✓ Các trường hợp biên từ kịch bản đã được xử lý
     ✓ Trạng thái lỗi khớp với định nghĩa trong spec

     TÍNH MẠCH LẠC (COHERENCE)
     ✓ Các quyết định thiết kế phản ánh trong cấu trúc mã
     ✓ Quy ước đặt tên nhất quán với design.md
     ⚠ Thiết kế đề cập đến "event-driven" nhưng triển khai lại sử dụng polling

     TÓM TẮT (SUMMARY)
     ─────────────────────────────
     Vấn đề nghiêm trọng: 0
     Cảnh báo: 2
     Sẵn sàng để lưu trữ: Có (kèm cảnh báo)

     Khuyến nghị:
     1. Thêm bài kiểm tra cho kịch bản hết thời gian phiên
     2. Cân nhắc tái cấu trúc sang event-driven như thiết kế, hoặc cập nhật design.md
```

**Những gì xác minh kiểm tra:**

| Khía cạnh | Kiểm tra những gì |
|-----------|------------------|
| Tính Hoàn chỉnh | Tất cả tác vụ đã hoàn thành, tất cả yêu cầu đã được triển khai, kịch bản đã được bao phủ |
| Tính Chính xác | Triển khai khớp với ý định của spec, các trường hợp biên đã được xử lý |
| Tính Mạch lạc | Các quyết định thiết kế phản ánh trong mã, các mẫu nhất quán |

Verify sẽ không chặn việc lưu trữ, nhưng nó sẽ nêu bật những vấn đề bạn có thể muốn giải quyết trước.

#### Lưu trữ: Hoàn thiện Thay Đổi

`/opsx:archive` hoàn thành thay đổi và chuyển nó vào kho lưu trữ:

```text
You: /opsx:archive

AI:  Đang lưu trữ add-auth...

     Trạng thái artifact:
     ✓ proposal.md tồn tại
     ✓ specs/ tồn tại
     ✓ design.md tồn tại
     ✓ tasks.md tồn tại (12/12 tác vụ hoàn thành)

     Delta specs: Chưa được đồng bộ với main
     → Bạn có muốn đồng bộ bây giờ không?

You: Có

AI:  ✓ Đã đồng bộ specs vào openspec/specs/auth/spec.md
     ✓ Đã chuyển đến openspec/changes/archive/2025-01-24-add-auth/

     Thay đổi đã được lưu trữ thành công.
```

Archive sẽ nhắc nhở nếu các spec chưa được đồng bộ. Nó sẽ không chặn trên các tác vụ chưa hoàn thành, nhưng nó sẽ cảnh báo bạn.

## Khi nào nên dùng cái gì

### `/opsx:ff` so với `/opsx:continue`

| Tình huống | Sử dụng |
|-----------|-----|
| Yêu cầu rõ ràng, sẵn sàng để xây dựng | `/opsx:ff` |
| Đang khám phá, muốn xem xét từng bước | `/opsx:continue` |
| Muốn lặp lại proposal trước khi làm specs | `/opsx:continue` |
| Áp lực thời gian, cần hành động nhanh | `/opsx:ff` |
| Thay đổi phức tạp, muốn kiểm soát | `/opsx:continue` |

**Quy tắc chung:** Nếu bạn có thể mô tả toàn bộ phạm vi ngay từ đầu, hãy sử dụng `/opsx:ff`. Nếu bạn đang tìm hiểu trong khi làm việc, hãy sử dụng `/opsx:continue`.

### Khi nào nên Cập nhật so với Bắt đầu Mới

Một câu hỏi thường gặp: khi nào thì việc cập nhật một thay đổi hiện có là ổn, và khi nào cần bắt đầu một cái mới?

**Cập nhật thay đổi hiện có khi:**

- Ý định giống nhau, thực thi được tinh chỉnh
- Phạm vi bị thu hẹp (MVP trước, phần còn lại sau)
- Sửa chữa dựa trên việc học hỏi (codebase không như bạn mong đợi)
- Điều chỉnh thiết kế dựa trên những khám phá trong quá trình triển khai

**Bắt đầu một thay đổi mới khi:**

- Ý định đã thay đổi cơ bản
- Phạm vi bị bùng nổ thành công việc hoàn toàn khác
- Thay đổi ban đầu có thể được đánh dấu là "hoàn thành" độc lập
- Các bản vá sẽ gây nhầm lẫn nhiều hơn là làm rõ ràng

```text
                     ┌─────────────────────────────────────┐
                     │     Đây có phải là công việc tương tự không?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Ý định giống nhau?      >50% trùng lặp?      Có thể làm cái ban đầu
          Vấn đề giống nhau?     Phạm vi giống nhau?        "hoàn thành" mà không cần
                 │                  │          những thay đổi này?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      CÓ               KHÔNG CÓ YES           KHÔNG  KHÔNG              CÓ
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    CẬP NHẬT            MỚI  CẬP NHẬT       MỚI  CẬP NHẬT          MỚI
```

**Ví dụ: "Thêm chế độ tối"**

- "Cũng cần hỗ trợ các chủ đề tùy chỉnh" → Thay đổi mới (phạm vi bị bùng nổ)
- "Việc phát hiện tùy chọn hệ thống khó hơn dự kiến" → Cập nhật (ý định giống nhau)
- "Hãy xuất bản toggle trước, thêm tùy chọn sau" → Cập nhật rồi lưu trữ, sau đó tạo thay đổi mới

## Các Thực Hành Tốt Nhất

### Giữ các Thay Đổi Tập Trung

Một đơn vị công việc logic cho mỗi thay đổi. Nếu bạn đang làm "thêm tính năng X và đồng thời tái cấu trúc Y", hãy cân nhắc hai thay đổi riêng biệt.

**Tại sao điều này quan trọng:**
- Dễ dàng xem xét và hiểu
- Lịch sử lưu trữ sạch sẽ hơn
- Có thể xuất bản độc lập
- Rollback đơn giản hơn nếu cần thiết

### Sử dụng `/opsx:explore` cho các Yêu cầu Chưa Rõ ràng

Trước khi cam kết vào một thay đổi, hãy khám phá không gian vấn đề:

```text
You: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

You: Chúng ta nên xử lý giới hạn tỷ lệ (rate limiting) cho API của mình như thế nào?

AI:  Hãy để tôi điều tra thiết lập và các tùy chọn hiện tại của bạn...
     [Nghiên cứu codebase, xem xét các mẫu]

     Tôi thấy ba cách tiếp cận chúng ta có thể thực hiện:
     1. Dựa trên Middleware (đơn giản, theo endpoint)
     2. Hỗ trợ Redis (có khả năng mở rộng, trạng thái chung)
     3. Token bucket cho mỗi người dùng (công bằng, phức tạp)

     Stack hiện tại của bạn gợi ý #1 hoặc #2. Quy mô của bạn là gì?
```

Việc khám phá làm rõ suy nghĩ trước khi bạn tạo ra các artifact.

### Xác minh Trước khi Lưu trữ

Sử dụng `/opsx:verify` để kiểm tra xem triển khai có khớp với các artifact hay không:

```text
You: /opsx:verify

AI:  Đang xác minh add-dark-mode...

     ✓ Tất cả tác vụ trong tasks.md đã được kiểm tra
     ✓ Các yêu cầu trong specs đều có mã tương ứng
     ✓ Các quyết định thiết kế phản ánh trong triển khai

     Sẵn sàng để lưu trữ!
```

Nó sẽ phát hiện ra những sự không khớp trước khi bạn đóng thay đổi.

### Đặt Tên Thay Đổi Rõ Ràng

Tên tốt giúp `openspec list` trở nên hữu ích:

```text
Tốt:                          Tránh:
add-dark-mode                  feature-1
fix-login-redirect             update
optimize-product-query         changes
implement-2fa                  wip
```

## Tham Chiếu Nhanh Các Lệnh

Để biết chi tiết đầy đủ về lệnh và các tùy chọn, hãy xem [Commands](commands.md).

| Command | Mục đích | Khi nào nên sử dụng |
|---------|---------|-------------|
| `/opsx:propose` | Tạo thay đổi + các tạo phẩm lập kế hoạch | Đường dẫn mặc định nhanh (`core` profile) |
| `/opsx:explore` | Suy nghĩ về ý tưởng với AI | Bắt đầu ở đây khi không chắc chắn: yêu cầu chưa rõ ràng, điều tra, so sánh các tùy chọn |
| `/opsx:new` | Bắt đầu một khung thay đổi (change scaffold) | Chế độ mở rộng, kiểm soát tạo phẩm rõ ràng |
| `/opsx:continue` | Tạo tạo phẩm tiếp theo | Chế độ mở rộng, tạo tạo phẩm từng bước |
| `/opsx:ff` | Tạo tất cả các tạo phẩm lập kế hoạch | Chế độ mở rộng, phạm vi rõ ràng |
| `/opsx:apply` | Triển khai nhiệm vụ | Sẵn sàng viết mã |
| `/opsx:verify` | Xác thực triển khai | Chế độ mở rộng, trước khi lưu trữ |
| `/opsx:sync` | Hợp nhất các thông số kỹ thuật delta (delta specs) | Chế độ mở rộng, tùy chọn |
| `/opsx:archive` | Hoàn thành thay đổi | Tất cả công việc đã hoàn thành |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi | Chế độ mở rộng, làm việc song song |

## Các Bước Tiếp Theo

- [Commands](commands.md) - Tài liệu tham chiếu lệnh đầy đủ cùng các tùy chọn
- [Concepts](concepts.md) - Đi sâu vào thông số kỹ thuật (specs), tạo phẩm và lược đồ (schemas)
- [Customization](customization.md) - Tạo các quy trình làm việc tùy chỉnh