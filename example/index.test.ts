// tslint:disable:no-magic-numbers
import sum from "../src";

describe("slack-logger", () => {
  it("should work", () => {
    expect(sum(3, 5)).toEqual(8);
  });
});
