import { TaskId } from "./Task";

export class Day {
  date: string;
  tasks: TaskId[];

  constructor(date: string) {
    this.date = date;
    this.tasks = [];
  }
}
