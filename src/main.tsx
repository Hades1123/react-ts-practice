import { createRoot } from 'react-dom/client'
import Layout from './layout.tsx'
import './styles/style.css'
import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";
import BookPage from './pages/client/book.tsx';
import AboutPage from './pages/client/about.tsx';
import RegisterPage from './pages/client/auth/register.tsx';
import LoginPage from './pages/client/auth/login.tsx';
import { App, ConfigProvider } from 'antd';
import HomePage from './pages/client/home.tsx';
import { ContextWrapper } from './components/context/app.context.tsx';
import ProtectedRoute from './components/auth/index.tsx';
import DashBoardPage from 'pages/admin/dashboard';
import ManageBookPage from 'pages/admin/manage.book';
import ManageOrderPage from 'pages/admin/manage.order';
import ManageUserPage from 'pages/admin/manage.user';
import LayoutAdmin from 'components/layout/layout.admin';
import { StrictMode } from 'react';
import enUS from 'antd/locale/en_US';


const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <HomePage />
			},
			{
				path: "/book",
				element: <BookPage />,
			},
			{
				path: "/about",
				element: <AboutPage />,
			},
			{
				path: "/checkout",
				element: (
					<ProtectedRoute>
						<div>checkout page</div>
					</ProtectedRoute>
				),
			}
		]
	},
	{
		path: "admin",
		element: <LayoutAdmin />,
		children: [
			{
				index: true,
				element: (
					<ProtectedRoute>
						<DashBoardPage />
					</ProtectedRoute>
				)
			},
			{
				path: "book",
				element: (
					<ProtectedRoute>
						<ManageBookPage />
					</ProtectedRoute>
				)
			},
			{
				path: "order",
				element: (
					<ProtectedRoute>
						<ManageOrderPage />
					</ProtectedRoute>
				)
			},
			{
				path: "user",
				element: (
					<ProtectedRoute>
						<ManageUserPage />
					</ProtectedRoute>
				),
			},
			{
				path: "/admin",
				element: (
					<ProtectedRoute>
						<div>admin page</div>
					</ProtectedRoute>
				),
			},

		]
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/register",
		element: <RegisterPage />,
	},

]);

createRoot(document.getElementById('root')!).render(
	// <StrictMode>
	<App>
		<ContextWrapper>
			<ConfigProvider locale={enUS}>
				<RouterProvider router={router} />
			</ConfigProvider>
		</ContextWrapper>
	</App>
	// </StrictMode>
)
