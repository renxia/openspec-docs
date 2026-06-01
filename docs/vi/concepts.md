# Các khái niệm

Hướng dẫn này giải thích những ý tưởng cốt lõi đằng sau OpenSpec và cách chúng liên kết với nhau. Để biết cách sử dụng thực tế, hãy xem [Bắt đầu](getting-started.md) và [Các quy trình làm việc](workflows.md).

## Triết lý

OpenSpec được xây dựng dựa trên bốn nguyên tắc:

```
linh hoạt không cứng nhắc         — không có cổng giai đoạn, làm những gì hợp lý
lặp đi lặp lại không thác nước — học trong khi xây dựng, tinh chỉnh khi tiến hành
đơn giản không phức tạp        — thiết lập nhẹ nhàng, thủ tục tối thiểu
brownfield-first        — hoạt động với các cơ sở code hiện có, không chỉ greenfield
```

### Tại sao những nguyên tắc này quan trọng

**Linh hoạt không cứng nhắc.** Các hệ thống thông số kỹ thuật truyền thống giam bạn vào các giai đoạn: trước tiên bạn lập kế hoạch, sau đó triển khai, rồi hoàn thành. OpenSpec linh hoạt hơn — bạn có thể tạo các tác phẩm theo bất kỳ thứ tự nào phù hợp với công việc của bạn.

**Lặp đi lặp lại không thác nước.** Yêu cầu thay đổi. Sự hiểu biết được đào sâu. Những gì có vẻ là một cách tiếp cận tốt ban đầu có thể không còn phù hợp sau khi bạn nhìn thấy cơ sở code. OpenSpec chấp nhận thực tế này.

**Đơn giản không phức tạp.** Một số khung thông số kỹ thuật yêu cầu thiết lập mở rộng, định dạng cứng nhắc hoặc quy trình nặng nề. OpenSpec không gây cản trở bạn. Khởi tạo trong vài giây, bắt đầu làm việc ngay lập tức, chỉ tùy chỉnh nếu bạn cần.

**Brownfield-first.** Hầu hết công việc phần mềm không phải xây dựng từ đầu — mà là sửa đổi các hệ thống hiện có. Cách tiếp cận dựa trên delta của OpenSpec giúp dễ dàng chỉ định các thay đổi đối với hành vi hiện có, không chỉ mô tả các hệ thống mới.

## Tổng Quan

OpenSpec tổ chức công việc của bạn thành hai khu vực chính:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Nguồn dữ liệu     │◄─────│  Các sửa đổi đề xuất         │   │
│   │  gốc (source of     │ merge│  Mỗi thay đổi = một thư mục  │   │
│   │  truth) mô tả hệ   │      │  Chứa artifact + delta        │   │
│   │  thống hiện tại     │      │                               │   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** là nguồn dữ liệu gốc — chúng mô tả cách hệ thống của bạn hiện đang hoạt động.

**Changes** là các sửa đổi đề xuất — chúng tồn tại trong các thư mục riêng biệt cho đến khi bạn sẵn sàng hợp nhất (merge) chúng.

Sự tách biệt này là chìa khóa. Bạn có thể làm việc trên nhiều thay đổi song song mà không gặp xung đột. Bạn có thể xem xét một thay đổi trước khi nó ảnh hưởng đến các spec chính. Và khi bạn lưu trữ một thay đổi, các delta của nó sẽ được hợp nhất một cách sạch sẽ vào nguồn dữ liệu gốc.

## Không Gian Làm Việc Phối Hỗ Trợ

Hỗ trợ không gian làm việc đang trong giai đoạn beta. Mô hình xem cục bộ bên dưới là hướng đi hiện tại, nhưng tự động hóa bên ngoài, tích hợp và các quy trình làm việc dài hạn vẫn nên coi hành vi lệnh, tệp trạng thái và đầu ra JSON là đang phát triển.

Các lệnh bên dưới cung cấp quy trình thiết lập ban đầu để mở các chế độ xem cục bộ trên các kho lưu trữ (repo) hoặc thư mục được liên kết.

Các dự án OpenSpec cục bộ trong repo là mặc định phù hợp khi một repo sở hữu toàn bộ quy trình lập kế hoạch, triển khai và lưu trữ. Một số công việc跨越多个 kho lưu trữ hoặc thư mục. Trong trường hợp đó, một không gian làm việc phối hợp OpenSpec là một chế độ xem cục bộ trên máy, kết hợp các đường dẫn được liên kết, trạng thái opener và thiết lập agent.

Mô hình trừu tượng của không gian làm việc là:

