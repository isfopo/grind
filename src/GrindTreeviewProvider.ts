import * as vscode from "vscode";
import { DayTreeItem } from "./classes/TreeItems/DayTreeItem";
import { TaskTreeItem } from "./classes/TreeItems/TaskTreeItem";
import { Logger } from "./services/Logger";
import { Storage } from "./services/Storage";
import { Day } from "./classes/entities/Day";
import { Task } from "./classes/entities/Task";
import dayjs = require("dayjs");
import { reverse } from "dns";

const STORAGE_SCOPE: "global" | "workspace" = "global"; // Allow this to be set to workplace storage via settings
const NUMBER_OF_PREVIOUS_DAYS = 10;

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
    if (element instanceof DayTreeItem) {
      // generate new task id and add to Day
      const id = element.day.addTask();

      // store new Task
      this.storage.set(id, new Task(id, element.day.date, task));

      // update Day
      this.storage.set(element.day.date, element.day);
    } else if (element instanceof TaskTreeItem) {
      // generate new task id and add to Task
      const id = element.task.addSubtask();

      // store new Task
      this.storage.set(id, new Task(id, element.task.day, task));

      // update Task
      this.storage.set(element.task.id, element.task);
    }

    this.refresh();
  }

  async edit(element: TaskTreeItem, update: string): Promise<void> {
    // Edit given todo

    this.refresh();
  }

  refresh(): void {
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
      const today = Day.today();

      const day = Day.parse(this.storage.get(today));

      if (!day) {
        this.storage.set(today, new Day(today));
      }

      const array = Array(NUMBER_OF_PREVIOUS_DAYS).fill(0);

      return array
        .map((_, i) => {
          const date = this.storage.get<Day>(
            Day.format(dayjs(today).subtract(i, "day"))
          );
          return date ? Day.parse(date).toTreeItem() : undefined;
        })
        .filter((d) => !!d)
        .reverse() as DayTreeItem[];
    } else if (element instanceof DayTreeItem) {
      const today = this.storage.get<Day>(element.day.date);

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

  reset() {
    this.storage.reset();
  }
}
