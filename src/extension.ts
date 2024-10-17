import * as vscode from "vscode";
import { EnvironmentTreeviewProvider } from "./EnvironmentTreeviewProvider";
import { EnvironmentWorkspaceFolderTreeItem } from "./classes/TreeItems/EnvironmentWorkspaceFolderTreeItem";
import { EnvironmentFileTreeItem } from "./classes/TreeItems/EnvironmentFileTreeItem";
import { EnvironmentKeyValueTreeItem } from "./classes/TreeItems/EnvironmentKeyValueTreeItem";
import { EnvironmentGroupTreeItem } from "./classes/TreeItems/EnvironmentGroupTreeItem";

export function activate(context: vscode.ExtensionContext) {
  const treeDataProvider = new EnvironmentTreeviewProvider(context).register();

  vscode.commands.registerCommand(
    "grind.create",
    async (element: EnvironmentWorkspaceFolderTreeItem) => {
      const { workspaceFolders } = vscode.workspace;
      let workplaceFolder: string | undefined;

      if (!workspaceFolders || workspaceFolders.length == 0) {
        vscode.window.showErrorMessage("No workspace folder is open");
      } else if (element) {
        workplaceFolder = element.folder.uri.fsPath;
      } else if (workspaceFolders.length == 1) {
        workplaceFolder = workspaceFolders[0].uri.fsPath;
      } else {
        workplaceFolder = await vscode.window.showQuickPick(
          workspaceFolders.map((folder) => folder.uri.fsPath),
          {
            placeHolder: "Select a workspace folder",
          }
        );
      }

      const fileName = await vscode.window.showInputBox({
        prompt: "Enter the name of the new environment file",
        value: ".env",
      });

      if (workplaceFolder && fileName) {
        treeDataProvider.create(workplaceFolder, fileName);
      }
    }
  );

  vscode.commands.registerCommand(
    "grind.set-preset",
    async (element: EnvironmentGroupTreeItem) => {
      const preset = await vscode.window.showQuickPick(element.presets, {
        placeHolder: "Select a preset",
      });

      if (!preset) {
        return;
      }

      if (!element.presets.includes(preset)) {
        vscode.window.showErrorMessage("Invalid preset");
      } else {
        await treeDataProvider.setPreset(element, preset);
      }
    }
  );

  vscode.commands.registerCommand(
    "grind.add",
    async (element: EnvironmentFileTreeItem | EnvironmentGroupTreeItem) => {
      const key = await vscode.window.showInputBox({
        prompt: "Enter the key for the new environment variable",
      });

      if (!key) {
        return;
      } else if (key.includes(" ")) {
        vscode.window.showErrorMessage(
          "Environment variable keys cannot contain spaces"
        );
        return;
      }

      const value = await vscode.window.showInputBox({
        prompt: `Enter the value for ${key}`,
      });

      if (!value) {
        return;
      }

      treeDataProvider.add(element, key, value);
    }
  );

  vscode.commands.registerCommand("grind.refresh", () =>
    treeDataProvider.refresh()
  );

  vscode.commands.registerCommand(
    "grind.edit",
    async (element: EnvironmentKeyValueTreeItem) => {
      if (element.value.type === "bool") {
        const quickPick = vscode.window.createQuickPick();
        quickPick.items = [{ label: "true" }, { label: "false" }];
        quickPick.onDidHide(() => quickPick.dispose());

        quickPick.placeholder = `Update the value for ${element.key}`;
        quickPick.onDidAccept(() => {
          const selectedItem = quickPick.selectedItems[0];
          if (selectedItem) {
            treeDataProvider.edit(element, selectedItem.label);
          }
          quickPick.hide();
        });

        quickPick.show();
      } else {
        if (element.value.options && element.value.options.length > 0) {
          const quickPick = vscode.window.createQuickPick();
          quickPick.items = element.value.options.map((option) => ({
            label: option,
          }));
          quickPick.onDidHide(() => quickPick.dispose());
          quickPick.placeholder = `Update the value for ${element.key}`;
          quickPick.onDidAccept(() => {
            const selectedItem = quickPick.selectedItems[0];
            if (selectedItem) {
              treeDataProvider.edit(element, selectedItem.label);
            }
            quickPick.hide();
          });

          quickPick.show();
        } else {
          const input = await vscode.window.showInputBox({
            value: element.value.value,
            prompt: `Update the value for ${element.key}`,
          });

          if (!input) {
            return;
          }

          treeDataProvider.edit(element, input);
        }
      }
    }
  );

  vscode.commands.registerCommand(
    "grind.flip",
    async (element: EnvironmentKeyValueTreeItem) => {
      if (element.value.type === "bool") {
        treeDataProvider.flip(element);
      }
    }
  );

  vscode.commands.registerCommand(
    "grind.rename",
    async (element: EnvironmentFileTreeItem) => {
      const newFile = await vscode.window.showInputBox({
        prompt: "Enter the new name for the environment file",
        value: element.name,
      });

      if (!newFile) {
        return;
      }

      try {
        await vscode.workspace.fs.rename(
          element.uri,
          vscode.Uri.joinPath(element.getDir(), newFile)
        );

        treeDataProvider.refresh();
        vscode.window.showInformationMessage(`File renamed to ${newFile}`);
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to rename file: ${error.message}`
        );
      }
    }
  );

  vscode.commands.registerCommand(
    "grind.duplicate",
    async (element: EnvironmentFileTreeItem) => {
      const newFileName = await vscode.window.showInputBox({
        prompt: "Enter the name for the duplicated environment file",
        value: `${element.name}.copy`,
      });

      if (!newFileName) {
        return;
      }

      try {
        await vscode.workspace.fs.writeFile(
          vscode.Uri.joinPath(element.getDir(), newFileName),
          await vscode.workspace.fs.readFile(element.uri)
        );

        treeDataProvider.refresh();
        vscode.window.showInformationMessage(
          `File duplicated as ${newFileName}`
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(
          `Failed to duplicate file: ${error.message}`
        );
      }
    }
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
