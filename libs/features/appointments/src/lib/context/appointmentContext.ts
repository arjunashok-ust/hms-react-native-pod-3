import { createContext } from "react";
import { AppointmentContent } from "../content/content";
import { AppointmentStyles } from "./appointmentStyles";

export interface AppointmentContextValues{
    styles: AppointmentStyles,
    content: AppointmentContent,
}

export const AppointmentContext = createContext<AppointmentContextValues | undefined>(undefined);