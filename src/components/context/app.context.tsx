import { fetchAccountAPI } from "@/services/api";
import { Spin } from "antd";
import { createContext, useContext, useEffect, useState } from "react"


interface IContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: (v: boolean) => void;
    user: IUser | null;
    setUser: (value: IUser | null) => void;
    isAppLoading: boolean;
    setIsAppLoading: (v: boolean) => void;
    shoppingCart: IShoppingCart[];
    setShoppingCart: (v: IShoppingCart[]) => void;
}

const AppContext = createContext<IContextType | null>(null);

type TProps = {
    children: React.ReactNode;
}

const ContextWrapper = (props: TProps) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<IUser | null>(null);
    const [isAppLoading, setIsAppLoading] = useState<boolean>(true);
    const [shoppingCart, setShoppingCart] = useState<IShoppingCart[]>([])

    useEffect(() => {
        const fetchAccount = async () => {
            const result = await fetchAccountAPI();
            if (result.data) {
                setUser(result.data.user);
                setIsAuthenticated(true);
            }
            setIsAppLoading(false);
        }
        fetchAccount();
    }, [])

    return (
        <>
            {!isAppLoading ?
                <AppContext.Provider
                    value={{
                        isAuthenticated, setIsAuthenticated,
                        user, setUser,
                        isAppLoading, setIsAppLoading,
                        shoppingCart, setShoppingCart,
                    }}>
                    {props.children}
                </AppContext.Provider>
                :
                (<div className="h-[100vh] flex justify-center items-center"><Spin size="large" /></div>)
            }
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