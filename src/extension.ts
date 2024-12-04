import * as vscode from "vscode";
import { GrindTreeviewProvider } from "./GrindTreeviewProvider";
import { DayTreeItem } from "./classes/TreeItems/DayTreeItem";
import { TaskTreeItem } from "./classes/TreeItems/TaskTreeItem";
import { Day } from "./classes/entities/Day";
import { Storage } from "./services/Storage";
import { STORAGE_SCOPE } from "./consts";
import { Task } from "./classes/entities/Task";
import { UserInput } from "./services/UserInput";

export function activate(context: vscode.ExtensionContext) {
  const treeDataProvider = new GrindTreeviewProvider(context).register();

  const storage = new Storage(
    STORAGE_SCOPE === "global" ? context.globalState : context.workspaceState
  );

  vscode.commands.registerCommand(
    "grind.add",
    async (element: DayTreeItem | TaskTreeItem) => {
      treeDataProvider.add(element, await UserInput.promptNewTask());
    }
  );

  vscode.commands.registerCommand(
    "grind.edit",
    async (element: TaskTreeItem) => {
      treeDataProvider.edit(
        element,
        await UserInput.promptUpdateTask(element.label?.toString() ?? "")
      );
    }
  );

  const addToSubtask = async (
    parent: string,
    taskIds: string[] | undefined
  ) => {
    const tasks = taskIds?.map((t) => storage.get<Task>(t)) ?? [];
    const labels = tasks.map((t) => t.label);

    let addTo;

    const addNewTaskOption = Day.validate(parent)
      ? `Add task to ${Day.format(parent)}`
      : `Add subtask`;

    const addToSubtaskPrompt =
      "Select a task to add a subtask to or add a new task";

    if (taskIds && taskIds.length > 0) {
      addTo = await vscode.window.showQuickPick([addNewTaskOption, ...labels], {
        placeHolder: addToSubtaskPrompt,
      });
    } else {
      addTo = addNewTaskOption;
    }

    if (!addTo) {
      return;
    } else if (labels.includes(addTo)) {
      const task = tasks.find((t) => t.label === addTo);
      if (task) {
        await addToSubtask(task?.id, task?.subtasks);
      }
    } else if (addTo === addNewTaskOption) {
      const newTask = await vscode.window.showInputBox({
        prompt: "Add a new task",
      });
      if (!newTask) {
        return;
      }

      if (Day.validate(parent)) {
        treeDataProvider.add(Day.parse(storage.get(parent) as Day), newTask);
      } else if (Task.validate(parent)) {
        treeDataProvider.add(
          Task.parse(storage.get(parent) as string),
          newTask
        );
      } else {
        await vscode.window.showErrorMessage("Invalid parent");
      }
    }
  };

  vscode.commands.registerCommand("grind.add-to-today", async () => {
    const { date, tasks } = storage.get<Day>(Day.today, new Day(Day.today));

    await addToSubtask(date, tasks);
  });

  vscode.commands.registerCommand("grind.add-to-tomorrow", async () => {
    const day = await storage.getOrCreateDay(Day.dayAhead(1));

    if (!!day) {
      await addToSubtask(day.date, day.tasks);
    }
  });

  vscode.commands.registerCommand("grind.add-to-day", async () => {
    const chosenDay = await UserInput.promptDateSelection();

    const getDaySafely = async () => {
      try {
        const retrievedDay = storage.get<Day>(chosenDay);
        if (retrievedDay) {
          return retrievedDay;
        } else {
          storage.set<Day>(chosenDay, new Day(chosenDay));
          return storage.get<Day>(chosenDay);
        }
      } catch {
        storage.set<Day>(chosenDay, new Day(chosenDay));
        return storage.get<Day>(chosenDay);
      }
    };

    const { date, tasks } = await getDaySafely();

    await addToSubtask(date, tasks);
  });

  vscode.commands.registerCommand("grind.copy-today", () => {
    treeDataProvider.copy(Day.today);
  });

  vscode.commands.registerCommand("grind.copy-yesterday", () => {
    treeDataProvider.copy(Day.dayAgo(1));
  });

  vscode.commands.registerCommand("grind.copy-day", async () => {
    treeDataProvider.copy(await UserInput.promptDateSelection());
  });

  vscode.commands.registerCommand("grind.refresh", () => {
    treeDataProvider.refresh();
  });

  vscode.commands.registerCommand("grind.reset", () => {
    treeDataProvider.reset();
    vscode.window.showInformationMessage("Grind reset");
    treeDataProvider.refresh();
  });
}

// this method is called when your extension is deactivated
export function deactivate() {}
