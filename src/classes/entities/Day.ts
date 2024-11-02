import { TaskId } from "./Task";

export class Day {
  date: Date;
  tasks: TaskId[];

  constructor(date: Date) {
    this.date = date;
    this.tasks = [];
  }
}
