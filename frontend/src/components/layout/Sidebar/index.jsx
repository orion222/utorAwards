import { useMemo } from "react";
import { useUser } from "../../../context/UserContext";
import { getNavForRole } from "./SidebarNavConfig";
import './style.css';


function Sidebar({ isOpen }) {
  const { user } = useUser();
  // const userRole = user ? user.role : null;
  const userRole = "superuser"; //Rrmove this when login is implemented

  const navItems = useMemo(() => {
    return getNavForRole(userRole);
  }, [userRole]);

  // if (!user) {
  //   return null; // maybe a placeholder for unauthenticated users?
  // }

  return (
    <aside>
      <nav>
      {navItems.map(item => (
        <button key={item.id} className={isOpen ? "nav-item" : "nav-item collapsed"}>
          <item.icon />
          {isOpen ? item.label : null}
        </button>
      ))}
    </nav>
    </aside>
  );
}

export default Sidebar;
