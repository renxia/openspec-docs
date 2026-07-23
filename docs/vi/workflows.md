# Quy trình làm việc

Hướng dẫn này trình bày các mẫu quy trình làm việc phổ biến của OpenSpec và thời điểm nên sử dụng từng loại. Để biết hướng dẫn cài đặt cơ bản, xem [Bắt đầu](getting-started.md). Để tra cứu lệnh, xem [Lệnh](commands.md).

## Triết lý: Hành động, không phải Giai đoạn

Các quy trình làm việc truyền thống ép bạn phải đi qua các giai đoạn cố định: lập kế hoạch, sau đó thực hiện, rồi kết thúc. Nhưng công việc thực tế không bao giờ vừa vặn hoàn toàn với các khung cố định này.

OPSX áp dụng cách tiếp cận khác biệt:

```text
Truyền thống (khóa giai đoạn):

  LẬP KẾ HOẠCH ────────► THỰC HIỆN ────────► HOÀN THÀNH
      │                    │
      │   "Không thể quay lại"  │
      └────────────────────┘

OPSX (hành động linh hoạt):

  proposal ──► specs ──► design ──► tasks ──► implement
```

**Các nguyên tắc chính:**

- **Hành động, không phải giai đoạn** - Các lệnh là những việc bạn có thể thực hiện, không phải các giai đoạn bạn bị mắc kẹt ở đó
- **Phụ thuộc là yếu tố cho phép** - Chúng cho thấy những gì bạn có thể làm được, chứ không phải những việc bạn cần thực hiện tiếp theo

> **Tùy chỉnh:** Các quy trình làm việc OPSX được điều khiển bởi các schema xác định chuỗi các artifact. Để biết chi tiết cách tạo schema tùy chỉnh, xem [Tùy chỉnh](customization.md).

## Hai Chế Độ

### Đường Nhanh Mặc Định (profile `core`)

Cài đặt mới mặc định sử dụng `core`, cung cấp các lệnh:
- `/opsx:explore`
- `/opsx:propose`
- `/opsx:apply`
- `/opsx:sync`
- `/opsx:archive`

Luồng hoạt động phổ biến:

```text
/opsx:explore ──► /opsx:propose ──► /opsx:apply ──► /opsx:sync ──► /opsx:archive
  (tùy chọn)
```

#### Bắt đầu bằng khám phá (thói quen đáng hình thành)

`/opsx:explore` là một phần của profile mặc định, không phải là tiện ích bổ sung nâng cao. Đây là thao tác bạn nên thực hiện bất cứ khi nào bạn gặp vấn đề nhưng chưa có kế hoạch giải quyết, điều mà với trợ lý AI, xảy ra hầu hết thời gian.

```text
You: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

You: Kết quả tìm kiếm của chúng tôi có vẻ lỗi thời. Tôi không chắc liệu đó là do bộ nhớ đệm (caching),
     lập chỉ mục (indexing), hay chính câu truy vấn.

AI:  Để tôi xem xét... [đọc dịch vụ tìm kiếm và lớp bộ nhớ đệm]
     Đó là vấn đề ở chỉ mục: chỉ mục chỉ được xây dựng lại vào ban đêm, nên các chỉnh sửa không hiển thị
     cho đến ngày hôm sau. Có hai lựa chọn: xây dựng lại chỉ mục khi ghi (đơn giản, tăng tải nhiều hơn)
     hoặc xóa bộ nhớ đệm có thời gian tồn tại ngắn (TTL ngắn) (nhiều thành phần hoạt động hơn, ít tải hơn).
     Với khối lượng ghi của bạn thấp, xây dựng lại khi ghi là giải pháp sạch sẽ hơn. Bạn muốn xác định phạm vi không?

You: Có.

You: /opsx:propose rebuild-search-index-on-write
```

Khám phá không tạo ra tài liệu phụ trợ nào và không ghi bất kỳ mã nào. Đây là cuộc trò chuyện miễn phí, không rủi ro nào biến nỗi lo mơ hồ thành thay đổi chính xác, nên đề xuất tiếp theo sẽ sắc bén. Đã biết chính xác những gì bạn muốn? Bỏ qua bước này và đi thẳng đến `/opsx:propose`. Hướng dẫn đầy đủ: [Khám Phá Trước](explore.md).

