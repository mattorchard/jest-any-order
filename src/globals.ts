declare global {
  namespace jest {
    interface Matchers<R> {
      toMatchContents(array: unknown[]): R;
      toEqualContents(array: unknown[]): R;
    }
  }
}
export {};
