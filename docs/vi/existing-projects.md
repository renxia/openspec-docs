# Sử dụng OpenSpec trong một Dự án Hiện có

**Bạn không cần phải tài liệu hóa toàn bộ codebase của mình ngay từ đầu. Bạn chỉ viết specs cho những gì bạn sắp thay đổi.** Đây là điều quan trọng nhất cần biết khi áp dụng OpenSpec vào một dự án hiện có, và đó là lý do tại sao OpenSpec được xây dựng theo hướng "brownfield-first" (ưu tiên hệ thống đã tồn tại).

Một mối lo ngại phổ biến nghe như sau: "Ứng dụng của tôi đã 80.000 dòng code rồi. Tôi có phải viết specs cho tất cả nó trước khi OpenSpec trở nên hữu ích không?" Câu trả lời là Không. Bạn cũng sẽ ghét điều đó, và chúng tôi cũng vậy. OpenSpec giúp bạn phát triển specs từng thay đổi một. Thay đổi đầu tiên của bạn tài liệu hóa phần mà nó chạm tới, thay đổi tiếp theo tài liệu hóa phần của nó, và qua nhiều tháng, các specs của bạn sẽ tự nhiên lấp đầy xung quanh công việc thực tế bạn làm.

Hướng dẫn này cho thấy cách bắt đầu ngay từ ngày đầu tiên mà không cố gắng giải quyết mọi thứ cùng một lúc.

## Phiên bản ba mươi giây

```bash
$ cd your-existing-project
$ openspec init          # adds openspec/ and your AI tool's commands
```

Sau đó, trong cuộc trò chuyện với AI của bạn:

```text
/opsx:explore            # tùy chọn: yêu cầu AI đọc khu vực mà bạn sẽ thao tác
/opsx:propose <a real, small change you actually need>
/opsx:apply
/opsx:archive
```

Specs của bạn giờ đây mô tả chính xác phần hệ thống mà thay đổi đó chạm tới, và không hơn. Điều đó là đúng đắn. Bạn đã xong việc lo lắng về 80.000 dòng code còn lại.

## Tại sao phương pháp delta-first là mấu chốt
OpenSpec ghi lại các thay đổi dưới dạng **deltas**: `ADDED`, `MODIFIED`, `REMOVED`. Một delta mô tả những gì đang thay đổi so với hành vi hiện tại, chứ không phải toàn bộ hệ thống.

Đây chính xác là điều mà công việc trên hệ thống đã tồn tại cần có. Bạn hiếm khi xây dựng từ con số không. Bạn đang thêm một trường, sửa một redirect, siết chặt một timeout. Một delta cho phép bạn chỉ định thay đổi đó một cách chính xác mà không cần phải viết trước một bản spec 40 trang về mọi thứ xung quanh nó.

Vì vậy, thư mục `openspec/specs/` của bạn không bắt đầu đầy đủ và hoàn chỉnh. Nó bắt đầu gần như trống rỗng và tích lũy dần. Mỗi thay đổi được lưu trữ sẽ hợp nhất delta của nó vào. Spec cho `auth/` chỉ trở nên toàn diện sau khi bạn thực hiện nhiều thay đổi liên quan đến auth, đó chính xác là lúc bạn muốn nó toàn diện.

