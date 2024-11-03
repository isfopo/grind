import * as vscode from "vscode";
import { Day } from "../entities/Day";
import { Task, TaskId } from "../entities/Task";

export class TaskTreeItem extends vscode.TreeItem {
  id: TaskId;

  constructor(public readonly task: Task) {
    super(task.label);
    this.id = task.id;
    this.tooltip = task.label;
    this.contextValue = "task";

    this.task = new Task(
      task.id,
      task.day,
      task.label,
      task.subtasks,
      task.completed
    );

    this.collapsibleState =
      this.task.subtasks.length > 0
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None;
  }
}
