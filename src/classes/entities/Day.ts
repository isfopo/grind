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

  stringify() {
    return JSON.stringify({
      date: this.date,
      tasks: this.tasks,
    });
  }

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
    return Day.format(dayjs().startOf("day"));
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
    return Day.format(dayjs().startOf("day").subtract(days, "day"));
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
    return Array(days).map((d) =>
      Day.format(dayjs().startOf("day").subtract(d, "day"))
    );
  }

  static format(day: dayjs.Dayjs) {
    return day.format("YYYY-MM-DD");
  }

  static validate(key: string): boolean {
    return /^\d{4}-\d{2}-\d{2}$/.exec(key) !== null;
  }

  toTreeItem(): DayTreeItem {
    return new DayTreeItem(this);
  }

  addTask(): string {
    const id = Task.generateTaskId();
    this.tasks.push(id);
    return id;
  }
}
