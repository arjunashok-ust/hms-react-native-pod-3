export type HostActions = {
  signOut: () => Promise<void>;
  bookAppointment: (doctorId: string) => void;
};

export type HostContext = {
  patientId: string | null;
  email: string | null;
  actions: HostActions;
};

export type MicroAppProps = {
  host: HostContext;
};
