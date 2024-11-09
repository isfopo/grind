import * as vscode from "vscode";
import { Day } from "../entities/Day.js";
import { TaskTreeItem } from "./TaskTreeItem.js";
import { Task } from "../entities/Task.js";

/**
 * Represents a tree item for a specific day within the task management system.
 * Inherits from the vscode.TreeItem class to integrate with the Visual Studio Code
 * environment as a collapsible item in a tree view.
 *
 * @class DayTreeItem
 * @extends {vscode.TreeItem}
 *
 * @property {Day} day - The Day object associated with this tree item.
 * @property {string[]} children - An array of task identifiers associated with the day.
 *
 * @constructor
 * @param {Day} day - The Day object containing information about the date and its tasks.
 *
 * The constructor sets the following properties:
 * - The label of the tree item, formatted from the date of the day.
 * - The tooltip displaying the tasks for the specified day.
 * - The context value, indicating that this item represents a day.
 * - The collapsible state, determining if the tree item is expanded or collapsed based on
 *   whether the day is today.
 */
export class DayTreeItem extends vscode.TreeItem {
  children: string[];

  constructor(public readonly day: Day) {
    super(Day.format(day.date));
    this.day = day;
    this.children = day?.tasks ?? [];
    this.tooltip = `Tasks for ${Day.format(day.date)}`;
    this.contextValue = "day";
    this.collapsibleState =
      day.date === Day.today
        ? vscode.TreeItemCollapsibleState.Expanded
        : vscode.TreeItemCollapsibleState.Collapsed;
  }
}
