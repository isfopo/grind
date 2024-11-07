import * as vscode from "vscode";
import { GrindTreeviewProvider } from "./GrindTreeviewProvider";
import { DayTreeItem } from "./classes/TreeItems/DayTreeItem";
import { TaskTreeItem } from "./classes/TreeItems/TaskTreeItem";
import { Day } from "./classes/entities/Day";

export function activate(context: vscode.ExtensionContext) {
  const treeDataProvider = new GrindTreeviewProvider(context).register();

  vscode.commands.registerCommand(
    "grind.add",
    async (element: DayTreeItem | TaskTreeItem) => {
      const task = await vscode.window.showInputBox({
        prompt: "Enter task",
      });

      if (!task) {
        return;
      }

      treeDataProvider.add(element, task);
    }
  );

  vscode.commands.registerCommand(
    "grind.edit",
    async (element: TaskTreeItem) => {
      const update = await vscode.window.showInputBox({
        prompt: `Update task`,
        value: element.label?.toString() ?? "",
      });

      if (!update) {
        return;
      }

      treeDataProvider.edit(element, update);
    }
  );

  vscode.commands.registerCommand("grind.copy-today", () => {
    treeDataProvider.copy(Day.today);
  });

  vscode.commands.registerCommand("grind.copy-yesterday", () => {
    treeDataProvider.copy(Day.daysAgo(1));
  });

  vscode.commands.registerCommand("grind.copy-day", () => {});

  vscode.commands.registerCommand("grind.refresh", () => {
    treeDataProvider.refresh();
  });

  vscode.commands.registerCommand("grind.reset", () => {
    treeDataProvider.reset();
    vscode.window.showInformationMessage("Grind reset");
    treeDataProvider.refresh();
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
