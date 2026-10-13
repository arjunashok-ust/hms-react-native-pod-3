// Session storage (token, email, patientId) and the hooks that read it.
// All API calls go through @hms/trpc-client.

export * from "./lib/session.service";
export * from "./lib/session.hooks";
