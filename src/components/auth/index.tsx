import { Button, Result } from "antd";
import { useCurrentApp } from "../context/app.context";
import { Link, useLocation } from "react-router-dom";

interface IProps {
    children: React.ReactNode;
}


const ProtectedRoute = (props: IProps) => {
    const { isAuthenticated, user } = useCurrentApp();

    if (!isAuthenticated) {
        return (
            <>
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, you are not authorized to access this page."
                    extra={<Link to={'/login'}><Button type="primary">Login now</Button></Link>}
                />
            </>
        )
    }

    let location = useLocation();
    if (location.pathname === '/admin' && user?.role !== 'ADMIN') {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={<Link to={'/'}><Button type="primary">Go to homepage</Button></Link>}
            />
        )
    }

    return (
        <>
            {props.children}
        </>
    )
}

export default ProtectedRoute