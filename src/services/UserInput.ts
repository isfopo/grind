import * as vscode from "vscode";
import { Day } from "../classes/entities/Day";

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

  public static async promptUpdateTask(initial: string): Promise<string> {
    const task = await vscode.window.showInputBox({
      prompt: "Update task",
      value: initial,
    });

    if (!task) {
      throw new Error("Task cannot be empty");
    }

    return task;
  }

  public static async promptDateSelection(daysAgo: number = 10) {
    const options = Day.daysAgo(daysAgo);

    const day = await vscode.window.showQuickPick(options, {
      placeHolder: "Select a day",
    });

    if (!day) {
      throw new Error("No day selected");
    }

    return day;
  }
}
