import { Outlet } from "react-router-dom"
import AppHeader from "./components/layout/app.header"

const Layout = () => {
	return (
		<div>
			<AppHeader />
			<Outlet />
		</div>
	)
}

export default Layout
