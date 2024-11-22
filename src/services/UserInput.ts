import * as vscode from "vscode";
import { Day } from "../classes/entities/Day";
import dayjs = require("dayjs");

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

  public static async promptDateSelection(
    daysAgo: number = 10
  ): Promise<string> {
    const options = Day.daysAgo(daysAgo).reduce((acc, d) => {
      acc[Day.format(d)] = d;
      return acc;
    }, {} as Record<string, string>);

    const day = await vscode.window.showQuickPick(Object.keys(options), {
      placeHolder: "Select a day",
    });

    if (!day) {
      throw new Error("No day selected");
    } else {
      return options[day];
    }
  }
}
