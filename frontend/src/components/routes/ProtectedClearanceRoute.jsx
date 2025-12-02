import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function ProtectedClearanceRoute({ requiredClearance = [] }) {
  const { user, loading } = useUser();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace={true} />;
  }

  if (requiredClearance.length > 0 && !requiredClearance.includes(user.role)) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
}

export default ProtectedClearanceRoute;