### Luồng Hoạt Động Mở Rộng/Đầy Đủ (lựa chọn tùy chỉnh)

Nếu bạn muốn các lệnh xây dựng khung xương và phát triển rõ ràng (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:bulk-archive`, `/opsx:onboard`), hãy kích hoạt chúng bằng lệnh:

```bash
openspec config profile
openspec update
```

## Mẫu Luồng Hoạt Động (Chế Độ Mở Rộng)

### Tính Năng Nhanh

Khi bạn biết rõ những gì muốn xây dựng và chỉ cần thực hiện:

```text
/opsx:new ──► /opsx:ff ──► /opsx:apply ──► /opsx:verify ──► /opsx:archive
```

**Ví dụ hội thoại:**

```text
You: /opsx:new add-logout-button

AI:  Đã tạo openspec/changes/add-logout-button/
     Sẵn sàng tạo: đề xuất

You: /opsx:ff

AI:  Đang tạo tất cả tài liệu phụ trợ kế hoạch...
     ✓ proposal.md
     ✓ specs/
     ✓ design.md
     ✓ tasks.md
     Sẵn sàng triển khai!

You: /opsx:apply

AI:  Đang thực hiện qua các nhiệm vụ...
     ✓ Đã thêm nút đăng xuất vào tiêu đề
     ✓ Đã triển khai xóa phiên làm việc
     ✓ Đã thêm hộp thoại xác nhận
     Tất cả nhiệm vụ hoàn thành!

You: /opsx:archive

AI:  ✓ Đã gộp specs
     ✓ Đã lưu trữ thay đổi
```

**Phù hợp với:** Tính năng cỡ nhỏ đến trung bình, sửa lỗi, các thay đổi đơn giản.

### Khám Phá

Khi yêu cầu chưa rõ ràng hoặc bạn cần điều tra trước:

```text
/opsx:explore ──► /opsx:new ──► /opsx:continue ──► ... ──► /opsx:apply
```

**Ví dụ hội thoại:**

```text
You: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

You: Tôi muốn cải thiện hiệu suất tải trang nhưng không chắc các điểm nghẽn nằm ở đâu.

AI:  Để tôi giúp điều tra...
     [Phân tích kích thước gói, xác định các truy vấn chậm, xem xét mẫu render thành phần]

     Tôi tìm thấy 3 điểm nghẽn chính:
     1. Hình ảnh không được tối ưu kích thước lớn
     2. Truy xuất dữ liệu đồng bộ trong ProductList
     3. Render lại từ các thay đổi ngữ cảnh

     Bạn muốn giải quyết cái nào trước?

You: Hãy giải quyết vấn đề truy xuất dữ liệu trước.

You: /opsx:new optimize-product-list-fetching

AI:  Đã tạo thay đổi. Sẵn sàng tạo: đề xuất

You: /opsx:continue

AI:  Đang tạo đề xuất dựa trên cuộc khám phá của chúng ta...
     [Viết đề xuất kết hợp thông tin điều tra]

     Sẵn sàng tạo: specs, thiết kế
     Bạn muốn làm cái nào tiếp theo?

You: /opsx:continue

AI:  Đang tạo specs...
```

**Phù hợp với:** Tối ưu hiệu suất, gỡ lỗi, quyết định kiến trúc, yêu cầu chưa rõ ràng.

### Thay Đổi Song Song

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
You: Tôi đang làm việc trên add-dark-mode nhưng bị kéo vào sửa lỗi

You: /opsx:new fix-login-redirect

AI:  Đã tạo openspec/changes/fix-login-redirect/

You: /opsx:ff

AI:  ✓ Đã tạo tài liệu phụ trợ kế hoạch

You: /opsx:apply

AI:  Đang làm việc trên fix-login-redirect...
     [Triển khai bản sửa lỗi]
     Tất cả nhiệm vụ hoàn thành!

You: /opsx:archive

AI:  ✓ Đã lưu trữ fix-login-redirect

You: Quay lại làm chế độ tối thôi

You: /opsx:apply add-dark-mode

AI:  Đang tiếp tục add-dark-mode...
     Tiếp tục ở nhiệm vụ 2.3: Cập nhật tiêu đề...
```

**Phù hợp với:** Luồng công việc song song, gián đoạn khẩn cấp, cộng tác nhóm.

Khi bạn có nhiều thay đổi đã hoàn thành, hãy sử dụng `/opsx:bulk-archive`:

```text
You: /opsx:bulk-archive

AI:  Tìm thấy 3 thay đổi đã hoàn thành:
     - add-dark-mode (tất cả nhiệm vụ hoàn thành)
     - fix-login-redirect (tất cả nhiệm vụ hoàn thành)
     - update-footer (tất cả nhiệm vụ hoàn thành)

     Đang kiểm tra xung đột spec...
     ⚠ add-dark-mode và update-footer đều tác động đến specs/ui/

     Đang kiểm tra kho mã để giải quyết...
     Cả hai thay đổi đã được triển khai. Sẽ áp dụng theo thứ tự thời gian.

     Lưu trữ tất cả 3 thay đổi này?

You: Có

AI:  ✓ Đã lưu trữ add-dark-mode
     ✓ Đã lưu trữ fix-login-redirect
     ✓ Đã lưu trữ update-footer
     Specs được gộp theo thứ tự: add-dark-mode → update-footer
```

Lưu trữ hàng loạt phát hiện khi nhiều thay đổi tác động đến cùng các spec và giải quyết xung đột bằng cách kiểm tra những gì thực sự đã được triển khai.

### Hoàn Thành Một Thay Đổi

Luồng hoạt động hoàn thành được đề xuất:

```text
/opsx:apply ──► /opsx:verify ──► /opsx:archive
                    │                 │
              xác thực          nhắc đồng bộ
              triển khai        nếu cần
```

#### Xác Thực: Kiểm Tra Công Việc Của Bạn

`/opsx:verify` xác thực triển khai so với các tài liệu phụ trợ của bạn trên 3 chiều:

```text
You: /opsx:verify

AI:  Đang xác thực add-auth...

     ĐỘ ĐẦY ĐỦ
     ✓ Tất cả 12 nhiệm vụ trong tasks.md đã được kiểm tra
     ✓ Tất cả yêu cầu trong specs có mã tương ứng
     ⚠ Kịch bản "Hết phiên sau khi không hoạt động" chưa được kiểm tra

     ĐỘ CHÍNH XÁC
     ✓ Triển khai khớp với mục đích spec
     ✓ Các trường hợp biên từ kịch bản được xử lý
     ✓ Trạng thái lỗi khớp với định nghĩa spec

     TÍNH NHẤT QUÁN
     ✓ Quyết định thiết kế được phản ánh trong cấu trúc mã
     ✓ Quy ước đặt tên nhất quán với design.md
     ⚠ Thiết kế đề cập đến "hướng sự kiện" nhưng triển khai sử dụng kiểu polling

     TÓM TẮT
     ─────────────────────────────
     Vấn đề nghiêm trọng: 0
     Cảnh báo: 2
     Sẵn sàng lưu trữ: Có (kèm cảnh báo)

     Đề xuất:
     1. Thêm kiểm tra cho kịch bản hết phiên sau khi không hoạt động
     2. Cân nhắc tái cấu trúc thành hướng sự kiện như đã thiết kế, hoặc cập nhật design.md
```

**Xác thực kiểm tra những gì:**

| Chiều | Nó xác thực điều gì |
|-----------|------------------|
| Độ đầy đủ | Tất cả nhiệm vụ hoàn thành, tất cả yêu cầu được triển khai, các kịch bản được bao phủ |
| Độ chính xác | Triển khai khớp với mục đích spec, các trường hợp biên được xử lý |
| Tính nhất quán | Quyết định thiết kế được phản ánh trong mã, các mẫu nhất quán |

Xác thực sẽ không chặn lưu trữ, nhưng nó hiển thị các vấn đề bạn có thể muốn giải quyết trước.

#### Lưu Trữ: Hoàn Thành Thay Đổi

`/opsx:archive` hoàn thành thay đổi và di chuyển nó đến kho lưu trữ:

```text
You: /opsx:archive

AI:  Đang lưu trữ add-auth...

     Trạng thái tài liệu phụ trợ:
     ✓ proposal.md tồn tại
     ✓ specs/ tồn tại
     ✓ design.md tồn tại
     ✓ tasks.md tồn tại (12/12 nhiệm vụ hoàn thành)

     Delta specs: Chưa được đồng bộ với nhánh chính
     → Bạn có muốn đồng bộ ngay bây giờ không?

You: Có

AI:  ✓ Đã đồng bộ specs đến openspec/specs/auth/spec.md
     ✓ Đã di chuyển đến openspec/changes/archive/2025-01-24-add-auth/

     Thay đổi đã được lưu trữ thành công.
```

Lưu trữ sẽ nhắc bạn nếu specs chưa được đồng bộ. Nó sẽ không chặn bạn với các nhiệm vụ chưa hoàn thành, nhưng sẽ đưa ra cảnh báo.

## Khi Nào Dùng Cái Nào

### `/opsx:ff` vs `/opsx:continue`

| Tình huống | Sử dụng |
|-----------|-----|
| Yêu cầu rõ ràng, sẵn sàng xây dựng | `/opsx:ff` |
| Đang khám phá, muốn xem xét từng bước | `/opsx:continue` |
| Muốn lặp lại đề xuất trước khi tạo specs | `/opsx:continue` |
| Áp lực thời gian, cần di chuyển nhanh | `/opsx:ff` |
| Thay đổi phức tạp, muốn kiểm soát | `/opsx:continue` |

**Nguyên tắc chung:** Nếu bạn có thể mô tả toàn bộ phạm vi ngay từ đầu, hãy sử dụng `/opsx:ff`. Nếu bạn đang tìm ra nó trong quá trình thực hiện, hãy sử dụng `/opsx:continue`.

### Khi Nào Cập Nhật Thay Đổi Hiện Tại Hay Bắt Đầu Mới

Câu hỏi thường gặp: khi nào cập nhật một thay đổi hiện tại là phù hợp, và khi nào bạn nên bắt đầu một thay đổi mới?

**Cập nhật thay đổi hiện tại khi:**
- Cùng mục đích, thực hiện được tinh chỉnh
- Phạm vi thu hẹp (MVP trước, phần còn lại sau)
- Sửa đổi dựa trên hiểu biết mới (kho mã không như bạn mong đợi)
- Điều chỉnh thiết kế dựa trên phát hiện trong quá trình triển khai

**Bắt đầu thay đổi mới khi:**
- Mục đích cơ bản đã thay đổi
- Phạm vi mở rộng thành công việc hoàn toàn khác
- Thay đổi ban đầu có thể được đánh dấu là "hoàn thành" độc lập
- Các bản vá sẽ gây nhầm lẫn hơn là làm rõ

```text
                     ┌─────────────────────────────────────┐
                     │     Đây có phải là cùng công việc không?          │
                     └──────────────┬──────────────────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
          Cùng mục đích?      >50% trùng lặp?      Thay đổi ban đầu
          Cùng vấn đề?     Cùng phạm vi?        có thể "hoàn thành" mà
                 │                  │          không cần các thay đổi này?
                 │                  │                  │
       ┌────────┴────────┐  ┌──────┴──────┐   ┌───────┴───────┐
       │                 │  │             │   │               │
      CÓ               KHÔNG CÓ         KHÔNG CÓ      CÓ
       │                 │  │             │   │               │
       ▼                 ▼  ▼             ▼   ▼               ▼
    CẬP NHẬT            MỚI  CẬP NHẬT    MỚI  CẬP NHẬT        MỚI
```

**Ví dụ: "Thêm chế độ tối"**
- "Cần hỗ trợ thêm chủ đề tùy chỉnh" → Thay đổi mới (phạm vi mở rộng)
- "Phát hiện tùy chọn hệ thống khó hơn mong đợi" → Cập nhật (cùng mục đích)
- "Hãy phát hành nút bật/tắt trước, thêm tùy chọn sau" → Cập nhật rồi lưu trữ, sau đó tạo thay đổi mới

## Thực Hành Tốt Nhất

### Giữ Các Thay Đổi Tập Trung

Một đơn vị công việc logic cho mỗi thay đổi. Nếu bạn đang thực hiện "thêm tính năng X và đồng thời tái cấu trúc Y", hãy cân nhắc tạo hai thay đổi riêng biệt.

**Tại sao điều này quan trọng:**
- Dễ dàng hơn để xem xét và hiểu
- Lịch sử lưu trữ rõ ràng hơn
- Có thể phát hành độc lập
- Đơn giản hơn khi cần hoàn tác nếu có lỗi

### Sử Dụng `/opsx:explore` Cho Yêu Cầu Chưa Rõ Ràng

Trước khi cam kết thực hiện một thay đổi, hãy khám phá không gian vấn đề:

```text
You: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

You: Chúng ta nên xử lý giới hạn tốc độ cho API của mình như thế nào?

AI:  Để tôi điều tra cấu hình hiện tại và các lựa chọn của bạn...
     [Nghiên cứu kho mã, xem xét các mẫu]

     Tôi thấy có 3 phương pháp chúng ta có thể sử dụng:
     1. Dựa trên middleware (đơn giản, theo từng điểm cuối)
     2. Dựa trên Redis (có thể mở rộng, trạng thái chia sẻ)
     3. Xô token cho mỗi người dùng (công bằng, phức tạp)

     Ngăn xếp công nghệ hiện tại của bạn gợi ý phương pháp 1 hoặc 2. Quy mô của bạn là bao nhiêu?
```

Khám phá giúp làm rõ suy nghĩ trước khi bạn tạo các tài liệu phụ trợ.

### Xác Thực Trước Khi Lưu Trữ

Sử dụng `/opsx:verify` để kiểm tra triển khai có khớp với các tài liệu phụ trợ không:

```text
You: /opsx:verify

AI:  Đang xác thực add-dark-mode...

     ✓ Tất cả nhiệm vụ trong tasks.md đã được kiểm tra
     ✓ Yêu cầu trong specs có mã tương ứng
     ✓ Quyết định thiết kế được phản ánh trong triển khai

     Sẵn sàng lưu trữ!
```

Phát hiện các sự không khớp trước khi bạn kết thúc thay đổi.

### Đặt Tên Thay Đổi Rõ Ràng

Tên tốt giúp lệnh `openspec list` hữu ích:

| Tốt:                          | Tránh:                  |
|-------------------------------|-------------------------|
| add-dark-mode                 | feature-1               |
| fix-login-redirect            | update                  |
| optimize-product-query        | changes                 |
| implement-2fa                 | wip                     |

## Tài liệu tham khảo nhanh lệnh

Để xem chi tiết và tùy chọn đầy đủ của các lệnh, hãy xem [Lệnh](commands.md).

| Lệnh | Mục đích | Khi nào sử dụng |
|---------|---------|-------------|
| `/opsx:propose` | Tạo thay đổi + các tài liệu kế hoạch | Đường dẫn mặc định nhanh (hồ sơ `core`) |
| `/opsx:explore` | Suy nghĩ về các ý tưởng với AI | Bắt đầu ở đây khi bạn không chắc chắn: yêu cầu không rõ ràng, điều tra, so sánh các lựa chọn |
| `/opsx:new` | Bắt đầu khung thay đổi | Chế độ mở rộng, kiểm soát tài liệu rõ ràng |
| `/opsx:continue` | Tạo tài liệu tiếp theo | Chế độ mở rộng, tạo tài liệu từng bước |
| `/opsx:ff` | Tạo tất cả tài liệu kế hoạch | Chế độ mở rộng, phạm vi rõ ràng |
| `/opsx:apply` | Thực hiện các nhiệm vụ | Sẵn sàng viết mã |
| `/opsx:verify` | Xác thực phần triển khai | Chế độ mở rộng, trước khi lưu trữ |
| `/opsx:sync` | Hợp nhất các đặc tả delta | Chế độ mở rộng, tùy chọn |
| `/opsx:archive` | Hoàn thành thay đổi | Tất cả công việc đã hoàn thành |
| `/opsx:bulk-archive` | Lưu trữ nhiều thay đổi | Chế độ mở rộng, công việc song song |

## Các bước tiếp theo

- [Viết đặc tả tốt](writing-specs.md) - Một yêu cầu và kịch bản mạnh trông như thế nào, và cách điều chỉnh kích thước thay đổi phù hợp
- [Xem xét thay đổi](reviewing-changes.md) - Bước kiểm tra hai phút trên kế hoạch nháp trước khi viết bất kỳ mã nào
- [OpenSpec trong nhóm](team-workflow.md) - Các thay đổi phù hợp với nhánh và pull request như thế nào
- [Lệnh](commands.md) - Tài liệu tham khảo lệnh đầy đủ với các tùy chọn
- [Khái niệm](concepts.md) - Đi sâu vào đặc tả, tài liệu và schema
- [Tùy chỉnh](customization.md) - Tạo quy trình làm việc tùy chỉnh