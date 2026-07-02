# Cài đặt

## Điều kiện tiên quyết

- **Node.js 20.19.0 trở lên** — Kiểm tra phiên bản của bạn: `node --version`

## Trình quản lý gói

### npm

```bash
npm install -g @fission-ai/openspec@latest
```

### pnpm

```bash
pnpm add -g @fission-ai/openspec@latest
```

### yarn

```bash
yarn global add @fission-ai/openspec@latest
```

### bun

Bun có thể cài đặt OpenSpec toàn cục (globally), nhưng hiện tại OpenSpec chạy trên Node.js. Bạn vẫn cần có sẵn Node.js 20.19.0 trở lên trong `PATH`.

```bash
bun add -g @fission-ai/openspec@latest
```

## Nix

Chạy OpenSpec trực tiếp mà không cần cài đặt:

```bash
nix run github:Fission-AI/OpenSpec -- init
```

Hoặc cài đặt vào hồ sơ của bạn:

```bash
nix profile install github:Fission-AI/OpenSpec
```

Hoặc thêm vào môi trường phát triển của bạn trong `flake.nix`:

```nix
{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    openspec.url = "github:Fission-AI/OpenSpec";
  };

  outputs = { nixpkgs, openspec, ... }: {
    devShells.x86_64-linux.default = nixpkgs.legacyPackages.x86_64-linux.mkShell {
      buildInputs = [ openspec.packages.x86_64-linux.default ];
    };
  };
}
```

## Xác minh Cài đặt

```bash
openspec --version
```

## Cập nhật

Nâng cấp gói, sau đó làm mới các tệp được tạo của mỗi dự án:

```bash
npm install -g @fission-ai/openspec@latest   # hoặc pnpm/yarn/bun tương đương
openspec update                              # chạy bên trong mỗi dự án
```

`openspec update` sẽ tái tạo các tệp kỹ năng (skill) và lệnh (command) cho các công cụ bạn đã cấu hình, nhờ đó các lệnh gạch chéo (slash commands) của bạn luôn đồng bộ với phiên bản đã cài đặt.

## Gỡ bỏ Cài đặt

Không có lệnh `openspec uninstall`, bởi vì OpenSpec chỉ là một gói toàn cục cùng với một số tệp trong dự án của bạn. Việc gỡ bỏ nó bao gồm vài bước thủ công, và không có gì ở đây chạm vào mã nguồn của bạn.

**1. Gỡ bỏ gói toàn cục:**

```bash
npm uninstall -g @fission-ai/openspec   # hoặc: pnpm rm -g / yarn global remove / bun rm -g
```

**2. Gỡ bỏ OpenSpec khỏi một dự án (tùy chọn).** Xóa thư mục `openspec/` nếu bạn không còn muốn các thông số kỹ thuật (specs) và thay đổi của nó:

```bash
rm -rf openspec/
```

Hãy suy nghĩ kỹ trước khi làm điều này: `openspec/specs/` và `openspec/changes/archive/` là hồ sơ ghi lại cách hệ thống hoạt động và tại sao nó thay đổi. Nếu bạn có thể muốn lịch sử đó, hãy giữ lại thư mục (hoặc lưu trữ nó trong git) ngay cả sau khi gỡ bỏ cài đặt.

**3. Gỡ bỏ các tệp công cụ AI được tạo (tùy chọn).** OpenSpec ghi các tệp kỹ năng và lệnh vào các thư mục riêng cho từng công cụ như `.claude/skills/openspec-*`, `.cursor/commands/opsx-*`, v.v. Xóa các kỹ năng `openspec-*` và lệnh `opsx-*` cho bất kỳ công cụ nào bạn đã cấu hình. Các đường dẫn chính xác theo từng công cụ được liệt kê trong [Các Công cụ Được Hỗ trợ](supported-tools.md).

Nếu bạn cũng có các khối đánh dấu (marker blocks) của OpenSpec trong các tệp như `CLAUDE.md` hoặc `AGENTS.md`, hãy tự tay xóa những khối đó; nội dung riêng của bạn trong các tệp này là do bạn quyết định giữ lại.

## Các Bước Tiếp theo

Sau khi cài đặt, hãy khởi tạo OpenSpec trong dự án của bạn:

```bash
cd your-project
openspec init
```

Xem [Bắt đầu](getting-started.md) để có hướng dẫn đầy đủ.