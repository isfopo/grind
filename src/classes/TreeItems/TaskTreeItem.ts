import * as vscode from "vscode";
import { Day } from "../entities/Day";
import { Task, TaskId } from "../entities/Task";

export class TaskTreeItem extends vscode.TreeItem {
  public readonly task: Task;

  constructor(task: Task) {
    super(task.label);
    this.tooltip = task.label;
    this.contextValue = "task";

    this.task = new Task(
      task.id,
      task.day,
      task.label,
      task.subtasks,
      task.completed
    );

    this.checkboxState = {
      state: this.task.completed
        ? vscode.TreeItemCheckboxState.Checked
        : vscode.TreeItemCheckboxState.Unchecked,
      tooltip: this.task.completed ? "Mark as incomplete" : "Mark as complete",
      accessibilityInformation: {
        label: this.task.completed ? "Mark as incomplete" : "Mark as complete",
        role: "checkbox",
      },
    };

    this.collapsibleState =
      this.task.subtasks.length > 0
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None;
  }
}
