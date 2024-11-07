import { Task, TaskId } from "./Task";
import dayjs = require("dayjs");
import dayOfYear = require("dayjs/plugin/dayOfYear");
import { DayTreeItem } from "../TreeItems/DayTreeItem";

dayjs.extend(dayOfYear);

export class Day {
  date: string;
  tasks: TaskId[];

  constructor(date: string, tasks?: TaskId[]) {
    this.date = date;
    this.tasks = tasks ?? [];
  }

  stringify() {
    return JSON.stringify({
      date: this.date,
      tasks: this.tasks,
    });
  }

  static parse(json: Day | string | undefined): Day | undefined {
    if (!json) {
      return undefined;
    } else if (typeof json === "string") {
      return JSON.parse(json) as Day;
    } else {
      return new Day(json?.date, json?.tasks);
    }
  }

  static get today(): string {
    return Day.format(dayjs().startOf("day"));
  }

  static daysAgo(days: number): string {
    return Day.format(dayjs().startOf("day").subtract(days, "day"));
  }

  static format(day: dayjs.Dayjs) {
    return day.format("YYYY-MM-DD");
  }

  static validate(key: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.exec(key) !== null;
  }

  toTreeItem(): DayTreeItem {
    return new DayTreeItem(this);
  }

  addTask(): string {
    const id = Task.generateTaskId();
    this.tasks.push(id);
    return id;
  }
}
