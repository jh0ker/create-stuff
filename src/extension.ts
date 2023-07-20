import * as vscode from "vscode";

async function createStuff() {
  if (!vscode.workspace.workspaceFolders) {
    vscode.window.showErrorMessage("No workspace folders open!");
    return;
  }

  // Select a workspace folder if there are multiple
  let workspaceFolder = vscode.workspace.workspaceFolders[0];
  if (vscode.workspace.workspaceFolders.length > 1) {
    const response = await vscode.window.showWorkspaceFolderPick();

    if (!response) {
      return;
    }

    workspaceFolder = response;
  }

  const dirName = await vscode.window.showInputBox({
    value: "stuff",
    prompt: "Enter a relative path for the new directory",
    title: "Create stuff",
  });

  if (!dirName) {
    return;
  }

  const dirPath = vscode.Uri.joinPath(workspaceFolder.uri, dirName);

  try {
    await vscode.workspace.fs.createDirectory(dirPath);
  } catch (e) {
    vscode.window.showErrorMessage(`Failed to create directory: ${e}`);
    return;
  }

  const gitignorePath = vscode.Uri.joinPath(dirPath, ".gitignore");

  try {
    await vscode.workspace.fs.writeFile(gitignorePath, Buffer.from("*"));
  } catch (e) {
    vscode.window.showErrorMessage(`Failed to create .gitignore: ${e}`);
    return;
  }
}

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "create-stuff.createStuff",
    createStuff
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
