# Xem xét thay đổi

Toàn bộ lời hứa của OpenSpec là bạn và AI **cùng thống nhất về những gì cần xây dựng trước khi viết bất kỳ dòng mã nào.** Thỏa thuận đó chỉ có ý nghĩa nếu bạn thực sự đọc những gì AI đã soạn thảo. Trang này nói về hai phút bạn dành cho việc đó — mở cái gì, theo thứ tự nào, và cần tìm kiếm điều gì.

Kèo cược này rất đơn giản: phát hiện ra một lựa chọn sai lầm trong kế hoạch chỉ có một đoạn văn gần như không tốn chi phí. Phát hiện cùng một lựa chọn sai lầm đó trong 300 dòng mã thì không phải vậy. Bước xem xét là lúc bạn thu lợi từ kèo cược đó.

## Hai thời điểm bạn xem xét

Chính xác có hai thời điểm:

```
/opsx:propose ──► REVIEW THE PLAN ──► /opsx:apply ──► REVIEW THE CODE ──► /opsx:archive
                  (trước khi viết bất kỳ mã nào)                    (/opsx:verify)
```

1. **Sau khi chạy `/opsx:propose`** (hoặc `/opsx:ff`), trước khi chạy `/opsx:apply` — đọc kế hoạch khi nó vẫn chỉ là văn bản thôi.
2. **Sau khi hoàn thành xây dựng**, với lệnh `/opsx:verify` — kiểm tra xem mã thực tế đã làm đúng những gì kế hoạch quy định chưa.

Bước xem xét đầu tiên là bước tiết kiệm thời gian và công sức cho bạn nhất, cũng là bước mà nhiều người bỏ qua. Trang này dành phần lớn thời gian để nói về bước đó.

## Đọc theo thứ tự này

Một thay đổi là một thư mục chứa tệp Markdown thuần nằm ở `openspec/changes/<name>/`. Đọc các tệp theo thứ tự giúp bạn dừng sớm nhất nếu phát hiện có vấn đề:

```
openspec/changes/add-dark-mode/
├── proposal.md      1. mục đích và phạm vi   ← nếu cái này sai, dừng lại ở đây
├── specs/…/spec.md  2. các yêu cầu       ← phần cốt lõi của bước xem xét
├── design.md        (chỉ dành cho các thay đổi lớn) — cách tiếp cận kỹ thuật
└── tasks.md         3. kế hoạch công việc
```

Bạn không cần đọc từng dòng. Bạn chỉ cần trả lời ba câu hỏi, mỗi câu hỏi tương ứng với một tệp.

## Tài liệu đề xuất: đây có phải là vấn đề đúng không?

Mở tệp `proposal.md` trước tiên. Tệp này ghi lại "tại sao" và "làm gì" — mục đích, phạm vi, cách tiếp cận trong một hoặc hai đoạn văn.

**Dấu hiệu của tài liệu đề xuất tốt:** một mục đích rõ ràng, phạm vi bạn nhận ra được, và lý do tại sao việc này đáng làm ngay bây giờ.

**Dấu hiệu cảnh báo:**
- Nó giải quyết một vấn đề *hơi khác* so với vấn đề bạn yêu cầu.
- Phạm vi đã mở rộng — bạn yêu cầu thêm nút chuyển đổi chủ đề mà tài liệu đề xuất còn đề cập đến cả chức năng xác thực "nhân tiện chúng ta đang làm việc ở đây".
- Nó mơ hồ. "Cải thiện trang cài đặt" không phải là một phạm vi rõ ràng; "thêm nút chuyển đổi chế độ tối phù hợp với tùy chọn của hệ điều hành" thì mới là phạm vi rõ ràng.

