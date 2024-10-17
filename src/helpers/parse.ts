import * as vscode from "vscode";
import { EnvironmentGroupTreeItem } from "../classes/TreeItems/EnvironmentGroupTreeItem";
import { EnvironmentKeyValueTreeItem } from "../classes/TreeItems/EnvironmentKeyValueTreeItem";
import type { EnvironmentContent, EnvironmentKeyValueType } from "../types";

const LINE =
  /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(#.*)?(?:$|$)|^\s*(\n###.*)$/gm;

export const parseEnvironmentContent = (
  lines: string,
  file: vscode.Uri
): EnvironmentContent => {
  const items: (EnvironmentKeyValueTreeItem | EnvironmentGroupTreeItem)[] = [];
  let currentGroup: EnvironmentGroupTreeItem | null = null;

  // Add a new line at start of file to match first line
  lines = "\n" + lines;
  // Convert line breaks to same format
  lines = lines.replace(/\r\n?/gm, "\n");

  let match;
  while ((match = LINE.exec(lines)) != null) {
    if (match[4]) {
      if (currentGroup && match[4].trim().endsWith("###")) {
        // Group end
        items.push(currentGroup);
        currentGroup = null;
      } else {
        // Group start
        currentGroup = new EnvironmentGroupTreeItem(
          parseGroupName(match[4]),
          parsePresets(match[4])
        );
        items.push(currentGroup);
      }
    } else {
      const key = match[1];

      // Default undefined or null to empty string
      let value = sanitizeValue(match[2] || "");

      const keyValueItem = new EnvironmentKeyValueTreeItem(
        key,
        {
          type: inferType(value),
          value,
          options: parseOptions(match[3]),
          presets: parsePresetValues(currentGroup?.presets, match[3]),
        },
        file
      );

      // Add to items
      if (currentGroup) {
        currentGroup.children.push(keyValueItem);
      } else {
        items.push(keyValueItem);
      }
    }
  }

  return items;
};

export const sanitizeValue = (value: string): string => {
  // Remove whitespace
  value = value.trim();

  // Check if double quoted
  const maybeQuote = value[0];

  // Remove surrounding quotes
  value = value.replace(/^(['"`])([\s\S]*)\1$/gm, "$2");

  // Expand newlines if double quoted
  if (maybeQuote === '"') {
    value = value.replace(/\\n/g, "\n");
    value = value.replace(/\\r/g, "\r");
  }

  return value;
};

export const inferType = (value: string): EnvironmentKeyValueType => {
  if (value === "true" || value === "false") {
    return "bool";
  } else {
    return "string";
  }
};

export const parseOptions = (input: string | undefined): string[] => {
  // Create a regex that finds the key followed by a colon and captures the value
  const regex = new RegExp(`options:([^\\s]*)`, "i");

  // Execute the regex on the input string
  const match = input?.match(regex);

  return match?.[1].split(",") ?? [];
};

export const parsePresets = (input: string | undefined): string[] => {
  // Create a regex that finds the key followed by a colon and captures the value
  const regex = new RegExp(`presets:([^\\s]*)`, "i");

  // Execute the regex on the input string
  const match = input?.match(regex);

  return match?.[1].split(",") ?? [];
};

export const parsePresetValues = (
  presets: string[] | undefined,
  input: string | undefined
): Record<string, string> => {
  const result: Record<string, string> = {};

  // If no presets, return empty object
  if (!presets) {
    return result;
  }

  for (const preset of presets) {
    // Create a regex that finds the key followed by a colon and captures the value
    const regex = new RegExp(`${preset}:([^\\s]*)`, "i");
    // Execute the regex on the input string
    const match = input?.match(regex);
    if (match) {
      result[preset] = sanitizeValue(match[1]);
    }
  }

  return result;
};

export const replace = (content: string, key: string, value: string): string =>
  content.replace(new RegExp(`(${key}="?)([^\\s"]*)`, "g"), `$1${value}`);

export const parseGroupName = (input: string): string => {
  // Create a regex to capture the group name between ### and presets
  const regex = /###\s*(.*?)\s*(?=presets|$)/i;

  // Execute the regex on the input string
  const match = input.match(regex);

  // Return the captured group name or an empty string if not found
  return match?.[1].trim() ?? "";
};
