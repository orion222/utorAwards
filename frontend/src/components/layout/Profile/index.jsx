import { CircleUserRound, User, Settings, LogOut, Bell} from "lucide-react";
import './style.css';
import { useState, useRef, useEffect } from "react";
import { MenuItem } from "@mui/material";

export default function Profile() {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClick(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        isOpen ? document.addEventListener("mousedown", handleClick) : document.removeEventListener("mousedown", handleClick);

        return () => document.removeEventListener("mousedown", handleClick); 
    }, [isOpen]);

    return (
        <div ref={dropdownRef}>
            <button className="profile-button" onClick={() => setIsOpen(!isOpen)}>
                <CircleUserRound className="profile-icon"/>
            </button>
            
            {isOpen && (
                <div className="profile-dropdown">
                    <ProfileItem icon={<User />} label="Profile" onClick={() => {}}/> {/* Need a link to the profile page */}
                    <ProfileItem icon={<Bell />} label="Account" onClick={() => {}}/> {/* Need a link to the account page */}
                    <ProfileItem icon={<Settings />} label="Settings" onClick={() => {}}/> {/* Need a link to the settings page */}
                    <ProfileItem icon={<LogOut />} label="Logout" onClick={() => {}}/> {/* Need to implement logout functionality */}
                </div>
            )}
        </div>
    );
}

function ProfileItem({ icon, label, onClick }) {
    return (
        <button onClick={onClick} className="profile-item">
            <div className="item-icon">{icon}</div>
            <div className="item-label">{label}</div>
        </button>
    );
}