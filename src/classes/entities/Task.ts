export type TaskId = string;

export class Task {
  id: TaskId;
  day: string;
  label: string;
  subtasks: TaskId[];
  completed: boolean;

  constructor(id: TaskId, day: string, label: string, completed?: boolean) {
    this.id = id;
    this.day = day;
    this.label = label;
    this.completed = completed ?? false;
    this.subtasks = [];
  }

  stringify(): string {
    return JSON.stringify({
      id: this.id,
      day: this.day,
      label: this.label,
      subtasks: this.subtasks,
      completed: this.completed,
    });
  }

  static parse(json: string): Task {
    return JSON.parse(json) as Task;
  }

  static generateTaskId(length: number = 21): string {
    return Math.ceil(Math.random() * Date.now())
      .toPrecision(length)
      .toString()
      .replace(".", "");
  }
}
