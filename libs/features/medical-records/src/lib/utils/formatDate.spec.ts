import { formatDateAndTime } from "./formatDate";

const { formatDate, formatDateTime } = formatDateAndTime();

describe("formatDate", () => {
  it("formats a Date with toDateString", () => {
    expect(formatDate(new Date(2024, 0, 15))).toBe("Mon Jan 15 2024");
  });

  it("formats a date string", () => {
    expect(formatDate("2024-12-05T12:00:00")).toBe("Thu Dec 05 2024");
  });

  it.each([undefined, null, ""])("returns an em dash for %p", (value) => {
    expect(formatDate(value)).toBe("—");
  });

  it("returns 'Invalid Date' text for an unparseable string", () => {
    expect(formatDate("not-a-date")).toBe("Invalid Date");
  });
});

describe("formatDateTime", () => {
  it("formats a Date as 'DD Mon YYYY' in en-GB", () => {
    expect(formatDateTime(new Date(2024, 0, 15))).toBe("15 Jan 2024");
  });

  it("zero-pads the day", () => {
    expect(formatDateTime(new Date(2024, 11, 5))).toBe("05 Dec 2024");
  });

  it.each([undefined, null, ""])("returns an em dash for %p", (value) => {
    expect(formatDateTime(value)).toBe("—");
  });
});
