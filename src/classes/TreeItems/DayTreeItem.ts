import * as vscode from "vscode";
import { Day } from "../entities/Day.js";

export class DayTreeItem extends vscode.TreeItem {
  children: string[];

  constructor(
    public readonly day: Day,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState = vscode
      .TreeItemCollapsibleState.None
  ) {
    super(day.date.toString(), collapsibleState);
    this.children = day.tasks;
    this.tooltip = `Tasks for ${day.date.toLocaleString()}`;
    this.contextValue = "day";
  }
}