```text
workspace     = chế độ xem cục bộ riêng tư trên các kho ngữ cảnh, sáng kiến, repo và thư mục
context store = kho ngữ cảnh chung bền vững
initiative    = ngữ cảnh phối hợp bền vững bên trong một context store
link          = một tên ổn định cho repo hoặc thư mục mà không gian làm việc có thể phân giải cục bộ
change        = một phần công việc được lên kế hoạch; việc triển khai thuộc về repo sở hữu
```

Một không gian làm việc có cấu trúc khác với dự án cục bộ trong repo:

```text
getGlobalDataDir()/workspaces/<workspace-name>/
├── workspace.yaml                 # Bản ghi chế độ xem cục bộ riêng tư
├── AGENTS.md                      # Hướng dẫn thời gian chạy được tạo
└── <workspace-name>.code-workspace # Tệp workspace editor được tạo
```

Trạng thái OpenSpec cục bộ trong repo giữ nguyên cấu trúc hiện có:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Sự phân biệt này quan trọng. Thư mục không gian làm việc là bề mặt phối hợp cục bộ để mở và kiểm tra các repo hoặc thư mục được liên kết. Thư mục `openspec/` của mỗi repo vẫn là nơi chứa specs thuộc repo, các thay đổi cục bộ trong repo và kế hoạch triển khai. Người dùng không cần chạy lệnh `openspec init` cục bộ trong repo bên trong thư mục không gian làm việc.

Tên liên kết ổn định là cách một không gian làm việc tham chiếu đến các repo và thư mục. Bản ghi riêng tư của không gian làm việc lưu giữ các tên như `api`, `web` hoặc `checkout` và ánh xạ chúng đến các đường dẫn cục bộ của thời gian chạy này.

```yaml
# workspace.yaml
version: 1
name: platform
context: null
links:
  api: /repos/api
  web: /repos/web
```

Khi một không gian làm việc mở một sáng kiến, `context` ghi lại ràng buộc kho ngữ cảnh đã chọn và id của sáng kiến. Các kho được chọn qua registry vẫn di động bằng id; các kho được chọn qua đường dẫn cố ý giữ lại đường dẫn cục bộ của thời gian chạy vì `workspace.yaml` là trạng thái cục bộ riêng tư.

```yaml
context:
  kind: initiative
  store:
    id: platform
    selector:
      kind: registry
      id: platform
  initiative:
    id: billing-launch
```

Các đường dẫn được liên kết có thể là toàn bộ repo, thư mục bên trong một monorepo lớn, hoặc các thư mục hiện có khác. Chúng không cần trạng thái `openspec/` cục bộ trong repo trước khi có thể tham gia vào kế hoạch không gian làm việc. Các quy trình làm việc triển khai, xác minh hoặc lưu trữ sau này có thể yêu cầu repo sẵn sàng hơn, nhưng khả năng hiển thị trong kế hoạch bắt đầu từ liên kết.

```text
multi-repo:
  api      -> /repos/api
  web      -> /repos/web

large monorepo:
  billing  -> /repos/platform/services/billing
  checkout -> /repos/platform/apps/checkout
```

Các không gian làm việc được quản lý nằm dưới thư mục dữ liệu OpenSpec tiêu chuẩn:

```text
getGlobalDataDir()/workspaces
```

Điều đó có nghĩa là `$XDG_DATA_HOME/openspec/workspaces` khi `XDG_DATA_HOME` được đặt, `~/.local/share/openspec/workspaces` trên kiểu dự phòng Unix, và `%LOCALAPPDATA%\openspec\workspaces` trên dự phòng Windows gốc. Các shell Windows gốc, PowerShell và WSL2 mỗi loại đều giữ các chuỗi đường dẫn cho thời gian chạy đang chạy OpenSpec. Cơ sở này không dịch giữa các đường dẫn `D:\repo`, `/mnt/d/repo` và UNC WSL.

OpenSpec vẫn có thể đọc các thư mục gốc không gian làm việc beta cũ hơn dưới dạng đầu vào tương thích, nhưng các không gian làm việc được quản lý bây giờ sử dụng bản ghi gốc `workspace.yaml` ở trên. Thư mục không gian làm việc vẫn là nguồn chính cho chế độ xem cục bộ riêng tư của nó.

Khả năng hiển thị của không gian làm việc không phải là cam kết thay đổi. Thiết lập một không gian làm việc khi OpenSpec cần biết repo hoặc thư mục nào là liên quan; tạo một thay đổi sau đó khi bạn sẵn sàng lập kế hoạch cho một tính năng, sửa lỗi, dự án hoặc một phần công việc khác.

Các lệnh hữu ích:

```bash
# Thiết lập có hướng dẫn
openspec workspace setup

# Thiết lập thân thiện với tự động hóa
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex-cli

# Xem các không gian làm việc đã biết từ registry cục bộ
openspec workspace list
openspec workspace ls

# Thêm hoặc sửa chữa liên kết cho không gian làm việc đã chọn
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Kiểm tra máy này có thể phân giải gì
openspec workspace doctor
openspec workspace doctor --workspace platform

# Làm mới hướng dẫn cục bộ của không gian làm việc và kỹ năng agent
openspec workspace update
openspec workspace update --workspace platform --tools codex,claude

# Mở bộ làm việc được liên kết
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor

# Mở một sáng kiến dưới dạng chế độ xem không gian làm việc cục bộ
openspec workspace open --initiative billing-launch --store platform
openspec workspace open --initiative billing-launch --store-path /repos/platform-context
```

`workspace setup` luôn tạo không gian làm việc tại vị trí không gian làm việc tiêu chuẩn, ghi lại nó trong registry cục bộ, hiển thị vị trí không gian làm việc và yêu cầu ít nhất một repo hoặc thư mục được liên kết. Thiết lập tương tác hỏi về opener ưa thích và có thể cài đặt kỹ năng OpenSpec cho các agent đã chọn. Thiết lập không tương tác chỉ lưu trữ khi `--opener codex-cli`, `--opener claude`, `--opener github-copilot` hoặc `--opener editor` được cung cấp.

Kỹ năng không gian làm việc chỉ được cài đặt trong thư mục gốc của không gian làm việc. Hồ sơ toàn cục đang hoạt động chọn các kỹ năng quy trình làm việc nào được tạo; `--tools` chọn agent nào nhận chúng. Thiết lập và cập nhật không gian làm việc không tạo các tệp lệnh gạch chéo ngay cả khi phân phối toàn cục bao gồm các lệnh. Chạy `openspec workspace update` để làm mới hướng dẫn cục bộ của không gian làm việc và thêm, làm mới hoặc xóa các thư mục kỹ năng cục bộ không gian làm việc được quản lý mà không cần chỉnh sửa các repo hoặc thư mục được liên kết.

OpenSpec cũng duy trì các tệp mở không gian làm việc gốc: một khối hướng dẫn do OpenSpec quản lý trong `AGENTS.md` và một tệp `<workspace-name>.code-workspace` cục bộ trên máy cho việc mở VS Code và GitHub Copilot-trong-VS-Code. Một không gian làm việc được quản lý không phải là repo, vì vậy OpenSpec không tạo `.gitignore` mặc định cho không gian làm việc hoặc thư mục `changes/` cấp không gian làm việc mặc định.

VS Code workspace được duy trì liệt kê các repo hoặc thư mục được liên kết hợp lệ trước tiên, sau đó là ngữ cảnh sáng kiến khi được đính kèm, sau đó là các tệp không gian làm việc OpenSpec. VS Code hiển thị các mục đó dưới dạng không gian làm việc đa gốc.

`workspace open` mở bộ làm việc được liên kết với opener ưa thích đã lưu trữ trừ khi `--agent <tool>` hoặc `--editor` được truyền cho phiên đó. Truyền cả hai ghi đè opener là một lỗi. Mở không gian làm việc gốc làm cho các repo và thư mục được liên kết hiển thị để khám phá và ngữ cảnh; việc triển khai bắt đầu sau khi người dùng yêu cầu triển khai công việc một cách rõ ràng.

`workspace link` và `workspace relink` chỉ ghi lại các thư mục hiện có; chúng không tạo, sao chép, di chuyển, khởi tạo hoặc chỉnh sửa repo hoặc thư mục được liên kết. Sau khi liên kết hoặc liên kết lại thành công, OpenSpec làm mới hướng dẫn được quản lý và tệp workspace VS Code.

Các lệnh không gian làm việc cần một không gian làm việc có thể chạy từ bất kỳ đâu với `--workspace <name>`. Nếu bạn chạy chúng bên trong thư mục hoặc thư mục con của không gian làm việc, OpenSpec sử dụng không gian làm việc hiện tại đó. Nếu có nhiều không gian làm việc đã biết và bạn không truyền `--workspace <name>`, các lệnh của người sẽ hiển thị bộ chọn; `--json` và `--no-interactive` sẽ báo lỗi trạng thái có cấu trúc thay vì nhắc.

Các lệnh không gian làm việc trực tiếp hỗ trợ đầu ra JSON cho script. Các phản hồi JSON giữ dữ liệu chính trong các đối tượng `workspace`, `workspaces` hoặc `link` và báo cáo cảnh báo hoặc lỗi trong mảng `status`. Các đối tượng khỏe mạnh sử dụng `status: []`.

## Specs

Specs mô tả hành vi của hệ thống bạn bằng các yêu cầu và kịch bản có cấu trúc.

### Cấu Trúc

```
openspec/specs/
├── auth/
│   └── spec.md           # Hành vi xác thực
├── payments/
│   └── spec.md           # Xử lý thanh toán
├── notifications/
│   └── spec.md           # Hệ thống thông báo
└── ui/
    └── spec.md           # Hành vi và giao diện người dùng
```

