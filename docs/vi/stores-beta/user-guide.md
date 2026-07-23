# Stores: Lập kế hoạch trong repo riêng

> **Beta.** Stores, references, working context, và worksets là các tính năng mới. Tên lệnh, cờ, định dạng tệp và đầu ra JSON có thể vẫn thay đổi giữa các bản phát hành. Mọi hướng dẫn bên dưới đều được chạy trên bản dựng hiện tại, nhưng bạn nên đọc lại hướng dẫn này sau khi nâng cấp.

## Vấn đề mà giải pháp này giải quyết

OpenSpec thường nằm trong một repo duy nhất: thư mục `openspec/` cạnh mã nguồn của bạn, chứa các specs và changes cho repo đó.

Điều đó không còn phù hợp khi kế hoạch của bạn lớn hơn một repo:

- Công việc của bạn trải rộng trên nhiều repo — một tính năng tác động đến máy chủ API, ứng dụng web và thư viện dùng chung. Thư mục `openspec/` của repo nào sẽ lưu kế hoạch đó?
- Nhóm của bạn lập kế hoạch trước khi có mã nguồn, hoặc lập kế hoạch những thứ không bao giờ trở thành mã nguồn trong *repo này*.
- Yêu cầu được sở hữu bởi một nhóm và được các nhóm khác sử dụng. Phiên bản wiki bị lệch, và coding agent của bạn cũng không thể đọc được nó dù sao.

Một **store** là câu trả lời: một repo độc lập có nhiệm vụ duy nhất là lập kế hoạch. Nó có cấu trúc `openspec/` giống như bạn đã biết — gồm specs và changes — cùng với một tệp định danh nhỏ. Bạn đăng ký store trên máy của mình một lần, theo tên, và sau đó mọi lệnh OpenSpec thông thường đều có thể hoạt động với store đó từ mọi vị trí.

## Cấu trúc

```
            team-plans  (một kho lưu trữ: lập kế hoạch trong repo riêng của nó)
            ├── .openspec-store/store.yaml     identity: "Tôi là team-plans"
            └── openspec/
                ├── specs/      những gì là đúng
                └── changes/    những gì đang diễn ra
                      ▲
                      │ được đăng ký trên từng máy theo tên;
                      │ được chia sẻ bằng cách đẩy/nhân bản như mọi repo khác
        ┌─────────────┼─────────────┐
        │             │             │
    web-app       api-server     mobile-app
   (repo mã nguồn)   (repo mã nguồn)    (repo mã nguồn)
```

Hai quy tắc giữ cho mô hình này đơn giản:

1. **Một kho lưu trữ chỉ đơn giản là một repo git.** Bạn tự commit, đẩy, kéo và xem xét nó. OpenSpec không bao giờ tự động nhân bản, đồng bộ hoặc đẩy bất kỳ thứ gì.
2. **Khai báo, không phải cơ chế hoạt động.** Các repo có thể *khai báo* mối quan hệ của chúng với các kho lưu trữ (được hiển thị bên dưới). Các khai báo thay đổi những gì OpenSpec có thể nói với bạn — không bao giờ thay đổi nơi các lệnh của bạn tác động.

## Năm phút để có kho lưu trữ đầu tiên của bạn

Hai lệnh đưa bạn từ không có gì đến một thay đổi hoạt động, có phạm vi kho lưu trữ:

```bash
openspec store setup team-plans --path ~/openspec/team-plans
```

```
Kho lưu trữ đã sẵn sàng: team-plans
Vị trí: /Users/you/openspec/team-plans
Gốc OpenSpec: sẵn sàng
Danh sách đăng ký: đã đăng ký

Tiếp theo: chạy các lệnh OpenSpec thông thường đối với kho lưu trữ này, ví dụ:
  openspec new change <change-id> --store team-plans
Chia sẻ kho lưu trữ này bằng cách commit và đẩy nó như mọi repo Git khác.
```

```bash
openspec new change add-login --store team-plans
```

