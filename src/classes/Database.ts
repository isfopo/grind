import { drizzle } from "drizzle-orm/libsql";
import { Configuration } from "./Configuration";

export class Database {
  private static _instance: Database;
  static context: any;

  private constructor() {}

  public static getInstance(): Database {
    return this._instance || (this._instance = new this());
  }

  /** Connects or creates to file for database */
  public static connect() {
    this.context = drizzle(
      Configuration.get("grind.localDatabaseConnectionPath") as string
    );
  }
}
