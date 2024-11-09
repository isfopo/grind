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

  /**
   * Converts the current Day instance into a JSON string representation.
   *
   * This method serializes the properties of the Day instance, specifically
   * the `date` and `tasks`, into a JSON string. This can be useful for
   * storing the Day instance in a format that can be easily transmitted
   * or stored in databases. The resulting JSON string can be parsed back
   * into a Day instance or used for other data manipulation purposes.
   *
   * @returns A JSON string that represents the current Day instance.
   */
  stringify() {
    return JSON.stringify({
      date: this.date,
      tasks: this.tasks,
    });
  }

  /**
   * Parses a given input into a Day instance or returns undefined.
   *
   * This method accepts an input that can be of type `Day`, a JSON string
   * representing a Day, or `undefined`. It converts the input into a Day object
   * if applicable. If the input is a string, it attempts to parse it as JSON
   * and create a Day instance from the resulting object. If the input is already
   * a Day object, it simply returns a new Day instance initialized with the
   * same properties. If the input is undefined or not parsable, it returns
   * undefined. This method is useful for reconstructing Day instances from
   * various sources of data, such as storage or network responses.
   *
   * @param json - The input that can be a Day instance, a JSON string, or undefined.
   * @returns A Day instance if the input is valid, or undefined if the input is invalid or missing.
   */
  static parse(json: Day | string | undefined): Day | undefined {
    if (!json) {
      return undefined;
    } else if (typeof json === "string") {
      return JSON.parse(json) as Day;
    } else {
      return new Day(json?.date, json?.tasks);
    }
  }

  /**
   * A getter that retrieves today's date as a formatted string.
   *
   * This property returns the current date in the format "YYYY-MM-DD", ensuring that the time
   * component is set to the start of the day (midnight). For instance, accessing `Day.today`
   * during any part of the day will yield the date string corresponding to the current day.
   *
   * @returns A formatted date string representing today's date.
   */
  static get today(): string {
    return Day.toKey(dayjs().startOf("day"));
  }

  /**
   * Returns a formatted date string representing the specified number of days ago from today.
   *
   * This method calculates the date that is the given number of days prior to today
   * and returns it in the format "YYYY-MM-DD". For example, calling `dayAgo(3)`
   * would return the date string corresponding to three days before today.
   *
   * @param days - The number of days to go back from today.
   * @returns A formatted date string representing the date from the specified number of days ago.
   */
  static dayAgo(days: number): string {
    return Day.toKey(dayjs().startOf("day").subtract(days, "day"));
  }

  /**
   * Returns an array of formatted date strings representing the specified number of days ago.
   *
   * This method generates a list where each entry corresponds to a day, starting from
   * today and going back the given number of days. For example, calling `daysAgo(3)`
   * would return an array containing today's date and the two previous days in the format
   * "YYYY-MM-DD".
   *
   * @param days - The number of days to go back from today.
   * @returns An array of formatted date strings for each day going back from today.
   */
  static daysAgo(days: number): string[] {
    return Array(days)
      .fill(0)
      .map((_, d): string =>
        Day.toKey(
          dayjs()
            .startOf("day")
            .subtract(d + 1, "day")
        )
      );
  }

  /**
   * Formats a Day.js object into a string representation of the date.
   *
   * This method converts a Day.js instance into a formatted date string in the
   * "YYYY-MM-DD" format. This is useful for ensuring consistent date formatting
   * across the application when displaying or processing date values.
   *
   * @param day - A Day.js object representing the date to format.
   * @returns A string formatted as "YYYY-MM-DD" representing the given date.
   */
  static toKey(day: dayjs.Dayjs) {
    return day.format("YYYY-MM-DD");
  }

  /**
   * Formats a date string into a more human-readable representation.
   *
   * This method takes a date string (in a recognized format) and converts
   * it into a formatted string that specifies the weekday name, the full
   * month name, and the day of the month. For example, calling this method
   * with a date string such as "2023-10-23" would return a string like
   * "Monday, October 23". This can be useful for displaying dates in a
   * user-friendly manner within the application.
   *
   * @param key - The date string to format, which should be in a
   *              recognizable format by Day.js.
   * @returns A formatted string representing the date as "Day, Month D".
   */
  static format(key: string) {
    return dayjs(key).format("dddd, MMM D");
  }

  /**
   * Validates a date string against the format "YYYY-MM-DD".
   *
   * This method uses a regular expression to determine if the provided
   * string adheres to the expected date format. It returns `true` if
   * the format is valid, and `false` otherwise. This can be useful for
   * ensuring that date strings are correctly formatted before further
   * processing or storage.
   *
   * @param key - The date string to validate.
   * @returns A boolean indicating whether the date string matches the
   *          "YYYY-MM-DD" format.
   */
  static validate(key: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.exec(key) !== null;
  }

  /**
   * Converts the current Day instance into a DayTreeItem representation.
   *
   * This method initializes a new DayTreeItem, passing the current
   * Day instance to the constructor. This can be useful for creating
   * a tree structure where each day is represented as a tree item,
   * facilitating the management and visualization of tasks associated
   * with that day.
   *
   * @returns A DayTreeItem that represents the current Day instance.
   */
  toTreeItem(): DayTreeItem {
    return new DayTreeItem(this);
  }

  /**
   * Adds a new task to the current Day instance and returns its generated ID.
   *
   * This method creates a unique identifier for a new task using the
   * `Task.generateTaskId()` method and appends it to the list of tasks
   * for the Day. The generated ID serves as a reference for the task that
   * can be used for future manipulations, such as updating or deleting the
   * task. The method ensures that each task added has a distinct ID.
   *
   * @returns A string representing the unique ID of the newly added task.
   */
  addTask(): string {
    const id = Task.generateTaskId();
    this.tasks.push(id);
    return id;
  }
}
