# Stores: Kế Hoạch Trong Repo Riêng

> **Beta.** Stores, references, working context, và worksets là mới. Tên lệnh, cờ (flags), định dạng tệp và đầu ra JSON vẫn có thể thay đổi giữa các bản phát hành. Mọi hướng dẫn sử dụng bên dưới đều được chạy trên bản dựng hiện tại, nhưng hãy đọc lại hướng dẫn này sau khi nâng cấp.

## Vấn Đề Cần Giải Quyết

OpenSpec thường nằm bên trong một repo mã nguồn: một thư mục openspec/ bên cạnh mã của bạn, chứa các thông số kỹ thuật (specs) và thay đổi cho repo đó.

Điều này không còn phù hợp khi việc lập kế hoạch của bạn lớn hơn một repo:

- Công việc của bạn trải rộng trên nhiều repo — một tính năng chạm đến API server, ứng dụng web và một thư viện dùng chung. Kế hoạch nên nằm trong thư mục openspec/ nào?
- Nhóm của bạn lập kế hoạch trước khi mã tồn tại, hoặc lập kế hoạch những thứ sẽ không bao giờ trở thành mã trong *repo này*.
- Các yêu cầu do một nhóm sở hữu và được các nhóm khác sử dụng. Phiên bản trên wiki bị lệch, và tác nhân mã hóa (coding agent) của bạn cũng không thể đọc nó.

Một **store** là câu trả lời: một repo độc lập có nhiệm vụ duy nhất là lập kế hoạch. Nó có cùng cấu trúc openspec/ mà bạn đã biết — các thông số kỹ thuật và thay đổi — cộng thêm một tệp định danh nhỏ. Bạn chỉ cần đăng ký nó trên máy của mình một lần, bằng tên, và sau đó mọi lệnh OpenSpec thông thường đều có thể hoạt động trong đó từ bất kỳ đâu.

## Hình dạng (The shape)

```
            team-plans  (a store: planning in its own repo)
            ├── .openspec-store/store.yaml     identity: "I am team-plans"
            └── openspec/
                ├── specs/      what is true
                └── changes/    what is in motion
                      ▲
                      │ registered on each machine by name;
                      │ shared by pushing/cloning like any repo
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (code repo)   (code repo)    (code repo)
```

Hai quy tắc giữ cho điều này đơn giản:

1. **Một store chỉ là một git repo.** Bạn tự commit, push, pull và review nó. OpenSpec không bao giờ tự động clone, sync hay push bất cứ thứ gì.
2. **Các khai báo (Declarations), chứ không phải cơ chế vận hành (machinery).** Các repos có thể *khai báo* mối quan hệ của chúng với các stores (như minh họa bên dưới). Các khai báo thay đổi những gì OpenSpec có thể nói cho bạn — nhưng không bao giờ thay đổi nơi các lệnh của bạn hoạt động.

## Năm phút để có store đầu tiên

Hai lệnh đưa bạn từ trạng thái chưa có gì đến một sự thay đổi đã sẵn sàng và thuộc phạm vi của store:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Store ready: team-plans
Location: /Users/you/openspec/team-plans
OpenSpec root: ready
Registry: registered

Next: run normal OpenSpec commands against this store, for example:
  openspec new change <change-id> --store team-plans
Share this store by committing and pushing it like any Git repo.
```

```bash
openspec new change add-login --store team-plans
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
Created change 'add-login' at /Users/you/openspec/team-plans/openspec/changes/add-login/
Schema: spec-driven
Next: openspec status --change add-login --store team-plans
```

Đó là toàn bộ mô hình. Từ đây, vòng đời (lifecycle) hoàn toàn giống như những gì bạn biết — `status`, `instructions`, `validate`, `archive` — với `--store team-plans` trên mỗi lệnh, và mọi gợi ý được in ra đều mang cờ đó cho bạn. Dòng `Using OpenSpec root:` luôn cho bạn biết một lệnh đang hoạt động ở đâu.

## Câu chuyện: một đội nhóm, một repo lập kế hoạch (planning)

Một đội nhóm giữ các spec và thay đổi của họ trong `team-plans` thay vì phân tán chúng qua nhiều code repos.

**Ngày đầu tiên (ai thiết lập):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Việc truyền `--remote` ghi lại URL clone bên trong file identity của chính store (`.openspec-store/store.yaml`), ngay từ lần commit đầu tiên. Mọi lần clone sau đều được sinh ra với sự hiểu biết về nguồn gốc của nó, vì vậy các kiểm tra sức khỏe (health checks) và thông báo lỗi có thể in ra một bản sửa chữa hoàn chỉnh, sẵn sàng để dán cho đồng đội chưa có nó.

**Mỗi thành viên trong đội (một lần trên mỗi máy):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Từ đó trở đi, mọi người đều làm việc trong cùng một repo lập kế hoạch theo tên gọi:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Chia sẻ công việc là git, cố ý mà thôi.** Một thay đổi bạn tạo ra chỉ tồn tại trong checkout của bạn cho đến khi bạn commit và push nó — giống như code. Các kế hoạch có nhánh (branches), pull request và quy trình review miễn phí, bởi vì một store là một repo thông thường.

**Kết nối các code repos của đội nhóm.** Một code repo mà công tác lập kế hoạch đã được ngoại hóa hoàn toàn cần đúng một dòng trong `openspec/config.yaml`:

```yaml
# web-app/openspec/config.yaml
store: team-plans
```

Giờ đây, mọi lệnh OpenSpec chạy bên trong `web-app` đều hoạt động trên `team-plans` mà không cần bất kỳ cờ nào:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Using OpenSpec root: team-plans (/Users/you/openspec/team-plans)
...
```