```
Đang sử dụng gốc OpenSpec: team-plans (/Users/you/openspec/team-plans)
Đã tạo thay đổi 'add-login' tại /Users/you/openspec/team-plans/openspec/changes/add-login/
Lược đồ: spec-driven
Tiếp theo: openspec status --change add-login --store team-plans
```

Đó là toàn bộ mô hình. Từ đây, vòng đời hoạt động hoàn toàn giống như bạn đã biết — `status`, `instructions`, `validate`, `archive` — với cờ `--store team-plans` trên mỗi lệnh, và mọi gợi ý in ra đều mang theo cờ này cho bạn. Dòng `Using OpenSpec root:` luôn cho bạn biết lệnh đang tác động ở đâu.

## Câu chuyện: một nhóm, một repo lập kế hoạch

Một nhóm lưu giữ các đặc tả và thay đổi của mình trong `team-plans` thay vì phân tán chúng trên các repo mã nguồn khác nhau.

**Ngày đầu (người thiết lập nó):**

```bash
openspec store setup team-plans --path ~/openspec/team-plans \
  --remote git@github.com:acme/team-plans.git
git -C ~/openspec/team-plans push -u origin main
```

Truyền vào `--remote` sẽ ghi URL nhân bản vào trong tệp định danh riêng của kho lưu trữ (`.openspec-store/store.yaml`), trong lần commit đầu tiên. Mọi lần nhân bản sau này đều biết nguồn gốc của nó, do đó các kiểm tra tình trạng và thông báo lỗi có thể in ra một giải pháp hoàn chỉnh, có thể dán được cho các thành viên trong nhóm chưa có kho lưu trữ này.

**Mỗi thành viên trong nhóm (một lần trên mỗi máy):**

```bash
git clone git@github.com:acme/team-plans.git ~/openspec/team-plans
openspec store register ~/openspec/team-plans
```

Từ đó, mọi người làm việc trong cùng một repo lập kế hoạch theo tên:

```bash
openspec status --store team-plans --change add-login
openspec show add-login --store team-plans
```

**Chia sẻ công việc bằng git, có chủ đích.** Một thay đổi bạn tạo chỉ tồn tại trong bản nhân bản cục bộ của bạn cho đến khi bạn commit và đẩy nó — giống như mã nguồn. Các kế hoạch tự động có nhánh, yêu cầu kéo và quy trình xem xét miễn phí, vì một kho lưu trữ chỉ là một repo bình thường.

**Kết nối các repo mã nguồn của nhóm.** Một repo mã nguồn có kế hoạch được hoàn toàn tách bên ngoài chỉ cần đúng một dòng, trong tệp `openspec/config.yaml`:

```yaml
# Cấu hình của repo web-app: openspec/config.yaml
store: team-plans
```

Bây giờ mọi lệnh OpenSpec chạy bên trong `web-app` đều tác động lên `team-plans` mà không cần bất kỳ cờ nào:

```bash
cd ~/src/web-app
openspec status --change add-login
```

```
Đang sử dụng gốc OpenSpec: team-plans (/Users/you/openspec/team-plans)
...
```

Con trỏ này chỉ là lựa chọn dự phòng, không bao giờ ghi đè: một cờ `--store` rõ ràng luôn được ưu tiên, và nếu repo tự phát triển các thư mục lập kế hoạch thực tế của riêng nó, thì các thư mục đó được ưu tiên (kèm cảnh báo để xóa con trỏ cũ).

**Một mặc định cho mọi repo trên máy của bạn.** Nếu bạn làm việc trên nhiều repo mã nguồn khác nhau đều lập kế hoạch vào cùng một kho lưu trữ, hãy thiết lập nó một lần, toàn cục, thay vì thêm dòng `store:` vào từng repo:

```bash
openspec config set defaultStore team-plans
```