Tổ chức specs theo miền — các nhóm logic có ý nghĩa cho hệ thống của bạn. Các mẫu phổ biến:

- **Theo khu vực tính năng**: `auth/`, `payments/`, `search/`
- **Theo thành phần**: `api/`, `frontend/`, `workers/`
- **Theo ngữ cảnh giới hạn**: `ordering/`, `fulfillment/`, `inventory/`

### Định Dạng Spec

Một spec chứa các yêu cầu, và mỗi yêu cầu có các kịch bản:

```markdown
# Đặc tả xác thực

## Mục đích
Quản lý xác thực và phiên cho ứng dụng.

## Yêu cầu

### Yêu cầu: Xác thực người dùng
Hệ thống PHẢI phát hành mã JWT khi đăng nhập thành công.

#### Kịch bản: Thông tin đăng nhập hợp lệ
- GIẢ SỬ người dùng có thông tin đăng nhập hợp lệ
- KHI người dùng gửi biểu mẫu đăng nhập
- THÌ một mã JWT được trả về
- VÀ người dùng được chuyển hướng đến bảng điều khiển

#### Kịch bản: Thông tin đăng nhập không hợp lệ
- GIẢ SỬ thông tin đăng nhập không hợp lệ
- KHI người dùng gửi biểu mẫu đăng nhập
- THÌ một thông báo lỗi được hiển thị
- VÀ không có mã nào được phát hành

### Yêu cầu: Hết hạn phiên
Hệ thống BẮT BUỘC phải hết hạn phiên sau 30 phút không hoạt động.

#### Kịch bản: Hết thời gian chờ
- GIẢ SỬ một phiên đã được xác thực
- KHI 30 phút trôi qua mà không có hoạt động
- THÌ phiên bị vô hiệu hóa
- VÀ người dùng phải xác thực lại
```

**Các yếu tố chính:**

| Yếu tố | Mục đích |
|---------|---------|
| `## Mục đích` | Mô tả cấp cao về miền của spec này |
| `### Yêu cầu:` | Một hành vi cụ thể mà hệ thống phải có |
| `#### Kịch bản:` | Một ví dụ cụ thể của yêu cầu đang hoạt động |
| SHALL/MUST/SHOULD | Từ khóa RFC 2119 biểu thị mức độ yêu cầu |

### Tại Sao Cấu Trúc Specs Theo Cách Này

**Yêu cầu là "cái gì"** — chúng nêu rõ hệ thống nên làm gì mà không chỉ định cách triển khai.

**Kịch bản là "khi nào"** — chúng cung cấp các ví dụ cụ thể có thể được xác minh. Các kịch bản tốt:
- Có thể kiểm tra được (bạn có thể viết một kiểm tra tự động cho chúng)
- Bao gồm cả đường dẫn thành công và các trường hợp biên
- Sử dụng Định dạng Cho/Khi/Thì hoặc định dạng có cấu trúc tương tự

**Các từ khóa RFC 2119** (SHALL, MUST, SHOULD, MAY) truyền đạt ý định:
- **MUST/SHALL** — yêu cầu tuyệt đối
- **SHOULD** — được khuyến nghị, nhưng có ngoại lệ
- **MAY** — tùy chọn

### Spec Là Gì (Và Không Là Gì)

Một spec là **hợp đồng hành vi**, không phải kế hoạch triển khai.

Nội dung spec tốt:
- Hành vi có thể quan sát được mà người dùng hoặc hệ thống downstream dựa vào
- Đầu vào, đầu ra và điều kiện lỗi
- Các ràng buộc bên ngoài (bảo mật, quyền riêng tư, độ tin cậy, tính tương thích)
- Các kịch bản có thể được kiểm tra hoặc xác nhận rõ ràng

Tránh trong specs:
- Tên lớp/hàm nội bộ
- Lựa chọn thư viện hoặc framework
- Chi tiết triển khai từng bước
- Kế hoạch thực thi chi tiết (chúng thuộc về `design.md` hoặc `tasks.md`)

Kiểm tra nhanh:
- Nếu việc triển khai có thể thay đổi mà không thay đổi hành vi bên ngoài có thể thấy được, nó có thể không thuộc spec.

### Giữ Nó Nhẹ Nhàng: Sự Nghiêm Túc Tăng Dần

OpenSpec nhằm mục đích tránh quan liêu. Sử dụng mức độ nhẹ nhất vẫn làm cho thay đổi có thể xác minh được.

**Spec nhẹ (mặc định):**
- Các yêu cầu ngắn gọn, tập trung vào hành vi
- Phạm vi rõ ràng và các mục tiêu không phải
- Một vài kiểm tra chấp nhận cụ thể

