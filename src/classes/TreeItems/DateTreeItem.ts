import * as vscode from "vscode";
import { Temporal } from "proposal-temporal";
import { TaskTreeItem } from "./TaskTreeItem.js";

export class DateTreeItem extends vscode.TreeItem {
  constructor(
    public readonly date: Temporal.PlainDate,
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