Bây giờ mọi lệnh chạy bên ngoài gốc lập kế hoạch — và không có `--store` cũng không có con trỏ dự án — sẽ được giải quyết thành `team-plans`. Nó nằm ở cuối danh sách ưu tiên, do đó `--store`, một gốc cục bộ và con trỏ `store:` của dự án vẫn luôn được ưu tiên. Dòng tiêu đề gốc và khối JSON `root` báo cáo `source: "global_default"` cùng với id kho lưu trữ, do đó bạn luôn có thể phân biệt mặc định toàn máy với con trỏ riêng của repo. Xóa nó bằng lệnh `openspec config unset defaultStore`. Nếu id chưa được đăng ký, các lệnh sẽ báo lỗi và yêu cầu bạn đăng ký nó hoặc xóa mặc định cũ.

## Câu chuyện: các yêu cầu vượt qua ranh giới nhóm

Một nhóm nền tảng sở hữu các yêu cầu. Các nhóm sản phẩm xây dựng dựa trên các yêu cầu đó, trong các repo riêng của họ, với các thiết kế riêng. Một tham chiếu mô tả mối quan hệ đó mà không di chuyển công việc của bất kỳ ai.

```
   platform-reqs (kho lưu trữ)                 api-server (repo mã nguồn)
   thuộc sở hữu của nhóm nền tảng            thuộc sở hữu của nhóm sản phẩm
   ┌──────────────────────────┐          ┌──────────────────────────┐
   │ openspec/specs/          │ ◀────────│ openspec/config.yaml     │
   │   payments/spec.md       │ đọc    │   references:            │
   │   auth/spec.md           │          │     - platform-reqs      │
   │                          │          │ openspec/specs/          │
   │ openspec/changes/        │          │   (các thiết kế riêng của họ)    │
   │   công việc nền tảng          │          │ openspec/changes/        │
   │                          │          │   (công việc riêng của họ)       │
   │                          │          └──────────────────────────┘
   └──────────────────────────┘
```

**Nhóm sản phẩm khai báo những gì họ dựa vào** trong tệp `openspec/config.yaml` của repo của họ:

```yaml
references:
  - platform-reqs
```

Các tham chiếu là ngữ cảnh chỉ đọc. Repo giữ gốc `openspec/` riêng của nó; công việc vẫn được thực hiện ở đó. Điều thay đổi là: lệnh `openspec instructions` trong repo đó bây giờ bao gồm chỉ mục các đặc tả của kho lưu trữ được tham chiếu — mỗi đặc tả có tóm tắt một dòng và lệnh lấy chính xác (`openspec show <spec-id> --type spec --store platform-reqs`). Một tác nhân làm việc trong `api-server` có thể tìm thấy các yêu cầu thanh toán nguồn, trích dẫn chúng, và viết thiết kế chi tiết của mình ở gốc riêng của repo — mà không cần bất kỳ ai phải dán ngữ cảnh xung quanh.

Một tham chiếu có thể mang theo nguồn nhân bản của nó, do đó các thành viên trong nhóm chưa có kho lưu trữ sẽ nhận được giải pháp hoàn chỉnh thay vì đường cụt:

```yaml
references:
  - { id: platform-reqs, remote: "git@github.com:acme/platform-reqs.git" }
```

**Khi bạn muốn mở kế hoạch và mã nguồn cùng lúc, hãy tạo một bộ làm việc (workset).** Điều này là cá nhân và rõ ràng: mỗi người chọn các thư mục họ thực sự làm việc với trên máy của mình. Không có gì về các đường dẫn bản nhân bản cục bộ đó được commit vào repo lập kế hoạch chia sẻ.

```bash
openspec workset create platform \
  --member ~/openspec/platform-reqs \
  --member ~/src/api-server \
  --member ~/src/web-app
```

## Hai câu hỏi bạn luôn có thể đặt

**"Thiết lập của tôi có hoạt động bình thường không?"** — `openspec doctor` kiểm tra gốc hiện tại và các kho lưu trữ được tham chiếu của nó, chỉ đọc, với một giải pháp có thể dán được cho mỗi phát hiện:

```
Kiểm tra tình trạng

Gốc
  Vị trí: /Users/you/src/api-server
  Gốc OpenSpec: bình thường

Các tham chiếu
  - platform-reqs: bình thường (/Users/you/openspec/platform-reqs)
  - design-system: Kho lưu trữ được tham chiếu 'design-system' chưa được đăng ký trên máy này.
    Giải pháp: git clone -- git@github.com:acme/design-system.git '/Users/you/openspec/design-system' && openspec store register '/Users/you/openspec/design-system' --id design-system

```

