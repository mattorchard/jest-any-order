const { expected, actual, expectedSubset } = require("./test-data.json");

describe("passing cases", () => {
  it("on object subset", () => {
    expect(actual).toMatchContents(expectedSubset);
  });

  it("on full match", () => {
    expect(actual).toMatchContents(expected);
  });

  it("on strict equal", () => {
    expect(actual).toEqualContents(expected);
  });
});

describe("failing cases", () => {
  const getMonochromeErrorMessage = (callback) => {
    try {
      callback();
    } catch (error) {
      // Remove ANSI color codes
      return error.message.replace(/(\x1b\[[0-9;]+m)/g, "");
    }
    throw new Error(`Expected test failure, but no error thrown`);
  };

  it.each([
    [() => expect(actual).toEqualContents(expectedSubset), `Missing 3 items`],
    [
      () => expect(null).toMatchContents([]),
      `Received value must be an array but got null`,
    ],
    [
      () => expect([]).toMatchContents(null),
      `Expected value must be an array but got null`,
    ],
    [() => expect([]).toMatchContents([1]), `Received length: 0`],
    [
      () => expect([]).not.toMatchContents(expected),
      `cannot be used with '.not'`,
    ],
  ])("Fails with expected message", (codeUnderTest, messagePattern) => {
    const monochromeMessage = getMonochromeErrorMessage(codeUnderTest);
    expect(monochromeMessage).toMatch(messagePattern);
  });

  it("missing item 'Arnold'", () => {
    const codeUnderTest = () =>
      expect(actual).toMatchContents([
        { name: "Arnold" }, // Not in real dataset
        { name: "Bob" },
        { name: "Charlie" },
      ]);
    const errorMessage = getMonochromeErrorMessage(codeUnderTest);
    expect(errorMessage).toMatch(/Missing 1 items/);
    expect(errorMessage).toMatch(/Missing:\s*- {"name":"Arnold"}/);
  });
});
