import * as vscode from "vscode";
import { Temporal } from "proposal-temporal";

export class TaskTreeItem extends vscode.TreeItem {
  constructor(
    public readonly date: Temporal.PlainDate,
    public readonly children: TaskTreeItem,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(date.toString(), collapsibleState);
    this.children = children;
    this.tooltip = "";
    this.description = "";
  }
}
