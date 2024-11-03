import * as vscode from "vscode";
import { Day } from "../entities/Day";
import { Task, TaskId } from "../entities/Task";

export class TaskTreeItem extends vscode.TreeItem {
  id: TaskId;

  constructor(
    public readonly task: Task,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(task.label, collapsibleState);
    this.id = task.id;
    this.tooltip = task.label;
    this.description = task.label;
    this.contextValue = "task";
  }
}
