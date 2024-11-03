import { TaskId } from "./Task";

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
}
