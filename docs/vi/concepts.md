# Các khái niệm

Hướng dẫn này giải thích những ý tưởng cốt lõi đằng sau OpenSpec và cách chúng kết hợp với nhau. Để biết cách sử dụng thực tế, hãy xem [Bắt đầu](getting-started.md) và [Quy trình làm việc](workflows.md).

## Triết lý

OpenSpec được xây dựng dựa trên bốn nguyên tắc:

```
linh hoạt không cứng nhắc      — không có các giai đoạn bắt buộc, làm những gì hợp lý
lặp đi lặp lại không thác nước — học trong khi xây dựng, tinh chỉnh liên tục
đơn giản không phức tạp        — thiết lập nhẹ nhàng, thủ tục tối thiểu
ưu tiên sửa đổi hiện có        — hoạt động với các cơ sở mã hiện có, không chỉ xây mới
```

### Tại sao những nguyên tắc này quan trọng

**Linh hoạt không cứng nhắc.** Các hệ thống đặc tả truyền thống gò bạn vào các giai đoạn: trước tiên bạn lập kế hoạch, sau đó triển khai, và rồi hoàn thành. OpenSpec linh hoạt hơn — bạn có thể tạo các sản phẩm theo bất kỳ thứ tự nào phù hợp với công việc của mình.

**Lặp đi lặp lại không thác nước.** Yêu cầu thay đổi. Sự hiểu biết sâu sắc hơn. Những gì có vẻ là một cách tiếp cận tốt ban đầu có thể không còn phù hợp sau khi bạn xem xét cơ sở mã. OpenSpec chấp nhận thực tế này.

**Đơn giản không phức tạp.** Một số khung đặc tả đòi hỏi thiết lập phức tạp, định dạng cứng nhắc hoặc quy trình nặng nề. OpenSpec không cản trở bạn. Khởi tạo trong vài giây, bắt đầu làm việc ngay lập tức, chỉ tùy chỉnh khi cần thiết.

**Ưu tiên sửa đổi hiện có.** Hầu hết công việc phần mềm không phải là xây dựng từ đầu — mà là sửa đổi các hệ thống hiện có. Cách tiếp cận dựa trên thay đổi (delta-based) của OpenSpec giúp dễ dàng chỉ định các thay đổi đối với hành vi hiện có, không chỉ mô tả các hệ thống mới.

## Tổng quan

OpenSpec tổ chức công việc của bạn thành hai khu vực chính:

```
┌────────────────────────────────────────────────────────────────────┐
│                        openspec/                                   │
│                                                                    │
│   ┌─────────────────────┐      ┌───────────────────────────────┐   │
│   │       specs/        │      │         changes/              │   │
│   │                     │      │                               │   │
│   │  Nguồn chân lý     │◄─────│  Các sửa đổi đề xuất         │   │
│   │  Cách hệ thống     │ merge│  Mỗi thay đổi = một thư mục  │   │
│   │  hiện tại hoạt động│      │  Chứa các thành phẩm + deltas│   │
│   │                     │      │                               │   │
│   └─────────────────────┘      └───────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Specs** là nguồn chân lý — chúng mô tả cách hệ thống của bạn hiện đang hoạt động.

**Changes** là các sửa đổi đề xuất — chúng nằm trong các thư mục riêng biệt cho đến khi bạn sẵn sàng hợp nhất chúng.

Sự tách biệt này là chìa khóa. Bạn có thể làm việc trên nhiều thay đổi song song mà không xung đột. Bạn có thể xem xét một thay đổi trước khi nó ảnh hưởng đến specs chính. Và khi bạn lưu trữ một thay đổi, các deltas của nó được hợp nhất gọn gàng vào nguồn chân lý.

## Không gian làm việc phối hợp

Hỗ trợ không gian làm việc đang được phát triển tích cực và chưa sẵn sàng để sử dụng. Không xây dựng tự động hóa bên ngoài, tích hợp hoặc quy trình làm việc dài hạn dựa trên hành vi của không gian làm việc; các lệnh, tệp trạng thái và đầu ra JSON có thể thay đổi bất cứ lúc nào.

Các lệnh dưới đây cung cấp quy trình thiết lập đầu tiên để lập kế hoạch trên nhiều kho lưu trữ hoặc thư mục được liên kết.

Các dự án OpenSpec cục bộ trong kho lưu trữ là mặc định phù hợp khi một kho lưu trữ sở hữu quy trình lập kế hoạch, triển khai và lưu trữ. Một số công việc trải rộng trên nhiều kho lưu trữ hoặc thư mục. Đối với trường hợp đó, một không gian làm việc phối hợp OpenSpec là nơi lập kế hoạch bền vững.

Mô hình tinh thần của không gian làm việc là:

```text
workspace = nơi các thay đổi liên kho liên quan sống
link      = một tên ổn định cho một kho lưu trữ hoặc thư mục mà không gian làm việc có thể lập kế hoạch
change    = một tính năng, sửa lỗi, dự án hoặc một phần công việc được lên kế hoạch khác
```

Một không gian làm việc có hình dạng khác với dự án cục bộ trong kho lưu trữ:

```text
workspace-folder/
├── changes/                       # Lập kế hoạch cấp không gian làm việc
└── .openspec-workspace/
    ├── workspace.yaml             # Nhận dạng không gian làm việc chung và tên liên kết
    └── local.yaml                 # Các đường dẫn cục bộ của máy này
