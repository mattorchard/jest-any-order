function toMatchContentsInner(received, expected, strictEqual = false) {
  const {
    matcherHint,
    printExpected,
    printReceived,
    pluralize,
    EXPECTED_COLOR,
    RECEIVED_COLOR,
  } = this.utils;

  const prefix =
    matcherHint(strictEqual ? "toEqualContents" : "toMatchContents") + "\n\n";

  const formatLines = (...lines) => prefix + lines.join("\n");

  if (!Array.isArray(expected))
    return {
      message: () =>
        formatLines(
          `Expected value must be an array but got: ${printExpected(expected)}`
        ),
      pass: false,
    };
  if (!Array.isArray(received))
    return {
      message: () =>
        formatLines(
          `Received value must be an array but got: ${printReceived(received)}`
        ),
      pass: false,
    };

  if (received.length > expected.length) {
    return {
      message: () =>
        formatLines(
          `Received array has MORE items than expected`,
          `Expected length: ${printExpected(expected.length)}`,
          `Received length: ${printReceived(received.length)}`,
          `Received array: ${printReceived(received)}`
        ),
      pass: false,
    };
  }

  const missingItems = [];

  for (const expectedItem of expected) {
    try {
      expect(received).toContainEqual(
        strictEqual ? expectedItem : expect.objectContaining(expectedItem)
      );
    } catch {
      missingItems.push(expectedItem);
    }
  }

  if (missingItems.length === 0)
    return {
      message: () => `Contained all matches`,
      pass: true,
    };

  const expectedPrefix = EXPECTED_COLOR("  - ");
  const receivedPrefix = RECEIVED_COLOR("  + ");
  return {
    message: () =>
      formatLines(
        `Missing ${pluralize(
          strictEqual ? `item` : `matching item`,
          missingItems.length
        )} from the expected array`,
        `Missing items:`,
        ...missingItems.map(
          (item) => `${expectedPrefix}${printExpected(item)}`
        ),
        `Received array:`,
        `${receivedPrefix}${printReceived(received)}`
      ),
    pass: false,
  };
}

expect.extend({
  toMatchContents(received, expected) {
    if (this.isNot)
      throw new Error(`toMatchContents cannot be used with '.not'`);

    return toMatchContentsInner.call(this, received, expected, false);
  },

  toEqualContents(received, expected) {
    if (this.isNot)
      throw new Error(`toEqualContents cannot be used with '.not'`);

    return toMatchContentsInner.call(this, received, expected, true);
  },
});
