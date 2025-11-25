import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

function ProtectedOrganizerRoute() {
    const { user } = useUser();

    if (!user?.isEventOrganizer) {
        return <Navigate to="/dashboard" />;
    }

    return <Navigate to="/my-events/management" />
}

export default ProtectedOrganizerRoute;