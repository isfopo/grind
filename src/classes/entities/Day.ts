import { TaskId } from "./Task";
import dayjs = require("dayjs");
import dayOfYear = require("dayjs/plugin/dayOfYear");
import { DayTreeItem } from "../TreeItems/DayTreeItem";

dayjs.extend(dayOfYear);

export class Day {
  date: string;
  tasks: TaskId[];

  constructor(date: string) {
    this.date = date;
    this.tasks = [];
  }

  stringify() {
    return JSON.stringify({
      date: this.date,
      tasks: this.tasks,
    });
  }

  static parse(json: string) {
    return JSON.parse(json) as Day;
  }

  static today() {
    return dayjs().startOf("day").format("YYYY-MM-DD");
  }

  toTreeItem() {
    return new DayTreeItem(this);
  }
}