```

Trạng thái OpenSpec cục bộ trong kho lưu trữ giữ nguyên hình dạng hiện có:

```text
repo-root/
└── openspec/
    ├── specs/
    └── changes/
```

Sự phân biệt đó rất quan trọng. Thư mục không gian làm việc là bề mặt phối hợp để lập kế hoạch trên các kho lưu trữ hoặc thư mục được liên kết. Thư mục `openspec/` của mỗi kho lưu trữ vẫn là nơi cho specs thuộc sở hữu của kho lưu trữ, các thay đổi cục bộ trong kho lưu trữ và lập kế hoạch triển khai. Người dùng không cần chạy `openspec init` cục bộ trong kho lưu trữ bên trong thư mục không gian làm việc.

Các tên liên kết ổn định là cách lập kế hoạch không gian làm việc tham chiếu đến các kho lưu trữ và thư mục. Trạng thái không gian làm việc chung lưu giữ các tên như `api`, `web` hoặc `checkout`; mỗi máy ánh xạ các tên đó thành các đường dẫn cục bộ riêng trong `.openspec-workspace/local.yaml`.

```yaml
# .openspec-workspace/workspace.yaml
version: 1
name: platform
links:
  api: {}
  web: {}
```

```yaml
# .openspec-workspace/local.yaml
version: 1
paths:
  api: /repos/api
  web: /repos/web
```

Các không gian làm việc do OpenSpec tạo ra loại trừ `.openspec-workspace/local.yaml` khỏi trạng thái cộng tác di động theo mặc định. `.openspec-workspace/workspace.yaml` vẫn di động vì nó lưu trữ tên không gian làm việc và các tên liên kết ổn định, không phải đường dẫn checkout tuyệt đối của một người dùng.

Các đường dẫn được liên kết có thể là toàn bộ kho lưu trữ, các thư mục bên trong một monorepo lớn hoặc các thư mục hiện có khác. Chúng không cần trạng thái `openspec/` cục bộ trong kho lưu trữ trước khi có thể tham gia vào lập kế hoạch không gian làm việc. Các quy trình làm việc triển khai, xác minh hoặc lưu trữ sau này có thể yêu cầu sự sẵn sàng nhiều hơn của kho lưu trữ, nhưng khả năng hiển thị lập kế hoạch bắt đầu với liên kết.

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

Điều đó có nghĩa là `$XDG_DATA_HOME/openspec/workspaces` khi `XDG_DATA_HOME` được đặt, `~/.local/share/openspec/workspaces` trên dự phòng kiểu Unix và `%LOCALAPPDATA%\openspec\worksapces` trên dự phòng Windows gốc. Các shell Windows gốc, PowerShell và WSL2 mỗi loại giữ các chuỗi đường dẫn cho runtime đang chạy OpenSpec. Nền tảng này không dịch giữa `D:\repo`, `/mnt/d/repo` và các đường dẫn UNC WSL.

OpenSpec cũng lưu giữ một sổ đăng ký cục bộ trên máy tại:

```text
getGlobalDataDir()/workspaces/registry.yaml
```

Sổ đăng ký ánh xạ tên không gian làm việc sang vị trí không gian làm việc để các lệnh toàn cục sau này có thể liệt kê hoặc chọn các không gian làm việc đã biết từ bất kỳ đâu. Nó chỉ là một chỉ mục. Mỗi thư mục không gian làm việc vẫn là nguồn chính thức cho `.openspec-workspace/workspace.yaml` và `.openspec-workspace/local.yaml` của riêng nó, vì vậy các bản ghi sổ đăng ký cũ có thể được báo cáo và sửa chữa mà không cần xác định lại chính không gian làm việc.

Khả năng hiển thị không gian làm việc không phải là cam kết thay đổi. Thiết lập một không gian làm việc khi OpenSpec nên biết kho lưu trữ hoặc thư mục nào là liên quan; tạo một thay đổi sau đó khi bạn sẵn sàng lập kế hoạch cho một tính năng, sửa lỗi, dự án hoặc một phần công việc khác.

Các lệnh hữu ích:

```bash
# Thiết lập có hướng dẫn
openspec workspace setup

