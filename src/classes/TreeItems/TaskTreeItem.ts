import * as vscode from "vscode";

export class TaskTreeItem extends vscode.TreeItem {
  constructor(
    public readonly date: Date,
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
