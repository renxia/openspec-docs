---
layout: home

hero:
  name: "OpenSpec"
  text: "Phát triển Dựa trên Thông số Kỹ thuật cho Trợ lý AI"
  tagline: Một spec nhẹ để xây dựng và quản lý các dự án trợ lý AI.
  actions:
    - theme: brand
      text: Bắt đầu
      link: ./getting-started
    - theme: alt
      text: Trang chủ
      link: /

features:
  - title: Quy trình làm việc Ưu tiên Spec
    details: Xác định yêu cầu trước khi viết mã.
  - title: Thiết kế Tích hợp Sẵn AI
    details: Được xây dựng cho Claude Code, Cursor, Windsurf và nhiều công cụ khác.
  - title: Đa ngôn ngữ
    details: Tài liệu có sẵn bằng nhiều ngôn ngữ khác nhau.
---

# Tài liệu OpenSpec

Chào mừng bạn. Đây là trang chủ cho mọi thứ liên quan đến OpenSpec.

OpenSpec giúp bạn và trợ lý lập trình AI của mình **đồng thuận về những gì cần xây dựng trước khi bất kỳ dòng mã nào được viết.** Bạn mô tả thay đổi, AI soạn thảo một spec ngắn và danh sách nhiệm vụ, cả hai cùng xem cùng một kế hoạch, rồi công việc mới diễn ra. Không còn tình trạng phát hiện giữa chừng rằng AI đã xây dựng thứ sai yêu cầu nữa.

Nếu bạn chỉ có thời gian đọc một vài trang, hãy ưu tiên đọc hai trang này:

1. [Bắt đầu](getting-started.md): cài đặt, khởi tạo, và hoàn thành thay đổi đầu tiên của bạn.
2. [Cách hoạt động của Lệnh](how-commands-work.md): nơi bạn thực sự nhập `/opsx:propose` (gợi ý: trong cuộc trò chuyện với AI, không phải trong terminal). Điều này khiến hầu hết mọi người gặp khó khăn ít nhất một lần.

Trang thứ hai quan trọng hơn vẻ bề ngoài của nó. OpenSpec có hai phần: một công cụ dòng lệnh bạn chạy trong terminal, và các lệnh gạch chéo bạn gửi cho trợ lý AI của mình. Biết được đâu là đâu sẽ giúp bạn tránh được tình huống nhầm lẫn phổ biến nhất.

> **Thói quen tốt nhất cần xây dựng đầu tiên: khi bạn không chắc cần xây dựng gì, hãy bắt đầu với `/opsx:explore`.** Đây là một đối tác suy nghĩ không rủi ro, đọc mã của bạn, cân nhắc các lựa chọn, và làm rõ ý tưởng mơ hồ thành một kế hoạch cụ thể trước khi bất kỳ tài liệu hay mã nào được tạo. Hướng dẫn [Khám phá Trước Tiên](explore.md) sẽ giải thích chi tiết về điều này.

## Chọn hướng đi của bạn

**Tôi mới bắt đầu.** Hãy bắt đầu với [Bắt đầu](getting-started.md), sau đó lướt qua [Khái niệm Cốt lõi Tổng quan](overview.md). Khi có điều gì đó khó hiểu, bạn có thể tham khảo [Câu hỏi Thường gặp](faq.md) và [Từ điển Thuật ngữ](glossary.md) ngay gần đó.

**Tôi có vấn đề nhưng chưa có kế hoạch.** Đây là trường hợp phổ biến, và có hướng dẫn riêng cho nó: [Khám phá Trước Tiên](explore.md). Hãy sử dụng `/opsx:explore` để cùng AI suy nghĩ về vấn đề trước khi cam kết bất kỳ điều gì.

**Tôi có một mã nguồn dự án lớn đã tồn tại.** Bạn không cần ghi chú toàn bộ nó. [Sử dụng OpenSpec trong Dự án Hiện có](existing-projects.md) sẽ hướng dẫn bạn bắt đầu với mã nguồn dự án thực tế, đã phát triển từ trước mà không cần phải xử lý tất cả mọi thứ cùng lúc.

