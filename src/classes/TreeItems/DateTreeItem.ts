import * as vscode from "vscode";
import { TaskTreeItem } from "./TaskTreeItem.js";

export class DateTreeItem extends vscode.TreeItem {
  constructor(
    public readonly date: Date,
    public readonly children: TaskTreeItem,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(date.toString(), collapsibleState);
    this.children = children;
    this.description = `Tasks for ${date.toLocaleString()}`;
    this.tooltip = this.description;
  }
}
