import type { Doctor } from "@hms/trpc-client";
import { filterDoctors } from "./useFilteredDoctors";

const doctor = (name: string, specialization: string | null): Doctor =>
  ({ name, specialization }) as unknown as Doctor;

const doctors = [
  doctor("Asha Rao", "Cardiology"),
  doctor("Ben Carter", "Neurology"),
  doctor("Chitra Menon", null),
];

describe("filterDoctors", () => {
  it("returns every doctor for an empty query", () => {
    expect(filterDoctors(doctors, "")).toBe(doctors);
  });

  it("treats a whitespace-only query as empty", () => {
    expect(filterDoctors(doctors, "   ")).toBe(doctors);
  });

  it("matches on name", () => {
    expect(filterDoctors(doctors, "ben")).toEqual([doctors[1]]);
  });

  it("matches on specialization", () => {
    expect(filterDoctors(doctors, "cardio")).toEqual([doctors[0]]);
  });

  it("ignores case and surrounding whitespace", () => {
    expect(filterDoctors(doctors, "  NEURO ")).toEqual([doctors[1]]);
  });

  it("matches a name or specialization substring in the middle", () => {
    expect(filterDoctors(doctors, "hitra")).toEqual([doctors[2]]);
  });

  it("does not crash on a doctor without a specialization", () => {
    expect(filterDoctors(doctors, "zzz")).toEqual([]);
  });

  it("returns every doctor matching more than one record", () => {
    expect(filterDoctors(doctors, "r")).toEqual(doctors);
  });

  it("returns an empty list when nothing matches", () => {
    expect(filterDoctors(doctors, "dermatology")).toEqual([]);
  });

  it("returns an empty list when there are no doctors", () => {
    expect(filterDoctors([], "asha")).toEqual([]);
  });
});
