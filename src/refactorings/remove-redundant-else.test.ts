import { Code } from "./i-write-code";
import { removeRedundantElse } from "./remove-redundant-else";
import { Selection } from "./selection";
import { ShowErrorMessage, ErrorReason } from "./i-show-error-message";
import { createWriteInMemory } from "./adapters/write-code-in-memory";

describe("Remove Redundant Else", () => {
  let showErrorMessage: ShowErrorMessage;

  beforeEach(() => {
    showErrorMessage = jest.fn();
  });

  it.each<[string, { code: Code; selection: Selection; expected: Code }]>([
    [
      "redundant else",
      {
        code: `function doSomethingIfValid() {
  console.log("Start working");

  if (!isValid) {
    showWarning();
    return;
  } else {
    doSomething();
    doAnotherThing();
  }

  doSomeFinalThing();
}`,
        selection: new Selection([3, 3], [9, 3]),
        expected: `function doSomethingIfValid() {
  console.log("Start working");

  if (!isValid) {
    showWarning();
    return;
  }

  doSomething();
  doAnotherThing();
  doSomeFinalThing();
}`
      }
    ],
    [
      "only the selected redundant else",
      {
        code: `function doSomethingIfValid() {
  if (!isValid) {
    showWarning();
    return;
  } else {
    doSomething();
    doAnotherThing();
  }

  if (!isCorrect) {
    showWarning();
    return;
  } else {
    showMessage();
  }
}`,
        selection: new Selection([1, 3], [7, 3]),
        expected: `function doSomethingIfValid() {
  if (!isValid) {
    showWarning();
    return;
  }

  doSomething();
  doAnotherThing();

  if (!isCorrect) {
    showWarning();
    return;
  } else {
    showMessage();
  }
}`
      }
    ],
    [
      "redundant else when cursor is inside",
      {
        code: `function doSomethingIfValid() {
  if (!isValid) {
    showWarning();
    return;
  } else {
    doSomething();
    doAnotherThing();
  }
}`,
        selection: Selection.cursorAt(3, 3),
        expected: `function doSomethingIfValid() {
  if (!isValid) {
    showWarning();
    return;
  }

  doSomething();
  doAnotherThing();
}`
      }
    ],
    [
      "redundant else (throw in if branch)",
      {
        code: `function doSomethingIfValid() {
  if (!isValid) {
    throw new Error("Oh no!");
  } else {
    doSomething();
    doAnotherThing();
  }
}`,
        selection: Selection.cursorAt(3, 3),
        expected: `function doSomethingIfValid() {
  if (!isValid) {
    throw new Error("Oh no!");
  }

  doSomething();
  doAnotherThing();
}`
      }
    ]
  ])("should remove %s", async (_, { code, selection, expected }) => {
    const result = await doRemoveRedundantElse(code, selection);

    expect(result).toBe(expected);
  });

  it("should show an error message if selection has no redundant else", async () => {
    const code = `if (!isValid) {
  showWarning();
} else {
  doSomething();
  doAnotherThing();
}`;
    const selection = new Selection([0, 0], [5, 1]);

    await doRemoveRedundantElse(code, selection);

    expect(showErrorMessage).toBeCalledWith(
      ErrorReason.DidNotFoundRedundantElse
    );
  });

  async function doRemoveRedundantElse(
    code: Code,
    selection: Selection
  ): Promise<Code> {
    const [write, getCode] = createWriteInMemory(code);
    await removeRedundantElse(code, selection, write, showErrorMessage);
    return getCode();
  }
});