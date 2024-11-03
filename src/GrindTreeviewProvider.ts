import * as vscode from "vscode";
import { DayTreeItem } from "./classes/TreeItems/DayTreeItem";
import { TaskTreeItem } from "./classes/TreeItems/TaskTreeItem";
import { Logger } from "./services/Logger";
import { Storage } from "./services/Storage";
import { Day } from "./classes/entities/Day";
import { Task } from "./classes/entities/Task";
import dayjs = require("dayjs");
import dayOfYear = require("dayjs/plugin/dayOfYear");

dayjs.extend(dayOfYear);

const STORAGE_SCOPE: "global" | "workspace" = "global"; // Allow this to be set to workplace storage via settings

export class GrindTreeviewProvider
  implements vscode.TreeDataProvider<vscode.TreeItem>
{
  readonly context: vscode.ExtensionContext;
  readonly storage: Storage;

  private _onDidChangeTreeData: vscode.EventEmitter<
    vscode.TreeItem | undefined | void
  > = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();

  readonly onDidChangeTreeData: vscode.Event<
    vscode.TreeItem | undefined | void
  > = this._onDidChangeTreeData.event;

  readonly logger: Logger;

  constructor(context: vscode.ExtensionContext) {
    this.context = context;
    this.storage = new Storage(
      STORAGE_SCOPE === "global" ? context.globalState : context.workspaceState
    );

    this.logger = Logger.getInstance(context);
  }

  register() {
    const trees = [
      vscode.window.createTreeView("grind-sidebar", {
        treeDataProvider: this,
      }),

      vscode.window.createTreeView("grind-explorer", {
        treeDataProvider: this,
      }),
    ];

    for (const tree of trees) {
      tree.onDidChangeSelection(async (e): Promise<void> => {
        // if is todo item then open edit command
      });
    }

    return this;
  }

  async add(element: DayTreeItem | TaskTreeItem, task: string): Promise<void> {
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
    element?: DayTreeItem | TaskTreeItem | undefined
  ): vscode.ProviderResult<vscode.TreeItem[]> {
    if (element === undefined) {
      const today = dayjs().startOf("day");

      return; // recent dates
    } else if (element instanceof DayTreeItem) {
      const today = this.storage.get<Day>(element.date);

      return today.tasks.map(
        (t) => new TaskTreeItem(this.storage.get<Task>(t))
      );
    } else if (element instanceof TaskTreeItem) {
      const task = this.storage.get<Task>(element.id);

      return task.subtasks.map(
        (t) => new TaskTreeItem(this.storage.get<Task>(t))
      );
    } else {
      return;
    }
  }
}