# Thiết lập thân thiện với tự động hóa
openspec workspace setup --no-interactive --name platform --link /repos/api --link web=/repos/web
openspec workspace setup --no-interactive --name platform --link /repos/api --opener codex

# Xem các không gian làm việc đã biết từ sổ đăng ký cục bộ
openspec workspace list
openspec workspace ls

# Thêm hoặc sửa chữa liên kết cho không gian làm việc đã chọn
openspec workspace link /repos/api
openspec workspace link api-service /repos/api
openspec workspace relink api-service /new/path/to/api

# Kiểm tra những gì máy này có thể giải quyết
openspec workspace doctor
openspec workspace doctor --workspace platform

# Mở bộ làm việc được liên kết
openspec workspace open
openspec workspace open platform --agent github-copilot
openspec workspace open --editor
```

`workspace setup` luôn tạo không gian làm việc trong vị trí không gian làm việc tiêu chuẩn, ghi lại nó trong sổ đăng ký cục bộ, hiển thị vị trí không gian làm việc và yêu cầu ít nhất một kho lưu trữ hoặc thư mục được liên kết. Thiết lập tương tác hỏi về trình mở ưa thích. Thiết lập không tương tác chỉ lưu trữ một trình mở khi `--opener codex`, `--opener claude`, `--opener github-copilot` hoặc `--opener editor` được cung cấp.

OpenSpec cũng duy trì các tệp mở không gian làm việc gốc: một khối hướng dẫn do OpenSpec quản lý trong `AGENTS.md`, một tệp `<workspace-name>.code-workspace` cục bộ trên máy cho VS Code và GitHub Copilot-in-VS-Code mở, và một mục bỏ qua cụ thể cho tệp `.code-workspace` được duy trì đó. Các tệp `*.code-workspace` do người dùng tạo vẫn có thể theo dõi được vì quy tắc bỏ qua chỉ nhắm vào tệp được duy trì.

Không gian làm việc VS Code được duy trì bao gồm gốc phối hợp là `.` cùng với các kho lưu trữ hoặc thư mục được liên kết hợp lệ làm các gốc bổ sung. VS Code hiển thị các mục đó dưới dạng không gian làm việc đa gốc.

`workspace open` mở bộ làm việc được liên kết với trình mở ưa thích đã lưu trừ khi `--agent <tool>` hoặc `--editor` được truyền cho phiên đó. Truyền cả hai ghi đè trình mở là một lỗi. Mở không gian làm việc gốc làm cho các kho lưu trữ và thư mục được liên kết hiển thị để khám phá và lập kế hoạch; triển khai bắt đầu sau khi người dùng yêu cầu rõ ràng công việc triển khai.

`workspace link` và `workspace relink` chỉ ghi lại các thư mục hiện có; chúng không tạo, sao chép, di chuyển, khởi tạo hoặc chỉnh sửa kho lưu trữ hoặc thư mục được liên kết. Sau khi liên kết hoặc liên kết lại thành công, OpenSpec làm mới hướng dẫn được quản lý, tệp không gian làm việc VS Code và quy tắc bỏ qua.

Các lệnh không gian làm việc cần một không gian làm việc có thể chạy từ bất kỳ đâu với `--workspace <name>`. Nếu bạn chạy chúng bên trong thư mục không gian làm việc hoặc thư mục con, OpenSpec sử dụng không gian làm việc hiện tại đó. Nếu nhiều không gian làm việc đã biết khả dụng và bạn không truyền `--workspace <name>`, các lệnh của con người hiển thị bộ chọn; `--json` và `--no-interactive` thất bại với lỗi trạng thái có cấu trúc thay vì nhắc.

Các lệnh không gian làm việc trực tiếp hỗ trợ đầu ra JSON cho các tập lệnh. Các phản hồi JSON giữ dữ liệu chính trong các đối tượng `workspace`, `workspaces` hoặc `link` và báo cáo cảnh báo hoặc lỗi trong mảng `status`. Các đối tượng lành mạnh sử dụng `status: []`.

## Specs

Specs mô tả hành vi của hệ thống bạn bằng các yêu cầu và kịch bản có cấu trúc.

### Cấu trúc

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
- **Theo ngữ cảnh có giới hạn**: `ordering/`, `fulfillment/`, `inventory/`

### Định dạng Spec

Một spec chứa các yêu cầu, và mỗi yêu cầu có các kịch bản:

```markdown
# Đặc tả Xác thực
```

## Mục đích
Xác thực và quản lý phiên cho ứng dụng.

## Yêu cầu

### Yêu cầu: Xác thực người dùng
Hệ thống PHẢI cấp một mã JWT khi đăng nhập thành công.

#### Kịch bản: Thông tin đăng nhập hợp lệ
- CHO một người dùng có thông tin đăng nhập hợp lệ
- KHI người dùng gửi biểu mẫu đăng nhập
- THÌ một mã JWT được trả về
- VÀ người dùng được chuyển hướng đến trang tổng quan

#### Kịch bản: Thông tin đăng nhập không hợp lệ
- CHO thông tin đăng nhập không hợp lệ
- KHI người dùng gửi biểu mẫu đăngoài
- THÌ một thông báo lỗi được hiển thị
- VÀ không có mã nào được cấp

### Yêu cầu: Phiên hết hạn
Hệ thống BẮT BUỘC phải hết hạn phiên sau 30 phút không hoạt động.

#### Kịch bản: Hết thời gian chờ
- CHO một phiên đã được xác thực
- KHI 30 phút trôi qua mà không có hoạt động
- THÌ phiên bị vô hiệu hóa
- VÀ người dùng phải xác thực lại
```

