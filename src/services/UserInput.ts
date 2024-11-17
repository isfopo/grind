import * as vscode from "vscode";

export class UserInput {
  public static async promptNewTask(): Promise<string> {
    const task = await vscode.window.showInputBox({
      prompt: "Enter task",
    });

    if (!task) {
      throw new Error("Task cannot be empty");
    }

    return task;
  }
}
