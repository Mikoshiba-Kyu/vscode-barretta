# Contributing to Barretta

Thank you for your interest in contributing to this project!  
This document covers everything a contributor needs — from setting up the development environment to submitting a pull request.

> **Read this in other languages:**
> - [日本語](../CONTRIBUTING.md)
> - [中文 (简体)](CONTRIBUTING_zh.md)

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Development Environment Setup](#development-environment-setup)
  - [Option A: DevContainer (Recommended)](#option-a-devcontainer-recommended)
  - [Option B: Manual Setup](#option-b-manual-setup)
- [Building](#building)
- [Debugging](#debugging)
- [Testing](#testing)
- [Code Quality (Lint / Format)](#code-quality-lint--format)
- [Submitting Changes (Pull Request)](#submitting-changes-pull-request)
- [Contributing to Localization](#contributing-to-localization)

---

## Prerequisites

| Tool | Version | Purpose |
|---|---|---|
| [Node.js](https://nodejs.org/) | 22.x | Runtime |
| [yarn](https://yarnpkg.com/) | Latest | Package manager |
| [VS Code](https://code.visualstudio.com/) | Latest | Development editor |
| [Docker](https://www.docker.com/) *(optional)* | Latest | Required for DevContainer only |

> **Note:** Running Barretta's core features (Push / Pull / Macro Runner) requires **Windows + Microsoft Excel**.  
> However, editing code, building, and linting works on any OS.

---

## Development Environment Setup

### Option A: DevContainer (Recommended)

Using the DevContainer gives you a consistent, pre-configured environment with all required tools installed automatically.

#### Requirements
- Docker
- VS Code + [Dev Containers extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

#### Steps

1. Clone the repository
   ```bash
   git clone https://github.com/Mikoshiba-Kyu/vscode-barretta.git
   cd vscode-barretta
   ```

2. Open the folder in VS Code
   ```bash
   code .
   ```

3. When prompted, click **"Reopen in Container"** (or press `F1` → "Dev Containers: Reopen in Container")

4. Wait for the container to build and the `postCreateCommand.sh` script to finish.  
   The following happens automatically:
   - `yarn install` installs all dependencies
   - `lefthook` sets up Git hooks

---

### Option B: Manual Setup

Use this approach if you prefer not to use Docker.

1. Install [Node.js 22.x](https://nodejs.org/)

2. Install yarn
   ```bash
   npm install -g yarn
   ```

3. Clone the repository
   ```bash
   git clone https://github.com/Mikoshiba-Kyu/vscode-barretta.git
   cd vscode-barretta
   ```

4. Install dependencies
   ```bash
   yarn install
   ```

---

## Building

```bash
# One-time build
yarn compile

# Watch mode (auto-rebuild on file changes)
yarn watch
```

---

## Debugging

You can test the extension in a real VS Code window using the Extension Host.

1. Open the repository in VS Code
2. Press `F5` (or go to **Run and Debug** → **Run Extension**)
3. The default build task (`yarn watch` via `tasks.json`) starts automatically, and an **Extension Development Host** window opens with your built extension loaded
4. In the development host window, open `Ctrl+Shift+P` and test `Barretta:` commands

> **Debugging tests:** Use the **"Extension Tests"** launch configuration instead.

---

## Testing

```bash
# Compile and run tests
yarn test
```

Alternatively, select **Run and Debug** → **Extension Tests** in VS Code to run tests with the debugger attached.

---

## Code Quality (Lint / Format)

This project uses [Biome](https://biomejs.dev/) for linting and formatting.

```bash
# Check for lint issues
yarn lint

# Auto-fix lint issues
yarn lint:fix

# Format code
yarn format

# Check formatting without writing
yarn format:check
```

When you open a pull request, GitHub Actions CI automatically verifies formatting, linting, and the build.  
Please ensure CI passes before requesting a review.

---

## Submitting Changes (Pull Request)

1. Create a branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit them

3. Before submitting, verify:
   - `yarn lint` passes with no errors
   - `yarn format:check` shows no formatting issues
   - `yarn compile` builds successfully

4. Open a Pull Request targeting the `main` branch on GitHub

---

## Contributing to Localization

Barretta's UI and documentation are primarily in Japanese.  
Multi-language support for the plugin UI is planned for the future.

### Document Localization

- To translate documentation (e.g., `README.md`, `CONTRIBUTING.md`) into another language, add a file in the `docs/` folder using the locale as a suffix (e.g., `CONTRIBUTING_en.md`).
- Open a PR that also adds a link to the translation in the root document.

### Plugin UI Localization

VS Code extension UI string localization will use the [VS Code L10n API](https://code.visualstudio.com/api/references/vscode-api#l10n).  
Once support is added, you can contribute by adding a `package.nls.json` (default English) and `package.nls.<locale>.json` files.

---

If you have any questions, feel free to open an Issue!
