import * as fs from "node:fs";
import * as path from "node:path";
import * as vscode from "vscode";

// Cached vars
let messagesCache: Record<string, string> | undefined; // cached localization string 
let cachedLocale: string | undefined;                  // cached locale

/**
 * vscode.env.language  <-- MAPPING --> <extensions-root>/l10n/bundle.l10n.{lang}.json
 * default fallback to English
 */
function getBundleFileName(locale: string): string {
  const localeMap: Record<string, string> = {
    "zh-cn": "zh-cn",
    "zh-hans": "zh-cn",
    "zh": "zh-cn",
    "ja": "ja",
    "en": "",
    "en-us": "",
  };

  const normalizedLocale = locale.toLowerCase();
  const mappedLocale = localeMap[normalizedLocale] || "en";

  return mappedLocale ? `.${mappedLocale}` : "";
}

/**
 * load language bundle file based on current vscode.env.language, default fallback to English
 */
function loadI18nObject(): Record<string, string> {
  const currentLocale = vscode.env.language;

  if (messagesCache && cachedLocale === currentLocale) {
    return messagesCache;
  }

  cachedLocale = currentLocale;

  // load the bundle file for the current locale
  try {
    const suffix = getBundleFileName(currentLocale);
    const bundleName = suffix
      ? `bundle.l10n${suffix}.json`
      : "bundle.l10n.json";

    // bundle files possible paths: <extensions-root>/l10n/bundle.l10n.{lang}.json
    const possiblePaths = [path.join(__dirname, "..", "l10n", bundleName)];

    for (const jsonPath of possiblePaths) {
      if (fs.existsSync(jsonPath)) {
        const content = fs.readFileSync(jsonPath, "utf8");
        messagesCache = JSON.parse(content) as Record<string, string>;
        return messagesCache;
      }
    }
  } catch {
    // ignore errors
  }

  // if specific language file is not found, fallback to en
  try {
    // fallback bundle files (en) possible paths：<extensions-root>/l10n/bundle.l10n.json
    const fallbackPaths = [
      path.join(__dirname, "..", "l10n", "bundle.l10n.json"),
    ];

    for (const jsonPath of fallbackPaths) {
      if (fs.existsSync(jsonPath)) {
        const content = fs.readFileSync(jsonPath, "utf8");
        messagesCache = JSON.parse(content) as Record<string, string>;
        return messagesCache;
      }
    }
  } catch {
    // ignore errors
  }

  messagesCache = {};
  return messagesCache;
}

/**
 * localize & format strings
 * @param key - string keys in bundle.<locale>.json
 * @param args - replaceable parameters for the localized string, will replace {0}, {1}
 * @returns localized and formatted string
 */
export function l(key: string, ...args: (string | number | boolean)[]): string {
  // load language bundle files
  const messages = loadI18nObject();

  // lookup the localized message by key, fallback to key itself if not found
  const message = messages[key] || key;

  // args replacement {0}, {1}, ...
  if (args.length > 0) {
    return message.replace(/\{(\d+)\}/g, (_match, index) => {
      const argIndex = Number.parseInt(index, 10);
      return args[argIndex]?.toString() ?? `{${index}}`;
    });
  }

  return message;
}

/**
 * K-V mapping: encoding config (shown in settings) --> target encoding for iconv() func
 */
const encodingMap: Record<string, string> = {
  "Shift-JIS": "CP932",
  "GB2312": "GB2312",
  "ANSI": "win1252"
};

/**
 * Get VBA encoding setting from VSCode configuration
 * keys in K-V object "encodingMap"
 * @returns The configured VBA encoding (default: "Shift-JIS")
 */
export function getEncodingSettings(): string {
  const config = vscode.workspace.getConfiguration("barretta");
  return config.get<string>("vbaEncoding") || "Shift-JIS";
}

/**
 * Mapping: config encoding --> target encoding for iconv-lite func
 * key:encoding config (shown in settings) -->  value: K-V obj "encodingMap"
 * @param vbaEncoding - The VBA encoding name from settings
 * @returns The target encoding for iconv-lite (default: "CP932")
 */
export function getTargetEncoding(vbaEncoding?: string): string {
  const encoding = vbaEncoding || getEncodingSettings();
  return encodingMap[encoding] || "CP932";
}

/**
 * Get the full encoding configuration
 * @returns Object containing vbaEncoding and targetEncoding
 */
export function getEncodingConfig(): { vbaEncoding: string; targetEncoding: string } {
  const vbaEncoding = getEncodingSettings();
  const targetEncoding = getTargetEncoding(vbaEncoding);
  return { vbaEncoding, targetEncoding };
}
