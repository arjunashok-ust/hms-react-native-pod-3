import { createContext } from "react";
import type { TestIdTag } from "@hms/shared-util";
import { AppointmentContent } from "../content/content";
import { AppointmentStyles } from "./appointmentStyles";

export interface AppointmentContextValues{
    styles: AppointmentStyles,
    content: AppointmentContent,
    testId: (component: string) => TestIdTag,
}

export const AppointmentContext = createContext<AppointmentContextValues | undefined>(undefined);