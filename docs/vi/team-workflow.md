# OpenSpec trong môi trường làm việc nhóm

Tất cả nội dung trong các hướng dẫn khác đều hoạt động giống nhau dù bạn làm việc đơn lẻ hay trong nhóm 20 người. Điểm khác biệt khi làm việc nhóm chỉ là những câu hỏi ở phần rìa: các spec nên được lưu ở đâu, các thành viên trong nhóm đánh giá kế hoạch như thế nào, và tất cả những điều này phù hợp với quy trình pull-request mà chúng ta đã có như thế nào?

Câu trả lời ngắn gọn: một thay đổi chỉ đơn giản là các tệp, và OpenSpec không bao giờ tác động đến git. Do đó nó phù hợp với quy trình làm việc hiện tại của bạn thay vì thay thế nó. Trang này sẽ nêu rõ các quy ước hoạt động hiệu quả.

## Một quy tắc duy nhất: OpenSpec không tác động đến git

OpenSpec chỉ đọc và ghi các tệp Markdown thuần dưới thư mục `openspec/`. Nó không bao giờ commit, tạo nhánh, đẩy (push) hoặc kéo (pull) trong dự án của bạn — và cũng không tự động nhân bản (clone) hoặc đồng bộ một [kho lưu trữ](stores-beta/user-guide.md) của riêng nó. Điều đó có nghĩa là:

