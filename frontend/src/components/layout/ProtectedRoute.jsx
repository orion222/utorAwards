import { Navigate, Outlet } from "react-router-dom";
import { UseUser } from "../../context/UserContext";

function ProtectedRoute({ requiredClearance = [] }) {
  const { user } = UseUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredClearance.length > 0 && !requiredClearance.includes(user.role)) {
    console.log("test2");
    return <Navigate to="/login" />; // TODO: replace with either a unauthorized page or something else
  }

  return <Outlet />;
}

export default ProtectedRoute;