**Tôi chỉ muốn làm cho nó hoạt động thôi.** Hãy xem [Cài đặt](installation.md), chạy lệnh `openspec init`, sau đó đọc [Cách hoạt động của Lệnh](how-commands-work.md) để lệnh gạch chéo đầu tiên của bạn được nhập đúng nơi.

**Tôi học tốt qua ví dụ.** Trang [Ví dụ & Công thức](examples.md) sẽ hướng dẫn bạn thực hiện các thay đổi thực tế từ đầu đến cuối: một tính năng nhỏ, sửa lỗi, tái cấu trúc mã, khám phá ý tưởng.

**AI vừa soạn thảo xong một kế hoạch — bây giờ làm gì?** Hãy đọc nó. [Xem xét Thay đổi](reviewing-changes.md) sẽ hướng dẫn bạn kiểm tra nhanh trong 2 phút để phát hiện lỗi sai khi vẫn còn dễ sửa, và [Viết Spec Tốt](writing-specs.md) sẽ giải thích những gì cần có trong một kế hoạch đáng để phê duyệt.

**Tôi làm việc nhóm.** [OpenSpec trong Môi trường Làm việc Nhóm](team-workflow.md) sẽ hướng dẫn bạn cách một thay đổi được ánh xạ lên nhánh và pull request, cũng như cách các thành viên trong nhóm xem xét kế hoạch trước khi viết mã.

**Tôi đang chuyển từ quy trình làm việc cũ.** [Hướng dẫn Di chuyển](migration-guide.md) sẽ giải thích những gì đã thay đổi và lý do, đồng thời đảm bảo rằng công việc hiện tại của bạn vẫn được giữ nguyên an toàn.

**Tôi muốn tùy chỉnh nó cho phù hợp với quy trình của nhóm mình.** [Tùy chỉnh](customization.md) bao gồm cấu hình dự án, lược đồ tùy chỉnh, và ngữ cảnh chia sẻ.

**Có gì đó bị lỗi.** [Khắc phục sự cố](troubleshooting.md) tổng hợp các lỗi mà người dùng thường gặp phải, cùng với cách khắc phục.

## Toàn bộ lộ trình tài liệu

### Bắt đầu từ đây

| Tài liệu | Nội dung bạn nhận được |
|-----|-------------------|
| [Bắt đầu](getting-started.md) | Cài đặt, khởi tạo, và hoàn thành thay đổi đầu tiên của bạn từ đầu đến cuối |
| [Khám phá Trước Tiên](explore.md) | Sử dụng `/opsx:explore` để suy nghĩ về ý tưởng trước khi bạn cam kết thực hiện |
| [Cách hoạt động của Lệnh](how-commands-work.md) | Nơi chạy các lệnh gạch chéo, ý nghĩa của "chế độ tương tác", so sánh giữa terminal và chat |
| [Khái niệm Cốt lõi Tổng quan](overview.md) | Toàn bộ mô hình tư duy trên một trang: Spec, thay đổi, delta, kho lưu trữ |
| [Cài đặt](installation.md) | Hướng dẫn cài đặt qua npm, pnpm, yarn, bun, Nix, và cách kiểm tra cài đặt thành công |

### Sử dụng hàng ngày

| Tài liệu | Nội dung bạn nhận được |
|-----|-------------------|
| [Quy trình làm việc](workflows.md) | Các mẫu phổ biến và thời điểm nên sử dụng từng lệnh |
| [Ví dụ & Công thức](examples.md) | Hướng dẫn thực hiện các thay đổi thực tế từ đầu đến cuối, có thể sao chép dán trực tiếp |
| [Viết Spec Tốt](writing-specs.md) | Mô tả yêu cầu và kịch bản mạnh trông như thế nào, và cách điều chỉnh kích thước thay đổi phù hợp |
| [Xem xét Thay đổi](reviewing-changes.md) | Kiểm tra nhanh trong 2 phút đối với kế hoạch đã soạn thảo trước khi viết bất kỳ mã nào |
| [OpenSpec trong Môi trường Làm việc Nhóm](team-workflow.md) | Cách các thay đổi phù hợp với nhánh, pull request, và quy trình xem xét |
| [Sử dụng OpenSpec trong Dự án Hiện có](existing-projects.md) | Áp dụng OpenSpec trên mã nguồn dự án lớn, đã phát triển từ trước |
| [Chỉnh sửa & Lặp lại Thay đổi](editing-changes.md) | Cập nhật tài liệu, quay lại các bước trước, đối chiếu các chỉnh sửa thủ công |
| [Lệnh](commands.md) | Tài liệu tham khảo cho tất cả các lệnh gạch chéo `/opsx:*` |
| [CLI](cli.md) | Tài liệu tham khảo cho tất cả các lệnh terminal `openspec` |