**Các phần tử chính:**

| Phần tử | Mục đích |
|---------|---------|
| `## Purpose` | Mô tả cấp cao về lĩnh vực của đặc tả này |
| `### Requirement:` | Một hành vi cụ thể mà hệ thống phải có |
| `#### Scenario:` | Một ví dụ cụ thể về yêu cầu đang được áp dụng |
| SHALL/MUST/SHOULD | Các từ khóa RFC 2119 cho biết mức độ bắt buộc của yêu cầu |

### Tại sao nên cấu trúc đặc tả theo cách này

**Yêu cầu là "cái gì"** — chúng nêu rõ hệ thống nên làm gì mà không chỉ định cách triển khai.

**Kịch bản là "khi nào"** — chúng cung cấp các ví dụ cụ thể có thể được xác minh. Các kịch bản tốt:
- Có thể kiểm tra được (bạn có thể viết một bài kiểm tra tự động cho chúng)
- Bao gồm cả luồng thành công và các trường hợp ngoại lệ
- Sử dụng định dạng có cấu trúc như Given/When/Then hoặc tương tự

**Các từ khóa RFC 2119** (SHALL, MUST, SHOULD, MAY) truyền đạt ý định:
- **MUST/SHALL** — yêu cầu bắt buộc
- **SHOULD** — được khuyến nghị, nhưng có ngoại lệ
- **MAY** — tùy chọn

### Đặc tả là gì (và không phải là gì)

Đặc tả là một **hợp đồng hành vi**, không phải là kế hoạch triển khai.

Nội dung đặc tả tốt:
- Hành vi có thể quan sát được mà người dùng hoặc các hệ thống phụ thuộc vào
- Đầu vào, đầu ra và các điều kiện lỗi
- Các ràng buộc bên ngoài (bảo mật, quyền riêng tư, độ tin cậy, khả năng tương thích)
- Các kịch bản có thể được kiểm tra hoặc xác nhận rõ ràng

Tránh trong đặc tả:
- Tên lớp/hàm nội bộ
- Lựa chọn thư viện hoặc khung làm việc
- Chi tiết triển khai từng bước
- Kế hoạch thực thi chi tiết (chúng thuộc về `design.md` hoặc `tasks.md`)

Kiểm tra nhanh:
- Nếu việc triển khai có thể thay đổi mà không thay đổi hành vi có thể nhìn thấy từ bên ngoài, thì nó có thể không thuộc về đặc tả.

### Giữ nó nhẹ nhàng: Tính nghiêm ngặt tiến bộ

OpenSpec nhằm tránh quan liêu. Sử dụng mức độ nhẹ nhất vẫn làm cho thay đổi có thể xác minh được.

**Đặc tả Lite (mặc định):**
- Các yêu cầu ngắn gọn, ưu tiên hành vi
- Phạm vi và mục tiêu không rõ ràng
- Một vài kiểm tra chấp nhận cụ thể

**Đặc tả đầy đủ (cho rủi ro cao hơn):**
- Thay đổi liên nhóm hoặc liên kho lưu trữ
- Thay đổi API/hợp đồng, di chuyển, các mối quan tâm về bảo mật/quyền riêng tư
- Các thay đổi mà sự mơ hồ có khả năng gây ra việc làm lại tốn kém

Hầu hết các thay đổi nên ở chế độ Lite.

### Sự hợp tác giữa Con người và Agent

Trong nhiều nhóm, con người khám phá và agent soạn thảo các sản phẩm. Vòng lặp dự kiến là:

