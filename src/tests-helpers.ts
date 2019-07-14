import { Code } from "./refactorings/editor/i-write-code";
import { Selection } from "./refactorings/editor/selection";

export { testEach };

function testEach<T>(
  label: string,
  assertions: (Assertion & T)[],
  fn: (...args: (Assertion & T)[]) => any
) {
  describe(label, () => {
    assertions.forEach(assertion => {
      const test = assertion.only ? it.only : it;
      test(assertion.description, () => fn(assertion));
    });
  });
}

interface Assertion {
  description: string;
  only?: boolean;
}