Con trỏ (pointer) là một giải pháp dự phòng, không bao giờ là sự ghi đè: `--store` tường minh luôn thắng thế, và nếu repo phát triển các thư mục lập kế hoạch thực sự của riêng nó, thì những thư mục đó sẽ thắng (với cảnh báo để xóa con trỏ cũ).

## Câu chuyện: các yêu cầu vượt qua ranh giới đội nhóm

Một đội nền tảng (platform team) sở hữu các yêu cầu. Các đội sản phẩm xây dựng dựa trên chúng, trong repo của riêng họ, với thiết kế của riêng họ. Một tham chiếu mô tả mối quan hệ đó mà không di chuyển công việc của bất kỳ ai.

```
   platform-reqs (store)                 api-server (code repo)
   owned by the platform team            owned by a product team
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ reads    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (their own designs)    │
   │   platform work          │          │ openspec/changes/        │
   │                          │          │   (their own work)       │
   │                          │          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Đội sản phẩm khai báo những gì họ dựa vào** trong `openspec/config.yaml` của repo:

```yaml
references:
  - platform-reqs
```

Các tham chiếu là ngữ cảnh chỉ đọc (read-only context). Repo giữ nguyên gốc `openspec/` của riêng nó; công việc vẫn ở đó. Điều gì thay đổi: `openspec instructions` trong repo đó giờ đây bao gồm một mục lục các spec được tham chiếu — mỗi spec đều có một bản tóm tắt một dòng và lệnh fetch chính xác (`openspec show <spec-id> --type spec --store platform-reqs`). Một agent làm việc trong `api-server` có thể tìm thấy các yêu cầu thanh toán (payment requirements) thượng nguồn, trích dẫn chúng, và viết thiết kế cấp thấp của mình vào gốc repo — mà không cần ai dán ngữ cảnh.

Một tham chiếu có thể mang nguồn clone của nó, vì vậy những thành viên trong đội chưa có store vẫn nhận được một bản sửa chữa hoàn chỉnh thay vì bị tắc đường:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Khi bạn muốn kế hoạch và code mở cùng nhau, hãy tạo một workset.** Điều này mang tính cá nhân và tường minh: mỗi người chọn các thư mục mà họ thực sự làm việc trên máy của mình. Không có gì về những đường dẫn checkout cục bộ đó được commit vào repo lập kế hoạch chung.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Hai câu hỏi bạn luôn có thể đặt ra

**"Cấu hình của tôi có khỏe mạnh không?"** — `openspec doctor` kiểm tra gốc hiện tại và các store được tham chiếu, chỉ đọc, với một bản sửa chữa sẵn sàng để dán cho mỗi phát hiện:

```
Doctor

Root
  Location: /Users/you/src/api-server
  OpenSpec root: ok

References
  - platform-reqs: ok (/Users/you/openspec/platform-reqs)
  - design-system: Referenced store 'design-system' is not registered on this machine.
    Fix: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Tôi đang làm việc với cái gì?"** — `openspec context` tập hợp workset từ các khai báo của OpenSpec: gốc và các stores mà nó tham chiếu.

```
Working context for api-server (/Users/you/src/api-server)

OpenSpec root
  api-server  /Users/you/src/api-server

Referenced stores
  platform-reqs  /Users/you/openspec/platform-reqs
    Fetch: openspec show <spec-id> --type spec --store platform-reqs
```

Cả hai đều hỗ trợ `--json` cho các agent. `openspec context --code-workspace <path>` còn ghi thêm một file workspace của VS Code chứa toàn bộ set — đây là hành động ghi duy nhất mà lệnh này thực hiện.

## Worksets: mở lại những thư mục bạn làm việc cùng nhau

