import * as vscode from "vscode";
import { Day } from "../entities/Day.js";
import { TaskTreeItem } from "./TaskTreeItem.js";
import { Task } from "../entities/Task.js";

export class DayTreeItem extends vscode.TreeItem {
  children: string[];

  constructor(public readonly day: Day) {
    super(day.date.toString());
    this.day = day;
    this.children = day?.tasks ?? [];
    this.tooltip = `Tasks for ${day.date.toLocaleString()}`;
    this.contextValue = "day";
    this.collapsibleState =
      day.date === Day.today()
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.Collapsed;
  }
}
