
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
import { App } from 'antd';
import HomePage from './pages/client/home.tsx';
import { ContextWrapper } from './components/context/app.context.tsx';

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				index: true,
				element: <HomePage />,
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
				path: '/checkout',
				element: <div>Checkout page</div>,
			},
			{
				path: '/admin',
				element: <div>Admin page</div>,
			}
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
	<App>
		<ContextWrapper>
			<RouterProvider router={router} />
		</ContextWrapper>
	</App>
)
