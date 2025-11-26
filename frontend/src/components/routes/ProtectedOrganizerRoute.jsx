import { Navigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";
import EventManagement from "../../pages/MyEvents/EventManagement";

function ProtectedOrganizerRoute() {
    const { user } = useUser();

    if (!user?.isEventOrganizer && user?.role !== "manager" && user?.role !== "superuser") {
        return <Navigate to="/dashboard" />;
    }

    return <EventManagement />;
}

export default ProtectedOrganizerRoute;