1. Con người cung cấp ý định, ngữ cảnh và ràng buộc.
2. Agent chuyển đổi điều này thành các yêu cầu và kịch bản ưu tiên hành vi.
3. Agent giữ chi tiết triển khai trong `design.md` và `tasks.md`, không phải `spec.md`.
4. Xác nhận cấu trúc và sự rõ ràng trước khi triển khai.

Điều này giúp các đặc tả dễ đọc cho con người và nhất quán cho agent.

## Thay đổi

Một thay đổi là một sửa đổi được đề xuất cho hệ thống của bạn, được đóng gói dưới dạng một thư mục chứa mọi thứ cần thiết để hiểu và triển khai nó.

### Cấu trúc thay đổi

```
openspec/changes/add-dark-mode/
├── proposal.md           # Tại sao và cái gì
├── design.md             # Cách thực hiện (cách tiếp cận kỹ thuật)
├── tasks.md              # Danh sách kiểm tra triển khai
├── .openspec.yaml        # Metadata thay đổi (tùy chọn)
└── specs/                # Đặc tả delta
    └── ui/
        └── spec.md       # Những gì đang thay đổi trong ui/spec.md
```

Mỗi thay đổi là tự chứa. Nó có:
- **Tài liệu** — các tài liệu ghi lại ý định, thiết kế và các công việc
- **Đặc tả delta** — các đặc tả cho những gì đang được thêm vào, sửa đổi hoặc loại bỏ
- **Metadata** — cấu hình tùy chọn cho thay đổi cụ thể này

### Tại sao thay đổi là các thư mục

Đóng gói một thay đổi dưới dạng thư mục có một số lợi ích:

1. **Mọi thứ ở cùng một nơi.** Đề xuất, thiết kế, công việc và đặc tả nằm trong một vị trí. Không cần tìm kiếm qua các vị trí khác nhau.

2. **Làm việc song song.** Nhiều thay đổi có thể tồn tại đồng thời mà không xung đột. Làm việc trên `add-dark-mode` trong khi `fix-auth-bug` cũng đang được tiến hành.

3. **Lịch sử sạch.** Khi được lưu trữ, các thay đổi chuyển đến `changes/archive/` với toàn bộ ngữ cảnh được bảo toàn. Bạn có thể nhìn lại và hiểu không chỉ những gì đã thay đổi, mà còn tại sao.

4. **Thân thiện với việc xem xét.** Một thư mục thay đổi dễ xem xét — mở nó ra, đọc đề xuất, kiểm tra thiết kế, xem các delta đặc tả.

## Tài liệu

Tài liệu là các tài liệu bên trong một thay đổi hướng dẫn công việc.

### Quy trình tài liệu

```
proposal ──────► specs ──────► design ──────► tasks ──────► implement
    │               │             │              │
   why            what           how          steps
 + scope        changes       approach      to take
```

Các tài liệu xây dựng dựa trên nhau. Mỗi tài liệu cung cấp ngữ cảnh cho tài liệu tiếp theo.

### Loại tài liệu

#### Đề xuất (`proposal.md`)

Đề xuất ghi lại **ý định**, **phạm vi** và **cách tiếp cận** ở mức độ cao.

```markdown
# Đề xuất: Thêm chế độ tối

## Ý định
Người dùng đã yêu cầu tùy chọn chế độ tối để giảm mỏi mắt
trong quá trình sử dụng ban đêm và phù hợp với tùy chọn hệ thống.

## Phạm vi
Trong phạm vi:
- Chuyển đổi giao diện trong cài đặt
- Phát hiện tùy chọn hệ thống
- Lưu tùy chọn trong localStorage

Ngoài phạm vi:
- Giao diện màu tùy chỉnh (công việc tương lai)
- Ghi đè giao diện theo từng trang

## Cách tiếp cận
Sử dụng thuộc tính CSS tùy chỉnh cho giao diện với React context
để quản lý trạng thái. Phát hiện tùy chọn hệ thống khi tải lần đầu,
cho phép ghi đè thủ công.
```

**Khi nào cập nhật đề xuất:**
- Phạm vi thay đổi (thu hẹp hoặc mở rộng)
- Ý định được làm rõ (hiểu vấn đề tốt hơn)
- Cách tiếp cận thay đổi cơ bản

#### Đặc tả (đặc tả delta trong `specs/`)

