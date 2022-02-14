const getTypeName = (value) =>
  value ? value.constructor.toString() : `${value}`;

const toMatchContentsInner = (actual, expected, strictEqual = false) => {
  if (!Array.isArray(expected))
    return {
      pass: false,
      message: () =>
        `Expected value must be an array but got ${getTypeName(expected)}`,
    };
  if (!Array.isArray(actual))
    return {
      pass: false,
      message: () =>
        `Received value must be an array but got ${getTypeName(actual)}`,
    };

  expect(actual).toHaveLength(expected.length);

  const missingItems = [];

  for (const expectedItem of expected) {
    try {
      expect(actual).toContainEqual(
        strictEqual ? expectedItem : expect.objectContaining(expectedItem)
      );
    } catch {
      missingItems.push(expectedItem);
    }
  }

  if (missingItems.length > 0)
    return {
      message: () =>
        [
          `Missing ${missingItems.length} items from the expected array`,
          `Missing:`,
          ...missingItems.map((item) => `- ${JSON.stringify(item)}`),
          `Received Array ${JSON.stringify(actual)}`,
        ].join(`\n`),
      pass: false,
    };

  return {
    message: () => `Contained all matches`,
    pass: true,
  };
};

expect.extend({
  toMatchContents(actual, expected) {
    if (this.isNot)
      throw new Error(`toMatchContents cannot be used with '.not'`);

    return toMatchContentsInner(actual, expected, false);
  },
  toEqualContents(actual, expected) {
    if (this.isNot)
      throw new Error(`toEqualContents cannot be used with '.not'`);

    return toMatchContentsInner(actual, expected, true);
  },
});
