import * as vscode from "vscode";

export interface ConfigurationTypes {
  "grind.localDatabaseConnectionPath": string;
}

export class Configuration {
  public static get<K extends keyof ConfigurationTypes>(
    key: K
  ): ConfigurationTypes[K] {
    return vscode.workspace
      .getConfiguration()
      .get(key) as ConfigurationTypes[K];
  }
}
