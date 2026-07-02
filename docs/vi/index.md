---
layout: home

hero:
  name: "OpenSpec"
  text: "Phát triển dựa trên Đặc tả cho Trợ lý AI"
  tagline: "Một đặc tả nhẹ để xây dựng và quản lý các dự án trợ lý AI."
  actions:
    - theme: brand
      text: Bắt đầu
      link: ./getting-started
    - theme: alt
      text: Trang chủ
      link: /

features:
  - title: Quy trình làm việc ưu tiên Đặc tả (Spec-First)
    details: Định nghĩa yêu cầu trước khi viết mã.
  - title: Thiết kế bản địa AI (AI-Native Design)
    details: Được xây dựng cho Claude Code, Cursor, Windsurf và hơn thế nữa.
  - title: Đa ngôn ngữ
    details: Tài liệu có sẵn bằng nhiều ngôn ngữ.
---

# Tài liệu OpenSpec

Chào mừng. Đây là trung tâm của mọi thứ về OpenSpec.

OpenSpec giúp bạn và trợ lý lập trình AI của mình **thống nhất về những gì cần xây dựng trước khi bất kỳ mã nào được viết ra.** Bạn mô tả sự thay đổi, AI phác thảo một đặc tả ngắn và danh sách nhiệm vụ, cả hai cùng xem kế hoạch đó, và sau đó công việc được tiến hành. Không còn tình trạng phát hiện giữa chừng rằng AI đã tạo ra thứ sai.

Nếu bạn không đọc bất cứ điều gì khác, hãy đọc hai trang này:

1. [Getting Started](getting-started.md): cách cài đặt, khởi tạo và triển khai thay đổi đầu tiên của bạn.
2. [How Commands Work](how-commands-work.md): nơi bạn thực sự gõ `/opsx:propose` (gợi ý: trong cuộc trò chuyện AI của bạn, chứ không phải trong terminal). Điều này khiến hầu hết mọi người gặp khó khăn một lần.

Trang thứ hai quan trọng hơn vẻ ngoài của nó. OpenSpec có hai phần: một công cụ dòng lệnh mà bạn chạy trong terminal, và các lệnh gạch chéo (slash commands) mà bạn đưa cho trợ lý AI của mình. Việc biết cái nào là gì sẽ giúp bạn tránh được sự nhầm lẫn phổ biến nhất.

> **Thói quen tốt nhất cần xây dựng đầu tiên: khi bạn không chắc chắn về thứ cần xây dựng, hãy bắt đầu với `/opsx:explore`.** Đây là một đối tác tư duy không rủi ro, nó đọc mã của bạn, cân nhắc các lựa chọn và làm sắc nét một ý tưởng mơ hồ thành một kế hoạch cụ thể trước khi bất kỳ sản phẩm hoặc mã nào tồn tại. Hướng dẫn [Explore First](explore.md) đã chứng minh điều này.

## Chọn con đường của bạn

**Tôi hoàn toàn mới.** Bắt đầu với [Getting Started](getting-started.md), sau đó xem lướt qua [Core Concepts at a Glance](overview.md). Khi có điều gì đó cảm thấy bí ẩn, [FAQ](faq.md) và [Glossary](glossary.md) ở gần đó.

**Tôi có một vấn đề nhưng chưa có kế hoạch.** Đây là trường hợp phổ biến, và nó có câu trả lời riêng: [Explore First](explore.md). Sử dụng `/opsx:explore` để suy nghĩ về nó với AI trước khi cam kết bất cứ điều gì.

**Tôi có một cơ sở mã lớn đã tồn tại.** Bạn không cần tài liệu hóa tất cả chúng. [Using OpenSpec in an Existing Project](existing-projects.md) cho biết cách bắt đầu trên mã thực tế, "brownfield" mà không cố gắng giải quyết mọi thứ cùng một lúc.

**Tôi chỉ muốn nó hoạt động.** [Install](installation.md), chạy `openspec init`, sau đó đọc [How Commands Work](how-commands-work.md) để lệnh gạch chéo đầu tiên của bạn được thực hiện đúng chỗ.

**Tôi học qua ví dụ.** Trang [Examples & Recipes](examples.md) trình bày các thay đổi thực tế từ đầu đến cuối: một tính năng nhỏ, sửa lỗi, tái cấu trúc (refactor), và khám phá.

**Tôi đang chuyển từ quy trình làm việc cũ.** [Migration Guide](migration-guide.md) giải thích những gì đã thay đổi và tại sao, đồng thời đảm bảo công việc hiện có của bạn được an toàn.

**Tôi muốn điều chỉnh nó theo quy trình của nhóm mình.** [Customization](customization.md) đề cập đến cấu hình dự án, các schema tùy chỉnh và ngữ cảnh chia sẻ.

**Có thứ gì đó bị hỏng.** [Troubleshooting](troubleshooting.md) tổng hợp những lỗi mà mọi người thực sự gặp phải, kèm theo cách khắc phục.

## Toàn bộ bản đồ

### Bắt đầu tại đây

