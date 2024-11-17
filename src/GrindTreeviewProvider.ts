import * as vscode from "vscode";
import { DayTreeItem } from "./classes/TreeItems/DayTreeItem";
import { TaskTreeItem } from "./classes/TreeItems/TaskTreeItem";
import { Logger } from "./services/Logger";
import { Storage } from "./services/Storage";
import { Day } from "./classes/entities/Day";
import { Task } from "./classes/entities/Task";
import { ENABLE_COMPLETIONS, STORAGE_SCOPE } from "./consts";

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
    try {
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
          for (const item of e.selection as TaskTreeItem[]) {
            if (item instanceof TaskTreeItem) {
              const updated = item.task?.toggleCompleted();
              this.storage.set(item.task.id, updated);
              for (const subtask of item.task.subtasks) {
                const updated = this.storage.get<Task | undefined>(subtask);
                if (updated) {
                  updated.completed = item.task.completed;
                  this.storage.set(subtask, updated);
                }
              }
            }
          }
          this.refresh();
        });
      }

      return this;
    } catch (e) {
      this.logger.log(e as string);
      return this;
    }
  }

  async add(
    element: Day | Task | DayTreeItem | TaskTreeItem | undefined,
    newTask: string,
    {
      onError,
    }: {
      onError?: (message: string) => void;
    } = {}
  ): Promise<void> {
    if (!element) {
      onError?.("Element is undefined");
      return;
    }

    if (element instanceof Day || element instanceof DayTreeItem) {
      const day = element instanceof Day ? element : element.day;
      // generate new task id and add to Day
      const id = day.addTask();

      // store new Task
      this.storage.set(id, new Task(id, day.date, newTask));

      // update Day
      this.storage.set(day.date, day);
    } else if (element instanceof Task || element instanceof TaskTreeItem) {
      // generate new task id and add to Task

      const task = element instanceof Task ? element : element.task;

      const id = task.addSubtask();

      // store new Task
      this.storage.set(id, new Task(id, task.day, newTask));

      // update Task
      this.storage.set(task.id, task);
    }

    this.refresh();
  }

  async edit(element: TaskTreeItem, update: string): Promise<void> {
    // Edit given todo

    this.refresh();
  }

  async copy(key: string) {
    const appendTasks = (tasks: string[], indent: number = 0): string => {
      let result: string = "";

      for (const task of tasks) {
        const t = this.storage.get<Task>(task);
        if (t) {
          result = result.concat(
            `${" ".repeat(indent)}- ${
              ENABLE_COMPLETIONS ? `[${t.completed ? "x" : " "}]` : ""
            } ${t.label}\n`
          );
          result = result + appendTasks(t.subtasks, indent + 2);
        }
      }

      return result;
    };

    if (Day.validate(key)) {
      const day = this.storage.get<Day>(key);

      if (day) {
        await vscode.env.clipboard.writeText(appendTasks(day.tasks));
      } else {
        vscode.window.showInformationMessage("No tasks found for this day.");
      }
    } else if (Task.validate(key)) {
      const task = this.storage.get<Task>(key);

      if (task) {
        await vscode.env.clipboard.writeText(appendTasks(task.subtasks));
      } else {
        vscode.window.showInformationMessage("No tasks found.");
      }
    }
    vscode.window.showInformationMessage("Tasks copied.");
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
      const today = Day.today;

      const day = Day.parse(this.storage.get(today));

      if (!day) {
        this.storage.set(today, new Day(today));
      }

      return this.storage.getDates().map((d) => new DayTreeItem(d));
    } else if (element instanceof DayTreeItem) {
      const today = this.storage.get<Day>(element.day.date);

      return today?.tasks.map(
        (t) => new TaskTreeItem(this.storage.get<Task>(t))
      );
    } else if (element instanceof TaskTreeItem) {
      const task = this.storage.get<Task>(element.task.id);

      return task.subtasks.map(
        (t) => new TaskTreeItem(this.storage.get<Task>(t))
      );
    } else {
      return;
    }
  }

  reset() {
    this.storage.reset();
    this.refresh();
  }
}
