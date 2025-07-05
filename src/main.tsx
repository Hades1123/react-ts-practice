
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

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,
		children: [
			{
				path: "/book",
				element: <BookPage />,
			},
			{
				path: "/about",
				element: <AboutPage />,
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
	<RouterProvider router={router} />
)
