import { Memento } from "vscode";
import { Day } from "../classes/entities/Day";

export class Storage {
  constructor(private storage: Memento) {}

  public get<T>(key: string): T {
    return this.storage.get<T>(key, null as T);
  }

  public async set<T>(key: string, value: T): Promise<void> {
    await this.storage.update(key, value);
  }

  getDates = (): Day[] => {
    return this.storage
      .keys()
      .filter((i) => Day.validate(i))
      .map((i) => Day.parse(this.get(i)))
      .filter((i) => i !== undefined) as Day[];
  };

  public reset(): void {
    this.storage.keys().forEach((key) => this.storage.update(key, undefined));
  }
}
