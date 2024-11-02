import * as vscode from "vscode";
import { DateTreeItem } from "./classes/TreeItems/DateTreeItem";
import { TaskTreeItem } from "./classes/TreeItems/TaskTreeItem";
import { Database } from "./classes/Database";
import { Logger } from "./classes/Logger";

export class GrindTreeviewProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  context: vscode.ExtensionContext;

  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined | void
  > = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();

  readonly onDidChangeTreeData: vscode.Event<
    vscode.TreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  readonly logger: Logger;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.logger = Logger.getInstance(context);
  }

  register() {
    const db = Database.getInstance();

    const trees = [
      vscode.window.createTreeView("grind-sidebar", {
        treeDataProvider: this,
      }),

      vscode.window.createTreeView("grind-explorer", {
        treeDataProvider: this,
      }),
    ];

    // create or connect db

    // create command

    for (const tree of trees) {
      tree.onDidChangeSelection(async (e): Promise<void> => {
        // if is todo item then open edit command
      });
    }

    return this;
  }

  async add(element: DateTreeItem | TaskTreeItem, task: string): Promise<void> {
    // add new todo for the day

    this.refresh();
  }

  async edit(element: TaskTreeItem, update: string) {
    // Edit given todo

    this.refresh();
  }

  refresh() {
    try {
      this._onDidChangeTreeData?.fire();
    } catch (e) {
      this.logger.log(e as string);
    }
  }

  getTreeItem(
    element: vscode.TreeItem
  ): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }

  getChildren(
    element?: DateTreeItem | TaskTreeItem | undefined
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    if (!element) {
      return; // recent dates
    } else if (element instanceof DateTreeItem) {
      return; // tasks from given date
    } else {
      return; // subtasks of task
    }
  }
}
