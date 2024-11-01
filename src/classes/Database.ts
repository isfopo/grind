export class Database {
  private static _instance: Database;

  private constructor() {}

  public static getInstance(): Database {
    return this._instance || (this._instance = new this());
  }

  /** Connects or creates to file for database */
  public connect() {}
}
