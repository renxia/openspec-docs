---
layout: home

hero:
  name: "OpenSpec"
  text: "Phát triển dựa trên đặc tả cho Trợ lý AI"
  tagline: Một đặc tả nhẹ nhàng để xây dựng và quản lý các dự án trợ lý AI.
  actions:
    - theme: brand
      text: Bắt đầu
      link: ./getting-started
    - theme: alt
      text: Trang chủ
      link: /

features:
  - title: Quy trình Đặc tả đi trước
    details: Định nghĩa yêu cầu trước khi viết mã.
  - title: Thiết kế Nguyên bản cho AI
    details: Được xây dựng cho Claude Code, Cursor, Windsurf và nhiều hơn nữa.
  - title: Đa ngôn ngữ
    details: Tài liệu có sẵn bằng nhiều ngôn ngữ.
---


<details>
<summary><strong>Khung đặc tả được yêu thích nhất.</strong></summary>

[![Stars](https://img.shields.io/github/stars/Fission-AI/OpenSpec?style=flat-square&label=Stars)](https://github.com/Fission-AI/OpenSpec/stargazers)
[![Downloads](https://img.shields.io/npm/dm/@fission-ai/openspec?style=flat-square&label=Downloads/mo)](https://www.npmjs.com/package/@fission-ai/openspec)
[![Contributors](https://img.shields.io/github/contributors/Fission-AI/OpenSpec?style=flat-square&label=Contributors)](https://github.com/Fission-AI/OpenSpec/graphs/contributors)

</details>
<p></p>
Triết lý của chúng tôi:

```text
→ linh hoạt không cứng nhắc
→ lặp đi lặp lại không phải thác nước
→ dễ dàng không phức tạp
→ được xây dựng cho cả dự án cũ lẫn mới
→ có thể mở rộng từ dự án cá nhân đến doanh nghiệp
```

> [!TIP]
> **Quy trình mới hiện đã có!** Chúng tôi đã xây dựng lại OpenSpec với quy trình mới được hướng dẫn bởi các sản phẩm trung gian.
>
> Chạy `/opsx:propose "ý tưởng của bạn"` để bắt đầu. → [Tìm hiểu thêm tại đây](opsx.md)

<p align="center">
  Theo dõi <a href="https://x.com/0xTab">@0xTab trên X</a> để cập nhật · Tham gia <a href="https://discord.gg/YctCnvvshC">OpenSpec Discord</a> để được hỗ trợ và giải đáp thắc mắc.
</p>

<!-- TODO: Thêm GIF demo quy trình /opsx:propose → /opsx:archive -->

## Xem nó hoạt động như thế nào

```text
Bạn: /opsx:propose add-dark-mode
AI:  Đã tạo openspec/changes/add-dark-mode/
     ✓ proposal.md — lý do chúng ta thực hiện, những gì đang thay đổi
     ✓ specs/       — yêu cầu và kịch bản
     ✓ design.md    — cách tiếp cận kỹ thuật
     ✓ tasks.md     — danh sách kiểm tra triển khai
     Sẵn sàng để triển khai!

Bạn: /opsx:apply
AI:  Đang triển khai các nhiệm vụ...
     ✓ 1.1 Thêm nhà cung cấp ngữ cảnh chủ đề
     ✓ 1.2 Tạo thành phần chuyển đổi
     ✓ 2.1 Thêm biến CSS
     ✓ 2.2 Kết nối localStorage
     Tất cả các nhiệm vụ đã hoàn thành!

Bạn: /opsx:archive
AI:  Đã lưu trữ vào openspec/changes/archive/2025-01-23-add-dark-mode/
     Đặc tả đã được cập nhật. Sẵn sàng cho tính năng tiếp theo.
```

<details>
<summary><strong>Bảng điều khiển OpenSpec</strong></summary>

</details>

## Bắt đầu nhanh

**Yêu cầu Node.js phiên bản 20.19.0 trở lên.**

Cài đặt OpenSpec toàn cục:

```bash
npm install -g @fission-ai/openspec@latest
```

Sau đó, điều hướng đến thư mục dự án của bạn và khởi tạo:

```bash
cd your-project
openspec init
```

Bây giờ, hãy nói với AI của bạn: `/opsx:propose <điều-bạn-muốn-xây-dựng>`

Nếu bạn muốn quy trình mở rộng (`/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`), hãy chọn nó bằng `openspec config profile` và áp dụng bằng `openspec update`.

> [!NOTE]
> Không chắc công cụ của bạn có được hỗ trợ không? [Xem danh sách đầy đủ](supported-tools.md) – chúng tôi hỗ trợ hơn 25 công cụ và đang tiếp tục mở rộng.
>
> Cũng hoạt động với pnpm, yarn, bun và nix. [Xem các tùy chọn cài đặt](installation.md).

## Tài liệu

→ **[Bắt đầu](getting-started.md)**: các bước đầu tiên<br>
→ **[Quy trình](workflows.md)**: các tổ hợp và mẫu<br>
→ **[Lệnh](commands.md)**: lệnh gạch chéo & kỹ năng<br>
→ **[CLI](cli.md)**: tham chiếu terminal<br>
→ **[Công cụ được hỗ trợ](supported-tools.md)**: tích hợp công cụ & đường dẫn cài đặt<br>
→ **[Khái niệm](concepts.md)**: cách mọi thứ liên kết với nhau<br>
→ **[Đa ngôn ngữ](multi-language.md)**: hỗ trợ đa ngôn ngữ<br>
→ **[Tùy chỉnh](customization.md)**: làm cho nó trở nên của riêng bạn


## Tại sao chọn OpenSpec?

Trợ lý lập trình AI rất mạnh mẽ nhưng khó đoán khi các yêu cầu chỉ tồn tại trong lịch sử trò chuyện. OpenSpec thêm một lớp đặc tả nhẹ nhàng để bạn và AI thống nhất về những gì cần xây dựng trước khi bất kỳ dòng mã nào được viết.

- **Thống nhất trước khi xây dựng** — con người và AI đồng thuận về đặc tả trước khi viết mã
- **Giữ mọi thứ có tổ chức** — mỗi thay đổi có thư mục riêng với đề xuất, đặc tả, thiết kế và nhiệm vụ
- **Làm việc linh hoạt** — cập nhật bất kỳ sản phẩm trung gian nào bất cứ lúc nào, không có các bước kiểm tra cứng nhắc
- **Sử dụng công cụ của bạn** — hoạt động với hơn 20 trợ lý AI thông qua lệnh gạch chéo

### So sánh của chúng tôi

**vs. [Spec Kit](https://github.com/github/spec-kit)** (GitHub) — Toàn diện nhưng nặng nề. Các bước kiểm tra cứng nhắc, nhiều Markdown, cài đặt bằng Python. OpenSpec nhẹ nhàng hơn và cho phép bạn lặp lại tự do.

**vs. [Kiro](https://kiro.dev)** (AWS) — Mạnh mẽ nhưng bạn bị giới hạn trong IDE của họ và chỉ giới hạn ở các mô hình Claude. OpenSpec hoạt động với các công cụ bạn đang sử dụng.

**vs. không có gì** — Lập trình AI không có đặc tả có nghĩa là các prompt mơ hồ và kết quả khó đoán. OpenSpec mang lại sự dự đoán được mà không cần nghi lễ phức tạp.

## Cập nhật OpenSpec

**Nâng cấp gói**

```bash
npm install -g @fission-ai/openspec@latest
```

**Làm mới hướng dẫn cho tác tử**

Chạy lệnh này trong mỗi dự án để tạo lại hướng dẫn AI và đảm bảo các lệnh gạch chéo mới nhất được kích hoạt:

```bash
openspec update
```

## Ghi chú sử dụng

**Lựa chọn mô hình**: OpenSpec hoạt động tốt nhất với các mô hình có khả năng suy luận cao. Chúng tôi khuyến nghị Opus 4.5 và GPT 5.2 cho cả lập kế hoạch và triển khai.

**Vệ sinh ngữ cảnh**: OpenSpec được hưởng lợi từ một cửa sổ ngữ cảnh sạch. Xóa ngữ cảnh của bạn trước khi bắt đầu triển khai và duy trì vệ sinh ngữ cảnh tốt trong suốt phiên làm việc.

## Đóng góp

**Sửa lỗi nhỏ** — Sửa lỗi, sửa lỗi chính tả và cải tiến nhỏ có thể được gửi trực tiếp dưới dạng PR.

**Thay đổi lớn hơn** — Đối với tính năng mới, tái cấu trúc quan trọng hoặc thay đổi kiến trúc, vui lòng gửi đề xuất thay đổi OpenSpec trước để chúng tôi có thể thống nhất về mục đích và mục tiêu trước khi bắt đầu triển khai.

Khi viết đề xuất, hãy ghi nhớ triết lý OpenSpec: chúng tôi phục vụ nhiều loại người dùng khác nhau trên các tác tử lập trình, mô hình và trường hợp sử dụng khác nhau. Các thay đổi nên hoạt động tốt cho tất cả mọi người.

**Mã do AI tạo ra được chào đón** — miễn là nó đã được kiểm tra và xác minh. PR chứa mã do AI tạo ra nên đề cập đến tác tử lập trình và mô hình đã sử dụng (ví dụ: "Được tạo bằng Claude Code sử dụng claude-opus-4-5-20251101").

### Phát triển

- Cài đặt phụ thuộc: `pnpm install`
- Xây dựng: `pnpm run build`
- Kiểm thử: `pnpm test`
- Phát triển CLI cục bộ: `pnpm run dev` hoặc `pnpm run dev:cli`
- Cam kết theo quy ước (dòng đơn): `type(scope): subject`

## Khác

<details>
<summary><strong>Thu thập dữ liệu</strong></summary>

OpenSpec thu thập thống kê sử dụng ẩn danh.

Chúng tôi chỉ thu thập tên lệnh và phiên bản để hiểu các mô hình sử dụng. Không có đối số, đường dẫn, nội dung hay thông tin nhận dạng cá nhân. Tự động tắt trong CI.

**Tắt thu thập:** `export OPENSPEC_TELEMETRY=0` hoặc `export DO_NOT_TRACK=1`

</details>

<details>
<summary><strong>Người duy trì & Cố vấn</strong></summary>

Xem [MAINTAINERS.md](https://github.com/Fission-AI/OpenSpec/blob/main/MAINTAINERS.md) để biết danh sách các người duy trì cốt lõi và cố vấn giúp định hướng dự án.

</details>



## Giấy phép

MIT