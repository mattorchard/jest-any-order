const { expected, actual, expectedSubset } = require("./test-data.json");

describe("one liners are insufficient", () => {
  it("toStrictEqual", () => {
    expect(actual).not.toStrictEqual(expected);
  });

  it("toMatchObject", () => {
    expect(actual).not.toMatchObject(expected);
  });

  it("toContainEqual", () => {
    expect(actual).not.toContainEqual(expected);
  });
});

describe("verbose but working", () => {
  it("toStrictEqual + arrayContaining + toHaveLength", () => {
    expect(actual).toStrictEqual(expect.arrayContaining(expected));
    expect(actual).toHaveLength(expected.length);
  });

  it("toStrictEqual + arrayContaining + objectContaining + toHaveLength", () => {
    expect(actual).toStrictEqual(
      expect.arrayContaining(
        expectedSubset.map((e) => expect.objectContaining(e))
      )
    );
    expect(actual).toHaveLength(expectedSubset.length);
  });
});