### Tìm hiểu sâu hơn

| Tài liệu | Nội dung bạn nhận được |
|-----|-------------------|
| [Khái niệm](concepts.md) | Giải thích chi tiết về Spec, thay đổi, tài liệu, lược đồ, và kho lưu trữ |
| [Quy trình làm việc OPSX](opsx.md) | Lý do quy trình làm việc linh hoạt thay vì bị khóa theo giai đoạn, cùng với phân tích sâu về kiến trúc |
| [Từ điển Thuật ngữ](glossary.md) | Định nghĩa tất cả các thuật ngữ tại một nơi |

### Tùy chỉnh theo nhu cầu của bạn

| Tài liệu | Nội dung bạn nhận được |
|-----|-------------------|
| [Tùy chỉnh](customization.md) | Cấu hình dự án, lược đồ tùy chỉnh, ngữ cảnh chia sẻ |
| [Đa ngôn ngữ](multi-language.md) | Tạo tài liệu bằng các ngôn ngữ khác ngoài tiếng Anh |
| [Công cụ được Hỗ trợ](supported-tools.md) | Hơn 25 công cụ AI mà OpenSpec tích hợp với, và vị trí lưu trữ tệp |

### Khi bạn cần trợ giúp

| Tài liệu | Nội dung bạn nhận được |
|-----|-------------------|
| [Câu hỏi Thường gặp](faq.md) | Câu trả lời nhanh cho những câu hỏi mà mọi người thường hỏi nhất |
| [Khắc phục sự cố](troubleshooting.md) | Cách khắc phục cụ thể cho các lỗi cụ thể |
| [Hướng dẫn Di chuyển](migration-guide.md) | Chuyển từ quy trình làm việc cũ sang OPSX |

### Phối hợp giữa các kho lưu trữ (beta)

| Tài liệu | Nội dung bạn nhận được |
|-----|-------------------|
| [Stores: Hướng dẫn Người dùng](stores-beta/user-guide.md) | Lập kế hoạch trong kho lưu trữ riêng khi công việc của bạn trải rộng qua nhiều kho lưu trữ hoặc nhóm |
| [Hợp đồng Tác nhân](agent-contract.md) | Các giao diện CLI có thể đọc được bằng máy mà các tác nhân sử dụng |

## Phiên bản tóm tắt 30 giây

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← optional, but a great habit
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

Các bước 1 và 2 diễn ra trong terminal của bạn. Phần còn lại diễn ra trong cuộc trò chuyện với trợ lý AI của bạn. Sự phân chia này là điều duy nhất đáng để bạn ghi nhớ, và [Cách hoạt động của Lệnh](how-commands-work.md) sẽ giải thích chính xác lý do. Bước 3 là tùy chọn, nhưng bắt đầu với `/opsx:explore` khi bạn không chắc chắn là thói quen đáng để xây dựng nhất.

## Nơi khác để nhận trợ giúp

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) dành cho các câu hỏi, ý tưởng và trợ giúp.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) dành cho báo cáo lỗi và yêu cầu tính năng mới.
- Lệnh **`openspec feedback "your message"`** sẽ gửi phản hồi trực tiếp từ terminal của bạn (lệnh này sẽ mở một vấn đề trên GitHub).

Phát hiện có điều gì sai, lỗi thời hoặc khó hiểu trong tài liệu này? Đó là một lỗi. Hãy mở một vấn đề hoặc PR. Cải tiến tài liệu là một trong những đóng góp giá trị nhất mà bạn có thể thực hiện.