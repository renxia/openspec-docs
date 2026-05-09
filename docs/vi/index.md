---
layout: home

hero:
  name: "OpenSpec"
  text: "Phát triển dựa trên đặc tả cho trợ lý AI"
  tagline: Một đặc tả nhẹ để xây dựng và quản lý các dự án trợ lý AI.
  actions:
    - theme: brand
      text: Bắt đầu
      link: ./getting-started
    - theme: alt
      text: Trang chủ
      link: /

features:
  - title: Quy trình ưu tiên đặc tả
    details: Xác định yêu cầu trước khi viết mã.
  - title: Thiết kế bản địa cho AI
    details: Được xây dựng cho Claude Code, Cursor, Windsurf và nhiều hơn nữa.
  - title: Đa ngôn ngữ
    details: Tài liệu có sẵn bằng nhiều ngôn ngữ.
---


Triết lý của chúng tôi:

```text
→ linh hoạt không cứng nhắc
→ lặp đi lặp lại không theo thác nước
→ đơn giản không phức tạp
→ xây dựng cho dự án cũ không chỉ dự án mới
→ có thể mở rộng từ dự án cá nhân đến doanh nghiệp
```

> [!TIP]
> **Quy trình làm việc mới hiện đã có sẵn!** Chúng tôi đã xây dựng lại OpenSpec với một quy trình mới được hướng dẫn bởi các sản phẩm.
>
> Chạy `/opsx:propose "ý tưởng của bạn"` để bắt đầu. → [Tìm hiểu thêm tại đây](opsx.md)

<p align="center">
  Theo dõi <a href="https://x.com/0xTab">@0xTab trên X</a> để cập nhật · Tham gia <a href="https://discord.gg/YctCnvvshC">Discord OpenSpec</a> để được trợ giúp và giải đáp thắc mắc.
</p>

## Xem nó hoạt động

```text
You: /opsx:propose add-dark-mode
AI:  Đã tạo openspec/changes/add-dark-mode/
     ✓ proposal.md — lý do thực hiện, những thay đổi
     ✓ specs/       — yêu cầu và kịch bản
     ✓ design.md    — cách tiếp cận kỹ thuật
     ✓ tasks.md     — danh sách công việc triển khai
     Sẵn sàng để triển khai!

You: /opsx:apply
AI:  Đang triển khai các công việc...
     ✓ 1.1 Thêm nhà cung cấp ngữ cảnh chủ đề
     ✓ 1.2 Tạo thành phần chuyển đổi
     ✓ 2.1 Thêm biến CSS
     ✓ 2.2 Kết nối localStorage
     Tất cả công việc đã hoàn thành!

You: /opsx:archive
AI:  Đã lưu trữ vào openspec/changes/archive/2025-01-23-add-dark-mode/
     Đặc tả đã được cập nhật. Sẵn sàng cho tính năng tiếp theo.
```

<details>
<summary><strong>Bảng điều khiển OpenSpec</strong></summary>
</details>

## Bắt đầu nhanh

**Yêu cầu Node.js 20.19.0 hoặc cao hơn.**

Cài đặt OpenSpec toàn cục:

```bash
npm install -g @fission-ai/openspec@latest
```

Sau đó điều hướng đến thư mục dự án của bạn và khởi tạo:

```bash
cd your-project
openspec init
```

Bây giờ nói với AI của bạn: `/opsx:propose <điều-bạn-muốn-xây-dựng>`

Nếu bạn muốn quy trình mở rộng (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), hãy chọn nó với `openspec config profile` và áp dụng với `openspec update`.

> [!NOTE]
> Không chắc công cụ của bạn có được hỗ trợ không? [Xem danh sách đầy đủ](supported-tools.md) – chúng tôi hỗ trợ hơn 25 công cụ và đang tiếp tục tăng.
>
> Cũng hoạt động với pnpm, yarn, bun và nix. [Xem các tùy chọn cài đặt](installation.md).

## Tài liệu

→ **[Bắt đầu](getting-started.md)**: các bước đầu tiên<br>
→ **[Quy trình làm việc](workflows.md)**: các tổ hợp và mẫu<br>
→ **[Các lệnh](commands.md)**: lệnh gạch chéo & kỹ năng<br>
→ **[CLI](cli.md)**: tham chiếu dòng lệnh<br>
→ **[Công cụ được hỗ trợ](supported-tools.md)**: tích hợp công cụ & đường dẫn cài đặt<br>
→ **[Khái niệm](concepts.md)**: cách mọi thứ hoạt động<br>
→ **[Đa ngôn ngữ](multi-language.md)**: hỗ trợ đa ngôn ngữ<br>
→ **[Tùy chỉnh](customization.md)**: làm cho nó của bạn


