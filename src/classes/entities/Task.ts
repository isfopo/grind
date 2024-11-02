export type TaskId = number;

export class Task {
  id: number;
  date: string;
  label: string;
  subtasks: TaskId[];
  completed: boolean;

  constructor(id: number, date: string, label: string, completed?: boolean) {
    this.id = id;
    this.date = date;
    this.label = label;
    this.completed = completed ?? false;
    this.subtasks = [];
  }
}