**"Tôi đang làm việc với những gì?"** — `openspec context` tập hợp bộ làm việc từ các khai báo OpenSpec: gốc và các kho lưu trữ được tham chiếu của nó.

```
Ngữ cảnh làm việc cho api-server (/Users/you/src/api-server)

Gốc OpenSpec
  api-server  /Users/you/src/api-server

Các kho lưu trữ được tham chiếu
  platform-reqs  /Users/you/openspec/platform-reqs
    Lấy: openspec show <spec-id> --type spec --store platform-reqs
```

Cả hai đều hỗ trợ cờ `--json` cho các tác nhân. Lệnh `openspec context --code-workspace <path>` bổ sung ghi một tệp không gian làm việc VS Code chứa toàn bộ bộ làm việc — đây là thao tác ghi duy nhất mà lệnh này thực hiện.

## Bộ làm việc (Workset): mở lại các thư mục bạn làm việc cùng nhau

Khác với tất cả các phần trên: hầu hết mọi người mở cùng vài thư mục trong mỗi phiên làm việc — repo lập kế hoạch cộng với hai hoặc ba repo mã nguồn. Một **bộ làm việc (workset)** là một chế độ xem cá nhân, có tên của chính xác các thư mục đó, có thể mở lại chỉ với một lệnh trong công cụ bạn chọn.

```
  workset "platform"                 openspec workset open platform
  ├── team-plans   ~/openspec/team-plans         │
  ├── api-server   ~/src/api-server              ▼
  └── web-app      ~/src/web-app       cả ba được mở trong công cụ của bạn
```

```bash
openspec workset create platform \
  --member ~/openspec/team-plans --member ~/src/api-server \
  --tool code
openspec workset list
```

```
platform  (mở trong VS Code)
  team-plans  /Users/you/openspec/team-plans
  api-server  /Users/you/src/api-server
```

Lệnh `openspec workset open platform` sau đó khởi chạy công cụ đã lưu: các trình soạn thảo (VS Code, Cursor) mở một cửa sổ với tất cả các thành viên và trả về kết quả. Thành viên đầu tiên là thành viên chính. Bạn có thể ghi đè công cụ bất kỳ lúc nào bằng cờ `--tool <id>`.

Các bộ làm việc có chủ đích *không phải* là trạng thái chia sẻ. Chúng tồn tại trên máy của bạn, không bao giờ được commit, và không đưa ra bất kỳ tuyên bố nào về công việc — chúng chỉ ghi lại những gì bạn thích mở cùng nhau. Xóa một bộ làm việc không bao giờ ảnh hưởng đến các thư mục thành viên. Các công cụ mới là cấu hình, không phải mã nguồn: bất kỳ thứ gì được khởi chạy thông qua tệp không gian làm việc hoặc các cờ đính kèm theo thư mục có thể được thêm vào khóa `openers` trong cấu hình toàn cục (`openspec config edit`).

## Các lệnh quyết định tác động ở đâu như thế nào

Mọi lệnh thông thường đều giải quyết gốc của nó theo cùng một cách, theo thứ tự sau:

```
1. `--store <id>`          bạn đã chỉ định rõ ràng        → kho lưu trữ đó
2. thư mục openspec/ gần nhất     một gốc lập kế hoạch thực tế ở đây     → repo này
   (đi lên từ thư mục làm việc hiện tại)
3. con trỏ store:        config.yaml khai báo một kho lưu trữ  → kho lưu trữ đó
4. defaultStore          cấu hình toàn cục đặt một mặc định toàn máy  → kho lưu trữ đó
5. không có gì ở trên     các kho lưu trữ đã đăng ký trên máy này?     → báo lỗi với một
                         máy?                        gợi ý lựa chọn
                         không có kho lưu trữ nào được đăng ký?         → thư mục
                                                          hiện tại
                                                          (hành vi cổ điển)
```

