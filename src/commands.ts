import * as vscode from "vscode";

import { RefactoringCommand } from "./refactoring-command";

import { renameSymbol } from "./refactorings/rename-symbol";
import { extractVariable } from "./refactorings/extract-variable";
import { inlineVariable } from "./refactorings/inline-variable";
import { negateExpression } from "./refactorings/negate-expression";
import { removeRedundantElse } from "./refactorings/remove-redundant-else";
import { flipIfElse } from "./refactorings/flip-if-else";
import { flipTernary } from "./refactorings/flip-ternary";
import { convertIfElseToTernary } from "./refactorings/convert-if-else-to-ternary";
import { convertTernaryToIfElse } from "./refactorings/convert-ternary-to-if-else";

import { delegateToVSCode } from "./refactorings/adapters/delegate-to-vscode";
import { showErrorMessageInVSCode } from "./refactorings/adapters/show-error-message-in-vscode";
import {
  createReadThenWriteInVSCode,
  createWriteInVSCode
} from "./refactorings/adapters/write-code-in-vscode";
import { createSelectionFromVSCode } from "./refactorings/adapters/selection-from-vscode";

export default {
  renameSymbol: vscode.commands.registerCommand(
    RefactoringCommand.RenameSymbol,
    renameSymbolCommand
  ),
  extractVariable: vscode.commands.registerCommand(
    RefactoringCommand.ExtractVariable,
    extractVariableCommand
  ),
  inlineVariable: vscode.commands.registerCommand(
    RefactoringCommand.InlineVariable,
    inlineVariableCommand
  ),
  negateExpression: vscode.commands.registerCommand(
    RefactoringCommand.NegateExpression,
    negateExpressionCommand
  ),
  removeRedundantElse: vscode.commands.registerCommand(
    RefactoringCommand.RemoveRedundantElse,
    removeRedundantElseCommand
  ),
  flipIfElse: vscode.commands.registerCommand(
    RefactoringCommand.FlipIfElse,
    flipIfElseCommand
  ),
  flipTernary: vscode.commands.registerCommand(
    RefactoringCommand.FlipTernary,
    flipTernaryCommand
  ),
  convertIfElseToTernary: vscode.commands.registerCommand(
    RefactoringCommand.ConvertIfElseToTernary,
    convertIfElseToTernaryCommand
  ),
  convertTernaryToIfElse: vscode.commands.registerCommand(
    RefactoringCommand.ConvertTernaryToIfElse,
    convertTernaryToIfElseCommand
  )
};

function renameSymbolCommand() {
  executeSafely(() => renameSymbol(delegateToVSCode));
}

async function extractVariableCommand() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }

  const { document, selection } = activeTextEditor;

  await executeSafely(() =>
    extractVariable(
      document.getText(),
      createSelectionFromVSCode(selection),
      createReadThenWriteInVSCode(document),
      delegateToVSCode,
      showErrorMessageInVSCode
    )
  );
}

async function inlineVariableCommand() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }

  const { document, selection } = activeTextEditor;

  await executeSafely(() =>
    inlineVariable(
      document.getText(),
      createSelectionFromVSCode(selection),
      createReadThenWriteInVSCode(document),
      showErrorMessageInVSCode
    )
  );
}

async function negateExpressionCommand() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }

  const { document, selection } = activeTextEditor;

  await executeSafely(() =>
    negateExpression(
      document.getText(),
      createSelectionFromVSCode(selection),
      createReadThenWriteInVSCode(document),
      showErrorMessageInVSCode
    )
  );
}

async function removeRedundantElseCommand() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }

  const { document, selection } = activeTextEditor;

  await executeSafely(() =>
    removeRedundantElse(
      document.getText(),
      createSelectionFromVSCode(selection),
      createWriteInVSCode(document),
      showErrorMessageInVSCode
    )
  );
}

async function flipIfElseCommand() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }

  const { document, selection } = activeTextEditor;

  await executeSafely(() =>
    flipIfElse(
      document.getText(),
      createSelectionFromVSCode(selection),
      createWriteInVSCode(document),
      showErrorMessageInVSCode
    )
  );
}

async function flipTernaryCommand() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }

  const { document, selection } = activeTextEditor;

  await executeSafely(() =>
    flipTernary(
      document.getText(),
      createSelectionFromVSCode(selection),
      createWriteInVSCode(document),
      showErrorMessageInVSCode
    )
  );
}

async function convertIfElseToTernaryCommand() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }

  const { document, selection } = activeTextEditor;

  await executeSafely(() =>
    convertIfElseToTernary(
      document.getText(),
      createSelectionFromVSCode(selection),
      createWriteInVSCode(document),
      showErrorMessageInVSCode
    )
  );
}

async function convertTernaryToIfElseCommand() {
  const activeTextEditor = vscode.window.activeTextEditor;
  if (!activeTextEditor) {
    return;
  }

  const { document, selection } = activeTextEditor;

  await executeSafely(() =>
    convertTernaryToIfElse(
      document.getText(),
      createSelectionFromVSCode(selection),
      createWriteInVSCode(document),
      showErrorMessageInVSCode
    )
  );
}

async function executeSafely(command: () => Promise<any>): Promise<void> {
  try {
    await command();
  } catch (err) {
    if (err.name === "Canceled") {
      // This happens when "Rename Symbol" is completed.
      // In general, if command is cancelled, we're fine to ignore the error.
      return;
    }

    vscode.window.showErrorMessage(
      `😅 I'm sorry, something went wrong: ${err.message}`
    );
    console.error(err);
  }
}