Đặc tả delta mô tả **những gì đang thay đổi** so với các đặc tả hiện tại. Xem [Đặc tả Delta](#đặc-tả-delta) bên dưới.

#### Thiết kế (`design.md`)

Thiết kế ghi lại **cách tiếp cận kỹ thuật** và **các quyết định kiến trúc**.

````markdown
# Thiết kế: Thêm chế độ tối

## Cách tiếp cận kỹ thuật
Trạng thái giao diện được quản lý qua React Context để tránh truyền prop sâu.
Các thuộc tính CSS tùy chỉnh cho phép chuyển đổi thời gian chạy mà không cần chuyển đổi lớp.

## Các quyết định kiến trúc

### Quyết định: Context thay vì Redux
Sử dụng React Context cho trạng thái giao diện vì:
- Trạng thái nhị phân đơn giản (sáng/tối)
- Không có chuyển đổi trạng thái phức tạp
- Tránh thêm phụ thuộc Redux

### Quyết định: Thuộc tính CSS tùy chỉnh
Sử dụng biến CSS thay vì CSS-in-JS vì:
- Hoạt động với bảng định kiểu hiện tại
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
- `src/styles/globals.css` (đã sửa đổi)
````

**Khi nào cập nhật thiết kế:**
- Triển khai cho thấy cách tiếp cận sẽ không hiệu quả
- Tìm ra giải pháp tốt hơn
- Các phụ thuộc hoặc ràng buộc thay đổi

#### Công việc (`tasks.md`)

Công việc là **danh sách kiểm tra triển khai** — các bước cụ thể với hộp kiểm.

```markdown
# Công việc

## 1. Cơ sở hạ tầng giao diện
- [ ] 1.1 Tạo ThemeContext với trạng thái sáng/tối
- [ ] 1.2 Thêm thuộc tính CSS tùy chỉnh cho màu sắc
- [ ] 1.3 Triển khai lưu trữ localStorage
- [ ] 1.4 Thêm phát hiện tùy chọn hệ thống

## 2. Thành phần giao diện người dùng
- [ ] 2.1 Tạo thành phần ThemeToggle
- [ ] 2.2 Thêm chuyển đổi vào trang cài đặt
- [ ] 2.3 Cập nhật Header để bao gồm chuyển đổi nhanh

## 3. Định kiểu
- [ ] 3.1 Xác định bảng màu giao diện tối
- [ ] 3.2 Cập nhật các thành phần để sử dụng biến CSS
- [ ] 3.3 Kiểm tra tỷ lệ tương phản để đảm bảo khả năng truy cập
```

**Các phương pháp hay nhất cho công việc:**
- Nhóm các công việc liên quan dưới các tiêu đề
- Sử dụng đánh số phân cấp (1.1, 1.2, v.v.)
- Giữ các công việc đủ nhỏ để hoàn thành trong một phiên
- Đánh dấu hoàn thành công việc khi bạn hoàn thành chúng

## Đặc tả Delta

Đặc tả delta là khái niệm chính giúp OpenSpec hoạt động cho phát triển brownfield. Chúng mô tả **những gì đang thay đổi** thay vì lặp lại toàn bộ đặc tả.

### Định dạng

```markdown
# Delta cho Auth

## YÊU CẦU ĐƯỢC THÊM

### Yêu cầu: Xác thực hai yếu tố
Hệ thống PHẢI hỗ trợ xác thực hai yếu tố dựa trên TOTP.

#### Kịch bản: Đăng ký 2FA
- CHO một người dùng chưa bật 2FA
- KHI người dùng bật 2FA trong cài đặt
- THÌ một mã QR được hiển thị để thiết lập ứng dụng xác thực
- VÀ người dùng phải xác minh bằng mã trước khi kích hoạt

#### Kịch bản: Đăng nhập 2FA
- CHO một người dùng đã bật 2FA
- KHI người dùng gửi thông tin xác thực hợp lệ
- THÌ một thử thách OTP được trình bày
- VÀ đăng nhập chỉ hoàn thành sau OTP hợp lệ

## YÊU CẦU ĐƯỢC SỬA ĐỔI

### Yêu cầu: Hết hạn phiên
Hệ thống PHẢI hết hạn phiên sau 15 phút không hoạt động.
(Trước đây: 30 phút)

#### Kịch bản: Hết thời gian chờ nhàn rỗi
- CHO một phiên đã xác thực
- KHI 15 phút trôi qua mà không có hoạt động
- THÌ phiên bị vô hiệu hóa

## YÊU CẦU ĐƯỢC LOẠI BỎ

### Yêu cầu: Ghi nhớ tôi
(Đã ngừng sử dụng để ưu tiên 2FA. Người dùng nên xác thực lại mỗi phiên.)
```

### Các phần Delta

| Phần | Ý nghĩa | Điều gì xảy ra khi lưu trữ |
|---------|---------|------------------------|
| `## YÊU CẦU ĐƯỢC THÊM` | Hành vi mới | Được thêm vào đặc tả chính |
| `## YÊU CẦU ĐƯỢC SỬA ĐỔI` | Hành vi đã thay đổi | Thay thế yêu cầu hiện có |
| `## YÊU CẦU ĐƯỢC LOẠI BỎ` | Hành vi đã ngừng sử dụng | Bị xóa khỏi đặc tả chính |

### Tại sao dùng Delta thay vì Đặc tả đầy đủ

**Sự rõ ràng.** Một delta cho thấy chính xác những gì đang thay đổi. Khi đọc một đặc tả đầy đủ, bạn sẽ phải tự so sánh nó với phiên bản hiện tại trong đầu.

**Tránh xung đột.** Hai thay đổi có thể chạm vào cùng một tệp đặc tả mà không xung đột, miễn là chúng sửa đổi các yêu cầu khác nhau.

**Hiệu quả xem xét.** Người xem thấy sự thay đổi, không phải ngữ cảnh không thay đổi. Tập trung vào những gì quan trọng.

**Phù hợp với brownfield.** Hầu hết công việc sửa đổi hành vi hiện có. Delta làm cho các sửa đổi trở thành ưu tiên, không phải là điều nghĩ đến sau.

## Schemas

Schemas định nghĩa các loại artifact và sự phụ thuộc của chúng cho một workflow.

### Cách Schemas Hoạt Động

```yaml
# openspec/schemas/spec-driven/schema.yaml
name: spec-driven
artifacts:
  - id: proposal
    generates: proposal.md
    requires: []              # Không có phụ thuộc, có thể tạo trước

  - id: specs
    generates: specs/**/*.md
    requires: [proposal]      # Cần proposal trước khi tạo

  - id: design
    generates: design.md
    requires: [proposal]      # Có thể tạo song song với specs

  - id: tasks
    generates: tasks.md
    requires: [specs, design] # Cần cả specs và design trước
```

**Các artifact tạo thành một đồ thị phụ thuộc:**

```
                    proposal
                   (nút gốc)
                       │
         ┌─────────────┴─────────────┐
         │                           │
         ▼                           ▼
      specs                       design
   (yêu cầu:                  (yêu cầu:
    proposal)                   proposal)
         │                           │
         └─────────────┬─────────────┘
                       │
                       ▼
                    tasks
                (yêu cầu:
                specs, design)
```

**Các phụ thuộc là yếu tố kích hoạt, không phải cổng.** Chúng cho thấy điều gì có thể tạo, không phải điều bạn phải tạo tiếp theo. Bạn có thể bỏ qua design nếu không cần. Bạn có thể tạo specs trước hoặc sau design — cả hai đều chỉ phụ thuộc vào proposal.

### Schemas Có Sẵn

**spec-driven** (mặc định)

Workflow tiêu chuẩn cho phát triển driven bởi spec:

```
proposal → specs → design → tasks → implement
```

Phù hợp nhất cho: Phần lớn công việc tính năng nơi bạn muốn thống nhất specs trước khi triển khai.

### Schemas Tùy Chỉnh

Tạo schemas tùy chỉnh cho workflow của nhóm bạn:

```bash
# Tạo từ đầu
openspec schema init research-first

# Hoặc phân nhánh từ một schema hiện có
openspec schema fork spec-driven research-first
```

**Ví dụ schema tùy chỉnh:**

```yaml
# openspec/schemas/research-first/schema.yaml
name: research-first
artifacts:
  - id: research
    generates: research.md
    requires: []           # Nghiên cứu trước

  - id: proposal
    generates: proposal.md
    requires: [research]   # Proposal được thông tin từ nghiên cứu

  - id: tasks
    generates: tasks.md
    requires: [proposal]   # Bỏ qua specs/design, đi thẳng đến tasks
```

Xem [Tùy chỉnh](customization.md) để biết chi tiết đầy đủ về việc tạo và sử dụng schemas tùy chỉnh.

## Archive

Lưu trữ hoàn thành một thay đổi bằng cách hợp nhất các delta specs của nó vào specs chính và bảo toàn thay đổi cho lịch sử.

### Điều Gì Xảy Ra Khi Bạn Lưu Trữ

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
        └── 2025-01-24-add-2fa/    # Được bảo toàn cho lịch sử
            ├── proposal.md
            ├── design.md
            ├── tasks.md
            └── specs/
                └── auth/
                    └── spec.md
```

### Quy Trình Lưu Trữ

1. **Hợp nhất deltas.** Mỗi phần delta spec (ADDED/MODIFIED/REMOVED) được áp dụng vào spec chính tương ứng.

2. **Di chuyển đến archive.** Thư mục thay đổi di chuyển đến `changes/archive/` với tiền tố ngày để sắp xếp theo thứ tự thời gian.

3. **Bảo toàn ngữ cảnh.** Tất cả các artifact vẫn nguyên vẹn trong archive. Bạn luôn có thể nhìn lại để hiểu tại sao một thay đổi được thực hiện.

### Tại Sao Lưu Trữ Quan Trọng

**Trạng thái sạch.** Các thay đổi đang hoạt động (`changes/`) chỉ hiển thị công việc đang tiến hành. Công việc đã hoàn thành di chuyển ra khỏi đường.

**Dấu vết kiểm toán.** Archive bảo toàn toàn bộ ngữ cảnh của mọi thay đổi — không chỉ những gì đã thay đổi, mà cả proposal giải thích tại sao, design giải thích cách thức, và tasks cho thấy công việc đã hoàn thành.

**Sự tiến hóa của specs.** Specs phát triển hữu cơ khi các thay đổi được lưu trữ. Mỗi archive hợp nhất các deltas của nó, xây dựng một specification toàn diện theo thời gian.

## Cách Mọi Thứ Kết Hợp Với Nhau

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              QUY TRÌNH OPENSPEC                              │
│                                                                              │
│   ┌────────────────┐                                                         │
│   │  1. BẮT ĐẦU   │  /opsx:propose (cốt lõi) hoặc /opsx:new (mở rộng)      │
│   │     THAY ĐỔI  │                                                         │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  2. TẠO       │  /opsx:ff hoặc /opsx:continue (workflow mở rộng)        │
│   │     ARTIFACTS  │  Tạo proposal → specs → design → tasks                  │
│   │                │  (dựa trên sự phụ thuộc của schema)                     │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  3. TRIỂN KHAI │  /opsx:apply                                            │
│   │     TASKS      │  Làm việc qua các tasks, đánh dấu hoàn thành           │
│   │                │◄──── Cập nhật artifacts khi bạn học được                │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐                                                         │
│   │  4. XÁC MINH   │  /opsx:verify (tùy chọn)                               │
│   │     CÔNG VIỆC  │  Kiểm tra triển khai khớp với specs                    │
│   └───────┬────────┘                                                         │
│           │                                                                  │
│           ▼                                                                  │
│   ┌────────────────┐     ┌──────────────────────────────────────────────┐    │
│   │  5. LƯU TRỮ   │────►│  Delta specs hợp nhất vào specs chính        │    │
│   │     THAY ĐỔI  │     │  Thư mục thay đổi di chuyển đến archive/     │    │
│   └────────────────┘     │  Specs bây giờ là nguồn sự thật được cập nhật│    │
│                          └──────────────────────────────────────────────┘    │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

**Chu kỳ đức hạnh:**

1. Specs mô tả hành vi hiện tại
2. Các thay đổi đề xuất sửa đổi (dưới dạng deltas)
3. Triển khai biến các thay đổi thành hiện thực
4. Lưu trữ hợp nhất deltas vào specs
5. Specs bây giờ mô tả hành vi mới
6. Thay đổi tiếp theo xây dựng trên specs đã cập nhật

## Bảng Thuật Ngữ

| Thuật ngữ | Định nghĩa |
|-----------|------------|
| **Artifact** | Một tài liệu trong một thay đổi (proposal, design, tasks, hoặc delta specs) |
| **Archive** | Quá trình hoàn thành một thay đổi và hợp nhất các deltas của nó vào specs chính |
| **Change** | Một sửa đổi được đề xuất cho hệ thống, được đóng gói dưới dạng một thư mục với các artifact |
| **Delta spec** | Một spec mô tả các thay đổi (ADDED/MODIFIED/REMOVED) so với specs hiện tại |
| **Domain** | Một nhóm logic cho specs (ví dụ: `auth/`, `payments/`) |
| **Requirement** | Một hành vi cụ thể mà hệ thống phải có |
| **Scenario** | Một ví dụ cụ thể của một yêu cầu, thường ở định dạng Given/When/Then |
| **Schema** | Một định nghĩa về các loại artifact và sự phụ thuộc của chúng |
| **Spec** | Một specification mô tả hành vi hệ thống, chứa các yêu cầu và kịch bản |
| **Source of truth** | Thư mục `openspec/specs/`, chứa hành vi đã thống nhất hiện tại |

## Các Bước Tiếp Theo

- [Bắt Đầu](getting-started.md) - Các bước thực tế đầu tiên
- [Workflows](workflows.md) - Các mẫu phổ biến và khi nào sử dụng từng mẫu
- [Commands](commands.md) - Tham chiếu đầy đủ về lệnh
- [Tùy Chỉnh](customization.md) - Tạo schemas tùy chỉnh và cấu hình dự án của bạn