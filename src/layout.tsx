import { Outlet } from "react-router-dom"
import AppHeader from "./components/layout/app.header"
import { useCurrentApp } from "./components/context/app.context"
import { useEffect } from "react";
import { fetchAccountAPI } from "./services/api";
import { Spin } from "antd";


const Layout = () => {
	const { setUser, isAppLoading, setIsAppLoading, setIsAuthenticated } = useCurrentApp();

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
			{!isAppLoading ? (
				<>
					<AppHeader />
					<Outlet />
				</>
			) : <div className="h-[100vh] flex justify-center items-center"><Spin size="large" /></div>}

		</>
	)
}

export default Layout
