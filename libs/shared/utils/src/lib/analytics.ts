import {
  createContext,
  createElement,
  useContext,
  type ReactNode,
} from "react";

export type AnalyticsProperties = Record<string, string | number | boolean>;
export type AnalyticsPattern = { pattern: RegExp; vendorName: string };

export type AnalyticsEvent = {
  id: string;
  kind: "action" | "state";
  properties?: AnalyticsProperties;
};

export type AnalyticsHandler = (event: AnalyticsEvent) => void;
export type AnalyticsSink = (
  vendorName: string,
  properties?: AnalyticsProperties,
) => void;

const AnalyticsContext = createContext<AnalyticsHandler>(() => {});

export function AnalyticsProvider({
  handler,
  children,
}: {
  handler: AnalyticsHandler;
  children: ReactNode;
}) {
  return createElement(AnalyticsContext.Provider, { value: handler }, children);
}

export function useAnalytics() {
  return { emit: useContext(AnalyticsContext) };
}

export function createDecoratedHandler({
  mapping,
  patterns,
  sink,
}: {
  mapping: Record<string, string>;
  patterns: AnalyticsPattern[];
  sink: AnalyticsSink;
}): AnalyticsHandler {
  return (event) => {
    const exact = mapping[event.id];
    const vendorName =
      typeof exact === "string"
        ? exact
        : patterns.find((p) => p.pattern.test(event.id))?.vendorName;

    if (!vendorName) return;

    try {
      sink(vendorName, event.properties);
    } catch {
      // broken sink must never crash a button press
    }
  };
}
