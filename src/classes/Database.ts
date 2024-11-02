import { drizzle } from "drizzle-orm/libsql";
import { Configuration } from "./Configuration";

export class Database {
  private static _instance: Database;
  static context: any;

  private constructor() {}

  public static getInstance(): Database {
    if (!this._instance) {
      this._instance = new this();
      const dbPath = Configuration.get(
        "grind.localDatabaseConnectionPath"
      ) as string;
      this.context = drizzle(dbPath);
    }

    return this._instance;
  }
}
