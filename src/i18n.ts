import { l10n } from "vscode";

/**
 * 获取本地化字符串
 * @param message - 消息键（同时作为默认消息）
 * @param args - 替换参数（支持对象形式命名参数或数组形式位置参数）
 * @returns 本地化后的字符串
 */
export function l(message: string, ...args: (string | number | boolean | Record<string, string | number | boolean>)[]): string {
  // vscode-l10n 使用 t 函数，支持命名参数
  if (args.length === 1 && typeof args[0] === "object") {
    return l10n.t(message, args[0] as Record<string, string | number | boolean>);
  }
  // 位置参数形式
  return l10n.t(message, ...(args as (string | number | boolean)[]));
}
