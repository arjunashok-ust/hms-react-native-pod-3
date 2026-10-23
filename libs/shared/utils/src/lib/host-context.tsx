import { createContext,useContext, type ReactNode} from "react";
import type { HostContext } from "@hms/models";

const Context = createContext<HostContext | null>(null);

export function HostProvider({host,children}: {host: HostContext; children: ReactNode}){
    return <Context.Provider value={host}>{children}</Context.Provider>
}

export function useHost(): HostContext {
    const host = useContext(Context);
    if(!host) throw new Error("useHost must be used inside the <HostProvider>");
    return host;
}