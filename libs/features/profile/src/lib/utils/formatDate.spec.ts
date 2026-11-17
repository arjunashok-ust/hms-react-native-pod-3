import { formatDate } from "./formatDate";

describe("formatDate", () => {
  it("formats a Date as 'Mon D, YYYY'", () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe("Jan 15, 2024");
  });

  it("formats a date string", () => {
    expect(formatDate("2024-12-05T12:00:00")).toBe("Dec 5, 2024");
  });

  it.each([undefined, null, ""])("returns '' for %p", (value) => {
    expect(formatDate(value)).toBe("");
  });

  it("returns '' for an unparseable string", () => {
    expect(formatDate("not-a-date")).toBe("");
  });
});