- **Bạn commit thư mục `openspec/` giống như bất kỳ mã nguồn nào khác.** Các spec, các thay đổi đang hoạt động và kho lưu trữ đều là một phần của lịch sử dự án của bạn. (Đúng, hãy commit toàn bộ thư mục — xem [Câu hỏi thường gặp](faq.md#should-i-commit-the-openspec-folder-to-git).)
- **Một thay đổi là một thư mục bạn quản lý phiên bản giống như mã nguồn.** `openspec/changes/add-dark-mode/` chỉ đơn giản là các tệp trên một nhánh.
- **Tất cả nội dung bên dưới đều là quy ước, không phải là quy định bắt buộc.** OpenSpec không bắt bạn phải thực hiện theo cách này; nó chỉ phù hợp và hoạt động trơn tru mà thôi.

## Quy trình làm việc hàng ngày

Quy trình làm việc hiệu quả sẽ gắn một thay đổi với một nhánh và một pull request:

```
git switch -c add-dark-mode        bắt đầu một nhánh như thông thường
   │
/opsx:propose add-dark-mode        soạn thảo kế hoạch (đề xuất + spec + nhiệm vụ)
   │
REVIEW THE PLAN                    bạn đọc kế hoạch trước khi viết bất kỳ mã nào — xem phần Đánh giá một thay đổi
   │
/opsx:apply                        xây dựng tính năng; kết quả tạo ra + thay đổi mã cùng lúc
   │
git commit && open a PR            PR chứa cả delta spec VÀ mã nguồn
   │
các thành viên trong nhóm đánh giá, merge
   │
/opsx:archive                      gộp delta vào thư mục specs/, di chuyển thư mục thay đổi vào archive/
```

Kế hoạch và mã nguồn nằm cạnh nhau trên cùng một nhánh, do đó các thành viên trong nhóm có thể đánh giá cả hai cùng lúc, và sáu tháng sau spec đã được lưu trữ vẫn giải thích được lý do tại sao mã nguồn lại có hình dạng như hiện tại.

## Đánh giá spec trong một pull request

Đây là lúc nhóm làm việc cảm nhận được lợi ích. Khi một PR bao gồm delta spec của thay đổi, người đánh giá nhận được thứ mà một diff thô không bao giờ mang lại: **một bản tường thuật bằng ngôn ngữ tự nhiên về mục đích của thay đổi này**, trước khi họ đọc bất kỳ dòng mã nào.

Thứ tự đánh giá phù hợp cho người đánh giá:
1. **Đọc tệp `proposal.md`** — đây có phải là vấn đề và phạm vi đúng không?
2. **Đọc delta nằm trong thư mục `specs/`** — tiêu chí "hoàn thành" có được định nghĩa đúng không? (Đây là bước đánh giá nhanh 2 phút theo hướng dẫn [Đánh giá một thay đổi](reviewing-changes.md), hiện đang diễn ra trong PR.)
3. **Sau đó đọc diff mã nguồn** — mã nguồn có đáp ứng đúng các yêu cầu đó không?

Người đánh giá không đồng ý với *cách tiếp cận* có thể phản hồi ngay trên đề xuất một cách dễ dàng, thay vì phải tranh cãi lại vấn đề đó trên 300 dòng mã nguồn. Hãy đặt delta spec ở phần đầu của mô tả PR, hoặc chỉ dẫn người đánh giá đến thư mục thay đổi, để họ bắt đầu đọc từ đó.

## Thời điểm lưu trữ (archive)

Lưu trữ (archive) sẽ gộp các delta của thay đổi vào thư mục `openspec/specs/` chính và di chuyển thư mục thay đổi đến đường dẫn `openspec/changes/archive/YYYY-MM-DD-<name>/`. Vì `specs/` là **nguồn thông tin chung thống nhất**, thời điểm thực hiện lưu trữ rất quan trọng khi làm việc nhóm. Dưới đây là hai quy ước có thể áp dụng:

- **Lưu trữ sau khi PR được merge (khuyến nghị).** Nhánh mang theo thay đổi đang hoạt động; một khi nó được merge vào nhánh chính của bạn, hãy thực hiện lưu trữ tại đó (thường là một commit theo dõi nhỏ hoặc dọn dẹp theo lịch trình). Cách này đảm bảo thư mục `specs/` chung chỉ được cập nhật khi có tính năng thực sự được phát hành.
- **Lưu trữ ngay trong PR.** Đơn giản hơn đối với các nhóm nhỏ: cùng một PR thêm mã nguồn cũng sẽ đồng bộ và lưu trữ. Điểm đánh đổi là diff của thư mục `specs/` và diff mã nguồn sẽ xuất hiện cùng lúc, điều này có thể làm PR trở nên rối hơn.

Hãy chọn một cách và áp dụng nhất quán. Dù chọn cách nào, lệnh `/opsx:archive` cũng sẽ kiểm tra xem các nhiệm vụ đã hoàn thành chưa và đề nghị đồng bộ trước, do đó không có gì bị merge dở dang một cách tình cờ.

## Hai người, các thay đổi song song

Vì các thay đổi là các thư mục riêng biệt, chúng không xung đột với nhau:
- **Các thay đổi khác nhau, người thực hiện khác nhau — không có vấn đề gì.** `add-dark-mode` và `rate-limit-login` là các thư mục khác nhau trên các nhánh khác nhau; chúng không tác động đến nhau cho đến khi cả hai được lưu trữ.
- **Một thay đổi, một người phụ trách.** Hai người chỉnh sửa cùng một thư mục thay đổi sẽ xung đột giống hệt như hai người chỉnh sửa cùng một tệp. Hãy giữ mỗi thay đổi chỉ có một tác giả, hoặc tách nó thành hai thay đổi riêng (đây cũng là lý do khác để bạn [định kích thước phù hợp](writing-specs.md#right-size-the-change)).
- **Nơi duy nhất xảy ra xung đột là thư mục `specs/`.** Nếu hai thay đổi cùng chỉnh sửa *cùng một* yêu cầu, việc lưu trữ thay đổi thứ hai sẽ gây xung đột tại đường dẫn `openspec/specs/…/spec.md` — hãy giải quyết nó giống như mọi xung đột merge khác, giữ lại yêu cầu phù hợp với thực tế. Trường hợp này rất hiếm xảy ra, và đó là một tính năng: git đang thông báo cho bạn biết hai thay đổi đã không đồng ý về cách hệ thống nên hoạt động.

## Khi kế hoạch vượt quá phạm vi một kho lưu trữ

Tất cả nội dung trên đều giả định rằng kế hoạch được lưu trong thư mục `openspec/` riêng của kho lưu trữ mã nguồn, đây là thiết lập mặc định đúng đắn. Khi kế hoạch của bạn thực sự trải rộng trên nhiều kho lưu trữ hoặc nhóm — ví dụ một tính năng tác động đến 3 dịch vụ, hoặc các yêu cầu mà một nhóm sở hữu và các nhóm khác sử dụng — đó là lúc tính năng beta **stores** phát huy tác dụng: kế hoạch sẽ có kho lưu trữ riêng mà bất kỳ kho lưu trữ mã nguồn nào cũng có thể tham chiếu đến. Bắt đầu bằng [Hướng dẫn sử dụng Stores](stores-beta/user-guide.md).

## Tài liệu tham khảo tiếp theo

- [Đánh giá một thay đổi](reviewing-changes.md) — bước đánh giá, hiện đã được tích hợp trong PR của bạn.
- [Viết Spec chất lượng](writing-specs.md) — bao gồm cách định kích thước phù hợp cho thay đổi để nó vừa với một nhánh.
- [Hướng dẫn sử dụng Stores](stores-beta/user-guide.md) — kế hoạch trải rộng trên nhiều kho lưu trữ và nhóm.