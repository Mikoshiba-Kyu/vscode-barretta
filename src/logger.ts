import * as vscode from "vscode";

// Barretta 日志输出通道
// Barretta log output channel
let outputChannel: vscode.OutputChannel | undefined;

/**
 * 获取或创建日志输出通道
 * Get or create log output channel
 */
function getOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel("Barretta");
  }
  return outputChannel;
}

/**
 * 输出信息日志
 * Log info message
 */
export function log(message: string): void {
  const channel = getOutputChannel();
  const timestamp = new Date().toISOString();
  channel.appendLine(`[${timestamp}] [INFO] ${message}`);
}

/**
 * 输出错误日志
 * Log error message
 */
export function error(message: string, err?: unknown): void {
  const channel = getOutputChannel();
  const timestamp = new Date().toISOString();
  channel.appendLine(`[${timestamp}] [ERROR] ${message}`);
  if (err) {
    if (err instanceof Error) {
      channel.appendLine(`  ${err.message}`);
      if (err.stack) {
        channel.appendLine(`  ${err.stack}`);
      }
    } else {
      channel.appendLine(`  ${String(err)}`);
    }
  }
}

/**
 * 输出警告日志
 * Log warning message
 */
export function warn(message: string): void {
  const channel = getOutputChannel();
  const timestamp = new Date().toISOString();
  channel.appendLine(`[${timestamp}] [WARN] ${message}`);
}

/**
 * 显示日志面板
 * Show log panel
 */
export function show(): void {
  getOutputChannel().show();
}

/**
 * 清理日志通道
 * Dispose log channel
 */
export function dispose(): void {
  if (outputChannel) {
    outputChannel.dispose();
    outputChannel = undefined;
  }
}
