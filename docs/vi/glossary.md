# Thuật ngữ chuyên môn (Glossary)

Mọi thuật ngữ của OpenSpec đều ở một nơi, được định nghĩa bằng ngôn ngữ đơn giản. Chỉ cần lướt qua nó một lần là bạn có thể đọc nhanh hơn phần còn lại của tài liệu.

Các thuật ngữ được nhóm theo chủ đề và sau đó sắp xếp theo thứ tự bảng chữ cái trong mỗi nhóm.

## Các danh từ cốt lõi (The core nouns)

**Spec.** Một tài liệu mô tả cách một phần hệ thống của bạn hoạt động. Specs tồn tại trong `openspec/specs/`, được tổ chức theo miền (domain), và bao gồm các yêu cầu (requirements) cùng kịch bản (scenarios). Spec là câu trả lời đã được thống nhất cho câu hỏi "phần mềm này làm gì?". Xem [Concepts](concepts.md#specs).

**Source of truth.** Toàn bộ thư mục `openspec/specs/`. Nó chứa hành vi hiện tại và đã được thống nhất của hệ thống bạn. Các thay đổi đề xuất chỉnh sửa nó; việc lưu trữ (archiving) áp dụng chúng.

**Change.** Một đơn vị công việc, được đóng gói dưới dạng một thư mục trong `openspec/changes/<name>/`. Một Change chứa mọi thứ về công việc đó: đề xuất, thiết kế, nhiệm vụ và các chỉnh sửa spec mà nó giới thiệu. Một change = một tính năng hoặc một bản sửa lỗi.

**Artifact.** Một tài liệu bên trong một change. Các artifact tiêu chuẩn là đề xuất (proposal), delta specs, thiết kế (design) và nhiệm vụ (tasks). Chúng được tạo theo thứ tự phụ thuộc và cung cấp thông tin cho nhau.

**Delta spec.** Một spec bên trong một change chỉ mô tả những gì đang thay đổi, sử dụng các mục `ADDED`, `MODIFIED` và `REMOVED`, thay vì trình bày lại toàn bộ spec. Đây là điều giúp OpenSpec chỉnh sửa các hệ thống hiện có một cách gọn gàng. Xem [Concepts](concepts.md#delta-specs).

**Domain.** Một nhóm logic cho các specs, ví dụ như `auth/`, `payments/` hoặc `ui/`. Bạn chọn các domain phù hợp với cách bạn suy nghĩ về hệ thống của mình.

## Bên trong một spec (Inside a spec)

**Requirement.** Một hành vi duy nhất mà hệ thống phải có, thường được viết bằng từ khóa RFC 2119: "Hệ thống PHẢI hết hạn phiên sau 30 phút." Requirements nêu ra *cái gì* (what), chứ không phải *làm thế nào* (how).

**Scenario.** Một ví dụ cụ thể, có thể kiểm thử được của một requirement đang hoạt động, thường ở dạng Given/When/Then. Scenarios giúp một requirement có thể xác minh được: bạn có thể viết một bài kiểm thử tự động từ nó.

**RFC 2119 keywords.** Các từ MUST, SHALL, SHOULD và MAY, mang ý nghĩa tiêu chuẩn về mức độ nghiêm ngặt của một yêu cầu. MUST và SHALL là tuyệt đối. SHOULD là khuyến nghị với khả năng ngoại lệ. MAY là tùy chọn. Tên này bắt nguồn từ tài liệu tiêu chuẩn internet đã định nghĩa chúng.

## Các artifact (The artifacts)

**Proposal (`proposal.md`).** *Lý do* và *cái gì* của một thay đổi: ý định, phạm vi và cách tiếp cận cấp cao. Đây là artifact đầu tiên bạn tạo.

**Design (`design.md`).** *Cách làm*: phương pháp kỹ thuật, các quyết định kiến trúc và các file bạn dự kiến sẽ chạm tới. Tùy chọn đối với những thay đổi đơn giản.

**Tasks (`tasks.md`).** Danh sách kiểm tra việc triển khai (implementation checklist), có hộp kiểm. AI sẽ thực hiện nó trong quá trình `/opsx:apply` và đánh dấu các mục đã hoàn thành khi tiến hành.

## Vòng đời (The lifecycle)

**Archive.** Hành động kết thúc một change. Các delta specs của nó được hợp nhất vào các specs chính, và thư mục change di chuyển đến `openspec/changes/archive/YYYY-MM-DD-<name>/`. Sau khi lưu trữ, các specs của bạn mô tả thực tế mới. Xem [Concepts](concepts.md#archive).

**Sync.** Hợp nhất delta specs của một change vào các specs chính *mà không* lưu trữ (archiving) change đó. Thường là tự động (archive cung cấp tùy chọn này), nhưng cũng có thể chạy độc lập dưới dạng `/opsx:sync` đối với những thay đổi kéo dài. Xem [Commands](commands.md#opsxsync).

## Quy trình làm việc và lệnh (Workflow and commands)

**OPSX.** Quy trình làm việc OpenSpec tiêu chuẩn hiện tại, được xây dựng xung quanh các hành động linh hoạt thay vì các giai đoạn cứng nhắc. Tất cả các slash command của nó đều bắt đầu bằng `/opsx:`. Xem [OPSX Workflow](opsx.md).

**Slash command.** Một lệnh bạn gõ vào trình trợ lý AI, ví dụ như `/opsx:propose`. Slash commands điều khiển quy trình làm việc. Chúng không phải là các lệnh terminal. Xem [How Commands Work](how-commands-work.md).

**Explore (`/opsx:explore`).** Lệnh đối tác tư duy (thinking-partner). Nó đọc codebase của bạn, so sánh các tùy chọn và làm rõ một ý tưởng mơ hồ thành một kế hoạch cụ thể, không tạo ra artifact nào và không viết mã. Đây là điểm khởi đầu được khuyến nghị bất cứ khi nào bạn có vấn đề nhưng chưa có kế hoạch. Xem [Explore First](explore.md).

**CLI.** Chương trình `openspec` mà bạn chạy trong terminal. Nó thiết lập các dự án, liệt kê và xác thực các thay đổi, mở dashboard và lưu trữ. Là nửa terminal của OpenSpec. Xem [CLI](cli.md).

**Skill.** Một thư mục hướng dẫn (`.../skills/openspec-*/SKILL.md`) mà trợ lý AI của bạn tự động phát hiện và tuân theo. Skills là tiêu chuẩn xuyên công cụ đang nổi lên để cung cấp quy trình làm việc OpenSpec cho trợ lý của bạn.

**Command file.** Một file slash command dành riêng cho từng công cụ (`.../commands/opsx-*`). Cơ chế phân phối cũ hơn, vẫn được hỗ trợ song song với skills. Bạn hiếm khi cần chạm vào chúng trực tiếp.

**Profile.** Tập hợp các slash commands được cài đặt trong dự án của bạn. **Core** (mặc định) bao gồm `propose`, `explore`, `apply`, `sync`, `archive`. Bộ **expanded** bổ sung thêm `new`, `continue`, `ff`, `verify`, `bulk-archive`, `onboard`. Thay đổi nó bằng lệnh `openspec config profile`.

**Delivery.** Việc OpenSpec cài đặt skills, command files hay cả hai cho các công cụ của bạn. Được cấu hình toàn cục và áp dụng bằng `openspec update`.

## Tùy chỉnh (Customization)

**Schema.** Định nghĩa về những artifact nào mà một workflow có và chúng phụ thuộc lẫn nhau như thế nào. Mặc định tích hợp sẵn là `spec-driven` (proposal → specs → design → tasks). Bạn có thể fork nó hoặc tự viết một schema của riêng mình. Xem [Customization](customization.md#custom-schemas).

**Template.** Một file Markdown bên trong một schema dùng để định hình những gì AI tạo ra cho một artifact nhất định. Chỉnh sửa một template sẽ thay đổi ngay lập tức đầu ra của AI, mà không cần biên dịch lại.

**Project config (`openspec/config.yaml`).** Các cài đặt theo dự án: schema mặc định, `context:` được tiêm vào mọi yêu cầu lập kế hoạch và `rules:` cho từng artifact. Đây là cách dễ nhất để dạy OpenSpec về stack và quy ước của bạn. Xem [Customization](customization.md#project-configuration).

**Context injection.** Đặt bối cảnh dự án vào trường `context:` trong `config.yaml` để nó được tự động thêm vào mọi artifact mà AI tạo ra. Điều này đáng tin cậy hơn là hy vọng rằng AI đọc một file riêng biệt.

**Dependency graph.** Đồ thị có hướng (directed graph) được hình thành bởi mối quan hệ `requires:` của các artifact. Nó là một DAG (directed acyclic graph: mũi tên chỉ tiến về phía trước, không bao giờ theo vòng lặp), và OpenSpec sử dụng nó để biết bạn có thể tạo gì tiếp theo.

**Enablers, not gates.** Nguyên tắc rằng sự phụ thuộc của artifact cho thấy điều gì trở nên *có thể* (possible) tiếp theo, chứ không phải điều gì là *bắt buộc* (required) tiếp theo. Bạn có thể xem xét lại và chỉnh sửa bất kỳ artifact nào bất cứ lúc nào. Xem [Core Concepts at a Glance](overview.md#enablers-not-gates).

## Phối hợp giữa các repo (beta)

Các thuật ngữ này chỉ áp dụng nếu việc lập kế hoạch của bạn trải rộng qua nhiều hơn một repo. Chúng đang ở chế độ beta. Hầu hết người dùng có thể bỏ qua chúng. Xem [Stores User Guide](stores-beta/user-guide.md).

**Store.** Một repo độc lập mà công việc duy nhất là lập kế hoạch. Nó có hình dạng `openspec/` giống như bạn đã biết (specs và changes) cộng thêm một file định danh nhỏ. Bạn đăng ký nó trên máy của mình một lần, bằng tên, và sau đó bất kỳ lệnh OpenSpec nào cũng có thể hoạt động trong đó từ bất cứ đâu.

**Reference.** Một lời khai, trong `openspec/config.yaml` của một code repo, về một store mà repo đó sử dụng. References là chỉ đọc: repo giữ nguyên gốc của mình, và `openspec instructions` nhận được một chỉ mục (index) các specs của store được tham chiếu, mỗi cái với lệnh chính xác để lấy nó.

**Working context.** Những gì `openspec context` tập hợp cho repo hiện tại: OpenSpec root của nó cộng thêm mọi store mà nó tham chiếu, mỗi cái kèm theo cách để lấy nó. Câu trả lời cho câu hỏi "tôi đang làm việc với cái gì?".

**Workset.** Một bộ thư mục cá nhân, cục bộ trên máy bạn mở cùng nhau (một store bên cạnh các repo code bạn đang làm). Được tạo rõ ràng bằng `openspec workset create`; không có thông tin nào về những đường dẫn cục bộ đó được commit vào repo lập kế hoạch chung.

## Xem thêm (See also)

- [Core Concepts at a Glance](overview.md): năm ý tưởng, trên một trang
- [Concepts](concepts.md): giải thích chi tiết
- [How Commands Work](how-commands-work.md): slash commands so với CLI