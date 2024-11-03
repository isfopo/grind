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
}
