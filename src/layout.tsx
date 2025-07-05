import { Outlet } from "react-router-dom"
import AppHeader from "./components/layout/app.header"

const Layout = () => {

	return (
		<>
			<AppHeader />
			<Outlet />
		</>
	)
}

export default Layout
