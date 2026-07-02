# Các Khái Niệm Cốt Lõi Tổng Quan

**OpenSpec là một lớp thỏa thuận nhẹ giữa bạn và AI của bạn.** Bạn viết ra những gì mà một thay đổi nên làm, AI sẽ soạn thảo các chi tiết, cả hai cùng xem xét kế hoạch đó, và chỉ khi đó thì mã mới được viết. Trang này là toàn bộ mô hình tư duy trên một màn hình. Khi bạn muốn phiên bản đầy đủ hơn, [Concepts](concepts.md) có nó.

Đây là toàn bộ ý tưởng trong năm từ: **thống nhất trước, sau đó xây dựng tự tin.**

## Năm Ý Tưởng

Mọi thứ trong OpenSpec đều được xây dựng từ năm khái niệm. Hãy học những điều này và phần còn lại sẽ là chi tiết bổ sung.

**1. Bản Đặc Tả (Specs) là sự thật.** Một bản đặc tả mô tả cách hệ thống của bạn hoạt động *hiện tại*. Nó nằm trong `openspec/specs/`, được tổ chức theo miền (`auth/`, `payments/`, `ui/`). Các bản đặc tả bao gồm các yêu cầu ("hệ thống PHẢI hết hạn phiên sau 30 phút") và các kịch bản (các ví dụ cụ thể given/when/then). Hãy coi các bản đặc tả là câu trả lời duy nhất đã được đồng thuận cho câu hỏi "phần mềm này làm gì?".

**2. Một thay đổi là một đơn vị công việc.** Khi bạn muốn thêm, sửa hoặc xóa hành vi, bạn tạo một thay đổi: một thư mục trong `openspec/changes/` chứa tất cả mọi thứ về công việc đó tại một nơi. Đó là một đề xuất, một thiết kế, một danh sách nhiệm vụ và các chỉnh sửa bản đặc tả. Một thay đổi, một thư mục, một tính năng.

**3. Bản Đặc Tả Delta mô tả những gì đang thay đổi, chứ không phải toàn bộ thế giới.** Bên trong một thay đổi, bạn không viết lại toàn bộ bản đặc tả. Bạn viết một delta nhỏ: `ADDED` yêu cầu này, `MODIFIED` cái kia, `REMOVED` cái khác. Đây là thủ thuật giúp OpenSpec giỏi chỉnh sửa các hệ thống hiện có, chứ không chỉ những dự án mới hoàn toàn. Bạn mô tả sự khác biệt (diff), chứ không phải đích đến.

**4. Các Artifacts được xây dựng dựa trên nhau.** Một thay đổi chứa một vài tài liệu, được tạo theo một thứ tự tự nhiên, mỗi cái đều cung cấp cho cái tiếp theo:

```text
proposal ──► specs ──► design ──► tasks ──► implement
   why        what       how       steps      do it
```

Bạn có thể xem lại bất kỳ tài liệu nào bất cứ lúc nào. Chúng là yếu tố kích hoạt (enablers), không phải rào cản (gates). (Xem thêm bên dưới.)

**5. Lưu trữ (Archiving) đưa thay đổi trở lại vào sự thật.** Khi công việc hoàn thành, bạn lưu trữ thay đổi đó. Các bản đặc tả delta của nó được hợp nhất vào các bản đặc tả chính, và thư mục thay đổi di chuyển đến `changes/archive/` kèm theo dấu thời gian. Giờ đây các bản đặc tả mô tả thực tế mới, và bạn đã sẵn sàng cho thay đổi tiếp theo. Chu trình khép lại.

## Sơ đồ tổng thể

```text
┌─────────────────────────────────────────────────────────────────┐
│                          openspec/                              │
│                                                                 │
│   ┌──────────────────┐         ┌──────────────────────────┐    │
│   │     specs/       │         │        changes/          │    │
│   │                  │ ◄─────  │                          │    │
│   │ source of truth  │  merge  │ one folder per change    │    │
│   │ how things work  │  on     │ proposal · design ·      │    │
│   │ today            │ archive │ tasks · delta specs      │    │
│   └──────────────────┘         └──────────────────────────┘    │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

Hai thư mục. `specs/` là sự thật. `changes/` là những gì bạn đang đề xuất. Việc lưu trữ di chuyển một đề xuất vào sự thật.

## Vòng lặp mà bạn sẽ thực sự chạy

Trong thiết lập mặc định, ngày làm việc của bạn diễn ra như sau. Tùy chọn suy nghĩ trước; sau đó một lệnh sẽ soạn thảo kế hoạch, bạn đọc nó, cái tiếp theo sẽ xây dựng nó, và cuối cùng là lưu trữ các tệp tin.

```text
/opsx:explore                   →  (tùy chọn) suy nghĩ với AI trước
/opsx:propose add-dark-mode     →  AI soạn thảo đề xuất, bản đặc tả, thiết kế, nhiệm vụ
        (bạn đọc và điều chỉnh kế hoạch)
