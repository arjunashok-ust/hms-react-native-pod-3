import { parseDateInputValue, toDateInputValue } from "./date";

describe("toDateInputValue", () => {
  it("formats using the local calendar day", () => {
    expect(toDateInputValue(new Date(2024, 0, 15, 0, 0))).toBe("2024-01-15");
    expect(toDateInputValue(new Date(2024, 11, 5, 23, 59))).toBe("2024-12-05");
  });
});

describe("parseDateInputValue", () => {
  it("parses a date as local midnight", () => {
    const parsed = parseDateInputValue("2024-02-29");
    expect(parsed).toEqual(new Date(2024, 1, 29));
  });

  it("round-trips with toDateInputValue", () => {
    const original = new Date(2001, 6, 9);
    expect(parseDateInputValue(toDateInputValue(original))).toEqual(original);
  });

  it.each(["", "2024-1-5", "15/01/2024", "2024-02-31", "2023-02-29", "0005-03-01"])(
    "rejects %p",
    (value) => {
      expect(parseDateInputValue(value)).toBeNull();
    },
  );
});
