import * as vscode from "vscode";
import { getExtensionLogger, IVSCodeExtLogger } from "@vscode-logging/logger";

export class Logger {
  static _instance: Logger;

  private readonly context: vscode.ExtensionContext;
  private readonly channel: vscode.LogOutputChannel;
  readonly log: IVSCodeExtLogger;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;

    // The channel for printing the log.
    this.channel = vscode.window.createOutputChannel("Grind - Log", {
      log: true,
    });

    this.log = getExtensionLogger({
      extName: "Root.child",
      level: "info",
      logPath: context.logUri.fsPath,
      logOutputChannel: this.channel,
      sourceLocationTracking: true,
      logConsole: false,
    });
  }

  public static getInstance(context: vscode.ExtensionContext): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger(context);
    }

    return Logger._instance;
  }
}