**Câu hỏi cần trả lời:** *Tài liệu này có khớp với những gì tôi thực sự yêu cầu không, và có thứ gì đang lén lút thêm vào không?* Nếu câu trả lời là không, hãy dừng lại — không cần đọc tiếp, sửa tài liệu đề xuất (xem phần [Phản đối rất dễ dàng](#pushing-back-is-cheap)).

## Các bản chỉnh sửa spec: định nghĩa "hoàn thành" có đúng không?

Đây là phần cốt lõi của bước xem xét. Các bản chỉnh sửa spec nằm trong thư mục `specs/` quy định những gì sẽ *đúng* khi thay đổi được phát hành — bao gồm các yêu cầu và các kịch bản chứng minh chúng đúng:

```markdown
## ADDED Requirements

### Requirement: Dark Mode Toggle
The system SHALL let a user switch between light and dark themes.

#### Scenario: Respects the OS preference on first load
- GIVEN a user who has never set a theme
- WHEN they open the app on a device set to dark mode
- THEN the app renders in dark mode
```

**Dấu hiệu của yêu cầu tốt:** một câu lệnh rõ ràng có chứa `SHALL`/`MUST` mà bạn có thể đưa cho người kiểm thử, và ít nhất một kịch bản có GIVEN/WHEN/THEN thực sự kiểm tra câu lệnh đó.

**Dấu hiệu cảnh báo:**
- **Yêu cầu mơ hồ.** Câu "Hệ thống PHẢI nhanh" không thể xây dựng hay kiểm thử được. Nhanh là nhanh như thế nào?
- **Yêu cầu không có kịch bản đi kèm**, hoặc kịch bản không kiểm tra yêu cầu mà nó thuộc về.
- **Điểm phát hiện giá trị nhất: những gì bị thiếu.** AI ghi lại đúng những gì bạn *đã nói*. Công việc của bạn là chú ý những gì bạn *đã quên* nói. Nếu bạn quan tâm nhất đến trường hợp phù hợp với tùy chọn hệ điều hành mà không có kịch bản nào đề cập đến nó, thì bước xem xét này đã hoàn toàn xứng đáng với thời gian bạn bỏ ra.

Đọc các bản chỉnh sửa spec với câu hỏi *tôi có hài lòng nếu hệ thống thực hiện đúng — và chỉ — những gì được quy định ở đây không?* Ở đây chưa có gì liên quan đến mã, nên việc thay đổi vẫn rất dễ dàng.

## Các nhiệm vụ: kế hoạch công việc có hợp lý không?

Mở tệp `tasks.md` cuối cùng. Đây là danh sách kiểm tra thực hiện mà AI sẽ làm theo.

**Dấu hiệu của kế hoạch tốt:** các bước được sắp xếp theo thứ tự, mỗi bước có thể truy xuất về một yêu cầu, không có gì khó hiểu.

**Dấu hiệu cảnh báo:**
- Một nhiệm vụ không có yêu cầu tương ứng (nó đến từ đâu?).
- Một nhiệm vụ khổng lồ có tên "thực hiện tính năng" che giấu tất cả các quyết định thực tế.
- Một nhiệm vụ liên quan đến thứ gì đó nằm ngoài phạm vi bạn vừa phê duyệt.

Bạn không cần ước lượng thời gian hay quản lý quá chi tiết ở đây — bạn chỉ cần kiểm tra xem kế hoạch có khớp với các yêu cầu bạn đã chấp nhận trước đó không.

## Phản đối rất dễ dàng

Nếu bất kỳ câu trả lời nào trong ba câu hỏi trên là sai, hãy nói ra. Không có giai đoạn cố định hay thứ gì bị khóa — bạn sửa nó và tiếp tục. Có hai cách, giống hệt như trong phần [Chỉnh sửa thay đổi](editing-changes.md):

- **Tự chỉnh sửa tệp.** Đây là tệp Markdown thuần; bạn có thể sửa dòng phạm vi, làm rõ yêu cầu, xóa nhiệm vụ.
- **Nói cho AI biết vấn đề gì** và để AI sửa đổi: *"bỏ các thay đổi về xác thực — nằm ngoài phạm vi,"* *"thêm kịch bản cho trường hợp người dùng đã chọn chủ đề,"* *"chia nhiệm vụ 3 thành phần schema và UI."*

Sau đó đọc lại phần bạn đã thay đổi. Soạn thảo lại cho đến khi bạn có kế hoạch mà bạn dám ký tên vào. Quá trình điều chỉnh qua lại giữa bạn và AI *chính là* quá trình xây dựng sản phẩm.

## Sau khi có mã: xác minh

Sau khi công việc được xây dựng xong, `/opsx:verify` là bước xem xét thứ hai của bạn. Nó đọc lại các sản phẩm phụ và mã, sau đó báo cáo các điểm không khớp theo ba chiều:

| Chiều | Nó kiểm tra điều gì |
|-----------|----------------|
| **Tính đầy đủ** | Tất cả nhiệm vụ đã hoàn thành, tất cả yêu cầu đã được thực hiện, các kịch bản đã được bao phủ |
| **Tính chính xác** | Việc thực hiện khớp với mục đích của spec, các trường hợp biên đã được xử lý |
| **Tính nhất quán** | Các quyết định thiết kế thực sự xuất hiện trong mã |

```
You: /opsx:verify

AI:  Verifying add-dark-mode...

     COMPLETENESS
     ✓ All 8 tasks in tasks.md are checked
     ✓ All requirements in specs have corresponding code
     ⚠ Scenario "Respects the OS preference on first load" has no test coverage
```

Nó đánh dấu các vấn đề ở mức CRITICAL, WARNING hoặc SUGGESTION, và nó **không** chặn việc lưu trữ — nó chỉ ra các khoảng trống và để bạn tự quyết định. Đây là sự khác biệt giữa "AI có viết mã không" và "AI có xây dựng đúng những gì chúng ta đã thỏa thuận không."

Lệnh `/opsx:verify` nằm trong hồ sơ mở rộng. Nếu bạn không có lệnh này, hãy bật nó bằng lệnh `openspec config profile` (sau đó chạy `openspec update`), hoặc tự đọc lại thay đổi và khác biệt giữa các phiên bản.

## Xem xét với quy mô phù hợp

Không phải thay đổi nào cũng cần xem xét toàn bộ. Việc sửa lỗi chính tả trong một tệp chỉ cần lướt qua 20 giây. Thay đổi liên quan đến xác thực, thanh toán hoặc dữ liệu không thể khôi phục thì cần trả lời tất cả các câu hỏi trên. Mục đích không bao giờ là hình thức — mà là dành sự chú ý của bạn cho những nơi lỗi sẽ tốn kém, và lướt qua những nơi lỗi không gây hậu quả.

## Danh sách kiểm tra hai phút

- [ ] Mục đích của tài liệu đề xuất khớp với những gì tôi yêu cầu.
- [ ] Không có thứ gì thừa lọt vào phạm vi.
- [ ] Tất cả yêu cầu đủ cụ thể để kiểm thử.
- [ ] Mỗi yêu cầu đều có kịch bản thực sự kiểm tra nó.
- [ ] Trường hợp tôi quan tâm nhất đã được bao phủ.
- [ ] Các nhiệm vụ tương ứng với yêu cầu; không có gì khó hiểu hay nằm ngoài phạm vi.
- [ ] Tôi sẽ yên tâm nếu AI xây dựng đúng những gì này và không thêm gì khác.

Nếu tất cả 7 mục đều đạt, hãy chạy lệnh `/opsx:apply` với sự tự tin. Nếu bất kỳ mục nào không đạt, đó không phải là thất bại — đó là hai phút xem xét đang làm đúng công việc của nó.

## Đọc tiếp

- [Viết spec tốt](writing-specs.md) — mặt còn lại: cách soạn thảo yêu cầu và kịch bản đáng để phê duyệt.
- [Chỉnh sửa & lặp lại thay đổi](editing-changes.md) — cơ chế thay đổi kế hoạch sau khi bạn đã bắt đầu.
- [Quy trình làm việc](workflows.md) — vị trí của bước xem xét trong vòng lặp lớn hơn.