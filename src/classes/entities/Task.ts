export type TaskId = string;

export class Task {
  id: TaskId;
  day: string;
  label: string;
  subtasks: TaskId[];
  completed: boolean;

  constructor(
    id: TaskId,
    day: string,
    label: string,
    tasks?: TaskId[],
    completed?: boolean
  ) {
    this.id = id;
    this.day = day;
    this.label = label;
    this.completed = completed ?? false;
    this.subtasks = tasks ?? [];
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
    return (
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36)
    );
  }

  static validate(key: string): boolean {
    return /^[0-9a-z]{13}[0-9a-z]{12}$/.exec(key) !== null;
  }

  addSubtask() {
    const id = Task.generateTaskId();
    this.subtasks.push(id);
    return id;
  }
}
