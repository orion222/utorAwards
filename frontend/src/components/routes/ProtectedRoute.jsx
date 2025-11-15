import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function ProtectedRoute({ requiredClearance = [] }) {
    const { user, loading } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        console.log(user);
        return <Navigate to="/login" replace />;
    }

    if (requiredClearance.length > 0 && !requiredClearance.includes(user.role)) {
        return <Navigate to="/regular/dashboard" />; // TODO: replace with either a unauthorized page or something else
    }

    return <Outlet />
}

export default ProtectedRoute;