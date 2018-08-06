// tslint:disable:no-magic-numbers
import sum from "../src";

describe("slack-logger", () => {
  it("should work", () => {
    expect(sum(2, 5)).toEqual(7);
  });
});