| Doc | Nội dung cung cấp |
|-----|-------------------|
| [Getting Started](getting-started.md) | Cài đặt, khởi tạo và chạy thay đổi đầu tiên của bạn từ đầu đến cuối |
| [Explore First](explore.md) | Sử dụng `/opsx:explore` để suy nghĩ về một ý tưởng trước khi cam kết |
| [How Commands Work](how-commands-work.md) | Nơi các lệnh gạch chéo được chạy, "chế độ tương tác" có nghĩa là gì, terminal so với chat |
| [Core Concepts at a Glance](overview.md) | Toàn bộ mô hình tư duy trên một trang: đặc tả (specs), thay đổi (changes), delta, kho lưu trữ (archive) |
| [Installation](installation.md) | npm, pnpm, yarn, bun, Nix và cách xác minh nó đã hoạt động |

### Sử dụng hàng ngày

| Doc | Nội dung cung cấp |
|-----|-------------------|
| [Workflows](workflows.md) | Các mẫu phổ biến và khi nào nên sử dụng từng lệnh |
| [Examples & Recipes](examples.md) | Hướng dẫn đầy đủ về các thay đổi thực tế, có thể sao chép |
| [Using OpenSpec in an Existing Project](existing-projects.md) | Áp dụng OpenSpec trên một cơ sở mã lớn (brownfield codebase) |
| [Editing & Iterating on a Change](editing-changes.md) | Cập nhật các sản phẩm, quay lại và hòa giải các chỉnh sửa thủ công |
| [Commands](commands.md) | Tài liệu tham khảo cho mọi lệnh gạch chéo `/opsx:*` |
| [CLI](cli.md) | Tài liệu tham khảo cho mọi lệnh terminal `openspec` |

### Hiểu sâu về nó

| Doc | Nội dung cung cấp |
|-----|-------------------|
| [Concepts](concepts.md) | Giải thích chi tiết về đặc tả, thay đổi, sản phẩm (artifacts), schema và kho lưu trữ |
| [OPSX Workflow](opsx.md) | Lý do tại sao quy trình làm việc lại linh hoạt thay vì khóa theo giai đoạn, cùng với một phân tích kiến trúc chuyên sâu |
| [Glossary](glossary.md) | Mọi thuật ngữ được định nghĩa ở một nơi |

### Tùy chỉnh cho bạn

| Doc | Nội dung cung cấp |
|-----|-------------------|
| [Customization](customization.md) | Cấu hình dự án, các schema tùy chỉnh, ngữ cảnh chia sẻ |
| [Multi-Language](multi-language.md) | Tạo ra các sản phẩm bằng ngôn ngữ khác ngoài tiếng Anh |
| [Supported Tools](supported-tools.md) | Hơn 25 công cụ AI mà OpenSpec tích hợp, và nơi các tệp được lưu trữ |

### Khi bạn cần trợ giúp

| Doc | Nội dung cung cấp |
|-----|-------------------|
| [FAQ](faq.md) | Các câu trả lời nhanh cho những câu hỏi mọi người thường hỏi nhất |
| [Troubleshooting](troubleshooting.md) | Các bản sửa lỗi cụ thể cho các thất bại cụ thể |
| [Migration Guide](migration-guide.md) | Chuyển đổi từ quy trình làm việc cũ sang OPSX |

### Phối hợp giữa các repo (beta)

| Doc | Nội dung cung cấp |
|-----|-------------------|
| [Stores: User Guide](stores-beta/user-guide.md) | Lên kế hoạch trong repo riêng khi công việc của bạn trải rộng qua nhiều repo hoặc nhóm |
| [Agent Contract](agent-contract.md) | Các giao diện CLI có thể đọc được bằng máy mà các tác nhân (agents) điều khiển |

## Phiên bản ba mươi giây

```text
1. Install        npm install -g @fission-ai/openspec@latest
2. Initialize     cd your-project && openspec init
3. Explore        (in your AI chat)  /opsx:explore           ← tùy chọn, nhưng là một thói quen tuyệt vời
4. Propose        (in your AI chat)  /opsx:propose add-dark-mode
5. Build          (in your AI chat)  /opsx:apply
6. Archive        (in your AI chat)  /opsx:archive
```

Các bước 1 và 2 diễn ra trong terminal của bạn. Phần còn lại diễn ra trong cuộc trò chuyện với trợ lý AI của bạn. Sự phân chia này là điều đáng ghi nhớ, và [How Commands Work](how-commands-work.md) giải thích chính xác tại sao. Bước 3 là tùy chọn, nhưng bắt đầu bằng `/opsx:explore` khi bạn không chắc chắn là thói quen đáng được hình thành nhất.

## Nơi khác để nhận trợ giúp

- **Discord:** [discord.gg/YctCnvvshC](https://discord.gg/YctCnvvshC) để hỏi đáp, ý tưởng và hỗ trợ.
- **GitHub Issues:** [github.com/Fission-AI/OpenSpec/issues](https://github.com/Fission-AI/OpenSpec/issues) để báo cáo lỗi và yêu cầu tính năng.
- **`openspec feedback "tin nhắn của bạn"`** gửi phản hồi trực tiếp từ terminal của bạn (nó mở một vấn đề trên GitHub).

Bạn tìm thấy điều gì trong các tài liệu này là sai, cũ hoặc khó hiểu? Đó là một lỗi. Hãy mở một issue hoặc một PR. Cải thiện tài liệu là một trong những đóng góp giá trị nhất mà bạn có thể thực hiện.