import { Memento } from "vscode";

export class Storage {
  constructor(private storage: Memento) {}

  public get<T>(key: string): T {
    return this.storage.get<T>(key, null as T);
  }

  public set<T>(key: string, value: T) {
    this.storage.update(key, value);
  }
}
