const {
  peopleShuffled,
  peopleOrdered,
  peopleNames,
} = require("./sharedValues.json");

describe("passing cases", () => {
  it("on object subset", () => {
    expect(peopleShuffled).toMatchContents(peopleNames);
  });

  it("on full match", () => {
    expect(peopleShuffled).toMatchContents(peopleOrdered);
  });

  it("on strict equal", () => {
    expect(peopleShuffled).toEqualContents(peopleOrdered);
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
    [
      () => expect(peopleShuffled).toEqualContents(peopleNames),
      `Missing three items`,
    ],
    [
      () => expect(null).toMatchContents([]),
      `Received value must be an array but got: null`,
    ],
    [
      () => expect([]).toMatchContents(null),
      `Expected value must be an array but got: null`,
    ],
    [
      () => expect([1, 2]).toMatchContents([1]),
      `Received array has MORE items than expected`,
    ],
    [() => expect([]).toMatchContents([1]), `Missing one matching item`],
    [() => expect([]).not.toMatchContents([]), `cannot be used with '.not'`],
  ])("Fails with expected message ($2)", (codeUnderTest, messagePattern) => {
    const monochromeMessage = getMonochromeErrorMessage(codeUnderTest);
    expect(monochromeMessage).toMatch(messagePattern);
  });

  it("missing item 'Arnold'", () => {
    const codeUnderTest = () =>
      expect(peopleShuffled).toMatchContents([
        { name: "Arnold" }, // Not in real dataset
        { name: "Bob" },
        { name: "Charlie" },
      ]);
    const errorMessage = getMonochromeErrorMessage(codeUnderTest);
    expect(errorMessage).toMatch(/Missing one matching item/);
    expect(errorMessage).toMatch(/Missing items:/);
    expect(errorMessage).toMatch(/{"name": "Arnold"}/);
  });
});