Dòng `Using OpenSpec root:` (và khối `root` trong output `--json`) cho bạn biết bạn đang ở trường hợp nào.

## Hạn chế đã biết

- **Hình thái beta.** Mọi thứ trên trang này có thể thay đổi giữa các bản phát hành — tên, cờ, định dạng tệp, khóa JSON.
- **Một bản nhân bản cục bộ cho mỗi id kho lưu trữ trên mỗi máy.** Việc đăng ký một bản nhân bản cục bộ thứ hai với cùng id sẽ thất bại với gợi ý chạy `store unregister` trước.
- **Không bao giờ đồng bộ — theo thiết kế.** OpenSpec không bao giờ nhân bản, kéo hoặc đẩy. Một bản nhân bản cũ sẽ hiển thị các đặc tả cũ cho đến khi *bạn* kéo; các tham chiếu được lập chỉ mục trực tiếp từ mọi thứ có trên đĩa.
- **Các thư mục lập kế hoạch trống có thể không tồn tại.** Một kho lưu trữ mới có thể chưa có các thư mục `openspec/changes/`, `openspec/specs/` hoặc `openspec/changes/archive/` trong Git. Điều này được chấp nhận trong giai đoạn beta; các thư mục đó sẽ xuất hiện một khi các lệnh thông thường tạo tệp cho chúng.
- **Các repo con trỏ giữ nguyên trạng thái con trỏ.** Một repo chỉ chứa cấu hình có tệp `openspec/config.yaml` khai báo `store: <id>` được xem là kế hoạch được tách bên ngoài, không phải là bản nhân bản kho lưu trữ để đăng ký. Xóa dòng `store:` trước nếu bạn có chủ đích chuyển đổi repo đó thành gốc kho lưu trữ cục bộ.
- **Một số lệnh vẫn hoạt động ở vị trí hiện tại.** Các lệnh `view`, `templates`, `schemas` và các dạng danh từ đã lỗi thời (`openspec change show`, ...) chỉ tác động trên thư mục hiện tại — không hỗ trợ `--store`.
- **Trạng thái từng máy là riêng của từng máy.** Danh sách đăng ký kho lưu trữ và các bộ làm việc là cài đặt cục bộ. Không có gì về bố cục máy của bạn bao giờ được commit vào kế hoạch chia sẻ.
- **Hai phong cách khởi chạy cho bộ làm việc.** Một công cụ không thể khởi chạy bằng tệp không gian làm việc hoặc các cờ đính kèm theo thư mục không thể được thêm vào làm trình mở.
- **JSON của tác nhân có sự phân chia kiểu chữ hoa/thường đã biết** (các khóa thuộc họ store là snake_case, các khóa thuộc họ workflow là camelCase). Được ghi chú trong [hợp đồng tác nhân](../agent-contract.md); việc thống nhất chúng được hoãn lại cho bản phát hành có phiên bản.

## Vị trí lưu trữ các thành phần

| Thành phần | Vị trí | Có chia sẻ không? |
|---|---|---|
| Kế hoạch của cửa hàng | `<store>/openspec/` (đặc tả, thay đổi) | Có — commit và push |
| Định danh của cửa hàng | `<store>/.openspec-store/store.yaml` | Có — được commit cùng với cửa hàng |
| Danh sách đăng ký cửa hàng | `<data dir>/openspec/stores/registry.yaml` | Không — chỉ trên máy tính này |
| Bộ công việc | `<data dir>/openspec/worksets/` | Không — chỉ trên máy tính này |

`<data dir>` là `~/.local/share/openspec` trên macOS và Linux (hoặc `$XDG_DATA_HOME/openspec` khi được thiết lập), và `%LOCALAPPDATA%\openspec` trên Windows.

## Tài liệu tham khảo

Các cờ chính xác và cấu trúc JSON cho mọi lệnh trên trang này: [Tài liệu tham khảo CLI](../cli.md) (Cửa hàng, Doctor, Ngữ cảnh làm việc, Bộ công việc cá nhân) và [Hợp đồng tác nhân](../agent-contract.md).