**Spec đầy đủ (cho rủi ro cao hơn):**
- Các thay đổi跨 nhóm hoặc跨 repo
- Thay đổi API/hợp đồng, di chuyển, các mối quan ngại về bảo mật/riêng tư
- Các thay đổi mà sự mơ hồ có khả năng gây ra việc sửa đổi tốn kém

Hầu hết các thay đổi nên ở chế độ Nhẹ.

### Hợp Tác Giữa Người Và Agent

Trong nhiều nhóm, con người khám phá và agent soạn thảo artifact. Vòng lặp dự kiến là:

1. Con người cung cấp ý định, ngữ cảnh và ràng buộc.
2. Agent chuyển đổi điều này thành các yêu cầu và kịch bản tập trung vào hành vi.
3. Agent giữ chi tiết triển khai trong `design.md` và `tasks.md`, không phải `spec.md`.
4. Xác nhận cấu trúc và sự rõ ràng trước khi triển khai.

Điều này giúp specs dễ đọc cho con người và nhất quán cho agent.

## Thay Đổi

Một thay đổi là một sửa đổi được đề xuất đối với hệ thống của bạn, được đóng gói dưới dạng một thư mục chứa mọi thứ cần thiết để hiểu và triển khai nó.

### Cấu Trúc Thay Đổi

```
openspec/changes/add-dark-mode/
├── proposal.md           # Why and what
├── design.md             # How (technical approach)
├── tasks.md              # Implementation checklist
├── .openspec.yaml        # Change metadata (optional)
└── specs/                # Delta specs
    └── ui/
        └── spec.md       # What's changing in ui/spec.md
```

Mỗi thay đổi là một thực thể hoàn chỉnh. Nó bao gồm:
- **Artifacts** — các tài liệu ghi lại mục đích, thiết kế và các công việc
- **Delta specs** — các đặc tả cho những gì đang được thêm, sửa đổi hoặc xóa
- **Metadata** — cấu hình tùy chọn cho thay đổi cụ thể này

### Tại Sao Thay Đổi Là Các Thư Mục

Đóng gói một thay đổi dưới dạng thư mục có một số lợi ích:

1. **Tất cả ở một nơi.** Đề xuất, thiết kế, công việc và đặc tả đều nằm trong cùng một vị trí. Không cần phải tìm kiếm ở nhiều nơi khác nhau.

2. **Làm việc song song.** Nhiều thay đổi có thể tồn tại đồng thời mà không xung đột. Có thể làm việc trên `add-dark-mode` trong khi `fix-auth-bug` cũng đang được tiến hành.

3. **Lịch sử rõ ràng.** Khi được lưu trữ, các thay đổi chuyển đến `changes/archive/` với toàn bộ bối cảnh được bảo toàn. Bạn có thể nhìn lại và hiểu không chỉ điều gì đã thay đổi, mà còn tại sao.

4. **Thuận tiện cho việc đánh giá.** Một thư mục thay đổi rất dễ đánh giá — mở nó ra, đọc đề xuất, kiểm tra thiết kế, xem các thay đổi về đặc tả.

## Artifacts

Các Artifacts là các tài liệu trong một thay đổi giúp định hướng công việc.

### Quy Trình Của Artifacts

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Các Artifacts được xây dựng dựa trên nhau. Mỗi artifact cung cấp bối cảnh cho phần tiếp theo.

### Các Loại Artifact

#### Proposal (`proposal.md`)

Proposal ghi lại **mục đích**, **phạm vi** và **cách tiếp cận** ở mức độ cao.

```markdown
# Proposal: Add Dark Mode
```

## Mục đích
Người dùng đã yêu cầu tùy chọn chế độ tối để giảm mỏi mắt
khi sử dụng vào ban đêm và phù hợp với tùy chọn hệ thống.

## Phạm vi
Trong phạm vi:
- Chuyển đổi giao diện trong cài đặt
- Nhận diện tùy chọn hệ thống
- Lưu tùy chọn vào localStorage

Ngoài phạm vi:
- Giao diện màu tùy chỉnh (công việc tương lai)
- Ghi đè giao diện theo trang

