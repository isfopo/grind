import * as vscode from "vscode";

export class Logger {
  static _instance: Logger;

  private readonly context: vscode.ExtensionContext;
  private readonly channel: vscode.LogOutputChannel;

  private constructor(context: vscode.ExtensionContext) {
    this.context = context;

    // The channel for printing the log.
    this.channel = vscode.window.createOutputChannel("Grind - Log", {
      log: true,
    });
  }

  public static getInstance(context: vscode.ExtensionContext): Logger {
    if (!Logger._instance) {
      Logger._instance = new Logger(context);
    }

    return Logger._instance;
  }

  public show() {
    this.channel.show();
  }

  public log(message: string) {
    this.show();
    this.channel.appendLine(message);
  }
}