Tách biệt với tất cả những điều trên: hầu hết mọi người đều mở cùng vài thư mục trong mỗi phiên — repo lập kế hoạch cộng thêm hai hoặc ba code repos. Một **workset** là một chế độ xem cá nhân, có tên gọi về chính xác điều đó, được mở lại bằng một lệnh duy nhất trong công cụ bạn chọn.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       all three open in your tool
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --member ~/src/web-app
openspec workset list
```

```
platform  (opens in VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

`openspec workset open platform` sau đó sẽ khởi chạy công cụ đã lưu: các trình soạn thảo (VS Code, Cursor) mở một cửa sổ với mọi thành viên và trả về. Thành viên đầu tiên là chính yếu (primary). Có thể ghi đè công cụ bất cứ lúc nào bằng `--tool <id>`.

Worksets cố ý *không* phải là trạng thái được chia sẻ. Chúng tồn tại trên máy của bạn, không bao giờ được commit, và không đưa ra bất kỳ tuyên bố nào về công việc — chúng chỉ ghi lại những gì bạn thích mở cùng nhau. Việc xóa một workset sẽ không chạm vào các thư mục thành viên. Các công cụ mới là cấu hình, không phải code: bất cứ thứ gì được khởi chạy thông qua file workspace hoặc cờ gắn theo từng thư mục đều có thể được thêm dưới khóa `openers` trong cấu hình toàn cục (`openspec config edit`).

## Cách các lệnh quyết định nơi để hoạt động

Mọi lệnh thông thường đều giải quyết gốc của nó theo cùng một cách, theo thứ tự này:

```
1. --store <id>          bạn đã nói rõ ràng        → store đó
2. nearest openspec/     một gốc lập kế hoạch thực sự ở đây     → repo này
   (đi lên từ cwd)
3. store: pointer        config.yaml khai báo một store  → store đó
4. không có cái nào ở trên     các stores đã được đăng ký trên máy này?     → lỗi với gợi ý lựa chọn
                         không có store nào được đăng ký?         → thư mục hiện tại
                                                          (hành vi cổ điển)
```

Dòng `Using OpenSpec root:` (và khối `root` trong đầu ra `--json`) cho bạn biết bạn đang ở trường hợp nào.

## Các giới hạn đã biết đến

- **Hình dạng Beta.** Mọi thứ trên trang này đều có thể thay đổi giữa các bản phát hành — tên, cờ, định dạng file, khóa JSON.
- **Một checkout cho mỗi ID store trên mỗi máy.** Việc đăng ký một checkout thứ hai dưới cùng một ID sẽ thất bại với gợi ý phải `store unregister` trước.
- **Không đồng bộ hóa (sync), mãi mãi — theo thiết kế.** OpenSpec không bao giờ clone, pull hay push. Một checkout cũ sẽ hiển thị các spec cũ cho đến khi *bạn* pull; các tham chiếu được lập chỉ mục trực tiếp từ bất cứ thứ gì có trên đĩa.
- **Một số lệnh vẫn giữ nguyên vị trí của chúng.** `view`, `templates`, `schemas`, và các dạng danh từ đã lỗi thời (`openspec change show`, ...) chỉ hoạt động trên thư mục hiện tại — không cần `--store`.
- **Trạng thái trên từng máy là riêng của từng máy.** Registry store và worksets là cài đặt cục bộ. Không có gì về bố cục máy của bạn bao giờ được commit vào lập kế hoạch chung.
- **Hai kiểu khởi chạy cho worksets.** Một công cụ không thể được khởi chạy bằng file workspace hoặc cờ gắn theo từng thư mục thì không thể được thêm làm opener (người mở).
- **JSON Agent có sự phân chia về cách viết (casing) đã biết đến** (các khóa thuộc gia đình store là snake_case, các khóa thuộc gia đình workflow là camelCase). Được tài liệu hóa trong [agent contract](../agent-contract.md); việc thống nhất nó được hoãn lại cho một bản phát hành có phiên bản.

## Mọi thứ ở đâu

| Cái gì | Ở đâu | Có chia sẻ không? |
|---|---|---|
| Công tác lập kế hoạch của một store | `<store>/openspec/` (specs, changes) | Có — commit và push nó |
| Identity của một store | `<store>/.openspec-store/store.yaml` | Có — được commit cùng với store |
| Registry store | `<data dir>/openspec/stores/registry.yaml` | Không — chỉ máy này thôi |
| Worksets | `<data dir>/openspec/worksets/` | Không — chỉ máy này thôi |

`<data dir>` là `~/.local/share/openspec` trên macOS và Linux (hoặc `$XDG_DATA_HOME/openspec` khi được đặt), và `%LOCALAPPDATA%\openspec` trên Windows.
## Tài liệu tham khảo (Reference)

Các cờ chính xác và hình dạng JSON cho mọi lệnh trên trang này:
[CLI reference](../cli.md) (Stores, Doctor, Working context, Personal worksets) và [agent contract](../agent-contract.md).