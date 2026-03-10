# 贡献指南 (Barretta)

感谢您有意为本项目做出贡献！  
本文档涵盖贡献者所需的全部信息，从开发环境搭建到提交 Pull Request。

> **以其他语言阅读：**
> - [日本語](../CONTRIBUTING.md)
> - [English](CONTRIBUTING_en.md)

---

## 目录

- [前置条件](#前置条件)
- [开发环境搭建](#开发环境搭建)
  - [方式 A：DevContainer（推荐）](#方式-adevcontainer推荐)
  - [方式 B：手动搭建](#方式-b手动搭建)
- [构建](#构建)
- [调试](#调试)
- [测试](#测试)
- [代码质量（Lint / 格式化）](#代码质量lint--格式化)
- [提交变更（Pull Request）](#提交变更pull-request)
- [参与本地化贡献](#参与本地化贡献)

---

## 前置条件

| 工具 | 版本 | 用途 |
|---|---|---|
| [Node.js](https://nodejs.org/) | 18.x | 运行时 |
| [yarn](https://yarnpkg.com/) | 最新版 | 包管理器 |
| [VS Code](https://code.visualstudio.com/) | 最新版 | 开发编辑器 |
| [Docker](https://www.docker.com/)（可选） | 最新版 | 仅使用 DevContainer 时需要 |

> **注意：** 运行 Barretta 的核心功能（Push / Pull / Macro Runner）需要 **Windows + Microsoft Excel**。  
> 不过，代码编辑、构建和 Lint 在任何操作系统上均可进行。

---

## 开发环境搭建

### 方式 A：DevContainer（推荐）

使用 DevContainer 可快速获得一个所有工具已自动安装的一致开发环境。

#### 所需工具
- Docker
- VS Code + [Dev Containers 扩展](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

#### 步骤

1. 克隆仓库
   ```bash
   git clone https://github.com/Mikoshiba-Kyu/vscode-barretta.git
   cd vscode-barretta
   ```

2. 用 VS Code 打开文件夹
   ```bash
   code .
   ```

3. 弹出提示后点击 **"Reopen in Container"**（或按 `F1` → "Dev Containers: Reopen in Container"）

4. 等待容器构建完成，并等待 `postCreateCommand.sh` 脚本执行完毕。  
   以下操作将自动完成：
   - 通过 `yarn install` 安装所有依赖

---

### 方式 B：手动搭建

如果不想使用 Docker，可以按以下步骤在本地手动搭建环境。

1. 安装 [Node.js 22.x](https://nodejs.org/)

2. 安装 yarn
   ```bash
   npm install -g yarn
   ```

3. 克隆仓库
   ```bash
   git clone https://github.com/Mikoshiba-Kyu/vscode-barretta.git
   cd vscode-barretta
   ```

4. 安装依赖
   ```bash
   yarn install
   ```

---

## 构建

```bash
# 一次性构建
yarn compile

# 监视模式（文件变更时自动重新构建）
yarn watch
```

---

## 调试

您可以使用 Extension Host 在真实的 VS Code 窗口中测试扩展。

1. 用 VS Code 打开仓库
2. 按下 `F5`（或进入 **运行和调试** → **Run Extension**）
3. 默认构建任务（`tasks.json` 中的 `yarn watch`）会自动启动，并打开一个加载了您的扩展的 **扩展开发宿主** 窗口
4. 在开发宿主窗口中按 `Ctrl+Shift+P`，测试 `Barretta:` 命令

> **调试测试：** 请使用 **"Extension Tests"** 启动配置。

---

## 测试

```bash
# 编译并运行测试
yarn test
```

您也可以在 VS Code 中选择 **运行和调试** → **Extension Tests**，以附带调试器的方式运行测试。

---

## 代码质量（Lint / 格式化）

本项目使用 [Biome](https://biomejs.dev/) 进行代码检查和格式化。

```bash
# 检查 Lint 问题
yarn lint

# 自动修复 Lint 问题
yarn lint:fix

# 格式化代码
yarn format

# 仅检查格式（不写入）
yarn format:check
```

提交 Pull Request 后，GitHub Actions CI 会自动运行格式化、Lint 和构建任务（其中格式化步骤执行的是 `yarn format`，会尝试自动修复格式问题）。  
请确保 CI 通过后再请求代码审查，并在本地执行 `yarn format:check` 以确认不存在未修复的格式问题。

---

## 提交变更（Pull Request）

1. 从 `main` 分支创建工作分支
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. 进行修改并提交

3. 提交前请确认：
   - `yarn lint` 无报错
   - `yarn format:check` 无格式问题
   - `yarn compile` 构建成功

4. 在 GitHub 上向 `main` 分支创建 Pull Request

---

## 参与本地化贡献

Barretta 的 UI 和文档目前以日语为主。  
插件 UI 的多语言支持计划在未来添加。

### 文档本地化

- 若要将文档（如 `README.md`、`CONTRIBUTING.md`）翻译为其他语言，请在 `docs/` 文件夹中以语言区域为后缀创建文件（例如 `CONTRIBUTING_zh.md`）。
- 同时请在根文档中添加指向译文的链接，并一并提交 PR。

### 插件 UI 本地化

VS Code 扩展的 UI 字符串本地化将使用 [VS Code L10n API](https://code.visualstudio.com/api/references/vscode-api#l10n)。  
待相关支持加入后，您可以通过添加 `package.nls.json`（默认英语）和 `package.nls.<locale>.json` 文件来参与贡献。

---

如有任何疑问，欢迎随时提交 Issue！
