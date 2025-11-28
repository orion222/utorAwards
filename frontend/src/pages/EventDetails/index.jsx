import { useParams, useLocation } from "react-router-dom";
import EventCard from "../../components/common/EventCard.jsx";

function EventDetails() {
    const { eventId } = useParams();
    const { state } = useLocation();
    
    return (
        <EventCard event={state.event} key={eventId} detailsPage={false}></EventCard>
    )
}

export default EventDetails;