import { createDecoratedHandler, type AnalyticsEvent } from "./analytics";

const event = (id: string, properties = {}): AnalyticsEvent => ({
  id,
  kind: "action",
  properties,
});

describe("createDecoratedHandler", () => {
  const mapping = { "authentication.login.submit": "login_submit" };
  const patterns = [{ pattern: /^home\..*\.open$/, vendorName: "home_open" }];

  it("calls sink with the vendor name for an exact key", () => {
    const sink = jest.fn();
    createDecoratedHandler({ mapping, patterns, sink })(event("authentication.login.submit"));
    expect(sink).toHaveBeenCalledWith("login_submit", {});
  });

  it("calls sink when a regex matches", () => {
    const sink = jest.fn();
    createDecoratedHandler({ mapping, patterns, sink })(event("home.card.open"));
    expect(sink).toHaveBeenCalledWith("home_open", {});
  });

  it("drops unmapped ids", () => {
    const sink = jest.fn();
    createDecoratedHandler({ mapping, patterns, sink })(event("nope.nothing"));
    expect(sink).not.toHaveBeenCalled();
  });

  it("does not throw when the sink throws", () => {
    const sink = jest.fn(() => {
      throw new Error("boom");
    });
    const handler = createDecoratedHandler({ mapping, patterns, sink });
    expect(() => handler(event("authentication.login.submit"))).not.toThrow();
  });

  it("passes properties through", () => {
    const sink = jest.fn();
    createDecoratedHandler({ mapping, patterns, sink })(
      event("authentication.login.submit", { role: "patient", attempt: 2 }),
    );
    expect(sink).toHaveBeenCalledWith("login_submit", { role: "patient", attempt: 2 });
  });
});