## Phương pháp
Sử dụng CSS custom properties cho việc tạo giao diện với React context
để quản lý trạng thái. Nhận diện tùy chọn hệ thống khi tải lần đầu,
cho phép ghi đè thủ công.
```

**Khi nào cần cập nhật đề xuất:**
- Phạm vi thay đổi (thu hẹp hoặc mở rộng)
- Mục đích được làm rõ (hiểu vấn đề tốt hơn)
- Phương pháp thay đổi căn bản

#### Đặc tả (đặc tả delta trong `specs/`)

Đặc tả delta mô tả **những gì thay đổi** so với các đặc tả hiện tại. Xem [Đặc tả Delta](#delta-specs) bên dưới.

#### Thiết kế (`design.md`)

Phần thiết kế ghi lại **phương pháp kỹ thuật** và **quyết định kiến trúc**.

````markdown
# Thiết kế: Thêm Chế độ tối

## Phương pháp kỹ thuật
Trạng thái giao diện được quản lý qua React Context để tránh truyền props xuyên suốt.
CSS custom properties cho phép chuyển đổi thời gian chạy mà không cần chuyển đổi class.

## Quyết định kiến trúc

### Quyết định: Context thay vì Redux
Sử dụng React Context cho trạng thái giao diện vì:
- Trạng thái nhị phân đơn giản (sáng/tối)
- Không có chuyển đổi trạng thái phức tạp
- Tránh thêm phụ thuộc Redux

### Quyết định: CSS Custom Properties
Sử dụng biến CSS thay vì CSS-in-JS vì:
- Hoạt động với stylesheet hiện tại
- Không có overhead thời gian chạy
- Giải pháp gốc của trình duyệt

## Luồng dữ liệu
```
ThemeProvider (context)
       │
       ▼
ThemeToggle ◄──► localStorage
       │
       ▼
CSS Variables (applied to :root)
```

## Thay đổi tệp
- `src/contexts/ThemeContext.tsx` (mới)
- `src/components/ThemeToggle.tsx` (mới)
- `src/styles/globals.css` (sửa đổi)
````

**Khi nào cần cập nhật thiết kế:**
- Triển khai cho thấy phương pháp sẽ không hiệu quả
- Phát hiện giải pháp tốt hơn
- Thay đổi phụ thuộc hoặc ràng buộc

#### Nhiệm vụ (`tasks.md`)

Nhiệm vụ là **danh sách kiểm tra triển khai** — các bước cụ thể với ô kiểm.

```markdown
# Nhiệm vụ

## 1. Cơ sở hạ tầng Giao diện
- [ ] 1.1 Tạo ThemeContext với trạng thái sáng/tối
- [ ] 1.2 Thêm CSS custom properties cho màu sắc
- [ ] 1.3 Triển khai lưu trữ localStorage
- [ ] 1.4 Thêm nhận diện tùy chọn hệ thống

## 2. Thành phần Giao diện người dùng
- [ ] 2.1 Tạo thành phần ThemeToggle
- [ ] 2.2 Thêm công tắc vào trang cài đặt
- [ ] 2.3 Cập nhật Header để bao gồm công tắc nhanh

## 3. Định dạng
- [ ] 3.1 Xác định bảng màu giao diện tối
- [ ] 3.2 Cập nhật các thành phần để sử dụng biến CSS
- [ ] 3.3 Kiểm tra tỷ lệ tương phản để đảm bảo khả năng truy cập
```

**Các thực hành tốt cho nhiệm vụ:**
- Nhóm các nhiệm vụ liên quan dưới tiêu đề
- Sử dụng đánh số thứ bậc (1.1, 1.2, v.v.)
- Giữ nhiệm vụ đủ nhỏ để hoàn thành trong một phiên
- Đánh dấu hoàn thành các nhiệm vụ khi bạn hoàn thành chúng

## Đặc tả Delta

Đặc tả delta là khái niệm chính giúp OpenSpec hoạt động cho phát triển brownfield. Chúng mô tả **những gì thay đổi** thay vì lặp lại toàn bộ đặc tả.

### Định dạng

```markdown
# Delta cho Auth

## YÊU CẦU THÊM MỚI

### Yêu cầu: Xác thực hai yếu tố
Hệ thống PHẢI hỗ trợ xác thực hai yếu tố dựa trên TOTP.

#### Kịch bản: Đăng ký 2FA
- GIẢ SỬ một người dùng chưa bật 2FA
- KHI người dùng bật 2FA trong cài đặt
- THÌ một mã QR được hiển thị để thiết lập ứng dụng xác thực
- VÀ người dùng phải xác minh bằng mã trước khi kích hoạt

#### Kịch bản: Đăng nhập 2FA
- GIẢ SỬ một người dùng đã bật 2FA
- KHI người dùng gửi thông tin xác thực hợp lệ
- THÌ một thách thức OTP được trình bày
- VÀ quá trình đăng nhập chỉ hoàn thành sau OTP hợp lệ

## YÊU CẦU ĐÃ SỬA ĐỔI

### Yêu cầu: Phiên hết hạn
Hệ thống PHẢI hết hạn phiên sau 15 phút không hoạt động.
(Trước đây: 30 phút)

#### Kịch bản: Hết thời gian chờ
- GIẢ SỬ một phiên đã xác thực
- KHI 15 phút trôi qua mà không có hoạt động
- THÌ phiên bị vô hiệu hóa

