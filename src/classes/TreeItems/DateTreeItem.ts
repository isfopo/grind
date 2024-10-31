import * as vscode from "vscode";
import { Temporal } from "proposal-temporal";

export class DateTreeItem extends vscode.TreeItem {
  constructor(
    public readonly date: Temporal.PlainDate,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(date.toString(), collapsibleState);
    this.description = `Tasks for ${date.toLocaleString()}`;
    this.tooltip = this.description;
  }
}