Nếu bạn muốn tìm hiểu cơ chế sâu hơn, hãy xem [Concepts: Delta Specs](concepts.md#delta-specs).

## Thay đổi đầu tiên của bạn trên một codebase thực tế
Hãy chọn một thứ gì đó nhỏ và thực tế. Không phải đồ chơi, không phải viết lại hoàn toàn. Một thay đổi mà bạn đã định làm trong tuần này dù thế nào đi nữa. Những thay đổi ban đầu nhỏ sẽ dạy cho bạn quy trình làm việc với rủi ro thấp.

**Bước 1: Cho AI đọc khu vực liên quan.** Đây là nơi `/opsx:explore` phát huy tác dụng trên một codebase không quen thuộc hoặc lớn. Hãy chỉ nó vào phần bạn sắp chạm tới và để nó lập bản đồ cách mọi thứ hoạt động trước khi đề xuất bất cứ điều gì.

```text
You: /opsx:explore

AI:  Bạn muốn khám phá điều gì?

You: Tôi cần thêm giới hạn tốc độ (rate limiting) cho API công khai của chúng tôi, nhưng tôi không chắc chắn
     cách các yêu cầu hiện đang chảy qua middleware như thế nào.

AI:  Hãy để tôi theo dõi... [đọc router, stack middleware và cấu hình]
     Các yêu cầu đến Express, đi qua auth middleware, sau đó là controllers của bạn. Hiện tại chưa có lớp giới hạn tốc độ nào cả. Điểm chèn sạch nhất là một middleware ngay sau auth. Bạn muốn tôi xác định phạm vi không?
```

Hãy chú ý rằng AI giờ đây đã hiểu cấu trúc thực tế của bạn, vì vậy đề xuất mà nó viết sẽ phù hợp với code của bạn, chứ không phải một mẫu chung chung. Trên một codebase lớn, thói quen đơn lẻ này giúp tiết kiệm được nhiều rắc rối nhất. Xem [Explore First](explore.md).

**Bước 2: Đề xuất thay đổi.** Bản đề xuất và delta spec của nó chỉ ghi lại chính thay đổi này.

```text
You: /opsx:propose add-api-rate-limiting
```

**Bước 3: Xây dựng và lưu trữ** bằng `/opsx:apply` và `/opsx:archive`, giống như bất kỳ thay đổi nào khác. Sau khi lưu trữ, bạn sẽ có một spec thực tế về hành vi giới hạn tốc độ của mình, được sinh ra từ một thay đổi mà bạn vốn cần làm dù thế nào đi nữa.

## Thích một chuyến tham quan hướng dẫn? Hãy sử dụng onboard
Nếu bạn muốn xem toàn bộ vòng lặp diễn ra trên code của riêng mình với lời tường thuật, lệnh mở rộng `/opsx:onboard` sẽ làm chính xác điều đó: nó quét codebase của bạn để tìm một cải tiến nhỏ, an toàn, sau đó hướng dẫn bạn qua việc đề xuất, xây dựng và lưu trữ nó, giải thích từng bước.

Hãy bật các lệnh mở rộng trước:

```bash
$ openspec config profile      # chọn các quy trình làm việc mở rộng
$ openspec update              # áp dụng chúng cho dự án này
```

Sau đó trong chat:

```text
/opsx:onboard
```

Đây là sự giới thiệu nhẹ nhàng nhất có thể trên một dự án thực tế, và nó để lại cho bạn một thay đổi chân thật (nhỏ) mà bạn có thể giữ lại hoặc loại bỏ. Xem [Commands: `/opsx:onboard`](commands.md#opsxonboard).

## "Nhưng tôi đã có tài liệu yêu cầu"
Có lẽ bạn có một PRD, một SRS, một spec chính thức, thậm chí các mô hình TLA+. Điều đó tốt. Bạn không cần nhập chúng nguyên vẹn, và cũng không nên loại bỏ chúng.

Hãy coi các tài liệu hiện có là **nguồn tư liệu để khám phá**, chứ không phải là specs cần chuyển đổi. Khi bạn bắt đầu một thay đổi, hãy dán hoặc chỉ cho AI vào phần liên quan, và để nó định hình một delta OpenSpec tập trung từ đó. Delta này ghi lại hành vi mà bạn đang thay đổi bây giờ, dưới dạng yêu cầu và kịch bản có thể kiểm thử được của OpenSpec. Các tài liệu gốc của bạn vẫn giữ nguyên ở vị trí của chúng như là nền tảng.

Lý do chân thật: Specs của OpenSpec cố tình ưu tiên hành vi và giới hạn trong phạm vi thay đổi. Một PRD 40 trang là một artifact khác với nhiệm vụ khác. Việc ép buộc chuyển đổi hàng loạt một lần thường tạo ra một spec lớn, lỗi thời mà không ai tin tưởng. Cho phép các specs phát triển từ những thay đổi thực tế sẽ giữ cho chúng chính xác.

```text
You: /opsx:explore
You: Đây là phần PRD của chúng tôi về quy trình thanh toán. Tôi đang thực hiện yêu cầu "guest checkout" (thanh toán với tư cách khách) tiếp theo.
     [dán yêu cầu liên quan]
AI:  [đọc nó, đặt các câu hỏi làm rõ, sau đó giúp xác định phạm vi thay đổi]
You: /opsx:propose add-guest-checkout
```

## Tổ chức specs trong một codebase lớn
Specs nằm dưới `openspec/specs/`, được nhóm theo **domain**: một khu vực logic phù hợp với cách đội của bạn nghĩ về hệ thống. Bạn không cần phải thiết kế toàn bộ phân loại ngay từ đầu. Hãy tạo một thư mục domain khi thay đổi đầu tiên của bạn trong lĩnh vực đó yêu cầu điều đó.

Các cách phổ biến để chia nhỏ các domain:

- **Theo khu vực tính năng:** `auth/`, `payments/`, `search/`
- **Theo component:** `api/`, `frontend/`, `workers/`
- **Theo ngữ cảnh giới hạn (bounded context):** `ordering/`, `fulfillment/`, `inventory/`

Hãy chọn điều gì khiến người mới nghe mà gật đầu. Bạn có thể tinh chỉnh sau. Xem [Concepts: Specs](concepts.md#specs).

## Monorepos và công việc trải rộng qua nhiều repos
Đối với một monorepo, mô hình đơn giản nhất là một thư mục `openspec/` tại gốc của repo, với các domain ánh xạ tới packages hoặc services của bạn. Điều này bao gồm hầu hết các đội nhóm.

Nếu công việc của bạn thực sự trải rộng qua **nhiều repository** (hoặc nhiều package mà bạn coi là riêng biệt), OpenSpec có tính năng beta **stores**: kế hoạch tồn tại trong một repo độc lập mà bất kỳ repo code nào của bạn đều có thể tham chiếu, để bản kế hoạch không cần phải nằm bên trong thư mục `openspec/` của một repo. Nó đang ở trạng thái beta, vì vậy hãy coi các lệnh và trạng thái của nó là đang phát triển. Bắt đầu với [Stores User Guide](stores-beta/user-guide.md) để có mô hình tư duy và con đường hữu ích nhất.

## Một vài lời cảnh báo chân thành
- **Chống lại sự thôi thúc phải điền đầy tất cả.** Viết specs cho code mà bạn không thay đổi nghe có vẻ hiệu quả và thường là vậy. Những spec đó sẽ trở nên lỗi thời, vì không có gì buộc chúng phải theo dõi thực tế. Hãy để những thay đổi thực tế điều khiển các specs của bạn.
- **Giữ các thay đổi ban đầu nhỏ.** Vài thay đổi đầu tiên của bạn cũng quan trọng như việc vận chuyển (shipping). Một phạm vi hẹp sẽ làm cho vòng lặp diễn ra nhanh và bài học trở nên rẻ hơn.
- **Commit `openspec/` vào git.** Specs và archive của bạn thuộc về hệ thống quản lý phiên bản cùng với code mà chúng mô tả.
- **Cung cấp ngữ cảnh cho AI.** Trên một codebase lớn với các quy ước mạnh mẽ, hãy điền vào `context:` trong `openspec/config.yaml` để mọi đề xuất đều tôn trọng stack và các mẫu của bạn. Xem [Customization](customization.md#project-configuration).

## Nên đi đâu tiếp theo
- [Explore First](explore.md) - thói quen then chốt để hiểu code trước khi thay đổi nó
- [Getting Started](getting-started.md) - hướng dẫn đầy đủ cho lần thay đổi đầu tiên
- [Editing & Iterating on a Change](editing-changes.md) - điều chỉnh một thay đổi khi bạn học hỏi
- [Concepts: Delta Specs](concepts.md#delta-specs) - tại sao delta làm cho công việc trên hệ thống đã tồn tại trở nên sạch sẽ
- [Customization](customization.md) - dạy OpenSpec các quy ước của dự án bạn