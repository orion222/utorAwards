import { ShoppingCart, Gift, ArrowLeftRight, UserPlus, Home as HomeIcon, Wallet as WalletIcon, Compass, History, Mail, Tag, Users } from 'lucide-react';

const NAV_ITEMS = {
  home: { id: "home", label: "Home", icon: HomeIcon, path: "/dashboard" },
  wallet: { id: "wallet", label: "Wallet", icon: WalletIcon, children: [ { id: "my-qr", label: "My QR Code", path: "/test"  }, ] },
  pastTransactions: { id: "pastTransactions", label: "Past Transactions", icon: History, path: "/test" },

  create: { id: "create", label: "Create Transaction", icon: ShoppingCart, path: "/" },
  redeem: { id: "redeem", label: "Process Redemption", icon: Gift, path: "/" },
  transfer: { id: "transfer", label: "Transfer Points", icon: ArrowLeftRight, path: "/" },

  exploreEvents: { id: "exploreEvents", label: "Explore", icon: Compass, path: "/" },
  eventInvitations: { id: "eventInvitations", label: "Event Invitations", icon: Mail, path: "/" },

  promotions: { id: "promotions", label: "Promotions", icon: Tag, path: "/" },

  createUser: { id: "createUser", label: "Create User", icon: UserPlus, path: "/" },
  manageUsers: { id: "manageUsers", label: "Manage Users", icon: Users, path: "/" },
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
    "transfer",
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