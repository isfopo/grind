import * as vscode from "vscode";
import { GrindTreeviewProvider } from "./GrindTreeviewProvider";
import { DateTreeItem } from "./classes/TreeItems/DateTreeItem";
import { TaskTreeItem } from "./classes/TreeItems/TaskTreeItem";
import { Configuration } from "./classes/Configuration";

export function activate(context: vscode.ExtensionContext) {
  const treeDataProvider = new GrindTreeviewProvider(context).register();
  // const logger = Logger.getInstance(context);

  vscode.commands.registerCommand(
    "grind.add",
    async (element: DateTreeItem | TaskTreeItem) => {
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
    // logger.log.info("refresh");
    treeDataProvider.refresh();
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
