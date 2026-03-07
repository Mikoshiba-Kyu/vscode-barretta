import * as vscode from "vscode";

// Barretta log output ro VSCode channel window
let outputChannel: vscode.OutputChannel | undefined;

/**
 * Get or create log output channel
 */
function getOutputChannel(): vscode.OutputChannel {
  if (!outputChannel) {
    outputChannel = vscode.window.createOutputChannel("Barretta");
  }
  return outputChannel;
}

/**
 * Log info message
 */
export function log(message: string): void {
  const channel = getOutputChannel();
  const timestamp = new Date().toISOString();
  channel.appendLine(`[${timestamp}] [INFO] ${message}`);
}

/**
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
 * Log warning message
 */
export function warn(message: string): void {
  const channel = getOutputChannel();
  const timestamp = new Date().toISOString();
  channel.appendLine(`[${timestamp}] [WARN] ${message}`);
}

/**
 * Show log panel
 */
export function show(): void {
  getOutputChannel().show();
}

/**
 * Dispose log channel
 */
export function dispose(): void {
  if (outputChannel) {
    outputChannel.dispose();
    outputChannel = undefined;
  }
}
