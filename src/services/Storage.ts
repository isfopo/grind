import { Memento } from "vscode";

export class Storage {
  constructor(private storage: Memento) {}

  public get<T>(key: string): T {
    return this.storage.get<T>(key, null as T);
  }

  public async set<T>(key: string, value: T): Promise<void> {
    await this.storage.update(key, value);
  }

  public reset(): void {
    this.storage.keys().forEach((key) => this.storage.update(key, undefined));
  }
}