## Tại sao chọn OpenSpec?

Các trợ lý lập trình AI rất mạnh mẽ nhưng khó dự đoán khi các yêu cầu chỉ tồn tại trong lịch sử trò chuyện. OpenSpec thêm một lớp đặc tả nhẹ để bạn thống nhất về những gì cần xây dựng trước khi bất kỳ mã nào được viết.

- **Thống nhất trước khi xây dựng** — con người và AI thống nhất về đặc tả trước khi mã được viết
- **Giữ ngăn nắp** — mỗi thay đổi có thư mục riêng với đề xuất, đặc tả, thiết kế và công việc
- **Làm việc linh hoạt** — cập nhật bất kỳ sản phẩm nào bất cứ lúc nào, không có giai đoạn cứng nhắc
- **Sử dụng công cụ của bạn** — hoạt động với hơn 20 trợ lý AI thông qua các lệnh gạch chéo

### So sánh với chúng tôi

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Kỹ lưỡng nhưng nặng nề. Các giai đoạn cứng nhắc, nhiều Markdown, thiết lập Python. OpenSpec nhẹ hơn và cho phép bạn lặp lại tự do.

**vs. [Kiro](https://kiro.dev)** (AWS) — Mạnh mẽ nhưng bạn bị khóa vào IDE của họ và giới hạn ở các mô hình Claude. OpenSpec hoạt động với các công cụ bạn đã sử dụng.

**vs. không có gì** — Lập trình AI mà không có đặc tả có nghĩa là các lời nhắc mơ hồ và kết quả khó dự đoán. OpenSpec mang lại tính dự đoán mà không cần nghi thức.

## Cập nhật OpenSpec

**Nâng cấp gói**

```bash
npm install -g @fission-ai/openspec@latest
```

**Làm mới hướng dẫn tác nhân**

Chạy lệnh này bên trong mỗi dự án để tạo lại hướng dẫn AI và đảm bảo các lệnh gạch chéo mới nhất đang hoạt động:

```bash
openspec update
```

## Ghi chú sử dụng

**Lựa chọn mô hình**: OpenSpec hoạt động tốt nhất với các mô hình có khả năng suy luận cao. Chúng tôi khuyến nghị Opus 4.5 và GPT 5.2 cho cả lập kế hoạch và triển khai.

**Vệ sinh ngữ cảnh**: OpenSpec được hưởng lợi từ cửa sổ ngữ cảnh sạch. Xóa ngữ cảnh của bạn trước khi bắt đầu triển khai và duy trì vệ sinh ngữ cảnh tốt trong suốt phiên làm việc của bạn.

## Đóng góp

**Sửa lỗi nhỏ** — Sửa lỗi, sửa lỗi chính tả và cải tiến nhỏ có thể được gửi trực tiếp dưới dạng PR.

**Thay đổi lớn hơn** — Đối với các tính năng mới, tái cấu trúc quan trọng hoặc thay đổi kiến trúc, vui lòng gửi đề xuất thay đổi OpenSpec trước để chúng tôi có thể thống nhất về mục đích và mục tiêu trước khi bắt đầu triển khai.

Khi viết đề xuất, hãy ghi nhớ triết lý OpenSpec: chúng tôi phục vụ nhiều loại người dùng khác nhau trên các tác nhân lập trình, mô hình và trường hợp sử dụng khác nhau. Các thay đổi nên hoạt động tốt cho tất cả mọi người.

**Mã do AI tạo được chào đón** — miễn là nó đã được kiểm tra và xác minh. PR chứa mã do AI tạo nên đề cập đến tác nhân lập trình và mô hình đã sử dụng (ví dụ: "Được tạo với Claude Code sử dụng claude-opus-4-5-20251101").

### Phát triển

- Cài đặt các phụ thuộc: `pnpm install`
- Xây dựng: `pnpm run build`
- Kiểm thử: `pnpm test`
- Phát triển CLI cục bộ: `pnpm run dev` hoặc `pnpm run dev:cli`
- Cam kết thông thường (một dòng): `type(scope): subject`

## Khác

<details>
<summary><strong>Telemetry</strong></summary>

OpenSpec thu thập thống kê sử dụng ẩn danh.

Chúng tôi chỉ thu thập tên lệnh và phiên bản để hiểu các mẫu sử dụng. Không có đối số, đường dẫn, nội dung hoặc PII. Tự động bị vô hiệu hóa trong CI.

**Từ chối:** `export OPENSPEC_TELEMETRY=0` hoặc `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Người bảo trì & Cố vấn</strong></summary>

Xem [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) để biết danh sách các người bảo trì cốt lõi và cố vấn giúp hướng dẫn dự án.

</details>



## Giấy phép

MIT