/opsx:apply                     →  AI xây dựng nó, đánh dấu các nhiệm vụ đã hoàn thành
/opsx:archive                   →  specs được cập nhật, thay đổi được lưu trữ
```

**Khi nghi ngờ, hãy bắt đầu bằng việc khám phá.** `/opsx:explore` là một đối tác tư duy không có rủi ro: nó đọc mã của bạn, trình bày các lựa chọn và biến một ý tưởng mơ hồ thành một kế hoạch cụ thể trước khi bất kỳ artifact nào tồn tại. Đây là liều thuốc giải tốt nhất cho một AI mà nếu không thì sẽ xây dựng *một cái gì đó* từ một lời nhắc mơ hồ. Đã biết chính xác những gì bạn muốn? Hãy bỏ qua và chuyển thẳng đến `/opsx:propose`. Dù bằng cách nào, khám phá vẫn được tích hợp trong hồ sơ mặc định, vì vậy nó luôn có mặt. Xem [Explore guide](explore.md).

Chúng là các lệnh slash, được nhập vào cuộc trò chuyện của trợ lý AI của bạn. Thiết lập (`openspec init`) diễn ra trên terminal của bạn. Nếu sự phân chia này còn mới đối với bạn, hãy đọc [How Commands Work](how-commands-work.md) trước; đó là điểm gây nhầm lẫn phổ biến nhất.

## "Yếu tố kích hoạt, không phải rào cản"

Cụm từ này xuất hiện ở khắp mọi nơi trong OpenSpec, vì vậy đây là ý nghĩa của nó bằng ngôn ngữ đơn giản.

Các quy trình đặc tả kiểu cũ giống như thác nước: hoàn thành việc lập kế hoạch, *sau đó* bạn mới được phép triển khai, và quay lại thì rất đau đớn. OpenSpec từ chối bỏ điều đó. Trình tự `proposal → specs → design → tasks` cho thấy cái gì trở nên *có thể* tiếp theo, chứ không phải cái gì bạn *bị buộc* phải làm tiếp theo.

Phát hiện ra trong quá trình triển khai rằng thiết kế đã sai? Hãy chỉnh sửa `design.md` và tiếp tục. Nhận ra phạm vi cần thu hẹp lại? Cập nhật đề xuất. Không có thứ gì khóa chặt. Các sự phụ thuộc chỉ tồn tại để AI có được ngữ cảnh nó cần (bạn không thể viết các nhiệm vụ tốt mà không có bản đặc tả làm cơ sở), chứ không phải để bó buộc bạn.

Sức mạnh ở đây là tính trung thực: công việc thực tế là lộn xộn và mang tính lặp lại, và OpenSpec cho phép điều đó. Sự đánh đổi là kỷ luật: vì không có gì ép buộc bạn tiến lên, nên bạn phải tự giữ một thay đổi tập trung thay vì để nó lan man. Hướng dẫn [Workflows](workflows.md) có những thói quen tốt cho việc này.

## Tại sao điều này lại đáng với chi phí nhỏ

Sự thật đơn giản: OpenSpec thêm một bước. Bạn viết một kế hoạch ngắn trước khi xây dựng. Vậy bạn nhận được gì để đổi lấy nó?

- **Bạn bắt được những khúc ngoặt sai lầm trước khi chúng khiến bạn tốn kém.** Sửa một sự hiểu lầm trong một bản đề xuất một đoạn văn là miễn phí. Sửa nó sau khi AI đã viết 400 dòng thì không phải vậy.
- **Kế hoạch và mã vẫn nằm trong cùng một repo.** Sáu tháng sau, bản đặc tả cho bạn (và phiên làm việc tiếp theo của AI) biết tại sao hệ thống lại hoạt động như cách nó đang hoạt động.
- **Các thay đổi có thể được xem xét.** Một thư mục thay đổi là một gói gọn gàng: đọc đề xuất, lướt qua các delta, kiểm tra nhiệm vụ. Không cần phải khai quật lịch sử trò chuyện.
- **Nó phù hợp với các codebase hiện có.** Deltas nghĩa là bạn có thể chỉ định một thay đổi cho một ứng dụng 50.000 dòng mà không cần phải tài liệu hóa toàn bộ nó trước.

Và sự đánh đổi trung thực: đối với một bản sửa lỗi cực kỳ nhỏ, chỉ một dòng, nghi thức này có thể không mang lại lợi ích gì, và điều đó cũng ổn thôi. OpenSpec được thiết kế để nhẹ nhàng, nhưng nó không miễn phí. Hãy sử dụng nó ở nơi mà sự đồng thuận là quan trọng, điều mà hóa ra là hầu hết mọi lúc khi bạn làm việc với một AI sẽ tự tin xây dựng bất cứ điều gì bạn đã mơ hồ yêu cầu.

## Nên đi đâu tiếp theo

- Mới đến đây? [Getting Started](getting-started.md) hướng dẫn qua thay đổi đầu tiên một cách đầy đủ.
- Chưa chắc nên xây dựng cái gì? [Explore First](explore.md) là nơi để bắt đầu.
- Bối rối về việc các lệnh chạy ở đâu? [How Commands Work](how-commands-work.md).
- Muốn phiên bản sâu của tất cả những điều trên? [Concepts](concepts.md).
- Học qua ví dụ? [Examples & Recipes](examples.md).
- Cần định nghĩa một thuật ngữ? [Glossary](glossary.md).