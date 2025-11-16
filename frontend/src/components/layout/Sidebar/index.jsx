import { useMemo, useState } from "react";
import { useUser } from "../../../context/UserContext";
import { ShoppingCart, Gift, ArrowLeftRight, UserPlus, Home as HomeIcon, Wallet as WalletIcon, Compass, History, Mail, Tag, Users } from 'lucide-react';
import './style.css';
const NAV_ITEMS = {
  home: {
    id: "home",
    label: "Home",
    icon: HomeIcon,
    group: "dashboard",
  },

  wallet: {
    id: "wallet",
    label: "Wallet",
    icon: WalletIcon,
    group: "wallet",
  },

  pastTransactions: {
    id: "pastTransactions",
    label: "Past Transactions",
    icon: History,
    group: "wallet",
  },

  create: {
    id: "create",
    label: "Create Transaction",
    icon: ShoppingCart,
    group: "transactions",
  },

  redeem: {
    id: "redeem",
    label: "Process Redemption",
    icon: Gift,
    group: "transactions",
  },

  transfer: {
    id: "transfer",
    label: "Transfer Points",
    icon: ArrowLeftRight,
    group: "transactions",
  },

  exploreEvents: {
    id: "exploreEvents",
    label: "Explore",
    icon: Compass,
    group: "events",
  },

  eventInvitations: {
    id: "eventInvitations",
    label: "Event Invitations",
    icon: Mail,
    group: "events",
  },

  promotions: {
    id: "promotions",
    label: "Promotions",
    icon: Tag,
    group: "operations",
  },

  createUser: {
    id: "createUser",
    label: "Create User",
    icon: UserPlus,
    group: "users",
  },

  manageUsers: {
    id: "manageUsers",
    label: "Manage Users",
    icon: Users,
    group: "users",
  },
};

const ROLE_NAV = {
  regular: [
    "home",
    "wallet",
    "pastTransactions",
    "exploreEvents",
    "eventInvitations",
  ],

  cashier: [
    "home",
    "wallet",
    "pastTransactions",
    "create",
    "redeem",
    "transfer",
    "exploreEvents",
    "eventInvitations",
    "createUser",
  ],

  organizer: [
    "home",
    "wallet",
    "pastTransactions",
    "create",
    "redeem",
    "transfer",
    "exploreEvents",
    "eventInvitations",
    "createUser",
  ],

  manager: [
    "home",
    "wallet",
    "pastTransactions",
    "create",
    "redeem",
    "transfer",
    "exploreEvents",
    "eventInvitations",
    "promotions",
    "createUser",
    "manageUsers",
  ],

  superuser: "ALL",
};

export const NAV_ORDER = [
  "dashboard",
  "wallet",
  "transactions",
  "events",
  "operations",
  "users",
];

function getNavForRole(role) {
  const allowed = ROLE_NAV[role];

  // superuser gets everything
  const ids = allowed === "ALL" ? Object.keys(NAV_ITEMS) : allowed;

  const items = ids.map(id => NAV_ITEMS[id]);

  return items.sort((a, b) => {
    return NAV_ORDER.indexOf(a.group) - NAV_ORDER.indexOf(b.group);
  });
}

function Sidebar({ isOpen }) {
  const { user } = useUser();
  // const userRole = user ? user.role : null;
  const userRole = "superuser"; //Rrmove this when login is implemented
  console.log("User Role in Sidebar:", userRole);

  const navItems = useMemo(() => {
    return getNavForRole(userRole);
  }, [userRole]);
  console.log("navItems:", navItems);

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
