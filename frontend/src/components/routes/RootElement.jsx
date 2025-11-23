import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function RootElement() {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to="/dashboard" />;
}

export default RootElement;
