export type TaskId = string;

/**
 * Represents a task in the task management system.
 *
 * The Task class encapsulates all properties and methods related to a task,
 * including its unique identifier, associated day, label, subtasks, and
 * completion status. It provides functionality to create, modify,
 * serialize, and validate tasks, as well as manage subtasks.
 */
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

  /**
   * Toggles the completion status of the task.
   * This method updates the 'completed' property to its opposite value (true to false or false to true).
   * It returns the current instance of the Task class after the update.
   *
   * @returns {Task} - The current Task instance with the updated completion status.
   */
  toggleCompleted(): Task {
    this.completed = !this.completed;
    return this;
  }

  /**
   * Parses a JSON string and converts it into a Task instance.
   * This method takes a JSON string representation of a Task and reconstructs
   * the Task object, ensuring that it has the correct type and properties.
   *
   * @param {string} json - A JSON string representing a Task.
   * @returns {Task} - An instance of the Task class constructed from the JSON string.
   * @throws {SyntaxError} - Thrown if the input string is not valid JSON.
   */
  static parse(json: Task | string): Task | undefined {
    if (!json) {
      return undefined;
    } else if (typeof json === "string") {
      return JSON.parse(json) as Task;
    } else {
      return new Task(
        json.id,
        json.day,
        json.label,
        json.subtasks,
        json.completed
      );
    }
  }

  /**
   * Generates a unique task ID as a string.
   * This method creates a task ID by combining the current timestamp
   * (in base 36) and a random number (also in base 36) that falls
   * within a specific range to ensure uniqueness.
   *
   * @returns {string} - A unique task ID as a string.
   */
  static generateTaskId(): string {
    return (
      Date.now().toString(36) +
      Math.floor(
        Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)
      ).toString(36)
    );
  }

  /**
   * Validates a given task ID by checking if it matches the expected format.
   * The format requires the task ID to consist of a total of 25 characters,
   * where the first 13 characters are alphanumeric (0-9, a-z) followed by
   * another 12 alphanumeric characters. This method returns true if the key
   * conforms to this pattern; otherwise, it returns false.
   *
   * @param {string} key - The task ID to validate.
   * @returns {boolean} - True if the task ID is valid, false otherwise.
   */
  static validate(key: string): boolean {
    return /^[a-z0-9]+[a-z0-9]{12,}$/.exec(key) !== null;
  }

  /**
   * Adds a new subtask to the current task.
   * This method generates a unique task ID for the subtask using the
   * `generateTaskId` method and then appends this ID to the
   * `subtasks` array of the current task.
   * It returns the ID of the newly added subtask.
   *
   * @returns {TaskId} - The ID of the newly created subtask.
   */
  addSubtask(): TaskId {
    const id = Task.generateTaskId();
    this.subtasks.push(id);
    return id;
  }
}
