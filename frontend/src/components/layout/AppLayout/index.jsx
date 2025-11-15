import { Outlet } from "react-router-dom";
import Header from "../Header";
import Sidebar from "../Sidebar";

function AppLayout() {
    return (
        <>
            <Header />
            <Sidebar />
            <Outlet />
        </>
    );
}

export default AppLayout;