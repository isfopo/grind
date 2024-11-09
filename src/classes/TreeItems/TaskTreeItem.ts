import * as vscode from "vscode";
import { Day } from "../entities/Day";
import { Task, TaskId } from "../entities/Task";
import { ENABLE_COMPLETIONS } from "../../consts";

/**
 * Represents a task item in the Visual Studio Code tree view.
 *
 * The TaskTreeItem class extends vscode.TreeItem and encapsulates
 * the properties and functionality related to a task, including its
 * label, completion state, and any associated subtasks. It also
 * manages the tooltip and context values used in the tree view, as
 * well as the checkbox state if completions are enabled in the
 * settings.
 *
 * @class TaskTreeItem
 * @extends vscode.TreeItem
 *
 * @param {Task} task - The task object containing details such as
 *        id, day, label, subtasks, and completion status.
 *
 * @property {Task} task - The task represented by this tree item.
 * @property {vscode.TreeItemCheckboxState} checkboxState - The
 *        state of the checkbox representing the task's completion
 *        status, if ENABLE_COMPLETIONS is true.
 * @property {vscode.TreeItemCollapsibleState} collapsibleState -
 *        Indicates whether the item can be collapsed based on the
 *        presence of subtasks.
 */
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

    if (ENABLE_COMPLETIONS) {
      this.checkboxState = {
        state: this.task.completed
          ? vscode.TreeItemCheckboxState.Checked
          : vscode.TreeItemCheckboxState.Unchecked,
        tooltip: this.task.completed
          ? "Mark as incomplete"
          : "Mark as complete",
        accessibilityInformation: {
          label: this.task.completed
            ? "Mark as incomplete"
            : "Mark as complete",
          role: "checkbox",
        },
      };
    }

    this.collapsibleState =
      this.task.subtasks.length > 0
        ? vscode.TreeItemCollapsibleState.Collapsed
        : vscode.TreeItemCollapsibleState.None;
  }
}
