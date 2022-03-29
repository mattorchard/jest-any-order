const {
  peopleShuffled,
  peopleOrdered,
  peopleNames,
} = require("./sharedValues.json");

describe("one liners are insufficient", () => {
  it("toStrictEqual", () => {
    expect(peopleShuffled).not.toStrictEqual(peopleOrdered);
  });

  it("toMatchObject", () => {
    expect(peopleShuffled).not.toMatchObject(peopleNames);
  });

  it("toContainEqual", () => {
    expect(peopleShuffled).not.toContainEqual(peopleOrdered);
  });
});

describe("verbose but working", () => {
  it("toStrictEqual + arrayContaining + toHaveLength", () => {
    expect(peopleShuffled).toStrictEqual(expect.arrayContaining(peopleOrdered));
    expect(peopleShuffled).toHaveLength(peopleOrdered.length);
  });

  it("toStrictEqual + arrayContaining + objectContaining + toHaveLength", () => {
    expect(peopleShuffled).toStrictEqual(
      expect.arrayContaining(peopleNames.map((e) => expect.objectContaining(e)))
    );
    expect(peopleShuffled).toHaveLength(peopleNames.length);
  });
});
