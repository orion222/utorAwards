import {
  ShoppingCart,
  Gift,
  ArrowLeftRight,
  UserPlus,
  Home as HomeIcon,
  Wallet as WalletIcon,
  Compass,
  History,
  Mail,
  Tag,
  Users,
  ListOrdered,
  ShieldIcon,
} from "lucide-react";

const REGULAR_ITEMS = [
  { label: "Home", icon: HomeIcon, path: "/dashboard" },
  { label: "Wallet", icon: WalletIcon, path: "/wallet", children: [ { label: "My QR Code", path: "/wallet/my-qr-code" }, { label: "Redeem Points", path: "/wallet/redeem" }, { label: "Transfer Points", path: "/wallet/transfer" } ] },
  { label: "Past Transactions", icon: History, path: "/past-transactions" },
  { label: "Explore", icon: Compass, path: "/explore", children: [ { label: "Events", path: "/explore/events" }, { label: "Promotions", path: "/explore/promotions" }] },
  { label: "My Events", icon: Mail, path: "/my-events/invitations" },
  { label: "Leaderboard", icon: ListOrdered, path: "/leaderboard" },
];

const CASHIER_EXTRA = [
  { label: "Create Transaction", icon: ShoppingCart, path: "/create" },
  { label: "Process Redemption", icon: Gift, path: "/redeem" },
  { label: "Create User", icon: UserPlus, path: "/createUser" },
];

const MANAGER_EXTRA = [
  { label: "Promotions", icon: Tag, path: "/promotions" },
  { label: "Admin", icon: ShieldIcon, path: "/admin", children: [ { label: "Users", path: "/admin/users" }, { label: "Transactions", path: "/admin/transactions" } ] },
];

const SUPERUSER_EXTRA = [
  { label: "Manage Users", icon: Users, path: "/manageUsers" },
];

export function getNavForRole(role, isEventOrganizer) {
  const items = [...REGULAR_ITEMS];

  if (role === "cashier" || role === "manager" || role === "superuser") {
    items.push(...CASHIER_EXTRA);
  }

  if (role === "manager" || role === "superuser") {
    items.push(...MANAGER_EXTRA);
  }

  if (role === "superuser") {
    items.push(...SUPERUSER_EXTRA);
  }

  if (isEventOrganizer || role === "manager" || role === "superuser") {
    items[4] = { label: "My Events", icon: Mail, path: "/my-events", children: [ { label: "Invitations", path: "/my-events/invitations" }, { label: "Management", path: "/my-events/management" }] };
  }

  return items;
}
