import api from "../../api/api.js";
export const handleAddAsGuest = async (eventId, utorid) => {
  try {
    const payload = { utorid: utorid };
    const res = await api.post(`/events/${eventId}/guests`, payload);
    return res.status;
  } catch (error) {
    console.error("Error adding user as guest:", error);
    throw error;
  }
};
export const handleAddAsOrganizer = async (eventId, utorid) => {
  try {
    const payload = { utorid: utorid };
    const res = await api.post(`/events/${eventId}/organizers`, payload);
    return res.status;
  } catch (error) {
    console.error("Error adding user as organizer:", error);
    throw error;
  }
};
export const removeGuestFromEvent = async (eventId, userId) => {
  try {
    const res = await api.delete(`/events/${eventId}/guests/${userId}`);
    return res.status;
  } catch (error) {
    console.error("Error removing user from event guests:", error);
    throw error;
  }
};
export const removeOrganizerFromEvent = async (eventId, userId) => {
  try {
    const res = await api.delete(`/events/${eventId}/organizers/${userId}`);
    return res.status;
  } catch (error) {
    console.error("Error removing user from event guests:", error);
    throw error;
  }
};
