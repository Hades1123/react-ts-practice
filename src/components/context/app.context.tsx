import { createContext, useContext, useState } from "react"

interface IContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    user: IUser | null;
    setUser: (value: IUser) => void;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
}

const AppContext = createContext<IContextType | null>(null);

type TProps = {
    children: React.ReactNode;
}

const ContextWrapper = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);

    return (
        <>
            <AppContext.Provider value={{
                isAuthenticated, setIsAuthenticated,
                user, setUser,
                isAppLoading, setIsAppLoading,
            }}>
                {props.children}
            </AppContext.Provider>
        </>
    )
}

const useCurrentApp = () => {
    const currentAppContext = useContext(AppContext);

    if (!currentAppContext) {
        throw new Error(
            "useCurrentApp has to be used within <CurrentAppContext.Provider>"
        );
    }

    return currentAppContext;
};

export { useCurrentApp, ContextWrapper }