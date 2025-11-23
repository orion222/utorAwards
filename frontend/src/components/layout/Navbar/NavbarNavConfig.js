import { ShoppingCart, Gift, ArrowLeftRight, UserPlus, Home as HomeIcon, Wallet as WalletIcon, Compass, History, Mail, Tag, Users } from 'lucide-react';

const NAV_ITEMS = {
  home: { label: "Home", icon: HomeIcon, path: "/dashboard" },
  wallet: { id: "My Wallet", label: "Wallet", icon: WalletIcon, path: "/wallet" },
  pastTransactions: { label: "Past Transactions", icon: History, path: "/past-transactions" },

  create: { label: "Create Transaction", icon: ShoppingCart, path: "/create" },
  redeem: { label: "Process Redemption", icon: Gift, path: "/redeem" },

  exploreEvents: { label: "Explore", icon: Compass, path: "/events" },
  eventInvitations: { label: "Event Invitations", icon: Mail, path: "/events/invitations" },

  promotions: { label: "Promotions", icon: Tag, path: "/promotions" },

  createUser: { label: "Create User", icon: UserPlus, path: "/createUser" },
  manageUsers: { label: "Manage Users", icon: Users, path: "/manageUsers" },
};

const BASE = {
  regular: [
    "home",
    "wallet",
    "pastTransactions",
    "exploreEvents",
    "eventInvitations",
  ],

  cashierExtras: [
    "create",
    "redeem",
    "createUser",
  ],

  managerExtras: [
  ],

  organizerExtras: [
    
  ],

  superuserExtras: [
    // something ONLY superusers should see
  ],
};

const ROLE_MAP = {
  regular: [...BASE.regular],

  cashier: [
    ...BASE.regular,
    ...BASE.cashierExtras,
  ],

  manager: [
    ...BASE.regular,
    ...BASE.cashierExtras,
    ...BASE.managerExtras,
  ],

  organizer: role => [
    ...(ROLE_MAP[role] || BASE.regular),
    ...BASE.organizerExtras,
  ],

  superuser: [
    ...Object.keys(NAV_ITEMS), // all items
    ...BASE.superuserExtras,
  ],
};

export function getNavForRole(role, isOrganizer) {
  if (role === "superuser") {
    return ROLE_MAP.superuser.map(id => NAV_ITEMS[id]);
  }

  if (isOrganizer) {
    const fullList = ROLE_MAP.organizer(role);
    return fullList.map(id => NAV_ITEMS[id]);
  }

  return ROLE_MAP[role].map(id => NAV_ITEMS[id]);
}