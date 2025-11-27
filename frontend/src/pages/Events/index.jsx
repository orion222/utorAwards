import { useState } from "react";
import { useUser } from "../../context/UserContext";
import api from "../../api/api";
import { useNavigate } from "react-router-dom";
import EditEventForm from "./EditEventForm";

function Events() {
  return (
    <div>
      <EditEventForm />
    </div>
  );
}

export default Events;
