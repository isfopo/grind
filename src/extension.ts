import * as vscode from "vscode";
import { GrindTreeviewProvider } from "./GrindTreeviewProvider";
import { DayTreeItem } from "./classes/TreeItems/DayTreeItem";
import { TaskTreeItem } from "./classes/TreeItems/TaskTreeItem";
import { Configuration } from "./services/Configuration";

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
      });

      if (!update) {
        return;
      }

      treeDataProvider.edit(element, update);
    }
  );

  vscode.commands.registerCommand("grind.refresh", () => {
    treeDataProvider.refresh();
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