## YÊU CẦU ĐÃ LOẠI BỎ

### Yêu cầu: Ghi nhớ đăng nhập
(Bị phản đối để ủng hộ 2FA. Người dùng nên xác thực lại mỗi phiên.)
```

### Các phần Delta

| Phần | Ý nghĩa | Điều gì xảy ra khi lưu trữ |
|---------|---------|------------------------|
| `## YÊU CẦU THÊM MỚI` | Hành vi mới | Được thêm vào đặc tả chính |
| `## YÊU CẦU ĐÃ SỬA ĐỔI` | Hành vi thay đổi | Thay thế yêu cầu hiện có |
| `## YÊU CẦU ĐÃ LOẠI BỎ` | Hành vi bị phản đối | Bị xóa khỏi đặc tả chính |

### Tại sao dùng Delta thay vì Đặc tả đầy đủ

**Sự rõ ràng.** Một delta cho thấy chính xác những gì đang thay đổi. Khi đọc một đặc tả đầy đủ, bạn sẽ phải tự so sánh nó với phiên bản hiện tại.

**Tránh xung đột.** Hai thay đổi có thể chạm vào cùng một tệp đặc tả mà không xung đột, miễn là chúng sửa đổi các yêu cầu khác nhau.

**Hiệu quả đánh giá.** Người đánh giá thấy sự thay đổi, không phải ngữ cảnh không thay đổi. Tập trung vào những gì quan trọng.

**Phù hợp brownfield.** Hầu hết công việc sửa đổi hành vi hiện có. Các delta làm cho việc sửa đổi trở thành ưu tiên, không phải là suy nghĩ sau cùng.

## Sơ đồ

Sơ đồ xác định các loại tạo phẩm và phụ thuộc của chúng cho một quy trình làm việc.

### Cách Sơ đồ hoạt động

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Không phụ thuộc, có thể tạo trước tiên

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Cần đề xuất trước khi tạo

  - id: design
    generates: design.md
    requires: [proposal]      # Có thể tạo song song với specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Cần cả specs và design trước
```

**Các tạo phẩm tạo thành một đồ thị phụ thuộc:**

```
                    proposal
                   (nút gốc)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (requires:                  (requires:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (requires:
                specs, design)
```

**Phụ thuộc là yếu tố kích hoạt, không phải cổng.** Chúng cho thấy những gì có thể tạo, không phải những gì bạn phải tạo tiếp theo. Bạn có thể bỏ qua thiết kế nếu không cần. Bạn có thể tạo đặc tả trước hoặc sau thiết kế — cả hai chỉ phụ thuộc vào đề xuất.

### Sơ đồ tích hợp

**spec-driven** (mặc định)

Quy trình làm việc tiêu chuẩn cho phát triển dựa trên đặc tả:

```
proposal → specs → design → tasks → implement
```

Phù hợp nhất cho: Hầu hết công việc tính năng mà bạn muốn thống nhất về đặc tả trước khi triển khai.

### Sơ đồ tùy chỉnh

Tạo sơ đồ tùy chỉnh cho quy trình làm việc của nhóm bạn:

```bash
# Tạo từ đầu
openspec schema init research-first

# Hoặc phân nhánh từ một sơ đồ hiện có
openspec schema fork spec-driven research-first
```

**Ví dụ sơ đồ tùy chỉnh:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Nghiên cứu trước tiên

  - id: proposal
    generates: proposal.md
    requires: [research]   # Đề xuất dựa trên nghiên cứu

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Bỏ qua specs/design, đi thẳng đến tasks
```

Xem [Tùy chỉnh](customization.md) để biết chi tiết đầy đủ về việc tạo và sử dụng sơ đồ tùy chỉnh.

## Lưu trữ

Lưu trữ hoàn thành một thay đổi bằng cách hợp nhất các đặc tả delta của nó vào các đặc tả chính và bảo quản thay đổi cho lịch sử.

### Điều gì xảy ra khi bạn lưu trữ

```
Trước khi lưu trữ:

openspec/
├── specs/
│   └── auth/
│       └── spec.md ◄────────────────┐
└── changes/                         │
    └── add-2fa/                     │
        ├── proposal.md              │
        ├── design.md                │ hợp nhất
        ├── tasks.md                 │
        └── specs/                   │
            └── auth/                │
                └── spec.md ─────────┘


Sau khi lưu trữ:

openspec/
├── specs/
│   └── auth/
│       └── spec.md        # Bây giờ bao gồm các yêu cầu 2FA
└── changes/
    └── archive/
        └── 2025-01-24-add-2fa/    # Được bảo quản cho lịch sử
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Quy trình lưu trữ

1. **Hợp nhất delta.** Mỗi phần đặc tả delta (THÊM MỚI/SỬA ĐỔI/LOẠI BỎ) được áp dụng vào đặc tả chính tương ứng.

2. **Chuyển vào lưu trữ.** Thư mục thay đổi được chuyển sang `changes/archive/` với tiền tố ngày tháng để sắp xếp theo thứ tự thời gian.

3. **Bảo quản ngữ cảnh.** Tất cả các tạo phẩm vẫn còn nguyên vẹn trong kho lưu trữ. Bạn luôn có thể nhìn lại để hiểu tại sao một thay đổi được thực hiện.

### Tại sao lưu trữ quan trọng

**Trạng thái sạch.** Các thay đổi đang hoạt động (`changes/`) chỉ hiển thị công việc đang thực hiện. Công việc đã hoàn thành được di chuyển ra khỏi tầm nhìn.

**Lịch sử kiểm tra.** Kho lưu trữ bảo quản toàn bộ ngữ cảnh của mọi thay đổi — không chỉ những gì đã thay đổi, mà còn cả đề xuất giải thích lý do, thiết kế giải thích cách thức, và các nhiệm vụ cho thấy công việc đã hoàn thành.

**Sự tiến hóa của đặc tả.** Các đặc tả phát triển hữu cơ khi các thay đổi được lưu trữ. Mỗi kho lưu trữ hợp nhất các delta của nó, xây dựng lên một đặc tả toàn diện theo thời gian.

## Cách tất cả hoạt động cùng nhau

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              QUY TRÌNH OPENSPEC                              │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. BẮT ĐẦU   │  /opsx:propose (core) hoặc /opsx:new (expanded)         │
│   │     THAY ĐỔI  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. TẠO       │  /opsx:ff hoặc /opsx:continue (expanded workflow)        │
│   │     TẠO PHẨM  │  Tạo proposal → specs → design → tasks                  │
│   │                │  (dựa trên phụ thuộc schema)                           │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. TRIỂN KHAI │  /opsx:apply                                            │
│   │     NHIỆM VỤ  │  Thực hiện qua các nhiệm vụ, đánh dấu hoàn thành       │
│   │                │◄──── Cập nhật tạo phẩm khi bạn học được                 │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. XÁC MINH   │  /opsx:verify (tùy chọn)                               │
│   │     CÔNG VIỆC │  Kiểm tra triển khai khớp với đặc tả                    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. LƯU TRỮ   │────►│  Delta specs hợp nhất vào main specs        │    │
│   │     THAY ĐỔI  │     │  Thư mục thay đổi chuyển vào archive/       │    │
│   └────────────────┘     │  Specs bây giờ là nguồn sự thật đã cập nhật│    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Chu trình đạo đức:**

1. Các đặc tả mô tả hành vi hiện tại
2. Các thay đổi đề xuất sửa đổi (dưới dạng delta)
3. Triển khai làm cho các thay đổi trở thành hiện thực
4. Lưu trữ hợp nhất delta vào đặc tả
5. Các đặc tả bây giờ mô tả hành vi mới
6. Thay đổi tiếp theo xây dựng dựa trên các đặc tả đã cập nhật

## Bảng chú giải thuật ngữ

| Thuật ngữ | Định nghĩa |
|-----------|-------------|
| **Artifact** | Một tài liệu nằm trong một thay đổi (đề xuất, thiết kế, nhiệm vụ hoặc đặc tả delta) |
| **Archive** | Quá trình hoàn thành một thay đổi và hợp nhất các delta của nó vào các đặc tả chính |
| **Change** | Một sửa đổi được đề xuất cho hệ thống, được đóng gói dưới dạng một thư mục chứa các artifact |
| **Delta spec** | Một đặc tả mô tả các thay đổi (THÊM/SỬA/XÓA) so với các đặc tả hiện tại |
| **Domain** | Một nhóm logic cho các đặc tả (ví dụ: `auth/`, `payments/`) |
| **Requirement** | Một hành vi cụ thể mà hệ thống phải có |
| **Scenario** | Một ví dụ cụ thể của một yêu cầu, thường ở định dạng Given/When/Then |
| **Schema** | Một định nghĩa về các loại artifact và các phụ thuộc của chúng |
| **Spec** | Một đặc tả mô tả hành vi của hệ thống, chứa các yêu cầu và kịch bản |
| **Source of truth** | Thư mục `openspec/specs/`, chứa hành vi đã được thống nhất hiện tại |

## Các bước tiếp theo

- [Bắt đầu](getting-started.md) - Các bước thực tế đầu tiên
- [Quy trình làm việc](workflows.md) - Các mẫu phổ biến và khi nào nên sử dụng từng mẫu
- [Các lệnh](commands.md) - Tham chiếu lệnh đầy đủ
- [Tùy chỉnh](customization.md) - Tạo lược đồ tùy chỉnh và cấu hình dự án của bạn